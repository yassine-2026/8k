import fs from "fs";
import { BaseProvider } from "./BaseProvider";
import { EnhancementOptions } from "../types";

export class ClipdropProvider extends BaseProvider {
  name = "Clipdrop";

  isAvailable(): boolean {
    return !!process.env.CLIPDROP_API_KEY;
  }

  async enhanceImage(filePath: string, mimeType: string, options: EnhancementOptions, getPublicUrl: (filePath: string) => string): Promise<string> {
    const fileBuffer = await fs.promises.readFile(filePath);
    const form = new FormData();
    form.append('image_file', new Blob([fileBuffer], { type: mimeType }));
    
    const promise = fetch('https://clipdrop-api.co/image-upscaling/v1/upscale', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.CLIPDROP_API_KEY || '',
      },
      body: form as any,
    }).then(async (res) => {
      if (!res.ok) throw new Error(`Clipdrop Error: ${await res.text()}`);
      const buffer = await res.arrayBuffer();
      return `data:image/png;base64,${Buffer.from(buffer).toString("base64")}`;
    });

    return this.withTimeout(promise, 60000);
  }

  async enhanceVideo(): Promise<string> {
    throw new Error("Clipdrop does not support video upscaling.");
  }
}
