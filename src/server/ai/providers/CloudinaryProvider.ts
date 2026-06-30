import { v2 as cloudinary } from "cloudinary";
import { BaseProvider } from "./BaseProvider";
import { EnhancementOptions } from "../types";

export class CloudinaryProvider extends BaseProvider {
  name = "Cloudinary AI";

  isAvailable(): boolean {
    return !!process.env.CLOUDINARY_URL;
  }

  async enhanceImage(filePath: string, mimeType: string, options: EnhancementOptions, getPublicUrl: (filePath: string) => string): Promise<string> {
    const promise = new Promise<string>((resolve, reject) => {
      cloudinary.uploader.upload(filePath, {
        folder: "ai_enhance",
        transformation: [
          options.faceEnhance ? { effect: "gen_restore" } : {},
          { effect: "upscale" }
        ]
      }, (error, result) => {
        if (error) return reject(new Error(`Cloudinary Error: ${error.message}`));
        if (!result) return reject(new Error("Cloudinary Error: No result returned"));
        resolve(result.secure_url);
      });
    });

    return this.withTimeout(promise, 60000);
  }

  async enhanceVideo(filePath: string, mimeType: string, getPublicUrl: (filePath: string) => string): Promise<string> {
    const promise = new Promise<string>((resolve, reject) => {
      cloudinary.uploader.upload(filePath, {
        resource_type: "video",
        folder: "ai_enhance_video",
        transformation: [
          { effect: "enhance" }
        ]
      }, (error, result) => {
        if (error) return reject(new Error(`Cloudinary Error: ${error.message}`));
        if (!result) return reject(new Error("Cloudinary Error: No result returned"));
        resolve(result.secure_url);
      });
    });

    return this.withTimeout(promise, 300000);
  }
}
