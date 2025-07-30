import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { chatbotService } from '@/lib/chatbot';

export function useProductSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  const syncProducts = async () => {
    setIsSyncing(true);
    try {
      await chatbotService.syncProducts();
      setLastSyncTime(new Date());
      console.log('Products synced successfully');
    } catch (error) {
      console.error('Error syncing products:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Set up real-time subscription to products table
  useEffect(() => {
    const channel = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
        },
        (payload) => {
          console.log('Product change detected:', payload);
          // Auto-sync when products change
          syncProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    isSyncing,
    lastSyncTime,
    syncProducts,
  };
}
