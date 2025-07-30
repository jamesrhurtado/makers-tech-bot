import { pineconeService } from './pinecone';
import { openaiService } from './openai';
import { supabase } from './supabase';

export class ChatbotService {
  private isInitialized = false;

  async initialize(): Promise<void> {
    try {
      console.log('Initializing chatbot service...');
      
      // Fetch products from Supabase
      const { data: products, error } = await supabase
        .from('products')
        .select('*');

      if (error) {
        console.error('Error fetching products from Supabase:', error);
        throw error;
      }

      if (products && products.length > 0) {
        // Sync products to Pinecone
        await pineconeService.upsertProducts(products);
        console.log(`Successfully synced ${products.length} products to Pinecone`);
      } else {
        console.warn('No products found in database');
      }

      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing chatbot service:', error);
    }
  }

  async processMessage(userMessage: string): Promise<string> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const matches = await pineconeService.queryProducts(userMessage, 3);
      
      const context = this.formatContext(matches);
      
      const response = await openaiService.generateResponse(context, userMessage);
      
      return response;
    } catch (error) {
      console.error('Error processing message:', error);
      return this.getFallbackResponse(userMessage);
    }
  }

  private formatContext(matches: any[]): string {
    if (!matches || matches.length === 0) {
      return '';
    }

    return matches
      .map((match) => {
        const metadata = match.metadata;
        return `Name: ${metadata.name}, Brand: ${metadata.brand}, Category: ${metadata.category}, Description: ${metadata.description}, Price: $${metadata.price}, Stock: ${metadata.stock}`;
      })
      .join('\n');
  }

  // Fallback response when services are unavailable
  private getFallbackResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('laptop') || lowerMessage.includes('computer')) {
      return "I'd be happy to help you find a laptop! We have various computers available. Could you tell me more about what you'll be using it for? Gaming, work, programming, or general use?";
    }
    
    if (lowerMessage.includes('phone') || lowerMessage.includes('mobile')) {
      return "Looking for a new phone? Great! We have smartphones from various brands. Are you looking for something specific like camera quality, battery life, or budget range?";
    }
    
    if (lowerMessage.includes('tablet')) {
      return "Tablets are great for productivity and entertainment! Are you looking for something for work, drawing, reading, or general use?";
    }
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cheap') || lowerMessage.includes('budget')) {
      return "I understand you're looking for budget-friendly options! What type of product are you interested in, and what's your budget range?";
    }

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! Welcome to Makers Tech! I'm here to help you find the perfect tech products. What can I help you with today?";
    }

    // Default response
    return "I'm here to help you find the perfect tech products! You can ask me about laptops, phones, tablets, or any specific features you're looking for. What interests you today?";
  }

  async syncProducts(): Promise<void> {
    await this.initialize();
  }
}

export const chatbotService = new ChatbotService();
