import fetcher from "@/libs/fetcher";
import { cloudinaryUploadUrl } from "@/constants/cloudinary";

class UploaderService {
  private createFormData() {
    const formData = new FormData();
    // formData.append("signature", process.env.CLOUDINARY_API_SECRET || "")
    formData.append("api_key", process.env.CLOUDINARY_API_KEY || "");
    return formData;
  }

  public uploadImage(file: Blob) {
    const data = this.createFormData();
    data.append("file", file);
    return fetcher(`${cloudinaryUploadUrl}/`, {
      body: data,
      method: "POST",
    });
  }
}

const uploaderService = new UploaderService();

export { uploaderService };
