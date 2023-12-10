import { identityService } from "@/apis";
import { useFetchWithCache } from "@/libs/use-fetch-with-cache";
import { BasicUser, GetUserByIdsRequestBody, User } from "@/schema";

const FETCH_USER_BY_IDS_KEY = "FETCH_USER_BY_IDS_KEY";

export const useFetchUsersByIds = <T extends BasicUser | User>(
  body: GetUserByIdsRequestBody,
) => {
  const { data, ...rest } = useFetchWithCache(
    body.user_ids.length
      ? [FETCH_USER_BY_IDS_KEY, JSON.stringify(body.user_ids), body.detail]
      : null,
    () => identityService.getUserByIds<T>(body),
  );
  return {
    users: data?.data,
    ...rest,
  };
};
