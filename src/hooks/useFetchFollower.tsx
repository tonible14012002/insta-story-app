import { identityService } from "@/apis";
import { useFetchWithCache } from "@/libs/use-fetch-with-cache";

export const FETCH_FOLLOWER_KEY = "FETCH_FOLLOWER_KEY";

export const useFetchFollower = (id?: string) => {
  const { data, ...props } = useFetchWithCache(
    // The Fetcher only be called when cache Key is not Null value
    id ? [FETCH_FOLLOWER_KEY, id] : null,
    () => identityService.getFollowerbyId(id as string),
  );
  return {
    followers: data?.data,
    ...props,
  };
};
