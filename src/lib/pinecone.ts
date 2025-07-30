import { Pinecone } from '@pinecone-database/pinecone';
import { azureEmbeddingService } from './azure-embedding';

// Initialize Pinecone client with error handling
let pinecone: Pinecone | null = null;
let initError: string | null = null;

try {
  pinecone = new Pinecone({
    apiKey: import.meta.env.VITE_PINECONE_API_KEY,
  });
} catch (error) {
  console.error('Failed to initialize Pinecone:', error);
  initError = error instanceof Error ? error.message : 'Unknown initialization error';
}

const INDEX_NAME = import.meta.env.VITE_PINECONE_INDEX_NAME;

export class PineconeService {
  private index: any;
  private isAvailable: boolean = false;

  constructor() {
    if (pinecone && !initError) {
      try {
        this.index = pinecone.Index(INDEX_NAME);
        this.isAvailable = true;
      } catch (error) {
        console.error('Failed to get Pinecone index:', error);
        this.isAvailable = false;
      }
    } else {
      console.warn('Pinecone service not available:', initError || 'Failed to initialize');
      this.isAvailable = false;
    }
  }

  // Generate embeddings using Azure OpenAI
  async generateEmbedding(text: string): Promise<number[]> {
    return await azureEmbeddingService.generateEmbedding(text);
  }

  // Upsert products to Pinecone
  async upsertProducts(products: any[]): Promise<void> {
    if (!this.isAvailable) {
      console.warn('Pinecone service not available, skipping upsert');
      return;
    }

    try {
      const records = await Promise.all(
        products.map(async (product) => {
          const text = `${product.name} by ${product.brand}. ${product.description}. Price: $${product.price}. Category: ${product.category}`;
          const embedding = await this.generateEmbedding(text);
          
          return {
            id: product.id.toString(),
            values: embedding,
            metadata: {
              name: product.name,
              brand: product.brand,
              category: product.category,
              description: product.description,
              price: product.price,
              stock: product.stock,
            },
          };
        })
      );

      await this.index.upsert(records);
      console.log(`Successfully upserted ${records.length} products to Pinecone`);
    } catch (error) {
      console.error('Error upserting products to Pinecone:', error);
      throw error;
    }
  }

  async queryProducts(question: string, topK: number = 3): Promise<any[]> {
    if (!this.isAvailable) {
      console.warn('Pinecone service not available, returning empty results');
      return [];
    }

    try {
      const queryEmbedding = await this.generateEmbedding(question);
      
      const queryResponse = await this.index.query({
        vector: queryEmbedding,
        topK,
        includeMetadata: true,
      });

      return queryResponse.matches || [];
    } catch (error) {
      console.error('Error querying Pinecone:', error);
      return [];
    }
  }
}

export const pineconeService = new PineconeService();
