export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface TopicRequest {
  theme: string;
  numTopics: number;
}
