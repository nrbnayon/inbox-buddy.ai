// app\(main)\chat\page.js
import { ChatProvider } from './components/ChatContext';
import ChatSection from './components/ChatSection';

export default function ChatPage() {
  return (
    <ChatProvider>
      <div className="min-h-screen bg-gray-50">
        <ChatSection />
      </div>
    </ChatProvider>
  );
}