import { storage } from "#imports";

export type LiveChatBehavior =
  | "followDefault"
  | "forceCollapsed"
  | "forceExpanded";

export const liveChatBehaviorStorage = storage.defineItem<LiveChatBehavior>(
  "local:liveChatBehavior",
  {
    fallback: "followDefault",
  },
);
