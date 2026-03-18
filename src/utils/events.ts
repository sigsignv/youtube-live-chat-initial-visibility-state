import * as v from "valibot";
import type { LiveChatRenderer } from "./types";

declare global {
  interface DocumentEventMap {
    "yt-page-data-fetched": CustomEvent<PageDataDetail>;
  }
}

const PageDataDetailSchema = v.object({
  pageData: v.object({
    page: v.literal("watch"),
    response: v.object({
      contents: v.object({
        twoColumnWatchNextResults: v.object({
          conversationBar: v.object({
            liveChatRenderer: v.object({
              initialDisplayState: v.picklist([
                "LIVE_CHAT_DISPLAY_STATE_EXPANDED",
                "LIVE_CHAT_DISPLAY_STATE_COLLAPSED",
              ]),
              isReplay: v.optional(v.boolean()),
            }),
          }),
        }),
      }),
    }),
  }),
});

type PageDataDetail = v.InferOutput<typeof PageDataDetailSchema>;

type PageDataFetchedCallback = (liveChat: LiveChatRenderer) => void;

export function onPageDataFetched(callback: PageDataFetchedCallback) {
  const controller = new AbortController();
  const signal = controller.signal;

  const listener = (ev: CustomEvent<PageDataDetail>) => {
    const r = v.safeParse(PageDataDetailSchema, ev.detail);
    if (!r.success) {
      return;
    }

    try {
      const liveChat = extractLiveChatRenderer(ev.detail);
      callback(liveChat);
    } catch (error) {
      console.error("Failed onPageDataFetched callback", error);
    }
  };

  document.addEventListener("yt-page-data-fetched", listener, { signal });

  return () => controller.abort();
}

function extractLiveChatRenderer(detail: PageDataDetail) {
  return detail.pageData.response.contents.twoColumnWatchNextResults
    .conversationBar.liveChatRenderer;
}
