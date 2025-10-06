import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  BookOpen, 
  Users, 
  Target, 
  Calendar,
  Lightbulb,
  MessageSquare,
  Mic,
  Paperclip,
  MoreVertical,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Maximize,
  Minimize
} from 'lucide-react';
import openaiService from '../../../services/openaiService';

const ParentAIChat = () => {

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: '👨‍👩‍👧‍👦 ¡Hola! Soy el **Asistente para Familias EDA** potenciado por ChatGPT.\n\n🤝 Estoy aquí para ayudarte con:\n• Consejos para apoyar el aprendizaje de tu hijo\n• Estrategias de comunicación familia-escuela\n• Sugerencias para el desarrollo socioemocional\n• Resolución de dudas sobre tareas y actividades\n\n🎯 **¿En qué puedo ayudarte hoy como familia?** Puedes preguntarme sobre cualquier tema relacionado con la educación de tu hijo.',
      timestamp: new Date(Date.now() - 60000)
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [apiStatus, setApiStatus] = useState('checking');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const checkApiStatus = () => {
      if (openaiService.isConfigured()) {
        setApiStatus('connected');
      } else {
        setApiStatus('error');
      }
    };
    checkApiStatus();
  }, []);

  const quickPrompts = [
    {
      icon: BookOpen,
      title: "Apoyo en tareas",
      prompt: "¿Cómo puedo ayudar a mi hijo a organizarse mejor con sus tareas escolares y motivarlo a cumplirlas a tiempo?"
    },
    {
      icon: Users,
      title: "Comunicación con docentes",
      prompt: "¿Qué consejos me das para comunicarme de manera efectiva con los profesores de mi hijo y estar al tanto de su progreso?"
    },
    {
      icon: Target,
      title: "Hábitos de estudio",
      prompt: "¿Cuáles son los mejores hábitos de estudio que puedo fomentar en casa para que mi hijo tenga éxito académico?"
    },
    {
      icon: Calendar,
      title: "Rutinas familiares",
      prompt: "¿Cómo puedo establecer una rutina diaria en casa que equilibre el estudio, el juego y el descanso para mi hijo?"
    },
    {
      icon: Lightbulb,
      title: "Motivación y autoestima",
      prompt: "Mi hijo a veces se siente desmotivado o inseguro. ¿Qué estrategias puedo usar para fortalecer su autoestima y motivación?"
    },
    {
      icon: Sparkles,
      title: "Recursos para padres",
      prompt: "¿Qué recursos online gratuitos recomiendas para que los padres apoyen el aprendizaje y desarrollo de sus hijos en primaria?"
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateAIResponse = async (userMessage) => {
    setIsTyping(true);
    try {
      const history = conversationHistory.slice(-6);
      const aiResponse = await openaiService.sendMessage(userMessage, history);
      const newAiMessage = {
        id: Date.now(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newAiMessage]);
      setConversationHistory(prev => [
        ...prev,
        { role: 'user', content: userMessage },
        { role: 'assistant', content: aiResponse }
      ]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage = {
        id: Date.now(),
        type: 'ai',
        content: `❌ **Disculpa, hay un problema temporal**\n\nNo pude procesar tu consulta en este momento. Esto puede deberse a:\n\n� Configuración de API pendiente\n🌐 Problemas de conectividad\n⚡ Límites de uso alcanzados\n\n� **Mientras tanto:**\n• Usa las consultas frecuentes\n• Intenta reformular tu pregunta\n• Contacta al soporte técnico\n\n¿Te gustaría intentar con una pregunta más específica?`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
    setIsTyping(false);
  };

  const handleSendMessage = async (messageContent = newMessage) => {
    if (!messageContent.trim()) return;
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageContent,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    await simulateAIResponse(messageContent);
  };

  const handleQuickPrompt = async (prompt) => {
    await handleSendMessage(prompt);
  };

  const clearConversation = () => {
    setMessages([
      {
        id: 1,
        type: 'ai',
        content: '🔄 **Conversación reiniciada**\n\n👨‍👩‍👧‍👦 ¡Hola de nuevo! Soy el **Asistente para Familias EDA**.\n\n¿En qué puedo ayudarte hoy como familia?',
        timestamp: new Date()
      }
    ]);
    setConversationHistory([]);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'h-full'}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-3 md:p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-3 min-w-0 flex-1">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-yellow-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-base md:text-lg font-semibold text-gray-900 flex items-center space-x-2 truncate">
                <span>Asistente Familiar IA</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full hidden sm:inline">ChatGPT</span>
              </h1>
              <div className="flex items-center space-x-2">
                {apiStatus === 'connected' && (
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span className="text-xs md:text-sm text-green-600 truncate">En línea • Listo para ayudar</span>
                  </div>
                )}
                {apiStatus === 'error' && (
                  <div className="flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3 text-orange-500" />
                    <span className="text-xs md:text-sm text-orange-600">Configuración pendiente</span>
                  </div>
                )}
                {apiStatus === 'checking' && (
                  <span className="text-xs md:text-sm text-gray-500">Verificando conexión...</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1 md:space-x-2 ml-2">
            <button
              onClick={toggleFullscreen}
              className="p-1.5 md:p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
            <button
              onClick={clearConversation}
              className="p-1.5 md:p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              title="Limpiar conversación"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button className="p-1.5 md:p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 md:hidden">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Prompts */}
      {false && (
        <div className="bg-gray-50 p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Consultas Frecuentes:</h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            {quickPrompts.map((prompt, index) => {
              const IconComponent = prompt.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleQuickPrompt(prompt.prompt)}
                  className="flex items-center space-x-2 p-3 text-left bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all duration-200 text-sm"
                >
                  <IconComponent className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700 truncate">{prompt.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex space-x-3 max-w-3xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.type === 'user' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gradient-to-r from-yellow-500 to-blue-600 text-white'
              }`}>
                {message.type === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
              {/* Message Bubble */}
              <div className={`rounded-2xl p-4 ${
                message.type === 'user'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-900'
              }`}>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {/* Render basic markdown formatting */}
                  {message.content.split('\n').map((line, index) => {
                    // Handle bold text **text**
                    if (line.includes('**')) {
                      const parts = line.split(/(\*\*.*?\*\*)/g);
                      return (
                        <div key={index} className={index > 0 ? 'mt-2' : ''}>
                          {parts.map((part, partIndex) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                              return (
                                <strong key={partIndex} className="font-semibold">
                                  {part.slice(2, -2)}
                                </strong>
                              );
                            }
                            return <span key={partIndex}>{part}</span>;
                          })}
                        </div>
                      );
                    }
                    // Handle bullet points
                    if (line.startsWith('•') || line.startsWith('-')) {
                      return (
                        <div key={index} className="ml-2 mt-1">
                          {line}
                        </div>
                      );
                    }
                    // Handle numbered lists
                    if (/^\d+\./.test(line.trim())) {
                      return (
                        <div key={index} className="ml-2 mt-1">
                          {line}
                        </div>
                      );
                    }
                    // Regular lines
                    return (
                      <div key={index} className={index > 0 ? 'mt-2' : ''}>
                        {line || '\u00A0'}
                      </div>
                    );
                  })}
                </div>
                <div className={`text-xs mt-2 ${
                  message.type === 'user' ? 'text-green-100' : 'text-gray-400'
                }`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex space-x-3 max-w-3xl">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-500 to-blue-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-4">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-3 md:p-4">
        <div className="flex items-end space-x-2 md:space-x-3">
          <div className="flex-1">
            <div className="relative">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Pregúntame sobre educación infantil, padres..."
                className="w-full p-3 pr-12 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500 max-h-32 text-sm md:text-base"
                rows="1"
                style={{ minHeight: '44px' }}
              />
            </div>
          </div>

          <button
            onClick={() => handleSendMessage()}
            disabled={!newMessage.trim() || isTyping}
            className={`p-3 rounded-lg transition-colors flex-shrink-0 ${
              newMessage.trim() && !isTyping
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span className="hidden sm:inline">Presiona Enter para enviar, Shift+Enter para nueva línea</span>
          <span className="sm:hidden">Enter para enviar</span>
          <div className="flex items-center space-x-2">
            {apiStatus === 'connected' && (
              <span className="flex items-center space-x-1 text-green-600">
                <CheckCircle className="w-3 h-3" />
                <span className="hidden sm:inline">ChatGPT Conectado</span>
                <span className="sm:hidden">Conectado</span>
              </span>
            )}
            {apiStatus === 'error' && (
              <span className="flex items-center space-x-1 text-orange-600">
                <AlertCircle className="w-3 h-3" />
                <span className="hidden sm:inline">API no configurada</span>
                <span className="sm:hidden">Error</span>
              </span>
            )}
            <span className="hidden md:inline">EDA IA v2.1</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentAIChat;
