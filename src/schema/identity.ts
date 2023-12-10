import { PaginationParams } from "./common";

export type User = {
  avatar: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  city: string;
  country: "US";
  nickname: string;
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  dob: null;
  phone: string;
  total_followers: number;
  total_followings: number;
  is_followed?: boolean;
};

export type BasicUser = {
  id: string;
  avatar: string;
  nickname: string;
  first_name: string;
  last_name: string;
};

export interface UserRegistrationParams {
  username: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  gender?: string;
  city?: string;
  country?: string;
  avatar?: string;
  password: string;
  password_confirm: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface SearchUserParams extends PaginationParams {
  search?: string;
  gender?: User["gender"];
}

export interface GetUserByIdsRequestBody {
  user_ids: string[];
  detail?: boolean;
}

export type UserByIdsResponse<T extends User | BasicUser = BasicUser> = T[];
