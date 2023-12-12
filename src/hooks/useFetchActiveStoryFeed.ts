import { storyService } from "@/apis";
import { useFetchWithCache } from "@/libs/use-fetch-with-cache";

const FETCH_ACTIVE_STORY_FEED = "FETCH_ACTIVE_STORY_FEED";

export const useFetchActiveStoriesFeed = (
  id?: string,
  allowFetch: boolean = true,
) => {
  const { data, ...restData } = useFetchWithCache(
    allowFetch ? [FETCH_ACTIVE_STORY_FEED, id] : null,
    () => storyService.getStories({}),
  );
  return {
    stories: data?.data,
    ...restData,
  };
};
