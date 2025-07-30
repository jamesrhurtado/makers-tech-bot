# Makers Tech - AI-Powered Chatbot Implementation

This project includes an intelligent chatbot powered by Pinecone vector database and Supabase, with OpenAI integration for natural language responses.

## 🚀 Features Implemented

### 1. **Vector-Powered Product Search**
- Products from Supabase are automatically converted to vector embeddings
- Stored in Pinecone for semantic similarity search
- Real-time sync when products are added/updated

### 2. **Intelligent Chatbot**
- Understands natural language queries about products
- Provides contextual recommendations based on user needs
- Falls back gracefully when external services are unavailable

### 3. **Real-time Synchronization**
- Automatic sync between Supabase and Pinecone
- Real-time updates when products change
- Visual indicators during sync operations

## 🛠️ Setup Instructions

### 1. Environment Variables
Copy `.env.example` to `.env` and fill in your credentials:

```bash
# Supabase Configuration (Required)
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Pinecone Configuration (Required for vector search)
VITE_PINECONE_API_KEY=your-pinecone-api-key
VITE_PINECONE_INDEX_NAME=makers-tech-products

# OpenAI Configuration (Optional - intelligent fallback works without it)
VITE_OPENAI_API_KEY=your-openai-api-key
```

### 2. Supabase Setup
Ensure your Supabase database has a `products` table with this structure:

```sql
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    category TEXT,
    stock INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow read access to all authenticated users
CREATE POLICY "Allow read access to products" ON products
    FOR SELECT USING (true);

-- Allow insert/update for authenticated users (for admin operations)
CREATE POLICY "Allow insert for authenticated users" ON products
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow update for authenticated users" ON products
    FOR UPDATE USING (auth.uid() IS NOT NULL);
```

### 3. Pinecone Setup
1. Create a Pinecone account at https://pinecone.io
2. Create an index with these settings:
   - **Dimensions**: 1536 (for OpenAI embeddings) or 768 (for other models)
   - **Metric**: cosine
   - **Name**: `makers-tech-products` (or update the env variable)

### 4. Sample Products
Insert some sample products to test the chatbot:

```sql
INSERT INTO products (name, brand, description, price, category, stock) VALUES
('MacBook Pro 16"', 'Apple', 'Powerful laptop with M3 Pro chip, perfect for developers and creative professionals', 2499.00, 'Computer', 10),
('iPhone 15 Pro', 'Apple', 'Latest iPhone with titanium design and advanced camera system', 999.00, 'Phone', 25),
('ThinkPad X1 Carbon', 'Lenovo', 'Ultra-light business laptop with excellent keyboard and long battery life', 1899.00, 'Computer', 15),
('Galaxy S24 Ultra', 'Samsung', 'Premium Android phone with S Pen and incredible camera capabilities', 1199.00, 'Phone', 20),
('iPad Pro 12.9"', 'Apple', 'Professional tablet perfect for design work and productivity', 1099.00, 'Tablet', 12);
```


## 🔧 Architecture

### Services Created:
- **`PineconeService`**: Handles vector operations and product embeddings
- **`OpenAIService`**: Generates intelligent responses with fallbacks
- **`ChatbotService`**: Orchestrates the entire conversation flow

### Hooks Created:
- **`useProductSync`**: Manages real-time synchronization between services

### Components Updated:
- **`ChatBot`**: Now uses intelligent responses instead of random replies
- **`ProductGrid`**: Shows sync status and provides refresh functionality


The chatbot is now ready to provide intelligent, context-aware responses about your tech products! 🎉
