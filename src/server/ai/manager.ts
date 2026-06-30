import { AIProvider, EnhancementOptions, EnhancementResult, ProviderStats } from "./types";
import { ReplicateProvider } from "./providers/ReplicateProvider";
import { HuggingFaceProvider } from "./providers/HuggingFaceProvider";
import { DeepAIProvider } from "./providers/DeepAIProvider";
import { FalProvider } from "./providers/FalProvider";
import { ClipdropProvider } from "./providers/ClipdropProvider";
import { CloudinaryProvider } from "./providers/CloudinaryProvider";
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
    this.providers.push(new CloudinaryProvider());
    
    this.imageQueue = new TaskQueue(4);
    this.videoQueue = new TaskQueue(2);
    this.cache = new ResultCache();
  }

  getProviderStats(): ProviderStats[] {
    return this.providers.map(p => p.getStats());
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
