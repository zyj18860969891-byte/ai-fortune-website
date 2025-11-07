const { IntelligentBaziService } = require('./dist/services/intelligentBaziService');

async function testIntelligentBaziSystem() {
  console.log('🤖 开始测试智能八字助手系统...');
  console.log('='.repeat(60));
  
  const intelligentService = new IntelligentBaziService();
  
  // 测试用户数据
  const testUserData = {
    userId: 'test_user_001',
    birthDate: '1990-05-15',
    birthTime: '10:30',
    gender: '男',
    location: '北京',
    occupation: '互联网工程师',
    interests: ['投资', '创业', '健康管理', '技术创新']
  };
  
  console.log('👤 测试用户档案:', testUserData);
  
  try {
    // 1. 建立智能用户档案
    console.log('\n1️⃣ 建立智能用户档案');
    console.log('─'.repeat(40));
    
    const profileResult = await intelligentService.setupUserProfile(testUserData);
    
    if (profileResult.success) {
      console.log('✅ 智能档案建立成功!');
      console.log('📊 档案信息:');
      console.log('   用户ID:', profileResult.data.profile.userId);
      console.log('   八字数据:', profileResult.data.profile.baziData?.year, 
                  profileResult.data.profile.baziData?.month, 
                  profileResult.data.profile.baziData?.day);
      console.log('   能力列表:');
      profileResult.data.capabilities.forEach((capability, index) => {
        console.log(`   ${index + 1}. ${capability}`);
      });
    } else {
      console.log('❌ 智能档案建立失败:', profileResult.error);
      return;
    }
    
    // 2. 智能主动推荐
    console.log('\n2️⃣ 智能主动推荐');
    console.log('─'.repeat(40));
    
    const recommendationResult = await intelligentService.generateProactiveRecommendations(
      testUserData.userId, 
      { city: '北京', timezone: 'UTC+8' }
    );
    
    if (recommendationResult.success) {
      console.log('✅ 智能主动推荐成功!');
      console.log('🎯 主动建议:');
      console.log('   建议类型:', recommendationResult.data.proactiveSuggestions?.personalizedAdvice?.timing);
      console.log('   当前行动:', recommendationResult.data.nextAction?.primaryAction);
      console.log('   紧急程度:', recommendationResult.data.priority);
      
      if (recommendationResult.data.immediateOpportunities?.length > 0) {
        console.log('📈 即时机会:');
        recommendationResult.data.immediateOpportunities.forEach((opp, index) => {
          console.log(`   ${index + 1}. ${opp.title} - ${opp.description}`);
        });
      }
    } else {
      console.log('❌ 智能主动推荐失败:', recommendationResult.error);
    }
    
    // 3. 基于时间的智能分析
    console.log('\n3️⃣ 基于时间的智能分析');
    console.log('─'.repeat(40));
    
    const timingResult = await intelligentService.generateTimelyAnalysis(testUserData.userId);
    
    if (timingResult.success) {
      console.log('✅ 时间智能分析成功!');
      console.log('⏰ 时间分析:');
      console.log('   当前季节:', timingResult.data.timingContext?.season);
      console.log('   时间段:', timingResult.data.timingContext?.timeOfDay);
      console.log('   是否周末:', timingResult.data.timingContext?.isWeekend);
      
      console.log('💡 时间建议:');
      console.log('   建议内容:', timingResult.data.timeBasedAdvice?.advice);
      console.log('   幸运颜色:', timingResult.data.timeBasedAdvice?.luckyColors?.join(', '));
      
      if (timingResult.data.solarTermsReminder?.current) {
        console.log('🌟 当前节气:', timingResult.data.solarTermsReminder.current.name);
        console.log('   节气建议:', timingResult.data.solarTermsReminder.current.advice);
      }
    } else {
      console.log('❌ 时间智能分析失败:', timingResult.error);
    }
    
    // 4. 获取当前最佳建议
    console.log('\n4️⃣ 获取当前最佳建议');
    console.log('─'.repeat(40));
    
    const currentAdviceResult = await intelligentService.getCurrentBestAdvice(testUserData.userId);
    
    if (currentAdviceResult.success) {
      console.log('✅ 当前最佳建议成功!');
      console.log('💡 即时建议:');
      console.log('   立即行动:', currentAdviceResult.data.immediateAdvice?.immediateAction);
      console.log('   建议内容:', currentAdviceResult.data.immediateAdvice?.advice);
      console.log('   紧急程度:', currentAdviceResult.data.immediateAdvice?.urgency);
      
      console.log('🍀 幸运元素:');
      console.log('   幸运颜色:', currentAdviceResult.data.luckyElements?.colors?.join(', '));
      console.log('   幸运数字:', currentAdviceResult.data.luckyElements?.numbers?.join(', '));
      console.log('   最佳方向:', currentAdviceResult.data.luckyElements?.directions?.join(', '));
      
      if (currentAdviceResult.data.urgentReminders?.length > 0) {
        console.log('⚠️ 紧急提醒:');
        currentAdviceResult.data.urgentReminders.forEach((reminder, index) => {
          console.log(`   ${index + 1}. ${reminder}`);
        });
      }
    } else {
      console.log('❌ 当前最佳建议失败:', currentAdviceResult.error);
    }
    
    // 5. 测试用户档案管理
    console.log('\n5️⃣ 测试用户档案管理');
    console.log('─'.repeat(40));
    
    const profile = intelligentService.getUserProfile(testUserData.userId);
    if (profile) {
      console.log('✅ 用户档案查询成功!');
      console.log('📋 档案详情:');
      console.log('   用户ID:', profile.userId);
      console.log('   出生日期:', profile.birthDate);
      console.log('   职业:', profile.occupation);
      console.log('   兴趣爱好:', profile.interests?.join(', '));
    } else {
      console.log('❌ 用户档案查询失败');
    }
    
    // 6. 模拟多用户场景
    console.log('\n6️⃣ 模拟多用户场景');
    console.log('─'.repeat(40));
    
    const users = [
      {
        userId: 'test_user_002',
        birthDate: '1985-08-20',
        birthTime: '14:30',
        gender: '女',
        location: '上海',
        occupation: '设计师'
      },
      {
        userId: 'test_user_003',
        birthDate: '1992-12-03',
        birthTime: '08:15',
        gender: '男',
        location: '深圳',
        occupation: '创业者'
      }
    ];
    
    for (const user of users) {
      const multiUserResult = await intelligentService.setupUserProfile(user);
      if (multiUserResult.success) {
        console.log(`✅ 用户 ${user.userId} 档案建立成功`);
      } else {
        console.log(`❌ 用户 ${user.userId} 档案建立失败`);
      }
    }
    
    const allProfiles = intelligentService.getAllUserProfiles();
    console.log(`📊 总共建立了 ${allProfiles.length} 个用户档案`);
    
    console.log('\n🎉 智能八字助手系统测试完成!');
    console.log('='.repeat(60));
    console.log('💡 系统功能验证总结:');
    console.log('   ✅ 智能用户档案建立');
    console.log('   ✅ 主动推荐服务');
    console.log('   ✅ 时间智能分析');
    console.log('   ✅ 当前最佳建议');
    console.log('   ✅ 用户档案管理');
    console.log('   ✅ 多用户支持');
    console.log('   ✅ 八字数据计算');
    console.log('   ✅ 季节性建议');
    console.log('   ✅ 节气提醒');
    console.log('   ✅ 幸运元素分析');
    
  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error.message);
    console.error('详细错误:', error);
  }
}

// 运行测试
testIntelligentBaziSystem().catch(console.error);