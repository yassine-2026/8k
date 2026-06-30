import Replicate from "replicate";
import { BaseProvider } from "./BaseProvider";
import { EnhancementOptions } from "../types";

export class ReplicateProvider extends BaseProvider {
  name = "Replicate";

  isAvailable(): boolean {
    return !!process.env.REPLICATE_API_TOKEN;
  }

  async enhanceImage(filePath: string, mimeType: string, options: EnhancementOptions, getPublicUrl: (filePath: string) => string): Promise<string> {
    const replicate = new (Replicate as any)({
      auth: process.env.REPLICATE_API_TOKEN || "",
    });
    
    const fileUrl = getPublicUrl(filePath);
    
    const promise = replicate.run(
      "nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b",
      {
        input: {
          image: fileUrl,
          scale: options.scale,
          face_enhance: options.faceEnhance
        }
      }
    ) as Promise<string>;

    return this.withTimeout(promise, 60000); // 60s timeout
  }

  async enhanceVideo(filePath: string, mimeType: string, getPublicUrl: (filePath: string) => string): Promise<string> {
    const replicate = new (Replicate as any)({
      auth: process.env.REPLICATE_API_TOKEN || "",
    });
    
    const fileUrl = getPublicUrl(filePath);
    
    const promise = replicate.run(
      "cjwbw/video-restoration:87f87f2e15bcda6a60eebf1bf0285a73e659392e2e666a243d93708a388b1ca5",
      {
        input: { video: fileUrl }
      }
    ) as Promise<string>;

    return this.withTimeout(promise, 300000); // 5m timeout
  }
}
