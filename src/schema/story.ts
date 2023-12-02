import { HALF_DAY, ONE_DAY, TWO_DAY } from "@/constants"
import { BasicUser } from "."

export interface Story {
  id: string
  duration: number
  excluded_users: string[]
  media_url: string
  created_at: string
  updated_at: string
  live_time: number
  status: "NEW",
  privacy_mode: 'PUBLIC' | 'PRIVATE'
  views: BasicUser[]
  expire_date: string
  media_type: "VIDEO" | "IMAGE"
  owner: BasicUser
}

export type BasicStory = Pick<
   Story,
   | 'id'
   | 'created_at'
   | 'duration'
   | 'expire_date'
   | 'media_url'
   | 'media_type'
   | 'privacy_mode'
   | 'owner'
  >


export interface CreateStoryParams {
  duration: 5 | 10 | 15 | 30
  media_url: string
  live_time: typeof ONE_DAY | typeof TWO_DAY | typeof HALF_DAY
  privacy_mode: "PUBLIC" | "PRIVATE" | "FRIEND_ONLY"
  users_to_exclude: string[]
  media_type: "VIDEO" | "IMAGE"
}