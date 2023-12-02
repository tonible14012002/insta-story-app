import JWTManager from "@/libs/jwt-manager";
import { identityService  } from "./identity";
import { storyService } from "./story";

const serviceList = [
   identityService,
   storyService
]

const services = {
  setAuthToken: (token: string) => {
    serviceList.forEach((service) => service.setAuthToken(token))
  },
  clearAuthToken: () => {
    serviceList.forEach((service) => service.clearAuthToken())
  },
}

if (typeof window !== "undefined") {
 

  window.addEventListener('storage', (event) => {
    const { key, newValue } = event
    console.log("run new token")
    if (key === JWTManager?.getTokenKey() && newValue) {
      services.setAuthToken(newValue)
    }
    console.log("set token")
  })
}

export { identityService, storyService }
