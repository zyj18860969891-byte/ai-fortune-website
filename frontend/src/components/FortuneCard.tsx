import React from 'react';
import { motion } from 'framer-motion';
import { FortuneResponse } from '../types';
import { Calendar, Clock, Star, Sparkles } from 'lucide-react';

interface FortuneCardProps {
  fortune: FortuneResponse;
  index?: number;
}

export const FortuneCard: React.FC<FortuneCardProps> = ({ fortune, index = 0 }) => {
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('zh-CN');
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.6) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      tarot: '🔮',
      bazi: '📜',
      astrology: '⭐',
      numerology: '🔢'
    };
    return icons[type as keyof typeof icons] || '🔮';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="fortune-card"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{getTypeIcon(fortune.type)}</span>
          <div>
            <h3 className="text-lg font-semibold text-white">
              {fortune.type === 'tarot' && '塔罗占卜'}
              {fortune.type === 'bazi' && '八字命理'}
              {fortune.type === 'astrology' && '星座占星'}
              {fortune.type === 'numerology' && '数字命理'}
            </h3>
            <p className="text-sm text-gray-300">置信度: 
              <span className={`ml-1 ${getConfidenceColor(fortune.result.confidence)}`}>
                {Math.round(fortune.result.confidence * 100)}%
              </span>
            </p>
          </div>
        </div>
        <Sparkles className="w-5 h-5 text-mystical-gold animate-sparkle" />
      </div>

      {/* Question */}
      <div className="mb-4">
        <p className="text-gray-300 text-sm mb-2">你的问题:</p>
        <p className="text-white font-medium">{fortune.question}</p>
      </div>

      {/* Prediction */}
      <div className="mb-4">
        <p className="text-mystical-gold text-sm mb-2 flex items-center">
          <Star className="w-4 h-4 mr-1" />
          预测结果
        </p>
        <p className="text-white leading-relaxed">{fortune.result.prediction}</p>
      </div>

      {/* Advice */}
      <div className="mb-4">
        <p className="text-mystical-purple text-sm mb-2">建议指导</p>
        <p className="text-gray-200 leading-relaxed">{fortune.result.advice}</p>
      </div>

      {/* Lucky Elements */}
      <div className="mb-4">
        <p className="text-mystical-gold text-sm mb-2">幸运元素</p>
        <div className="flex flex-wrap gap-2">
          {fortune.result.luckyElements.map((element, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-mystical-purple/20 text-mystical-purple rounded-full text-sm border border-mystical-purple/30"
            >
              {element}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-xs text-gray-400 border-t border-gray-600 pt-3">
        <div className="flex items-center">
          <Calendar className="w-3 h-3 mr-1" />
          {formatDate(fortune.timestamp)}
        </div>
        <div className="flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          {fortune.processingTime}ms
        </div>
      </div>
    </motion.div>
  );
};