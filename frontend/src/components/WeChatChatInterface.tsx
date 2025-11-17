import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getSessionId } from '../services/api';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface WeChatChatInterfaceProps {
  fortuneType: string;
  fortuneName: string;
}

export const WeChatChatInterface: React.FC<WeChatChatInterfaceProps> = ({ 
  fortuneType, 
  fortuneName 
}) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 初始化欢迎消息
  useEffect(() => {
    let welcomeContent = `您好！我是${fortuneName}AI占卜师。请输入您的问题，我会为您提供专业的占卜分析和建议。`;
    
    // 如果是八字分析，明确要求先提供出生日期
    if (fortuneType === 'bazi') {
      welcomeContent = `您好！我是八字命理AI占卜师。要进行准确的八字分析，请先提供您的出生日期（格式：1990.05.15 或 1990年5月15日），确认后会为您进行专业分析。`;
    }
    
    const welcomeMessage: Message = {
      id: '1',
      type: 'ai',
      content: welcomeContent,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [fortuneName, fortuneType]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // 提取出生信息（如果用户输入了日期）
      const birthInfo = extractBirthInfo(inputText.trim());
      console.log('🔍 前端提取出生信息:', { inputText: inputText.trim(), birthInfo });
      
      // 调用AI占卜API - 使用相对路径触发Vercel重写规则
      const requestBody: any = {
        question: inputText.trim(),
        type: fortuneType,
        context: messages.slice(-6).map(m => `${m.type === 'user' ? '用户' : '占卜师'}: ${m.content}`).join('\n'),
        sessionId: getSessionId()  // ✅ 使用getSessionId()获取持久化的会话ID
      };
      
      // 检查是否为关系分析请求
      const isRelationshipAnalysis = checkIfRelationshipAnalysis(userMessage.content, requestBody.context);
      console.log('🔍 是否为关系分析请求:', isRelationshipAnalysis);
      
      if (isRelationshipAnalysis) {
        console.log('💑 检测到关系分析请求，准备双人出生信息');
        
        // 提取自己的出生数据
        let selfBirthInfo = null;
        if (birthInfo) {
          selfBirthInfo = birthInfo;
          console.log('✅ 使用当前消息提取的birthInfo作为self:', selfBirthInfo);
        } else {
          // 从历史用户消息中查找自己的出生信息
          const userMessages = messages.slice(-20).filter(m => m.type === 'user');
          for (const userMsg of userMessages) {
            const extracted = extractBirthInfo(userMsg.content);
            if (extracted) {
              selfBirthInfo = extracted;
              console.log('✅ 从历史用户消息中找到自己的出生信息:', selfBirthInfo);
              break;
            }
          }
        }
        
        // 提取对方的出生数据
        let otherBirthInfo = extractOtherBirthData(userMessage.content);
        if (otherBirthInfo) {
          console.log('✅ 提取对方的出生数据:', otherBirthInfo);
        }
        
        // 构建birthInfos对象
        const birthInfos: any = {};
        if (selfBirthInfo) {
          birthInfos.self = selfBirthInfo;
        }
        if (otherBirthInfo) {
          birthInfos.other = otherBirthInfo;
        }
        
        if (Object.keys(birthInfos).length > 0) {
          requestBody.birthInfos = birthInfos;
          // 如果同时有自己和对方的信息，删除单独的birthInfo字段
          delete requestBody.birthInfo;
          console.log('✅ 添加birthInfos到请求:', birthInfos);
          console.log('🗑️ 删除单独的birthInfo字段，避免覆盖逻辑');
        } else {
          console.log('⚠️ 未找到双人出生信息，尝试单人分析');
          // 回退到单人分析
          if (birthInfo) {
            requestBody.birthInfo = birthInfo;
            console.log('✅ 回退：添加birthInfo到请求:', birthInfo);
          }
        }
      } else {
        // 尝试从上下文中获取出生信息（仅从用户消息中提取）
        let contextBirthInfo = null;
        if (!birthInfo) {
          console.log('🔍 当前消息未提取到出生信息，尝试从用户消息中查找');
          // 只从用户消息中提取，避免从AI回复中提取错误信息
          const userMessages = messages.slice(-10).filter(m => m.type === 'user');
          if (userMessages.length > 0) {
            const userContextText = userMessages.map(m => m.content).join(' ');
            contextBirthInfo = extractBirthInfo(userContextText);
            console.log('🔍 从用户消息中提取的出生信息:', contextBirthInfo);
          } else {
            console.log('⚠️ 没有找到用户消息，无法从上下文提取出生信息');
          }
        }
        
        // 优先使用当前消息提取的birthInfo，否则使用上下文提取的
        const finalBirthInfo = birthInfo || contextBirthInfo;
        if (finalBirthInfo) {
          requestBody.birthInfo = finalBirthInfo;
          console.log('✅ 添加birthInfo到请求:', { 
            source: birthInfo ? '当前消息' : '上下文',
            birthInfo: finalBirthInfo 
          });
        } else {
          console.log('⚠️ 未提取到birthInfo，发送的请求体:', requestBody);
        }
      }
      
      const response = await fetch(`/api/fortune/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      
      // 检查是否因为缺少出生信息导致MCP服务失效
      let aiContent = data.response || data.result?.prediction || '抱歉，我现在无法提供占卜服务，请稍后再试。';
      
      // 如果是八字类型且检测到缺少出生信息，主动询问
      if (fortuneType === 'bazi' && data.hasBaziData === false) {
        aiContent = `要进行准确的八字分析，请提供您的出生日期（格式：1990.05.15 或 1990年5月15日），这样我才能为您进行专业的命理分析。`;
      }
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiContent,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: '抱歉，网络连接有问题，请检查网络后重试。',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // 提取出生信息的函数
  const extractBirthInfo = (text: string) => {
    // 匹配日期格式：1990.05.15 或 1990年5月15日 或 1990/5/15
    const datePatterns = [
      /(\d{4})[年./](\d{1,2})[月./](\d{1,2})/,
      /(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})/
    ];
    
    console.log('🔍 extractBirthInfo 调用:', { text, patterns: datePatterns.map(p => p.toString()) });
    
    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      console.log('🔍 正则匹配结果:', { pattern: pattern.toString(), match });
      if (match) {
        const year = parseInt(match[1]);
        const month = parseInt(match[2]);
        const day = parseInt(match[3]);
        
        console.log('🔍 提取的数值:', { year, month, day });
        
        // 验证数值是否有效
        if (!isNaN(year) && !isNaN(month) && !isNaN(day) && 
            year >= 1900 && year <= 2100 && 
            month >= 1 && month <= 12 && 
            day >= 1 && day <= 31) {
          return {
            year,
            month,
            day,
            hour: 0, // 默认子时
            minute: 0
          };
        } else {
          console.log('⚠️ 提取的数值无效:', { year, month, day, isNaNYear: isNaN(year), isNaNMonth: isNaN(month), isNaNDay: isNaN(day) });
        }
      }
    }
    
    console.log('⚠️ 未找到有效的出生日期');
    return null;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center">
        <button
          onClick={() => navigate('/')}
          className="mr-3 p-1 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">{fortuneName}占卜师</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                {/* Timestamp */}
                <div className={`text-xs text-gray-500 mb-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                  {formatTime(message.timestamp)}
                </div>
                
                {/* Message Bubble */}
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-green-500 text-white rounded-br-sm'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="max-w-xs lg:max-w-md">
              <div className="text-xs text-gray-500 mb-1">
                {formatTime(new Date())}
              </div>
              <div className="px-4 py-2 rounded-2xl rounded-bl-sm bg-white border border-gray-200">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入您的问题..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={1}
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!inputText.trim() || isLoading}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// 检查是否为关系分析请求
function checkIfRelationshipAnalysis(question: string, context: string): boolean {
  const relationshipKeywords = [
    '喜欢', '爱', '感情', '恋爱', '婚姻', '配偶', '对象', '男朋友', '女朋友',
    '结婚', '缘分', '合婚', '配对', '两个人', '你们', '我和他', '我和她',
    '对方', '恋人', '情侣', '交往', '追求', '暗恋', '心动', 'crush'
  ];
  
  const fullText = (question + ' ' + context).toLowerCase();
  const foundKeywords = relationshipKeywords.filter(keyword => 
    fullText.includes(keyword.toLowerCase())
  );
  
  return foundKeywords.length > 0;
}

// 提取对方的出生数据
function extractOtherBirthData(question: string): any {
  // 在问题中查找对方的出生信息
  const otherPatterns = [
    // "我喜欢一个1989.07.18的女人" -> 提取1989.07.18
    /喜欢.*?(\d{4})[\.\-\/](\d{1,2})[\.\-\/](\d{1,2})/g,
    /爱.*?(\d{4})[\.\-\/](\d{1,2})[\.\-\/](\d{1,2})/g,
    /一个.*?(\d{4})[\.\-\/](\d{1,2})[\.\-\/](\d{1,2})/g,
    /(\d{4})[\.\-\/](\d{1,2})[\.\-\/](\d{1,2}).*?的.*?人/g,
    /(\d{4})年(\d{1,2})月(\d{1,2})日.*?的.*?人/g,
    // "1989.07.18的女人" -> 提取1989.07.18
    /(\d{4})[\.\-\/](\d{1,2})[\.\-\/](\d{1,2}).*?(女人|男人|女孩|男孩|女生|男生)/g,
    /(女人|男人|女孩|男孩|女生|男生).*?(\d{4})[\.\-\/](\d{1,2})[\.\-\/](\d{1,2})/g,
    // "她/他出生于1989.07.18" -> 提取1989.07.18
    /(她|他|对方|那个他|那个她).*?出生.*?(\d{4})[\.\-\/](\d{1,2})[\.\-\/](\d{1,2})/g,
    /(她|他|对方|那个他|那个她).*?(\d{4})[\.\-\/](\d{1,2})[\.\-\/](\d{1,2})/g,
    // "1989年7月18日出生" -> 提取1989.07.18
    /(\d{4})年(\d{1,2})月(\d{1,2})日.*?出生/g,
    /出生于.*?(\d{4})年(\d{1,2})月(\d{1,2})日/g
  ];
  
  for (const pattern of otherPatterns) {
    const match = pattern.exec(question);
    if (match) {
      let year, month, day;
      
      if (pattern.source.includes('年') && pattern.source.includes('月') && pattern.source.includes('日')) {
        // 中文格式：1989年7月18日
        year = parseInt(match[1]);
        month = parseInt(match[2]);
        day = parseInt(match[3]);
      } else {
        // 标准格式：1989.07.18
        year = parseInt(match[1]);
        month = parseInt(match[2]);
        day = parseInt(match[3]);
      }
      
      // 验证日期的合理性
      if (year >= 1900 && year <= 2100 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
        console.log('✅ 从问题中提取对方出生日期:', { year, month, day });
        return {
          year,
          month,
          day,
          hour: 0,
          minute: 0,
          gender: 'female', // 默认女性，可根据上下文调整
          timezone: 'Asia/Shanghai'
        };
      }
    }
  }
  
  return null;
}

export default WeChatChatInterface;