import { identityService } from "@/apis";
import { SMALL_SIZE_PAGINATION } from "@/constants";
import { useFetchInfinite } from "@/libs/use-fetch-infinite";
import { SearchUserParams } from "@/schema";

export const SEARCH_USER_KEY = "SEARCH_USER_KEY";

export const useSearchUsers = (
  params: Omit<SearchUserParams, "pageSize">,
  allowFetch: boolean = true,
) => {
  const { gender, page = 1, search } = params;

  const { data, ...restData } = useFetchInfinite(
    (index) => (allowFetch ? [index, gender, page, search] : null),
    ([index, ...b]) => {
      return identityService.searchUsers({
        page: index + 1,
        pageSize: SMALL_SIZE_PAGINATION,
        search,
        gender,
      });
    },
  );
  return {
    userCollections: data,
    ...restData,
  };
};
