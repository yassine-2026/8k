import { AIProvider, ProviderStats, EnhancementOptions } from "../types";

export abstract class BaseProvider implements AIProvider {
  abstract name: string;
  private successCount = 0;
  private failureCount = 0;
  private lastUsed: Date | null = null;

  abstract isAvailable(): boolean;
  abstract enhanceImage(filePath: string, mimeType: string, options: EnhancementOptions, getPublicUrl: (filePath: string) => string): Promise<string>;
  abstract enhanceVideo(filePath: string, mimeType: string, getPublicUrl: (filePath: string) => string): Promise<string>;

  getStats(): ProviderStats {
    return {
      name: this.name,
      successCount: this.successCount,
      failureCount: this.failureCount,
      lastUsed: this.lastUsed,
      status: this.isAvailable() ? 'active' : 'inactive'
    };
  }

  recordSuccess() {
    this.successCount++;
    this.lastUsed = new Date();
  }

  recordFailure() {
    this.failureCount++;
    this.lastUsed = new Date();
  }

  protected async withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    let timeoutHandle: NodeJS.Timeout;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutHandle = setTimeout(() => reject(new Error(`Request timed out after ${timeoutMs}ms`)), timeoutMs);
    });

    return Promise.race([
      promise,
      timeoutPromise
    ]).finally(() => clearTimeout(timeoutHandle));
  }
}
