'use client'

import { useState, useRef, useEffect } from 'react'

type Message = {
  sender: 'user' | 'bot';
  text: string;
};

// Logique simple pour simuler les réponses du chatbot
const getBotResponse = (userMessage: string): string => {
  const lowerCaseMessage = userMessage.toLowerCase();
  if (lowerCaseMessage.includes('bonjour') || lowerCaseMessage.includes('salut')) {
    return 'Bonjour ! Comment puis-je vous aider aujourd\'hui sur Afrivio ?';
  }
  if (lowerCaseMessage.includes('paiement') || lowerCaseMessage.includes('payer')) {
    return 'Pour le moment, les paiements se font via Mobile Money. Après avoir réservé, vous recevrez un numéro pour finaliser votre paiement.';
  }
  if (lowerCaseMessage.includes('réservation') || lowerCaseMessage.includes('réserver')) {
    return 'Vous pouvez réserver une offre en cliquant sur "Voir l\'offre" depuis notre catalogue, puis sur "Réserver maintenant".';
  }
  if (lowerCaseMessage.includes('aide') || lowerCaseMessage.includes('support')) {
    return 'Je suis là pour vous aider. Posez-moi une question sur les réservations, les paiements ou les comptes.';
  }
  if (lowerCaseMessage.includes('compte') || lowerCaseMessage.includes('abonnement')) {
    return 'Vous pouvez gérer votre compte et voir votre type d\'abonnement depuis votre tableau de bord personnel.';
  }
  return 'Je ne suis pas sûr de comprendre. Pouvez-vous reformuler ? Vous pouvez demander de l\'aide sur le "paiement", la "réservation" ou votre "compte".';
};


export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: 'Bonjour ! Je suis l\'assistant Afrivio. Comment puis-je vous aider ?' }
  ])
  const [inputValue, setInputValue] = useState('')
  const chatBodyRef = useRef<HTMLDivElement>(null);

  // Fait défiler la fenêtre de chat vers le bas à chaque nouveau message
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const userMessage: Message = { sender: 'user', text: inputValue };
    const botResponse: Message = { sender: 'bot', text: getBotResponse(inputValue) };

    setMessages([...messages, userMessage, botResponse]);
    setInputValue('');
  };

  return (
    <>
      {/* Fenêtre de chat */}
      <div className={`fixed bottom-24 right-5 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col transition-transform duration-300 ${isOpen ? 'transform-none' : 'transform translate-y-full opacity-0'}`}>
        <header className="bg-indigo-600 text-white p-3 rounded-t-lg">
          <h3 className="font-semibold text-center">Support Afrivio</h3>
        </header>
        <div ref={chatBodyRef} className="flex-1 p-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`my-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block px-3 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                {msg.text}
              </span>
            </div>
          ))}
        </div>
        <div className="p-2 border-t border-gray-200">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Posez votre question..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Bouton flottant pour ouvrir/fermer le chat */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 w-16 h-16 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center text-3xl"
      >
        💬
      </button>
    </>
  )
}