"use client";

import { useSearchParams } from "next/navigation";

export function useInitialTab() {
  const searchParams = useSearchParams();
  return searchParams.get("tab") || "users";
}

