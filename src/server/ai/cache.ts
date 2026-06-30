import crypto from "crypto";
import fs from "fs";

export class ResultCache {
  private cache = new Map<string, string>();

  async getCacheKey(filePath: string, options: any): Promise<string> {
    const fileBuffer = await fs.promises.readFile(filePath);
    const hash = crypto.createHash('md5').update(fileBuffer).digest('hex');
    return `${hash}_${JSON.stringify(options)}`;
  }

  get(key: string): string | undefined {
    return this.cache.get(key);
  }

  set(key: string, resultUrl: string) {
    this.cache.set(key, resultUrl);
  }
}
