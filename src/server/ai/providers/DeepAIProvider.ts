import { BaseProvider } from "./BaseProvider";
import { EnhancementOptions } from "../../types";

export class DeepAIProvider extends BaseProvider {
  name = "DeepAI";

  isAvailable(): boolean {
    return !!process.env.DEEPAI_API_KEY;
  }

  async enhanceImage(filePath: string, mimeType: string, options: EnhancementOptions, getPublicUrl: (filePath: string) => string): Promise<string> {
    const fileUrl = getPublicUrl(filePath);
    
    const formData = new URLSearchParams();
    formData.append("image", fileUrl);
    
    const promise = fetch("https://api.deepai.org/api/torch-srgan", {
      method: "POST",
      headers: {
        "api-key": process.env.DEEPAI_API_KEY || "",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: formData.toString(),
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
