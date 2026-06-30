import { BaseProvider } from "./BaseProvider";
import { EnhancementOptions } from "../../types";

export class FalProvider extends BaseProvider {
  name = "Fal.ai";

  isAvailable(): boolean {
    return !!process.env.FAL_KEY;
  }

  async enhanceImage(filePath: string, mimeType: string, options: EnhancementOptions, getPublicUrl: (filePath: string) => string): Promise<string> {
    const fileUrl = getPublicUrl(filePath);
    
    const promise = fetch("https://fal.run/fal-ai/aura-sr", {
      method: "POST",
      headers: {
        "Authorization": `Key ${process.env.FAL_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ image_url: fileUrl })
    }).then(async (res) => {
      if (!res.ok) throw new Error(`Fal.ai Error: ${await res.text()}`);
      const data = await res.json();
      return data.image?.url || data.url;
    });

    return this.withTimeout(promise, 60000);
  }

  async enhanceVideo(): Promise<string> {
    throw new Error("Fal.ai video upscaling not implemented in this tier.");
  }
}
