import { PaginationParams } from "./common";
import COUNTRY_CODE from "@/constants/country-code.json";

export type User = {
  avatar?: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  city: string;
  country?: keyof typeof COUNTRY_CODE;
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

export type BasicUser = Pick<
  User,
  | "id"
  | "avatar"
  | "first_name"
  | "last_name"
  | "nickname"
  | "total_followers"
  | "is_followed"
>;

export type UserRegistrationParams = Pick<
  User,
  | "username"
  | "first_name"
  | "last_name"
  | "email"
  | "gender"
  | "city"
  | "country"
  | "avatar"
  | "phone"
  | "dob"
> & {
  password: string;
  password_confirm: string;
};

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
