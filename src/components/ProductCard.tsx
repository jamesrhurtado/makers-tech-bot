import { Product } from '@/types/product';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Package } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'computer':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'phone':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'tablet':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200 border border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-1">
              {product.name}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 mt-1">
              {product.brand}
            </CardDescription>
          </div>
          <Badge className={`ml-2 ${getCategoryColor(product.category)}`}>
            {product.category}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        <p className="text-sm text-gray-700 mb-4 flex-1 line-clamp-3">
          {product.description}
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Package className="h-4 w-4" />
              <span>{product.stock} in stock</span>
            </div>
          </div>
          
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={product.stock === 0}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}