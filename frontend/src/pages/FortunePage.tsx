import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { WeChatChatInterface } from '../components/WeChatChatInterface';

export const FortunePage: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();

  const getFortuneName = (type: string | undefined): string => {
    const names: { [key: string]: string } = {
      tarot: '塔罗占卜',
      bazi: '八字命理',
      astrology: '星座占星',
      numerology: '数字命理'
    };
    return names[type || 'tarot'] || '塔罗占卜';
  };

  if (!type) {
    navigate('/');
    return null;
  }

  return (
    <WeChatChatInterface
      fortuneType={type}
      fortuneName={getFortuneName(type)}
    />
  );
};