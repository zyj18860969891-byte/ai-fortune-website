import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Clock } from 'lucide-react';

interface ChatHistoryProps {
  history: { question: string; response: any }[];
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({ history }) => {
  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>暂无聊天记录</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <MessageCircle className="w-5 h-5 mr-2" />
        聊天历史
      </h3>
      
      {history.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gray-800/50 rounded-lg p-4 border border-gray-700"
        >
          <div className="flex items-start space-x-3 mb-3">
            <div className="w-8 h-8 bg-mystical-purple rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">你</span>
            </div>
            <div className="flex-1">
              <p className="text-gray-300 text-sm mb-1">{item.question}</p>
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="w-3 h-3 mr-1" />
                刚刚
              </div>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-mystical-gold rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">AI</span>
            </div>
            <div className="flex-1">
              <div className="bg-gray-700/50 rounded-lg p-3">
                <p className="text-gray-200 text-sm">{item.response.prediction}</p>
              </div>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <Clock className="w-3 h-3 mr-1" />
                刚刚
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};