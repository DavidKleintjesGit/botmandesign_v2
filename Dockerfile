# Next.js in standalone-modus, bedoeld voor de eigen server (Coolify).
# De Cloudflare-route loopt langs dit bestand heen en gebruikt wrangler.

FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# libc6-compat heeft sharp nodig voor beeldoptimalisatie op Alpine.
RUN apk add --no-cache libc6-compat && npm ci

FROM node:24-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
