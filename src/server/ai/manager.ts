import fs from "fs";
import path from "path";
import os from "os";
import { v4 as uuidv4 } from "uuid";
import { AIProvider, EnhancementOptions, EnhancementResult, ProviderStats } from "./types";
import { ReplicateProvider } from "./providers/ReplicateProvider";
import { HuggingFaceProvider } from "./providers/HuggingFaceProvider";
import { DeepAIProvider } from "./providers/DeepAIProvider";
import { FalProvider } from "./providers/FalProvider";
import { ClipdropProvider } from "./providers/ClipdropProvider";
import { TaskQueue } from "./queue";
import { ResultCache } from "./cache";

export class AIManager {
  providers: AIProvider[] = [];
  imageQueue: TaskQueue;
  videoQueue: TaskQueue;
  cache: ResultCache;

  constructor() {
    this.providers.push(new ReplicateProvider());
    this.providers.push(new FalProvider());
    this.providers.push(new HuggingFaceProvider());
    this.providers.push(new ClipdropProvider());
    this.providers.push(new DeepAIProvider());
    
    this.imageQueue = new TaskQueue(4);
    this.videoQueue = new TaskQueue(2);
    this.cache = new ResultCache();
  }

  getProviderStats(): ProviderStats[] {
    return this.providers.map(p => p.getStats());
  }

  async testProviders(baseUrl: string) {
    const results = [];
    const testImageBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    const testImageBuffer = Buffer.from(testImageBase64, "base64");
    const testFilePath = path.join(os.tmpdir(), `test_${uuidv4()}.png`);
    
    await fs.promises.writeFile(testFilePath, testImageBuffer);
    const testPublicUrl = `${baseUrl}/public-temp/${path.basename(testFilePath)}`;

    for (const provider of this.providers) {
      if (!provider.isAvailable()) {
        results.push({
          provider: provider.name,
          status: "inactive",
          reason: "API Key not configured."
        });
        continue;
      }

      try {
        const startTime = Date.now();
        // Skip actual enhancement for replicate during fast health check to save quota, unless required.
        // We will do a full test as requested by user.
        await provider.enhanceImage(testFilePath, "image/png", { scale: 2, faceEnhance: false }, () => testPublicUrl);
        results.push({
          provider: provider.name,
          status: "working",
          latencyMs: Date.now() - startTime
        });
      } catch (error: any) {
        results.push({
          provider: provider.name,
          status: "failed",
          reason: error.message
        });
      }
    }

    try { await fs.promises.unlink(testFilePath); } catch (e) {}
    
    return results;
  }

  private async sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async retryTask<T>(task: () => Promise<T>, retries = 2): Promise<T> {
    let lastError;
    for (let i = 0; i < retries; i++) {
      try {
        return await task();
      } catch (err: any) {
        lastError = err;
        console.warn(`Retry ${i + 1}/${retries} failed: ${err.message}`);
        if (i < retries - 1) {
          await this.sleep(1000 * (i + 1));
        }
      }
    }
    throw lastError;
  }

  async enhanceImage(filePath: string, mimeType: string, options: EnhancementOptions, getPublicUrl: (filePath: string) => string): Promise<EnhancementResult> {
    return this.imageQueue.enqueue(async () => {
      const cacheKey = await this.cache.getCacheKey(filePath, options);
      const cached = this.cache.get(cacheKey);
      if (cached) {
        return { outputUrl: cached, providerName: "Cache", processingTimeMs: 0 };
      }

      const available = this.providers.filter(p => p.isAvailable());
      if (available.length === 0) {
        throw new Error("No AI providers configured. Please add an API key (e.g. REPLICATE_API_TOKEN, FAL_KEY) to your environment variables.");
      }

      let lastError = null;

      for (const provider of available) {
        try {
          console.log(`[AIManager] Attempting image enhancement with ${provider.name}`);
          const startTime = Date.now();
          const outputUrl = await this.retryTask(() => provider.enhanceImage(filePath, mimeType, options, getPublicUrl));
          
          provider.recordSuccess();
          this.cache.set(cacheKey, outputUrl);
          
          return {
            outputUrl,
            providerName: provider.name,
            processingTimeMs: Date.now() - startTime
          };
        } catch (err: any) {
          provider.recordFailure();
          console.error(`[AIManager] Provider ${provider.name} failed:`, err.message);
          lastError = err;
        }
      }
      
      throw new Error(`All configured AI providers failed. Last error: ${lastError?.message}`);
    });
  }

  async enhanceVideo(filePath: string, mimeType: string, getPublicUrl: (filePath: string) => string): Promise<EnhancementResult> {
    return this.videoQueue.enqueue(async () => {
      const available = this.providers.filter(p => p.isAvailable());
      if (available.length === 0) {
        throw new Error("No AI providers configured. Please add an API key to your environment variables.");
      }

      let lastError = null;

      for (const provider of available) {
        try {
          console.log(`[AIManager] Attempting video enhancement with ${provider.name}`);
          const startTime = Date.now();
          const outputUrl = await this.retryTask(() => provider.enhanceVideo(filePath, mimeType, getPublicUrl));
          
          provider.recordSuccess();
          return {
            outputUrl,
            providerName: provider.name,
            processingTimeMs: Date.now() - startTime
          };
        } catch (err: any) {
          provider.recordFailure();
          console.error(`[AIManager] Provider ${provider.name} failed for video:`, err.message);
          lastError = err;
        }
      }
      
      throw new Error(`All configured AI providers failed to enhance video. Last error: ${lastError?.message}`);
    });
  }
}
