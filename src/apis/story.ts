import { Client } from "@/libs/apis";
import fetcher from "@/libs/fetcher";
import JWTManager from "@/libs/jwt-manager";

import { BaseResponse } from "@/schema";
import { BasicStory, CreateStoryBody, Story } from "@/schema/story";

class StoryService extends Client {
  public setAuth() {
    const token = JWTManager?.getToken();
    if (token && JWTManager.isTokenValid()) {
      this.setAuthToken(token);
    }
  }

  public createStory(params: CreateStoryBody) {
    this.setAuth();
    return fetcher<BaseResponse<Story>>(
      `${this.baseUrl}/api/story-services/new/`,
      {
        headers: this.privateHeaders,
        method: "POST",
        body: JSON.stringify(params),
      },
    );
  }

  public getStories() {
    this.setAuth();
    return fetcher<BaseResponse<BasicStory[]>>(
      `${this.baseUrl}/api/story-services/following/`,
      {
        headers: this.privateHeaders,
        method: "GET",
      },
    );
  }

  public getArchievedStories() {
    this.setAuth();
    return fetcher<BaseResponse<Story[]>>(
      `${this.baseUrl}/api/story-services/archieved/`,
      {
        headers: this.privateHeaders,
        method: "GET",
      },
    );
  }
}

const storyService = new StoryService();

export { storyService };
