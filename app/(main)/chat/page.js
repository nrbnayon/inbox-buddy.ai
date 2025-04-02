import { ChatProvider } from './components/ChatContext';
import ChatSection from './components/ChatSection';

export default function ChatPage() {
  return (
    <ChatProvider>
      <ChatSection />
    </ChatProvider>
  );
}