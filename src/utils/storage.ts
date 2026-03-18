import { storage } from "#imports";

export const liveChatCollapsed = storage.defineItem<boolean>(
  "local:liveChatCollapsed",
  {
    fallback: true,
  },
);
