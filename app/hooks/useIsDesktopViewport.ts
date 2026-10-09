"use client";

import { useSyncExternalStore } from "react";

const DESKTOP_MEDIA_QUERY = "(min-width: 768px)";

function subscribeToDesktopMediaQuery(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
  mediaQuery.addEventListener("change", onStoreChange);

  return () => {
    mediaQuery.removeEventListener("change", onStoreChange);
  };
}

function getDesktopMediaQuerySnapshot() {
  return window.matchMedia(DESKTOP_MEDIA_QUERY).matches;
}

function getDesktopMediaQueryServerSnapshot() {
  return false;
}

export default function useIsDesktopViewport() {
  return useSyncExternalStore(
    subscribeToDesktopMediaQuery,
    getDesktopMediaQuerySnapshot,
    getDesktopMediaQueryServerSnapshot,
  );
}
