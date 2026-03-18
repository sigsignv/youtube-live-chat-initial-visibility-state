import { defineUnlistedScript } from "#imports";
import type { LiveChatRenderer, WatchPageResponse } from "@/utils/types";

declare global {
  interface DocumentEventMap {
    "yt-page-data-fetched": CustomEvent<{
      pageData: { response?: WatchPageResponse };
    }>;
  }
}

type PageDataFetchedEvent = DocumentEventMap["yt-page-data-fetched"];

export default defineUnlistedScript(async () => {
  const script = document.currentScript;

  let setCollapse = script?.dataset.shouldCollapse === "true";
  script?.addEventListener("extension:config-updated", (ev) => {
    if (ev instanceof CustomEvent) {
      setCollapse = ev.detail.shouldCollapse;
    }
  });

  const handler = (ev: PageDataFetchedEvent) => {
    const liveChat = extractLiveChatRenderer(ev);
    if (!liveChat || liveChat.isReplay) {
      return;
    }

    if (setCollapse && isInitiallyExpanded(liveChat)) {
      liveChat.initialDisplayState = "LIVE_CHAT_DISPLAY_STATE_COLLAPSED";
      console.debug("[Collapsed by Default] live chat collapsed");
    }
  };

  document.addEventListener("yt-page-data-fetched", handler);
});

function extractLiveChatRenderer(event: PageDataFetchedEvent) {
  return event.detail.pageData.response?.contents?.twoColumnWatchNextResults
    ?.conversationBar?.liveChatRenderer;
}

function isInitiallyExpanded(liveChat: LiveChatRenderer) {
  return liveChat.initialDisplayState === "LIVE_CHAT_DISPLAY_STATE_EXPANDED";
}
