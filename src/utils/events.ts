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

type Disposer = () => void;

export function onLiveChatRendererReady(
  callback: (liveChatRenderer: LiveChatRenderer) => void,
): Disposer {
  const listener = (ev: CustomEvent<PageDataDetail>) => {
    const parsed = v.safeParse(PageDataDetailSchema, ev.detail);
    if (!parsed.success) {
      return;
    }

    try {
      const { liveChatRenderer } =
        ev.detail.pageData.response.contents.twoColumnWatchNextResults
          .conversationBar;
      callback(liveChatRenderer);
    } catch (ex) {
      console.error(ex);
    }
  };

  document.addEventListener("yt-page-data-fetched", listener);

  return () => {
    document.removeEventListener("yt-page-data-fetched", listener);
  };
}
