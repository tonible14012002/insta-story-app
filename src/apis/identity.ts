import { Client } from "@/libs/apis";
import fetcher from "@/libs/fetcher";
import JWTManager from "@/libs/jwt-manager";

import {
  BaseResponse,
  BasicUser,
  LoginResponse,
  User,
  UserRegistrationParams,
} from "@/schema";

class IdentityService extends Client {
  public setAuth() {
    const token = JWTManager?.getToken();
    if (token && JWTManager.isTokenValid()) {
      this.setAuthToken(token);
    }
  }

  public register(params: UserRegistrationParams) {
    return fetcher<BaseResponse<User>>(
      `${this.baseUrl}/api/user-services/profile/registration/`,
      {
        headers: this.headers,
        method: "POST",
        body: JSON.stringify(params),
      }
    );
  }

  public login(params: { username: string; password: string }) {
    return fetcher<BaseResponse<LoginResponse>>(
      `${this.baseUrl}/api/identity-services/token/`,
      {
        headers: this.headers,
        method: "POST",
        body: JSON.stringify(params),
      }
    );
  }

  public profile() {
    this.setAuth();
    console.log(this.privateHeaders);
    return fetcher<BaseResponse<User>>(
      `${this.baseUrl}/api/identity-services/profile/`,
      {
        headers: this.privateHeaders,
        method: "POST",
      }
    );
  }

  public profileById(id: string) {
    this.setAuth();
    console.log(this.privateHeaders);
    return fetcher<BaseResponse<User>>(
      `${this.baseUrl}/api/user-services/profile/${id}/`,
      {
        headers: this.privateHeaders,
        method: "GET",
      }
    );
  }
  public getFollowerbyId(id: string) {
    this.setAuth();
    console.log(this.privateHeaders);
    return fetcher<BaseResponse<BasicUser[]>>(
      `${this.baseUrl}/api/user-services/profile/${id}/followers/`,
      {
        headers: this.privateHeaders,
        method: "GET",
      }
    );
  }
  public getFollowingbyId(id: string) {
    this.setAuth();
    console.log(this.privateHeaders);
    return fetcher<BaseResponse<BasicUser[]>>(
      `${this.baseUrl}/api/user-services/profile/${id}/followings/`,
      {
        headers: this.privateHeaders,
        method: "GET",
      }
    );
  }
  public followUser(id: string) {
    this.setAuth();
    console.log(this.privateHeaders);
    return fetcher<BaseResponse<User>>(
      `${this.baseUrl}/api/user-services/profile/${id}/follow/`,
      {
        headers: this.privateHeaders,
        method: "POST",
      }
    );
  }
  public unfollowUser(id: string) {
    this.setAuth();
    console.log(this.privateHeaders);
    return fetcher<BaseResponse<User>>(
      `${this.baseUrl}/api/user-services/profile/${id}/unfollow/`,
      {
        headers: this.privateHeaders,
        method: "POST",
      }
    );
  }

  public allUsers() {
    this.setAuth();
    console.log(this.privateHeaders);
    return fetcher<BaseResponse<User[]>>(
      `${this.baseUrl}/api/user-services/profile/`,
      {
        headers: this.privateHeaders,
        method: "GET",
      }
    );
  }
}

const identityService = new IdentityService();

export { identityService };
