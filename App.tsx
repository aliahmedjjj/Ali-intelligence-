// مكونات واجهة المستخدم الرئيسية
import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// نموذج للرسالة
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

function App() {
  // حالة المحادثة
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState('default');
  
  // مرجع للتمرير التلقائي
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // التمرير التلقائي إلى أسفل عند إضافة رسائل جديدة
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // إضافة رسالة ترحيبية عند بدء المحادثة
  useEffect(() => {
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      content: 'مرحباً بك! أنا Manus، مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟',
      sender: 'assistant',
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, []);

  // إرسال رسالة إلى الخادم
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    // إضافة رسالة المستخدم إلى المحادثة
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // استدعاء واجهة برمجة التطبيقات
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          conversation_id: conversationId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // إضافة رد المساعد إلى المحادثة
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.message,
          sender: 'assistant',
          timestamp: new Date(),
        };
        
        setMessages(prevMessages => [...prevMessages, assistantMessage]);
        setConversationId(data.conversation_id);
      } else {
        // إضافة رسالة خطأ
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `حدث خطأ: ${data.error || 'فشل الاتصال بالخادم'}`,
          sender: 'assistant',
          timestamp: new Date(),
        };
        
        setMessages(prevMessages => [...prevMessages, errorMessage]);
      }
    } catch (error) {
      // إضافة رسالة خطأ في حالة فشل الاتصال
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'عذراً، حدث خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى.',
        sender: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // مسح المحادثة
  const clearConversation = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/clear-conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_id: conversationId,
        }),
      });

      if (response.ok) {
        // إعادة تعيين المحادثة مع رسالة ترحيبية جديدة
        const welcomeMessage: Message = {
          id: Date.now().toString(),
          content: 'مرحباً بك! أنا Manus، مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟',
          sender: 'assistant',
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error('فشل مسح المحادثة:', error);
    }
  };

  // معالجة إرسال النموذج
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  // تنسيق الرسائل لعرضها
  const formatMessage = (content: string) => {
    // يمكن إضافة دعم Markdown هنا في المستقبل
    return content;
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Manus - مساعدك الذكي</h1>
        <button onClick={clearConversation} className="clear-button">
          محادثة جديدة
        </button>
      </header>

      <main className="chat-container">
        <div className="messages-container">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.sender === 'user' ? 'user-message' : 'assistant-message'}`}
            >
              <div className="message-content">
                {formatMessage(message.content)}
              </div>
              <div className="message-timestamp">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="message assistant-message loading">
              <div className="loading-indicator">
                <span>.</span><span>.</span><span>.</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="اكتب رسالتك هنا..."
            className="message-input"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="send-button"
            disabled={isLoading || !inputMessage.trim()}
          >
            إرسال
          </button>
        </form>
      </main>

      <footer className="app-footer">
        <p>Manus - مساعد ذكي مدعوم بالذكاء الاصطناعي</p>
      </footer>
    </div>
  );
}

export default App;
