import { ProductGrid } from './ProductGrid';
import { ChatBot } from './ChatBot';
import { Card } from '@/components/ui/card';

export function MainContent() {
  return (
    <div className="flex-1 overflow-hidden bg-gray-50">
      <div className="h-full flex">
        {/* Products Section */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Our Products</h2>
              <p className="text-gray-600">Discover our latest tech products and find what you need</p>
            </div>
            <ProductGrid />
          </div>
        </div>

        {/* Chat Section */}
        <div className="w-96 border-l border-gray-200 bg-white flex flex-col">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
            <h3 className="font-semibold">Need Help?</h3>
            <p className="text-sm text-blue-100">Chat with our assistant</p>
          </div>
          <div className="flex-1 overflow-hidden">
            <ChatBot />
          </div>
        </div>
      </div>
    </div>
  );
}