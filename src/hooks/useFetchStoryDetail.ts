import { storyService } from "@/apis";
import { useFetchWithCache } from "@/libs/use-fetch-with-cache";

const STORY_DETAIL_KEY = "STORY_DETAIL_KEY";

export const useFetchStoryDetail = (id: string, allowFetch: boolean = true) => {
  const { data, ...restData } = useFetchWithCache(
    allowFetch ? [STORY_DETAIL_KEY, id] : null,
    () => storyService.getStoryDetail(id),
  );
  return {
    story: data?.data,
    ...restData,
  };
};
