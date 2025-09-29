import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Index from '@/pages/Index.tsx';
import NotFound from '@/pages/NotFound.tsx';
import { useEffect } from 'react';
import notificationService from '@/services/notificationService';
import { subscribeToForegroundMessages, firebaseReady } from '@/config/firebase';
import ChatInterface from '@/components/ChatInterface';
import DealAd from '@/pages/DealAd';
import DealForm from '@/pages/DealForm';
import DealSuccess from '@/pages/DealSuccess';
import { Button } from '@/components/ui/button'
import { ArrowRight, Home } from 'lucide-react'
import Chats from '@/pages/Chats';

// Import FCMPayload type
interface FCMPayload {
  notification: {
    title: string;
    body: string;
  };
  data?: {
    type?: string;
    [key: string]: string | undefined;
  };
}

const queryClient = new QueryClient();

// Wrapper page to pass navigation state into ChatInterface full-page mode
const ChatPage = () => {
  const location = useLocation();
  const state = (location && location.state) || {};
  return (
    <ChatInterface
      viewMode="page"
      user={state.user}
      activeChat={state.activeChat}
      pickupRequest={state.pickupRequest}
    />
  );
};

const MissingFirebaseBanner = () => (
  <div style={{
    background: '#fff3cd',
    color: '#856404',
    border: '1px solid #ffeeba',
    padding: '10px 14px',
    margin: '10px',
    borderRadius: 8,
    fontSize: 14
  }}>
    ⚠️ האפליקציה פועלת במצב מוגבל כי חסרים מפתחות Firebase. חלק מהפיצ'רים (התחברות, התראות) יושבתו זמנית.
  </div>
);

const HeaderNav = () => {
  const navigate = useNavigate()
  return (
    <div className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-[60]" dir="rtl">
      <div className="container mx-auto px-3 sm:px-4 py-2 flex items-center justify-between">
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-full"
          >
            <ArrowRight className="w-4 h-4" />
            חזרה
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/')} 
            className="flex items-center gap-1 rounded-full"
          >
            <Home className="w-4 h-4" />
            דף הבית
          </Button>
        </div>
        <div className="text-sm text-green-600 font-bold">
          🔄 עדכונים חיים פעילים!
        </div>
      </div>
    </div>
  )
}

const App = () => {
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    (async () => {
      unsubscribe = await subscribeToForegroundMessages((payload: FCMPayload) => {
        notificationService.handleForegroundMessage(payload);
      });
    })();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {import.meta.env.PROD && !firebaseReady && <MissingFirebaseBanner />}
        <BrowserRouter>
          <HeaderNav />
          <Routes>
            <Route path="/" element={<Index />} />
            {/* Chat full-page route (uses state from navigation) */}
            <Route path="/chat/:chatId" element={<ChatPage />} />
            {/* Deal flow */}
            <Route path="/deal/ad/:chatId" element={<DealAd />} />
            <Route path="/deal/form/:chatId" element={<DealForm />} />
            <Route path="/deal/success/:chatId" element={<DealSuccess />} />
            <Route path="/chats" element={<Chats />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;