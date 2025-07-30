import { useAuth } from './hooks/useAuth';
import { AuthForm } from './components/AuthForm';
import { UserHeader } from './components/UserHeader';
import { MainContent } from './components/MainContent';
import { EmbeddingTest } from './components/EmbeddingTest';
import { Toaster } from '@/components/ui/toaster';
import { Loader2 } from 'lucide-react';
import './App.css';

function App() {
  const { user, loading, signOut } = useAuth();

  // Development mode: show embedding test
  const isDevelopment = import.meta.env.DEV;
  const showEmbeddingTest = isDevelopment && new URLSearchParams(window.location.search).has('test');

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <AuthForm onAuthSuccess={() => {}} />
        <Toaster />
      </>
    );
  }

  // Show embedding test in development mode
  if (showEmbeddingTest) {
    return (
      <>
        <div className="min-h-screen bg-gray-50">
          <UserHeader user={user} onSignOut={signOut} />
          <EmbeddingTest />
        </div>
        <Toaster />
      </>
    );
  }

  return (
    <>
      <div className="h-screen flex flex-col">
        <UserHeader user={user} onSignOut={signOut} />
        <MainContent />
      </div>
      <Toaster />
    </>
  );
}

export default App;