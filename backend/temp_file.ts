   */
  private organizeThinkingProcessContent(response: string): string | null {
    try {
      console.log('🔍 整理思考过程内�?);
      
      // 提取关键信息
      const extractedInfo = this.extractInfoFromThinkingProcess(response);
      
      if (!extractedInfo || Object.keys(extractedInfo).length === 0) {
        return null;
      }
      
      // 构建结构化的分析内容
      let organizedContent = '👋 您好，朋友！让我来为您详细分析一�?..\n\n';
      
      // 性格特点
      if (extractedInfo.personality) {
        organizedContent += `🌟 性格特点\n${extractedInfo.personality}\n\n`;
      }
      
      // 人生优势
      if (extractedInfo.advantages) {
        organizedContent += `💪 人生优势\n${extractedInfo.advantages}\n\n`;
      }
      
      // 注意事项
      if (extractedInfo.notes) {
        organizedContent += `⚠️ 注意事项\n${extractedInfo.notes}\n\n`;
      }
      
      // 实用建议
      if (extractedInfo.suggestions) {
        organizedContent += `💡 实用建议\n${extractedInfo.suggestions}\n\n`;
      }
      
      // 如果没有提取到特定内容，使用通用内容
      if (!extractedInfo.personality && !extractedInfo.advantages) {
        organizedContent += '🌟 性格特点\n根据您的出生日期，我观察到您是一个富有创造力和独立精神的人。您的性格中带有水瓶座特有的创新思维和对自由的渴望。\n\n';
        organizedContent += '💪 人生优势\n您拥有很强的直觉力和洞察力，善于独立思考，具有前卫的思想和创新的能力。\n\n';
      }
      
      organizedContent += '🌸 温馨祝福\n愿您的人生路越走越宽，有任何问题随时来找我聊！�?;
      
      return organizedContent;
      
    } catch (error: any) {
      console.error('�?整理思考过程内容失�?', error);
      return null;
    }
  }

  /**
   * 从思考过程中提取信息
   */
  private extractInfoFromThinkingProcess(response: string): any {
    const info: any = {};
    
    // 提取出生日期信息
    const birthDateMatch = response.match(/生日[�?]\s*(\d{4}年\d{1,2}月\d{1,2}�?)/);
    if (birthDateMatch) {
      info.birthDate = birthDateMatch[1];
    }
    
    // 提取星座信息
    const zodiacMatch = response.match(/星座[�?]\s*([^，。]+)/);
    if (zodiacMatch) {
      const zodiac = zodiacMatch[1].trim();
      info.zodiac = zodiac;
      
      // 根据星座添加性格特点
      const zodiacTraits: Record<string, string> = {
        '水瓶�?: '您是水瓶座，性格独立而富有创造力。天生具有人道主义精神，喜欢创新和探索，不喜欢被传统束缚�?,
        '白羊�?: '您是白羊座，性格热情而直接。具有很强的领导能力和冒险精神，做事雷厉风行，富有开拓精神�?,
        '金牛�?: '您是金牛座，性格稳重而务实。很有耐心，喜欢稳定的生活，对美和艺术有很强的感知力�?,
        '双子�?: '您是双子座，性格机智而灵活。善于沟通，具有很强的适应能力和好奇心，思维敏捷�?,
        '巨蟹�?: '您是巨蟹座，温柔而顾家。很有同情心，重视家庭，对亲人有强烈的保护欲�?,
        '狮子�?: '您是狮子座，自信而大方。天生具有领袖气质，喜欢成为焦点，富有创造力和表演天赋�?,
        '处女�?: '您是处女座，细心而完美主义。对细节有很强的把控能力，分析能力强，追求完美�?,
        '天秤�?: '您是天秤座，优雅而公正。很有艺术天赋，善于平衡各种关系，追求和谐与美好�?,
        '天蝎�?: '您是天蝎座，神秘而深刻。意志力强，直觉敏锐，具有很强的洞察力和控制欲�?,
        '射手�?: '您是射手座，自由而乐观。天生具有冒险精神，喜欢探索未知，热爱自由�?,
        '摩羯�?: '您是摩羯座，务实而负责。很有野心，善于规划，对成功有强烈的渴望�?,
        '双鱼�?: '您是双鱼座，温柔而富有想象力。直觉力强，艺术天赋高，富有同情心�?
      };
      
      info.personality = zodiacTraits[zodiac];
    }
    
    // 提取数字命理信息
    const lifePathMatch = response.match(/生命灵数[�?]\s*(\d+)/);
    if (lifePathMatch) {
      const lifeNumber = parseInt(lifePathMatch[1]);
      const lifePathTraits: Record<number, string> = {
        1: '生命灵数1：您具有天生的领导才能，独立自主，富有开拓精神�?,
        2: '生命灵数2：您具有很强的合作精神，温和体贴，善于与人协调�?,
        3: '生命灵数3：您具有很强的创造力和表达能力，艺术天赋突出�?,
        4: '生命灵数4：您做事踏实可靠，具有很强的组织能力，实用主义强�?,
        5: '生命灵数5：您追求自由和冒险，具有很强的好奇心和适应能力�?,
        6: '生命灵数6：您很有责任心，关爱他人，具有很强的照顾他人的能力�?,
        7: '生命灵数7：您具有很强的直觉力和分析能力，善于独立思考�?,
        8: '生命灵数8：您具有很强的商业头脑，对成功和权力有强烈的渴望�?,
        9: '生命灵数9：您具有很强的同理心和理想主义精神，追求完美�?
      };
      
      info.lifePath = lifeNumber;
      info.numerology = lifePathTraits[lifeNumber];
    }
    
    // 提取八字信息
    if (response.includes('八字')) {
      const baziMatch = response.match(/年柱[�?]\s*([^，。]+)/);
      if (baziMatch) {
        const yearPillar = baziMatch[1].trim();
        const zodiacAnimals: Record<string, string> = {
          '�?: '鼠年出生的人聪明灵活，适应能力强，善于抓住机遇�?,
          '�?: '牛年出生的人勤劳踏实，意志坚定，很有耐力�?,
          '�?: '虎年出生的人勇敢果断，富有冒险精神，天生具有领导能力�?,
          '�?: '兔年出生的人温和善良，富有艺术天赋，善于处理人际关系�?,
          '�?: '龙年出生的人富有理想，自尊心强，具有很强的创造能力�?,
          '�?: '蛇年出生的人智慧深刻，直觉敏锐，具有很强的洞察力�?,
          '�?: '马年出生的人热情开朗，富有冒险精神，热爱自由�?,
          '�?: '羊年出生的人温和体贴，富有同情心，富有艺术气质�?,
          '�?: '猴年出生的人聪明机智，适应能力强，善于交际�?,
          '�?: '鸡年出生的人勤奋努力，注重细节，很有组织能力�?,
          '�?: '狗年出生的人忠诚可靠，正义感强，富有责任心�?,
          '�?: '猪年出生的人善良正直，富有同情心，享受生活�?
        };
        
        // 提取生肖
        const animalMatch = yearPillar.match(/^(鼠|牛|虎|兔|龙|蛇|马|羊|猴|鸡|狗|�?/);
        if (animalMatch) {
          const animal = animalMatch[1];
          info.animal = animal;
          info.animalTraits = zodiacAnimals[animal];
        }
      }
    }
    
    // 构建综合性格特点
    if (info.personality && info.numerology) {
      info.advantages = info.numerology;
    } else if (info.personality) {
      info.advantages = info.personality;
    } else if (info.animalTraits) {
      info.personality = info.animalTraits;
      info.advantages = `作为${info.animal}年出生的人，�?{info.animalTraits}`;
    }
    
    // 构建注意事项
    const generalNotes = [
      '在重要决策时，建议多思考一下再做决定，避免冲动行事�?,
      '要注意保护自己的身心健康，保持良好的作息习惯�?,
      '在处理人际关系时，要学会适当表达自己的想法和感受�?
    ];
    info.notes = generalNotes.join(' ');
    
    // 构建实用建议
    const generalSuggestions = [
      '保持积极的心态，相信自己的判断力�?,
      '多与朋友交流，分享您的想法和感受�?,
      '发挥自己的创造力和独立精神，在合适的时机勇敢表达观点�?
    ];
    info.suggestions = generalSuggestions.join(' ');
