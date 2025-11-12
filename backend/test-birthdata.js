#!/usr/bin/env node

// 测试出生数据提取和MCP服务调用的完整流程
const { MsAgentStyleMcpService } = require('./dist/services/msAgentStyleMcpService');

async function testBirthDataAndMcp() {
  console.log('=== 测试出生数据提取和MCP服务调用 ===');
  
  // 1. 测试出生数据提取函数
  console.log('\n1. 测试出生数据提取...');
  
  const testQuestion = '我出生于1990年5月15日，想了解财运';
  console.log('测试问题:', testQuestion);
  
  // 复制fortune.ts中的提取函数逻辑
  function extractBirthDataFromQuestion(question) {
    if (!question) return null;
    
    console.log('🔍 开始从问题中提取出生日期:', question);
    
    // 过滤掉明显不是出生信息的输入
    const invalidInputs = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    const trimmedQuestion = question.trim();
    if (invalidInputs.includes(trimmedQuestion)) {
      console.log('⚠️ 输入内容不是有效的出生信息:', trimmedQuestion);
      return null;
    }
    
    const patterns = [
      // 标准格式：1996.02.10 或 1996-02-10 或 1996/02/10
      /(\d{4})[\.\-\/](\d{1,2})[\.\-\/](\d{1,2})/g,
      // 中文格式：1996年2月10日
      /(\d{4})年(\d{1,2})月(\d{1,2})日/g,
      // 紧凑格式：19960210 (8位数字)
      /(\d{4})(\d{2})(\d{2})/g,
      // 出生于格式
      /出生于.*?(\d{4})[\.\-\/](\d{1,2})[\.\-\/](\d{1,2})/g,
      // 其他可能的格式
      /(\d{4})年(\d{1,2})月(\d{1,2})/g,
      /(\d{4})年(\d{1,2})月(\d{1,2})时/g,
      /(\d{4})年(\d{1,2})月(\d{1,2})分/g,
    ];
    
    for (const pattern of patterns) {
      const match = pattern.exec(question);
      if (match) {
        let year, month, day;
        
        if (pattern.source.includes('出生于')) {
          // 出生于格式的处理
          year = parseInt(match[1]);
          month = parseInt(match[2]);
          day = parseInt(match[3]);
        } else if (pattern.source.includes('(\d{4})(\d{2})(\d{2})')) {
          // 紧凑格式的处理：19960210
          year = parseInt(match[1]);
          month = parseInt(match[2]);
          day = parseInt(match[3]);
        } else {
          // 标准格式的处理
          year = parseInt(match[1]);
          month = parseInt(match[2]);
          day = parseInt(match[3]);
        }
        
        console.log('📅 提取到日期:', { year, month, day });
        
        // 验证日期的合理性
        if (year >= 1900 && year <= 2100 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
          console.log('✅ 成功提取出生日期:', { year, month, day });
          return {
            year,
            month,
            day,
            hour: 0,
            minute: 0,
            gender: 'male',
            timezone: 'Asia/Shanghai'
          };
        } else {
          console.log('⚠️ 日期范围不合理:', { year, month, day });
        }
      }
    }
    
    console.log('⚠️ 未从问题中找到有效的出生日期');
    return null;
  }
  
  // 测试提取逻辑
  const birthData = extractBirthDataFromQuestion(testQuestion);
  console.log('🎯 提取结果:', birthData);
  
  // 2. 测试MCP服务
  console.log('\n2. 测试MCP服务调用...');
  
  if (birthData) {
    try {
      const mcpService = MsAgentStyleMcpService.getInstance();
      console.log('📡 开始调用MCP服务...');
      
      const baziResult = await mcpService.calculateBazi(birthData);
      console.log('📊 MCP服务返回结果:', baziResult);
      
      if (baziResult.success) {
        console.log('✅ MCP服务调用成功');
        console.log('📈 hasBaziData应该为true');
      } else {
        console.log('❌ MCP服务调用失败');
        console.log('📋 错误信息:', baziResult.error);
      }
    } catch (error) {
      console.log('❌ MCP服务调用异常:', error.message);
    }
  } else {
    console.log('❌ 没有birthData，不会调用MCP服务');
  }
  
  console.log('\n=== 测试完成 ===');
}

// 运行测试
testBirthDataAndMcp().catch(console.error);
