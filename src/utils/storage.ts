import { storage } from "#imports";
import type { LiveChatBehavior } from "./types";

export const liveChatBehaviorStorage = storage.defineItem<LiveChatBehavior>(
  "local:liveChatBehavior",
  {
    fallback: "followDefault",
  },
);
