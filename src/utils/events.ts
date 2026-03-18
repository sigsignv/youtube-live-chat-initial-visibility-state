import * as v from "valibot";

declare global {
  interface DocumentEventMap {
    "yt-page-data-fetched": CustomEvent<PageDataDetail>;
  }
}

const LiveChatRendererSchema = v.object({
  initialDisplayState: v.picklist([
    "LIVE_CHAT_DISPLAY_STATE_EXPANDED",
    "LIVE_CHAT_DISPLAY_STATE_COLLAPSED",
  ]),
});

export type LiveChatRenderer = v.InferOutput<typeof LiveChatRendererSchema>;

const PageDataDetailSchema = v.object({
  pageData: v.object({
    page: v.literal("watch"),
    response: v.object({
      contents: v.object({
        twoColumnWatchNextResults: v.object({
          conversationBar: v.object({
            liveChatRenderer: LiveChatRendererSchema,
          }),
        }),
      }),
    }),
  }),
});

type PageDataDetail = v.InferOutput<typeof PageDataDetailSchema>;

export function onLiveChatRendererReady(
  callback: (liveChatRenderer: LiveChatRenderer) => void,
) {
  const controller = new AbortController();
  const signal = controller.signal;

  const listener = (ev: CustomEvent<PageDataDetail>) => {
    const r = v.safeParse(PageDataDetailSchema, ev.detail);
    if (!r.success) {
      return;
    }

    try {
      const liveChatRenderer =
        ev.detail.pageData.response.contents.twoColumnWatchNextResults
          .conversationBar.liveChatRenderer;
      callback(liveChatRenderer);
    } catch (error) {
      console.error("onLiveChatRendererReady callback failed", error);
    }
  };

  document.addEventListener("yt-page-data-fetched", listener, { signal });

  return () => controller.abort();
}
