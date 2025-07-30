import { AzureOpenAI } from "openai";

// Azure OpenAI configuration
const endpoint = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT;
const apiKey = import.meta.env.VITE_AZURE_OPENAI_API_KEY;
const deployment = import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT;
const apiVersion = import.meta.env.VITE_AZURE_OPENAI_API_VERSION;

export class AzureEmbeddingService {
  private client: AzureOpenAI | null = null;
  private isAvailable: boolean = false;

  constructor() {
    try {
      if (apiKey && endpoint) {
        this.client = new AzureOpenAI({
          endpoint,
          apiKey,
          apiVersion,
          dangerouslyAllowBrowser: true,
        });
        this.isAvailable = true;
        console.log('Azure OpenAI embedding service initialized successfully');
      } else {
        console.warn('Azure OpenAI credentials not found, falling back to mock embeddings');
        this.isAvailable = false;
      }
    } catch (error) {
      console.error('Failed to initialize Azure OpenAI client:', error);
      this.isAvailable = false;
    }
  }

  /**
   * Generate embeddings using Azure OpenAI text-embedding-3-small model
   */
  async generateEmbedding(text: string): Promise<number[]> {
    if (!this.isAvailable || !this.client) {
      console.warn('Azure OpenAI not available, using mock embedding');
      return this.generateMockEmbedding(text);
    }

    try {
      const response = await this.client.embeddings.create({
        input: [text],
        model: deployment,
      });

      if (response.data && response.data.length > 0) {
        return response.data[0].embedding;
      } else {
        throw new Error('No embedding data received from Azure OpenAI');
      }
    } catch (error) {
      console.error('Error generating embedding with Azure OpenAI:', error);
      console.log('Falling back to mock embedding');
      return this.generateMockEmbedding(text);
    }
  }

  /**
   * Fallback mock embedding generation (1536 dimensions to match Azure OpenAI text-embedding-3-small)
   */
  private generateMockEmbedding(text: string): number[] {
    const words = text.toLowerCase().split(/\W+/).filter(word => word.length > 0);
    const embedding = new Array(1536).fill(0); // Match Azure OpenAI embedding dimension
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      for (let j = 0; j < word.length; j++) {
        const index = (word.charCodeAt(j) + i * j) % 1536;
        embedding[index] += 1;
      }
    }
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return embedding.map(val => magnitude > 0 ? val / magnitude : 0);
  }

  /**
   * Check if Azure OpenAI service is available
   */
  isServiceAvailable(): boolean {
    return this.isAvailable;
  }
}

export const azureEmbeddingService = new AzureEmbeddingService();
