import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { azureEmbeddingService } from '@/lib/azure-embedding';
import { chatbotService } from '@/lib/chatbot';

export function EmbeddingTest() {
  const [testText, setTestText] = useState('MacBook Pro laptop for developers');
  const [embedding, setEmbedding] = useState<number[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chatResponse, setChatResponse] = useState<string>('');

  const testEmbedding = async () => {
    setIsLoading(true);
    try {
      const result = await azureEmbeddingService.generateEmbedding(testText);
      setEmbedding(result);
      console.log('Embedding generated:', result.slice(0, 10), '... (showing first 10 dimensions)');
    } catch (error) {
      console.error('Error generating embedding:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const testChatbot = async () => {
    setIsLoading(true);
    try {
      const response = await chatbotService.processMessage(testText);
      setChatResponse(response);
    } catch (error) {
      console.error('Error testing chatbot:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isAzureAvailable = azureEmbeddingService.isServiceAvailable();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Azure OpenAI Embedding Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <span className={`inline-block w-3 h-3 rounded-full ${isAzureAvailable ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span>{isAzureAvailable ? 'Azure OpenAI Connected' : 'Azure OpenAI Not Available (using fallback)'}</span>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="test-text" className="text-sm font-medium">Test Text:</label>
            <Input
              id="test-text"
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder="Enter text to test embedding generation"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={testEmbedding} disabled={isLoading}>
              {isLoading ? 'Generating...' : 'Test Embedding'}
            </Button>
            <Button onClick={testChatbot} disabled={isLoading} variant="outline">
              {isLoading ? 'Processing...' : 'Test Chatbot'}
            </Button>
          </div>

          {embedding && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Embedding Result:</h3>
              <div className="bg-gray-100 p-3 rounded text-xs font-mono">
                <p><strong>Dimensions:</strong> {embedding.length}</p>
                <p><strong>First 10 values:</strong> [{embedding.slice(0, 10).map(v => v.toFixed(6)).join(', ')}...]</p>
                <p><strong>Service:</strong> {isAzureAvailable ? 'Azure OpenAI' : 'Mock/Fallback'}</p>
              </div>
            </div>
          )}

          {chatResponse && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Chatbot Response:</h3>
              <div className="bg-blue-50 p-3 rounded text-sm">
                {chatResponse}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
