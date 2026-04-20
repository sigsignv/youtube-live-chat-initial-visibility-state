import * as v from "valibot";
import { storage } from "#imports";

const liveChatBehaviorSchema = v.picklist([
  "followDefault",
  "forceCollapsed",
  "forceExpanded",
]);

export type LiveChatBehavior = v.InferOutput<typeof liveChatBehaviorSchema>;

export function isLiveChatBehavior(value: unknown): value is LiveChatBehavior {
  return v.safeParse(liveChatBehaviorSchema, value).success;
}

export const liveChatBehaviorStorage = storage.defineItem<LiveChatBehavior>(
  "local:liveChatBehavior",
  {
    fallback: "followDefault",
  },
);
