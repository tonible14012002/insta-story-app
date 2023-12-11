import { storyService } from "@/apis";
import { useFetchWithCache } from "@/libs/use-fetch-with-cache";

const FETCH_ACTIVE_STORY_BY_USER_ID = "FETCH_ACTIVE_STORY_BY_USER_ID";

export const useFetchActiveStoriesByUserId = (
  id?: string,
  allowFetch: boolean = true,
) => {
  const { data, ...restData } = useFetchWithCache(
    allowFetch ? [FETCH_ACTIVE_STORY_BY_USER_ID, id] : null,
    () => storyService.getStories({ owner_id: id }),
  );
  return {
    stories: data?.data,
    ...restData,
  };
};
