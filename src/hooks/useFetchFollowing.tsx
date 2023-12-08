import { identityService } from "@/apis";
import { useFetchWithCache } from "@/libs/use-fetch-with-cache";

export const FETCH_FOLLOWING_KEY = "FETCH_FOLLOWING_KEY";

export const useFetchFollowing = (id?: string) => {
  const { data, ...props } = useFetchWithCache(
    // The Fetcher only be called when cache Key is not Null value
    id ? [FETCH_FOLLOWING_KEY, id] : null,
    () => identityService.getFollowingbyId(id as string),
  );
  return {
    followings: data?.data,
    ...props,
  };
};
