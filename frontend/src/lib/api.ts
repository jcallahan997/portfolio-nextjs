const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

export async function fetchStates(): Promise<
  { abbr: string; name: string }[]
> {
  const res = await fetch(`${API_BASE}/clustering/states`);
  if (!res.ok) throw new Error("Failed to fetch states");
  return res.json();
}

export interface ClusteringRequest {
  state: string;
  sample_size: number;
  distance_threshold: number;
}

export interface ClusteringResponse {
  correlation_figure: Record<string, unknown>;
  dendrogram_figure: Record<string, unknown>;
  cluster_averages: Record<string, unknown>[];
  clustered_sample: Record<string, unknown>[];
  n_clusters: number;
  raw_sample: Record<string, unknown>[];
}

export async function fetchClusteringAnalysis(
  params: ClusteringRequest
): Promise<ClusteringResponse> {
  const res = await fetch(`${API_BASE}/clustering/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error("Failed to fetch clustering analysis");
  return res.json();
}

export interface ChatStreamRequest {
  theme: string;
  num_topics: number;
  history: { role: string; content: string }[];
}

export async function streamChat(
  params: ChatStreamRequest,
  onToken: (token: string) => void,
  onDone: () => void
): Promise<void> {
  const res = await fetch(`${API_BASE}/chat/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) throw new Error("Failed to start chat stream");
  if (!res.body) throw new Error("No response body");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.slice(6).trim();
        if (data === "[DONE]") {
          onDone();
          return;
        }
        try {
          const parsed = JSON.parse(data);
          if (parsed.content) {
            onToken(parsed.content);
          }
        } catch {
          // Skip malformed JSON
        }
      }
    }
  }

  onDone();
}
