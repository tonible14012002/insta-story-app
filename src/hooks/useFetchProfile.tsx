import { identityService } from "@/apis"
import { useFetchWithCache } from "@/libs/use-fetch-with-cache"


export const FETCH_PROFILE_KEY =  "FETCH_PROFILE_KEY"

export const useFetchProfile = (id?: string) => {
   const { data, ...props  } = useFetchWithCache(
      // The Fetcher only be called when cache Key is not Null value
      id ? FETCH_PROFILE_KEY: null,
      () => identityService.profileById(id as string)
   )
   return {
      profile: data?.data,
      ...props
   }
}