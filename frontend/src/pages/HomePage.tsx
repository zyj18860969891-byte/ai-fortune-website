import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Star, Moon, Calendar, Clock, User, MapPin } from 'lucide-react';

export const HomePage: React.FC = () => {

  return (
    <div className="min-h-screen mystical-bg relative overflow-hidden">
      {/* 动态背景装饰 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-mystical-purple rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-mystical-gold rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* 主标题区域 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-mystical-purple to-mystical-gold rounded-full flex items-center justify-center animate-float">
                <span className="text-3xl">📜</span>
              </div>
              <Star className="w-6 h-6 text-mystical-gold absolute -top-1 -right-1 animate-sparkle" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-4">
            八字命理
          </h1>
          
          <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed mb-2">
            基于古老八字智慧，结合现代AI技术
          </p>
          <p className="text-sm text-gray-400 max-w-2xl mx-auto">
            解析您的生辰八字，揭示性格特质、事业运势、感情婚姻与健康状况
          </p>
        </motion.div>

        {/* 功能特色展示 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12"
        >
          {[
            {
              icon: <User className="w-8 h-8" />,
              title: "性格分析",
              desc: "深度解析您的性格特质与内心世界"
            },
            {
              icon: <Star className="w-8 h-8" />,
              title: "事业运势",
              desc: "预知事业发展趋势与最佳时机"
            },
            {
              icon: <Calendar className="w-8 h-8" />,
              title: "感情婚姻",
              desc: "分析情感运势与婚姻缘分"
            },
            {
              icon: <MapPin className="w-8 h-8" />,
              title: "健康状况",
              desc: "了解身体状况与养生建议"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="card-glass p-6 text-center group hover:scale-105 transition-transform duration-300"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-mystical-purple to-mystical-gold rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-float">
                <div className="text-white">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* 主操作区域 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="text-center"
        >
          <div className="card-glass p-8 md:p-12 max-w-2xl mx-auto">
            <div className="mb-6">
              <Moon className="w-12 h-12 text-mystical-gold mx-auto mb-4 animate-float" />
              <Clock className="w-6 h-6 text-mystical-purple absolute transform translate-x-6 -translate-y-2 animate-sparkle" />
            </div>
            
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
              开始您的八字命理之旅
            </h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              只需提供您的出生日期和时间，
              <br />
              AI将为您进行专业的八字分析，
              <br />
              揭示您命运中的无限可能
            </p>
            
            <Link to="/fortune/bazi">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-mystical text-lg px-8 py-4 group"
              >
                <span>开始占卜</span>
                <Sparkles className="w-5 h-5 ml-2 group-hover:animate-sparkle" />
              </motion.button>
            </Link>
            
            <div className="mt-6 text-xs text-gray-500">
              💡 提示：支持多种日期格式，如 1990.05.15 或 1990年5月15日
            </div>
          </div>
        </motion.div>

        {/* 底部装饰 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-center mt-12"
        >
          <div className="flex justify-center space-x-8 text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-mystical-purple rounded-full animate-pulse"></div>
              <span className="text-sm">传统智慧</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-mystical-gold rounded-full animate-pulse delay-500"></div>
              <span className="text-sm">现代科技</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-1000"></div>
              <span className="text-sm">精准分析</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};