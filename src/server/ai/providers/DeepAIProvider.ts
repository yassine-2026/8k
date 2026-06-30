import fs from "fs";
import { BaseProvider } from "./BaseProvider";
import { EnhancementOptions } from "../types";

export class DeepAIProvider extends BaseProvider {
  name = "DeepAI";

  isAvailable(): boolean {
    return !!process.env.DEEPAI_API_KEY;
  }

  async enhanceImage(filePath: string, mimeType: string, options: EnhancementOptions, getPublicUrl: (filePath: string) => string): Promise<string> {
    const fileBuffer = await fs.promises.readFile(filePath);
    
    const form = new FormData();
    form.append("image", new Blob([fileBuffer], { type: mimeType }));
    
    const promise = fetch("https://api.deepai.org/api/torch-srgan", {
      method: "POST",
      headers: {
        "api-key": process.env.DEEPAI_API_KEY || ""
      },
      body: form as any,
    }).then(async (res) => {
      if (!res.ok) throw new Error(`DeepAI Error: ${await res.text()}`);
      const data = await res.json();
      return data.output_url;
    });

    return this.withTimeout(promise, 60000);
  }

  async enhanceVideo(): Promise<string> {
    throw new Error("DeepAI does not support video upscaling.");
  }
}
