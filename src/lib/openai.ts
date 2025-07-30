// Azure OpenAI Service for generating chatbot responses (o3-mini model)
import { azureChatService } from './azure-chat';

export class OpenAIService {
  private apiKey: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  }

  async generateResponse(context: string, userQuestion: string): Promise<string> {
    try {
      if (azureChatService.available) {
        console.log('🚀 Using Azure OpenAI o3-mini for response generation');
        return await azureChatService.generateChatResponse(context, userQuestion);
      } else {
        console.log('🔄 Azure OpenAI not available, using intelligent fallback');
        return this.generateSmartFallbackResponse(context, userQuestion);
      }
    } catch (error) {
      console.error('Error generating response:', error);
      return this.generateSmartFallbackResponse(context, userQuestion);
    }
  }

  private generateSmartFallbackResponse(context: string, userQuestion: string): string {
    const lowerQuestion = userQuestion.toLowerCase();
    const products = this.parseProductContext(context);
    
    if (products.length === 0) {
      return "I don't have specific product information that matches your question right now. Could you tell me more about what you're looking for? For example, are you interested in laptops, phones, tablets, or other tech products?";
    }

    if (lowerQuestion.includes('laptop') || lowerQuestion.includes('computer')) {
      const laptops = products.filter(p => p.category?.toLowerCase().includes('computer'));
      if (laptops.length > 0) {
        return this.formatProductRecommendations(laptops, 'laptop');
      }
    }

    if (lowerQuestion.includes('phone') || lowerQuestion.includes('mobile')) {
      const phones = products.filter(p => p.category?.toLowerCase().includes('phone'));
      if (phones.length > 0) {
        return this.formatProductRecommendations(phones, 'phone');
      }
    }

    if (lowerQuestion.includes('tablet')) {
      const tablets = products.filter(p => p.category?.toLowerCase().includes('tablet'));
      if (tablets.length > 0) {
        return this.formatProductRecommendations(tablets, 'tablet');
      }
    }

    if (lowerQuestion.includes('price') || lowerQuestion.includes('cheap') || lowerQuestion.includes('budget')) {
      const sortedByPrice = products.sort((a, b) => (a.price || 0) - (b.price || 0));
      return this.formatProductRecommendations(sortedByPrice.slice(0, 3), 'budget-friendly');
    }

    return this.formatProductRecommendations(products.slice(0, 3), 'recommended');
  }

  private parseProductContext(context: string): any[] {
    if (!context.trim()) return [];
    
    const products = [];
    const lines = context.split('\n').filter(line => line.trim());
    
    for (const line of lines) {
      if (line.includes('Name:') || line.includes('Brand:')) {
        const product: any = {};
        const parts = line.split(', ');
        
        parts.forEach(part => {
          if (part.includes('Name:')) product.name = part.split('Name:')[1]?.trim();
          if (part.includes('Brand:')) product.brand = part.split('Brand:')[1]?.trim();
          if (part.includes('Price:')) product.price = parseFloat(part.split('$')[1] || '0');
          if (part.includes('Category:')) product.category = part.split('Category:')[1]?.trim();
          if (part.includes('Description:')) product.description = part.split('Description:')[1]?.trim();
        });
        
        if (product.name) products.push(product);
      }
    }
    return products;
  }

  private formatProductRecommendations(products: any[], type: string): string {
    if (products.length === 0) {
      return "I don't have specific products that match your criteria right now. Could you provide more details about what you're looking for?";
    }

    let response = `Great! I found some ${type} options for you:\n\n`;
    
    products.forEach((product, index) => {
      response += `${index + 1}. **${product.name}** by ${product.brand || 'Unknown Brand'}\n`;
      if (product.price) response += `   💰 Price: $${product.price}\n`;
      if (product.description) response += `   📝 ${product.description}\n`;
      if (product.category) response += `   🏷️ Category: ${product.category}\n`;
      response += '\n';
    });

    response += "Would you like more details about any of these products, or are you looking for something specific?";
    
    return response;
  }
}

export const openaiService = new OpenAIService();
