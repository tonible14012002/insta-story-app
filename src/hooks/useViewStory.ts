import { storyService } from "@/apis";
import { useFetchWithCache } from "@/libs/use-fetch-with-cache";
import { useCallback, useEffect } from "react";

export const useViewStory = (id: string, allowApi: boolean = true) => {
  const viewStory = useCallback(async () => {
    try {
      await storyService.viewStory(id);
    } catch (e) {
      console.log(e);
    }
  }, [id]);

  useEffect(() => {
    if (allowApi) {
      viewStory();
    }
  }, [allowApi, viewStory]);
};
