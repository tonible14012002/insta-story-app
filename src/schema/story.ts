import { BasicUser, User } from ".";

export interface Story {
  id: string;
  duration: number;
  excluded_users: string[];
  media_url: string;
  created_at: string;
  updated_at: string;
  live_time: number;
  status: "NEW";
  privacy_mode: "PUBLIC" | "PRIVATE";
  views: StoryView[];
  expire_date: string;
  media_type: "VIDEO" | "IMAGE";
  owner: BasicUser;
  total_view: number;
  caption: string;
  alt_text: string;
  view_option: "ONLY_ME" | "EVERYONE";
}

export type StoryView = {
  pkid: number;
  user: BasicUser;
  viewed_at: string;
};

export type GetStoriesParams = {
  owner_id?: User["id"];
};

export type BasicStory = Pick<
  Story,
  | "id"
  | "created_at"
  | "duration"
  | "expire_date"
  | "media_url"
  | "media_type"
  | "privacy_mode"
  | "owner"
  | "total_view"
  | "alt_text"
  | "caption"
>;

export interface CreateStoryBody {
  caption: string;
  alt_text: string;
  view_option: "ONLY_ME" | "EVERYONE";
  duration: "5" | "10" | "15" | "30";
  media_url: string;
  live_time: "4300" | "8600" | "17200";
  privacy_mode: "PUBLIC" | "PRIVATE" | "FRIEND_ONLY";
  users_to_exclude: string[];
  media_type: "VIDEO" | "IMAGE";
}
