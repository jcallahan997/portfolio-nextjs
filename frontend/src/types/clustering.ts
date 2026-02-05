export interface StateOption {
  abbr: string;
  name: string;
}

export interface ClusteringParams {
  state: string;
  sample_size: number;
  distance_threshold: number;
}

export interface ClusteringResult {
  correlation_figure: Record<string, unknown>;
  dendrogram_figure: Record<string, unknown>;
  cluster_averages: Record<string, unknown>[];
  clustered_sample: Record<string, unknown>[];
  raw_sample: Record<string, unknown>[];
  n_clusters: number;
}
