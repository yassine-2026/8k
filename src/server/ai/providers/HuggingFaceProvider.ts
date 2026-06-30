import fs from "fs";
import { BaseProvider } from "./BaseProvider";
import { EnhancementOptions } from "../types";

export class HuggingFaceProvider extends BaseProvider {
  name = "HuggingFace";

  isAvailable(): boolean {
    return !!process.env.HUGGINGFACE_API_KEY;
  }

  async enhanceImage(filePath: string, mimeType: string, options: EnhancementOptions, getPublicUrl: (filePath: string) => string): Promise<string> {
    const fileBuffer = await fs.promises.readFile(filePath);
    
    const promise = fetch(
      "https://api-inference.huggingface.co/models/caidas/swin2SR-classical-sr-x2-64",
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/octet-stream",
        },
        method: "POST",
        body: fileBuffer,
      }
    ).then(async (res) => {
      if (!res.ok) throw new Error(`HuggingFace Error: ${await res.text()}`);
      const buffer = await res.arrayBuffer();
      return `data:image/png;base64,${Buffer.from(buffer).toString("base64")}`;
    });

    return this.withTimeout(promise, 60000);
  }

  async enhanceVideo(): Promise<string> {
    throw new Error("Video enhancement not natively supported by standard HuggingFace Inference free endpoints yet.");
  }
}
