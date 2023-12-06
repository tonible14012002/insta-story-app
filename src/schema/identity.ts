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
