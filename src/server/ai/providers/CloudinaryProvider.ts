import { BaseProvider } from "./BaseProvider";
import { EnhancementOptions } from "../../types";

export class CloudinaryProvider extends BaseProvider {
  name = "Cloudinary AI";

  isAvailable(): boolean {
    return !!process.env.CLOUDINARY_URL;
  }

  async enhanceImage(filePath: string, mimeType: string, options: EnhancementOptions, getPublicUrl: (filePath: string) => string): Promise<string> {
    throw new Error("Cloudinary requires full SDK setup, skipped for basic interface.");
  }

  async enhanceVideo(): Promise<string> {
    throw new Error("Cloudinary video upscaling not implemented.");
  }
}
