export interface EnhancementOptions {
  scale: number;
  faceEnhance: boolean;
}

export interface EnhancementResult {
  outputUrl: string;
  providerName: string;
  processingTimeMs: number;
}

export interface ProviderStats {
  name: string;
  successCount: number;
  failureCount: number;
  lastUsed: Date | null;
  status: 'active' | 'inactive';
}

export interface AIProvider {
  name: string;
  isAvailable(): boolean;
  enhanceImage(filePath: string, mimeType: string, options: EnhancementOptions, getPublicUrl: (filePath: string) => string): Promise<string>;
  enhanceVideo(filePath: string, mimeType: string, getPublicUrl: (filePath: string) => string): Promise<string>;
  getStats(): ProviderStats;
  recordSuccess(): void;
  recordFailure(): void;
}
