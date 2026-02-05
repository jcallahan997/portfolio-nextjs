"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchStates, fetchClusteringAnalysis } from "@/lib/api";
import type { ClusteringParams } from "@/types/clustering";

export function useStates() {
  return useQuery({
    queryKey: ["states"],
    queryFn: fetchStates,
  });
}

export function useClusteringAnalysis(params: ClusteringParams | null) {
  return useQuery({
    queryKey: ["clustering", params],
    queryFn: () => fetchClusteringAnalysis(params!),
    enabled: !!params?.state,
  });
}
