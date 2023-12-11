import fetcher from "@/libs/fetcher";
import * as CryptoJs from "crypto-js";
import queryString from "query-string";

class UploaderService {
  baseUrl = `https://api.cloudinary.com/v1_1/${
    process.env.CLOUDINARY_NAME || "dqw1ilzbd"
  }`;

  private createBaseData() {
    const data = {
      api_secret: process.env.CLOUDINARY_API_SECRET || "",
      api_key: process.env.CLOUDINARY_API_KEY || "",
      timestamp: String(new Date().getTime()),
      upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET || "l6z56jmi",
    };
    return data;
  }

  public uploadImage(file: Blob) {
    const baseData = this.createBaseData();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", baseData.api_key);
    formData.append("api_secret", baseData.api_secret);
    formData.append("upload_preset", baseData.upload_preset);
    formData.append("timestamp", baseData.timestamp);

    return fetcher(`${this.baseUrl}/image/upload/`, {
      method: "POST",
      body: formData,
    });
  }
}

const uploaderService = new UploaderService();

export { uploaderService };

const makeCloudinarySignature = (reqBody: any, apiSecret: string) => {
  const exclude_params = ["file", "cloud_name", "resource_type", "api_key"];

  const orderedParamNames = Object.keys(reqBody)
    .filter((r) => !exclude_params.includes(r))
    .sort();
  let obj = {} as any;
  orderedParamNames.forEach((n) => (obj[n] = reqBody[n]));

  const serialized = queryString.stringify(obj) + `&api_secret=${apiSecret}`;
  const hash = CryptoJs.SHA1(serialized).toString();
  return hash;
};
