#!/usr/bin/env bash
#
# Zet de site op de staging-box.
#
# Anders dan de statische sites daar draait deze als eigen Node-proces:
# systemd houdt hem aan op een interne poort en Caddy staat ervoor. Vandaar
# dat dit script niet de staging-deploy skill gebruikt — die kopieert
# bestanden naar een webroot en dat is hier niet genoeg.
#
# De serverkant ligt vast in:
#   /etc/systemd/system/botmandesign-v2.service
#   /etc/caddy/sites/botmandesign-v2.caddy
#
# Die bestaan al; dit script raakt ze niet aan en heeft dus geen root nodig.

set -euo pipefail

SITE="botmandesign-v2"
HOST="fsn1-web"      # de deploy-gebruiker — nooit als root naar /var/www
ROOT_HOST="fsn1"     # alleen om de service te herstarten
APP="/var/www/$SITE/app"

echo "→ bouwen"
npm run build

# Een standalone build staat verspreid over drie plekken. Hier zetten we ze
# bij elkaar zoals de server ze verwacht.
echo "→ bundel samenstellen"
rm -rf .deploy
mkdir -p .deploy/.next
cp -r .next/standalone/. .deploy/
cp -r .next/static .deploy/.next/static
cp -r public .deploy/public

# Eén tar-stream in plaats van scp per bestand: één verbinding, en het houdt
# de bestandsnamen heel die Next.js met rare tekens uitspuugt.
echo "→ kopiëren naar $HOST:$APP"
tar -cf - -C .deploy . | ssh "$HOST" "
  set -eu
  mkdir -p '$APP'
  rm -rf '$APP'/*
  tar -xf - -C '$APP'
"

# SQLite draait op een binair stuurprogramma dat per platform verschilt. Wij
# bouwen op Windows, dus reist de Windows-versie mee en ontbreekt die voor
# Linux. libsql en zijn binary moeten exact dezelfde versie hebben.
LIBSQL_VERSION=$(node -p "require('./node_modules/libsql/package.json').version")
echo "→ Linux-driver voor SQLite ($LIBSQL_VERSION)"
ssh "$HOST" "cd '$APP' && npm install --no-save --no-audit --no-fund @libsql/linux-x64-gnu@$LIBSQL_VERSION >/dev/null"

echo "→ herstarten"
ssh "$ROOT_HOST" "systemctl restart $SITE && sleep 3 && systemctl is-active $SITE"

# Beter weten dat het geland is dan het aannemen.
code=$(curl -s -o /dev/null -w '%{http_code}' "https://$SITE.$(ssh "$ROOT_HOST" 'hostname -I | awk "{print \$1}"' | tr -d '\r' | tr '.' '-').sslip.io/" || echo "000")
echo "✓ / antwoordde $code"
