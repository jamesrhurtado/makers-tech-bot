// Azure OpenAI Chat Service using o3-mini model
import { AzureOpenAI } from "openai";

const endpoint = import.meta.env.VITE_AZURE_OPENAI_CHAT_ENDPOINT;
const apiKey = import.meta.env.VITE_AZURE_OPENAI_CHAT_API_KEY;
const deployment = import.meta.env.VITE_AZURE_OPENAI_CHAT_DEPLOYMENT;
const apiVersion = import.meta.env.VITE_AZURE_OPENAI_CHAT_API_VERSION;

export class AzureChatService {
  private client: AzureOpenAI | null = null;
  private isAvailable: boolean = false;

  constructor() {
    try {
      if (apiKey && apiKey !== "" && endpoint) {
        this.client = new AzureOpenAI({
          endpoint,
          apiKey,
          apiVersion,
          deployment,
          dangerouslyAllowBrowser: true, // Solo para desarrollo
        });
        this.isAvailable = true;
      } else {
        this.isAvailable = false;
      }
    } catch (error) {
      this.isAvailable = false;
    }
  }

  async generateChatResponse(context: string, userQuestion: string): Promise<string> {
    if (!this.isAvailable || !this.client) {
      return this.generateFallbackResponse(context, userQuestion);
    }

    try {
      const systemPrompt = `You are an expert assistant in tech products for Makers Tech. Your job is to help customers find the perfect products based on the available product information.

INSTRUCTIONS:
- Be friendly, conversational, and professional
- Recommend specific products when relevant
- Include key details like price, brand, and features
- If there are no relevant products, suggest alternatives or ask for clarification
- Keep responses concise but informative
- Use appropriate emojis to make the conversation more engaging
- Respond in the same language the user asks`;

      const userPrompt = `Available product information:
${context}

User question: ${userQuestion}

Please provide a helpful and specific response based on the available products.`;

      const result = await this.client.chat.completions.create({
        model: deployment,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_completion_tokens: 500,
      });

      const response = result.choices[0]?.message?.content;
      
      if (response) {
        return response;
      } else {
        return this.generateFallbackResponse(context, userQuestion);
      }

    } catch (error) {
      return this.generateFallbackResponse(context, userQuestion);
    }
  }

  private generateFallbackResponse(context: string, userQuestion: string): string {
    const lowerQuestion = userQuestion.toLowerCase();
    
    const products = this.parseProductContext(context);
    
    if (products.length === 0) {
      return "🤔 I don't have specific product information matching your query at the moment. Could you tell me more about what you're looking for? For example, are you interested in laptops, phones, tablets, or other tech products?";
    }

    if (lowerQuestion.includes('laptop') || lowerQuestion.includes('computer') || lowerQuestion.includes('portátil')) {
      const laptops = products.filter(p => p.category?.toLowerCase().includes('computer'));
      if (laptops.length > 0) {
        return this.formatProductRecommendations(laptops, 'laptop');
      }
    }

    if (lowerQuestion.includes('phone') || lowerQuestion.includes('móvil') || lowerQuestion.includes('teléfono') || lowerQuestion.includes('celular')) {
      const phones = products.filter(p => p.category?.toLowerCase().includes('phone'));
      if (phones.length > 0) {
        return this.formatProductRecommendations(phones, 'teléfono');
      }
    }

    if (lowerQuestion.includes('tablet')) {
      const tablets = products.filter(p => p.category?.toLowerCase().includes('tablet'));
      if (tablets.length > 0) {
        return this.formatProductRecommendations(tablets, 'tablet');
      }
    }

    if (lowerQuestion.includes('price') || lowerQuestion.includes('cheap') || lowerQuestion.includes('budget') || 
        lowerQuestion.includes('precio') || lowerQuestion.includes('barato') || lowerQuestion.includes('económico')) {
      const sortedByPrice = products.sort((a, b) => (a.price || 0) - (b.price || 0));
      return this.formatProductRecommendations(sortedByPrice.slice(0, 3), 'budget-friendly');
    }

    return this.formatProductRecommendations(products.slice(0, 3), 'recomendado');
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
      return "🤔 I don't have specific products matching your criteria at the moment. Could you give me more details about what you're looking for?";
    }

    let response = `🛍️ Great! I found some ${type} options for you:\n\n`;
    
    products.forEach((product, index) => {
      response += `${index + 1}. **${product.name}** by ${product.brand || 'Unknown Brand'}\n`;
      if (product.price) response += `   💰 Price: $${product.price}\n`;
      if (product.description) response += `   📝 ${product.description}\n`;
      if (product.category) response += `   🏷️ Category: ${product.category}\n`;
      response += '\n';
    });

    response += "Would you like more details about any of these products, or are you looking for something specific? 😊";

    return response;
  }

  public get available(): boolean {
    return this.isAvailable;
  }
}

export const azureChatService = new AzureChatService();
