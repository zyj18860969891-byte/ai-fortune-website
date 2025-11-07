"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntelligentBaziService = void 0;
class IntelligentBaziService {
    constructor() {
        this.userProfiles = new Map();
        console.log('🎯 智能八字助手系统启动');
        console.log('🌍 支持基于时间、位置的智能八字建议');
        console.log('🤖 从被动问答升级为主动服务');
    }
    /**
     * 建立智能用户档案
     */
    async setupUserProfile(userData) {
        try {
            console.log('👤 开始建立智能用户档案:', userData);
            const profile = {
                ...userData,
                baziData: await this.calculateBaziData(userData)
            };
            this.userProfiles.set(userData.userId, profile);
            const capabilities = [
                '基于地理位置的八字分析',
                '基于时间的运势提醒',
                '基于职业的建议推荐',
                '基于季节的生活指导',
                '基于节气的健康提醒',
                '主动智能推荐',
                '实时机会提醒'
            ];
            console.log('✅ 智能档案建立成功');
            return {
                success: true,
                data: {
                    profile: profile,
                    capabilities: capabilities,
                    analysis: await this.generateInitialAnalysis(profile),
                    nextCheckIn: this.calculateNextCheckIn()
                },
                serviceType: 'intelligent-bazi-profile-setup',
                proactive: true,
                timestamp: new Date().toISOString()
            };
        }
        catch (error) {
            console.error('❌ 建立智能档案失败:', error);
            return {
                success: false,
                data: null,
                serviceType: 'intelligent-bazi-profile-setup',
                proactive: false,
                timestamp: new Date().toISOString()
            };
        }
    }
    /**
     * 智能主动分析 - 基于当前时间和位置
     */
    async generateProactiveRecommendations(userId, location) {
        try {
            console.log('🎯 生成智能主动推荐...');
            const userProfile = this.userProfiles.get(userId);
            if (!userProfile) {
                throw new Error('用户档案不存在，请先建立档案');
            }
            // 多维度分析
            const multiDimensionalAnalysis = await this.performMultiDimensionalAnalysis(userProfile, location);
            // 主动建议
            const proactiveSuggestions = await this.generatePersonalizedProactiveSuggestions(userProfile, location);
            // 立即机会提醒
            const immediateOpportunities = await this.identifyImmediateOpportunities(userProfile);
            return {
                success: true,
                data: {
                    analysis: multiDimensionalAnalysis,
                    proactiveSuggestions: proactiveSuggestions,
                    immediateOpportunities: immediateOpportunities,
                    nextAction: this.suggestNextAction(proactiveSuggestions),
                    priority: this.assessRecommendationPriority(proactiveSuggestions)
                },
                serviceType: 'intelligent-proactive-recommendations',
                proactive: true,
                timestamp: new Date().toISOString()
            };
        }
        catch (error) {
            console.error('❌ 智能主动推荐失败:', error);
            return {
                success: false,
                data: null,
                serviceType: 'intelligent-proactive-recommendations',
                proactive: false,
                timestamp: new Date().toISOString()
            };
        }
    }
    /**
     * 基于时间的智能分析
     */
    async generateTimelyAnalysis(userId) {
        try {
            console.log('⏰ 基于时间进行智能分析...');
            const userProfile = this.userProfiles.get(userId);
            if (!userProfile) {
                throw new Error('用户档案不存在');
            }
            const currentTime = new Date();
            const timingContext = this.analyzeTimingContext(currentTime);
            // 基于时间的建议
            const timeBasedAdvice = this.generateTimeSensitiveAdvice(userProfile, timingContext);
            // 季节性建议
            const seasonalAdvice = this.generateSeasonalAdvice(timingContext);
            // 节气提醒
            const solarTermsReminder = this.generateSolarTermsReminder(timingContext);
            return {
                success: true,
                data: {
                    currentTime: currentTime.toISOString(),
                    timingContext: timingContext,
                    timeBasedAdvice: timeBasedAdvice,
                    seasonalAdvice: seasonalAdvice,
                    solarTermsReminder: solarTermsReminder,
                    nextOptimalTiming: this.calculateNextOptimalTiming(timingContext)
                },
                serviceType: 'timely-intelligent-analysis',
                proactive: true,
                timestamp: new Date().toISOString()
            };
        }
        catch (error) {
            console.error('❌ 时间智能分析失败:', error);
            return {
                success: false,
                data: null,
                serviceType: 'timely-intelligent-analysis',
                proactive: false,
                timestamp: new Date().toISOString()
            };
        }
    }
    /**
     * 获取当前最佳建议（无需询问）
     */
    async getCurrentBestAdvice(userId) {
        try {
            const userProfile = this.userProfiles.get(userId);
            if (!userProfile) {
                throw new Error('用户档案不存在');
            }
            const currentTime = new Date();
            const timingContext = this.analyzeTimingContext(currentTime);
            // 立即建议
            const immediateAdvice = this.generateImmediateAdvice(userProfile, timingContext);
            // 当前机会
            const currentOpportunities = this.identifyCurrentOpportunities(userProfile, timingContext);
            // 最适合的活动
            const optimalActivities = this.suggestOptimalActivities(userProfile, timingContext);
            return {
                success: true,
                data: {
                    immediateAdvice: immediateAdvice,
                    currentOpportunities: currentOpportunities,
                    optimalActivities: optimalActivities,
                    urgentReminders: this.generateUrgentReminders(userProfile, timingContext),
                    luckyElements: this.getCurrentLuckyElements(timingContext)
                },
                serviceType: 'current-best-advice',
                proactive: true,
                timestamp: new Date().toISOString()
            };
        }
        catch (error) {
            return {
                success: false,
                data: null,
                serviceType: 'current-best-advice',
                proactive: false,
                timestamp: new Date().toISOString()
            };
        }
    }
    // ==== 私有辅助方法 ====
    async calculateBaziData(userData) {
        // 简化的八字计算
        const birthDate = new Date(userData.birthDate);
        const birthTime = userData.birthTime;
        // 这里应该调用真实的八字计算逻辑
        // 目前使用简化版本
        return {
            year: birthDate.getFullYear(),
            month: birthDate.getMonth() + 1,
            day: birthDate.getDate(),
            time: birthTime,
            gender: userData.gender,
            elements: this.calculateElements(birthDate),
            luckyDirections: ['东方', '南方'],
            optimalTimes: ['9-11点', '15-17点']
        };
    }
    calculateElements(date) {
        // 简化的五行计算
        const elements = ['木', '火', '土', '金', '水'];
        const year = date.getFullYear();
        return {
            year: elements[year % 5],
            month: elements[(date.getMonth() + 1) % 5],
            day: elements[date.getDate() % 5],
            dominant: '木火',
            weak: '金水'
        };
    }
    async generateInitialAnalysis(profile) {
        const currentMonth = new Date().getMonth() + 1;
        const season = this.getCurrentSeason(currentMonth);
        return {
            currentSeason: season,
            elementAnalysis: profile.baziData.elements,
            monthlyOutlook: this.generateMonthlyOutlook(profile, season),
            personalizedRecommendations: this.personalizeByOccupation(profile)
        };
    }
    getCurrentSeason(month) {
        if (month >= 3 && month <= 5)
            return 'spring';
        if (month >= 6 && month <= 8)
            return 'summer';
        if (month >= 9 && month <= 11)
            return 'autumn';
        return 'winter';
    }
    generateMonthlyOutlook(profile, season) {
        const outlooks = {
            spring: '春季是您展现新开始活力的最佳时机，适合制定新计划。',
            summer: '夏季是您努力付出的收获期，适合推进重要项目。',
            autumn: '秋季是收获成果的最佳时机，适合总结和投资。',
            winter: '冬季是休养生息的时期，适合学习和健康调理。'
        };
        return outlooks[season] || outlooks.spring;
    }
    personalizeByOccupation(profile) {
        const occupations = {
            '工程师': ['技术创新', '项目推进', '技能提升'],
            '销售': ['客户关系', '业绩突破', '人脉拓展'],
            '创业': ['机会把握', '资源整合', '团队建设'],
            '学生': ['学习进步', '考试发挥', '未来规划']
        };
        const occupation = profile.occupation || 'general';
        return occupations[occupation] || ['综合发展', '自我提升'];
    }
    analyzeTimingContext(currentTime) {
        const hour = currentTime.getHours();
        const month = currentTime.getMonth() + 1;
        const day = currentTime.getDate();
        const season = this.getCurrentSeason(month);
        let timeOfDay = 'morning';
        if (hour >= 12 && hour < 18)
            timeOfDay = 'afternoon';
        else if (hour >= 18 && hour < 22)
            timeOfDay = 'evening';
        else
            timeOfDay = 'night';
        return {
            season,
            timeOfDay,
            hour,
            month,
            day,
            isWeekend: currentTime.getDay() === 0 || currentTime.getDay() === 6,
            lunarDate: this.getLunarDate(currentTime)
        };
    }
    getLunarDate(date) {
        // 简化的农历计算
        const lunarMonths = ['正月', '二月', '三月', '四月', '五月', '六月',
            '七月', '八月', '九月', '十月', '冬月', '腊月'];
        return `${lunarMonths[date.getMonth()]}初${Math.ceil(date.getDate() / 10) * 10}`;
    }
    generateTimeSensitiveAdvice(profile, timingContext) {
        const { season, timeOfDay, isWeekend } = timingContext;
        const adviceMap = {
            spring: {
                morning: '春季早晨是规划新开始的最佳时机',
                afternoon: '下午适合推进新项目和创意工作',
                evening: '晚上适合与朋友交流或学习新技能'
            },
            summer: {
                morning: '夏季早晨精力充沛，适合重要决策',
                afternoon: '下午是展示才华和建立人脉的好时机',
                evening: '晚上适合社交活动或娱乐放松'
            }
        };
        const seasonAdvice = adviceMap[season] || adviceMap.spring;
        return {
            timing: `${season} ${timeOfDay}`,
            advice: seasonAdvice[timeOfDay] || seasonAdvice.morning,
            optimalActivities: this.getActivitiesByTime(timeOfDay, season),
            luckyColors: this.getColorsBySeason(season),
            avoidActivities: this.getAvoidActivities(season, timeOfDay)
        };
    }
    getActivitiesByTime(timeOfDay, season) {
        const activities = {
            morning: ['制定计划', '重要会议', '学习新技能', '健康运动'],
            afternoon: ['项目管理', '团队合作', '创意工作', '客户沟通'],
            evening: ['社交活动', '娱乐放松', '学习充电', '总结反思'],
            night: ['休息睡眠', '轻松阅读', '冥想放松']
        };
        return activities[timeOfDay] || activities.morning;
    }
    getColorsBySeason(season) {
        const colors = {
            spring: ['绿色', '青色', '淡蓝色'],
            summer: ['红色', '橙色', '黄色'],
            autumn: ['金色', '棕色', '橙色'],
            winter: ['白色', '蓝色', '灰色']
        };
        return colors[season] || colors.spring;
    }
    getAvoidActivities(season, timeOfDay) {
        const avoidMap = {
            spring: ['过度熬夜', '冲动决策'],
            summer: ['过度激动', '忽视休息'],
            autumn: ['过度焦虑', '忽视健康'],
            winter: ['过度懒散', '忽视运动']
        };
        return avoidMap[season] || avoidMap.spring;
    }
    generateSeasonalAdvice(timingContext) {
        const { season, month } = timingContext;
        return {
            season: season,
            focus: this.getSeasonFocus(season),
            healthAdvice: this.getSeasonHealthAdvice(season),
            careerAdvice: this.getSeasonCareerAdvice(season),
            relationshipAdvice: this.getSeasonRelationshipAdvice(season),
            financialAdvice: this.getSeasonFinancialAdvice(season)
        };
    }
    getSeasonFocus(season) {
        const focuses = {
            spring: '新开始和成长',
            summer: '努力和表现',
            autumn: '收获和总结',
            winter: '休养和准备'
        };
        return focuses[season] || focuses.spring;
    }
    getSeasonHealthAdvice(season) {
        const healthAdvice = {
            spring: '注意肝脏保养，多进行户外活动',
            summer: '注意心脏保健，适当补充水分',
            autumn: '注意肺部健康，预防感冒',
            winter: '注意肾脏保养，保持温暖'
        };
        return healthAdvice[season] || healthAdvice.spring;
    }
    getSeasonCareerAdvice(season) {
        const careerAdvice = {
            spring: '制定新计划，开始新项目',
            summer: '全力以赴，展现才华',
            autumn: '总结经验，收获成果',
            winter: '学习充电，为未来准备'
        };
        return careerAdvice[season] || careerAdvice.spring;
    }
    getSeasonRelationshipAdvice(season) {
        const relationshipAdvice = {
            spring: '新关系的发展期，开放心态',
            summer: '关系深化，适合表白或承诺',
            autumn: '关系稳定，适合长期规划',
            winter: '关系修复，适合深度沟通'
        };
        return relationshipAdvice[season] || relationshipAdvice.spring;
    }
    getSeasonFinancialAdvice(season) {
        const financialAdvice = {
            spring: '适合投资新项目或技能提升',
            summer: '收入增长期，可适当增加投资',
            autumn: '收获期，适合理财和总结',
            winter: '保守期，注意储蓄和风险控制'
        };
        return financialAdvice[season] || financialAdvice.spring;
    }
    generateSolarTermsReminder(timingContext) {
        const { month, day } = timingContext;
        // 简化的节气提醒
        const solarTerms = [
            { name: '立春', date: '2月4日', advice: '新开始的象征，适合制定新目标' },
            { name: '春分', date: '3月21日', advice: '阴阳平衡，适合重要决策' },
            { name: '立夏', date: '5月5日', advice: '夏季开始，注意心脏保健' },
            { name: '夏至', date: '6月21日', advice: '阳气最盛，适合展现才华' },
            { name: '立秋', date: '8月7日', advice: '秋季开始，适合总结收获' },
            { name: '秋分', date: '9月23日', advice: '阴阳平衡，适合规划未来' },
            { name: '立冬', date: '11月7日', advice: '冬季开始，注意保暖养生' },
            { name: '冬至', date: '12月22日', advice: '阴极阳生，新的循环开始' }
        ];
        const currentTerm = solarTerms.find(term => {
            // 简化的日期匹配
            const termMonth = parseInt(term.date.split('月')[0]);
            const termDay = parseInt(term.date.split('月')[1]);
            return month === termMonth && Math.abs(day - termDay) <= 3;
        });
        return {
            current: currentTerm || null,
            next: solarTerms.find(term => {
                const termMonth = parseInt(term.date.split('月')[0]);
                return termMonth > month;
            }) || solarTerms[0],
            importance: currentTerm ? 'high' : 'normal',
            message: currentTerm ? `今天是${currentTerm.name}，${currentTerm.advice}` : '关注下一个节气变化'
        };
    }
    calculateNextCheckIn() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(9, 0, 0, 0);
        return tomorrow.toISOString();
    }
    calculateNextOptimalTiming(timingContext) {
        const { season, timeOfDay, hour } = timingContext;
        const optimalHours = {
            morning: { start: 9, end: 11 },
            afternoon: { start: 15, end: 17 },
            evening: { start: 19, end: 21 }
        };
        const currentOptimal = optimalHours[timeOfDay];
        const nextOptimal = this.findNextOptimalHour(currentOptimal, hour);
        return {
            nextHour: nextOptimal,
            timing: `${season} ${timeOfDay}`,
            activities: this.getActivitiesByTime(nextOptimal.period, season)
        };
    }
    findNextOptimalHour(current, currentHour) {
        const periods = ['morning', 'afternoon', 'evening'];
        const currentIndex = periods.indexOf(current.period);
        let nextIndex = currentIndex;
        if (currentHour >= current.end) {
            nextIndex = (currentIndex + 1) % periods.length;
        }
        return {
            period: periods[nextIndex],
            start: nextIndex === 0 ? 9 : nextIndex === 1 ? 15 : 19,
            end: nextIndex === 0 ? 11 : nextIndex === 1 ? 17 : 21
        };
    }
    generateImmediateAdvice(profile, timingContext) {
        const { season, timeOfDay, isWeekend, hour } = timingContext;
        let immediateAction = '';
        let advice = '';
        let urgency = 'normal';
        if (hour >= 9 && hour <= 11) {
            immediateAction = '制定今日计划';
            advice = '现在是规划新开始的最佳时机';
            urgency = 'high';
        }
        else if (hour >= 15 && hour <= 17) {
            immediateAction = '推进重要项目';
            advice = '下午是展示才华和执行计划的好时机';
            urgency = 'medium';
        }
        else if (hour >= 19 && hour <= 21) {
            immediateAction = '社交或学习';
            advice = '晚上适合交流学习或娱乐放松';
            urgency = 'low';
        }
        else {
            immediateAction = '休息或轻松活动';
            advice = '现在适合休息或进行轻松的活动';
            urgency = 'low';
        }
        return {
            immediateAction,
            advice,
            urgency,
            luckyElements: {
                colors: this.getColorsBySeason(season),
                numbers: this.getLuckyNumbers(season),
                directions: ['东方', '南方'],
                timeSlot: `${hour}:00 - ${hour + 1}:00`
            }
        };
    }
    getLuckyNumbers(season) {
        const numbers = {
            spring: [3, 8],
            summer: [2, 7],
            autumn: [4, 9],
            winter: [1, 6]
        };
        return numbers[season] || numbers.spring;
    }
    identifyCurrentOpportunities(profile, timingContext) {
        const opportunities = [];
        const { season, hour, isWeekend } = timingContext;
        // 基于时间的即时机会
        if (hour >= 9 && hour <= 11 && !isWeekend) {
            opportunities.push({
                type: 'career',
                title: '上午重要会议',
                description: '当前时间是制定重要决策的最佳时机',
                action: '安排重要会议或做重要决定',
                urgency: 'high'
            });
        }
        if (season === 'spring') {
            opportunities.push({
                type: 'learning',
                title: '春季学习机会',
                description: '春季是学习新技能的最佳时机',
                action: '开始学习新项目或技能提升',
                urgency: 'medium'
            });
        }
        return opportunities;
    }
    suggestOptimalActivities(profile, timingContext) {
        const { season, timeOfDay, hour } = timingContext;
        const activities = this.getActivitiesByTime(timeOfDay, season);
        // 根据用户职业调整建议
        if (profile.occupation === '工程师') {
            activities.push('技术创新', '代码优化');
        }
        else if (profile.occupation === '销售') {
            activities.push('客户沟通', '业绩分析');
        }
        return activities;
    }
    generateUrgentReminders(profile, timingContext) {
        const reminders = [];
        const { season, hour } = timingContext;
        // 基于季节的健康提醒
        if (season === 'spring' && (hour >= 6 && hour <= 8)) {
            reminders.push('春季早晨适合户外运动，注意肝脏保养');
        }
        if (season === 'summer' && (hour >= 12 && hour <= 14)) {
            reminders.push('夏季中午注意心脏保健，适量补充水分');
        }
        return reminders;
    }
    getCurrentLuckyElements(timingContext) {
        const { season } = timingContext;
        return {
            colors: this.getColorsBySeason(season),
            numbers: this.getLuckyNumbers(season),
            directions: ['东方', '南方', '中央'],
            stones: this.getSeasonalStones(season),
            elements: this.getSeasonElements(season)
        };
    }
    getSeasonalStones(season) {
        const stones = {
            spring: ['翡翠', '绿松石', '绿幽灵'],
            summer: ['红玛瑙', '石榴石', '太阳石'],
            autumn: ['黄水晶', '虎眼石', '黄玉'],
            winter: ['白水晶', '海蓝宝', '月光石']
        };
        return stones[season] || stones.spring;
    }
    getSeasonElements(season) {
        const elements = {
            spring: ['木', '水'],
            summer: ['火', '木'],
            autumn: ['金', '土'],
            winter: ['水', '金']
        };
        return elements[season] || elements.spring;
    }
    async performMultiDimensionalAnalysis(profile, location) {
        return {
            timeAnalysis: this.analyzeTimingContext(new Date()),
            locationAnalysis: location ? this.analyzeLocationContext(location) : null,
            profileAnalysis: profile.baziData,
            currentOpportunities: await this.identifyImmediateOpportunities(profile),
            seasonalFactors: this.getCurrentSeason(new Date().getMonth() + 1)
        };
    }
    analyzeLocationContext(location) {
        // 简化的地理位置分析
        return {
            region: location.city || '北京',
            climate: '温带季风气候',
            timezone: 'UTC+8',
            culturalFactors: ['传统文化', '现代都市'],
            optimalDirections: ['东方', '南方']
        };
    }
    async identifyImmediateOpportunities(profile) {
        const currentHour = new Date().getHours();
        const opportunities = [];
        if (currentHour >= 9 && currentHour <= 11) {
            opportunities.push({
                type: 'morning_opportunity',
                title: '上午黄金时间',
                description: '当前是制定重要计划的最佳时机',
                action: '安排重要会议或做重要决定'
            });
        }
        return opportunities;
    }
    async generatePersonalizedProactiveSuggestions(profile, location) {
        const currentTime = new Date();
        const timingContext = this.analyzeTimingContext(currentTime);
        return {
            personalizedAdvice: this.generateTimeSensitiveAdvice(profile, timingContext),
            careerSuggestions: this.getOccupationBasedSuggestions(profile),
            healthReminders: this.generateHealthReminders(timingContext),
            relationshipTips: this.generateRelationshipTips(timingContext),
            financialGuidance: this.generateFinancialGuidance(timingContext)
        };
    }
    getOccupationBasedSuggestions(profile) {
        const suggestions = {
            '工程师': {
                focus: '技术创新',
                actions: ['学习新技术', '优化代码', '技术分享'],
                bestTime: '上午10-12点',
                colors: ['蓝色', '绿色']
            },
            '销售': {
                focus: '客户关系',
                actions: ['客户拜访', '业绩分析', '人脉拓展'],
                bestTime: '下午2-4点',
                colors: ['红色', '金色']
            },
            '创业': {
                focus: '资源整合',
                actions: ['项目推进', '融资洽谈', '团队管理'],
                bestTime: '上午9-11点',
                colors: ['紫色', '橙色']
            }
        };
        return suggestions[profile.occupation] || suggestions['创业'];
    }
    generateHealthReminders(timingContext) {
        const { season, hour } = timingContext;
        const reminders = {
            spring: '注意肝脏保养，多进行户外运动',
            summer: '注意心脏保健，适当补充水分',
            autumn: '注意肺部健康，预防感冒',
            winter: '注意肾脏保养，保持温暖'
        };
        return {
            current: reminders[season],
            nextCheck: this.getNextHealthCheck(timingContext),
            dailyRoutine: this.getOptimalDailyRoutine(season)
        };
    }
    getNextHealthCheck(timingContext) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(7, 0, 0, 0);
        return tomorrow.toISOString();
    }
    getOptimalDailyRoutine(season) {
        const routines = {
            spring: ['6:30起床', '7:00-8:00运动', '9:00工作开始', '12:00午餐休息', '18:00晚餐', '22:30就寝'],
            summer: ['6:00起床', '6:30-7:30运动', '8:30工作开始', '12:00午餐', '19:00晚餐', '23:00就寝'],
            autumn: ['6:30起床', '7:00运动', '9:00工作', '12:00午餐', '18:30晚餐', '22:00就寝'],
            winter: ['7:00起床', '7:30轻度运动', '9:30工作开始', '12:30午餐', '18:00晚餐', '21:30就寝']
        };
        return routines[season] || routines.spring;
    }
    generateRelationshipTips(timingContext) {
        const { season, timeOfDay } = timingContext;
        const tips = {
            morning: '早晨是开始新关系交流的好时机',
            afternoon: '下午适合深度沟通和解决问题',
            evening: '晚上适合浪漫约会或家庭聚会'
        };
        return {
            currentTimeTip: tips[timeOfDay] || tips.morning,
            seasonalAdvice: this.getSeasonRelationshipAdvice(season),
            communicationStyle: this.getCommunicationStyle(season),
            optimalActivities: this.getRelationshipActivities(timeOfDay)
        };
    }
    getCommunicationStyle(season) {
        const styles = {
            spring: '开放积极，喜欢新话题',
            summer: '热情直接，喜欢面对面交流',
            autumn: '深思熟虑，喜欢深度对话',
            winter: '温暖包容，喜欢温馨陪伴'
        };
        return styles[season] || styles.spring;
    }
    getRelationshipActivities(timeOfDay) {
        const activities = {
            morning: ['晨跑', '早餐约会', '计划未来'],
            afternoon: ['咖啡聊天', '户外散步', '共同购物'],
            evening: ['浪漫晚餐', '电影时光', '家居聊天']
        };
        return activities[timeOfDay] || activities.morning;
    }
    generateFinancialGuidance(timingContext) {
        const { season, timeOfDay } = timingContext;
        return {
            currentFocus: this.getSeasonFinancialAdvice(season),
            timingAdvice: this.getFinancialTimingAdvice(timeOfDay),
            investmentAdvice: this.getInvestmentAdvice(season),
            spendingTips: this.getSpendingTips(season),
            savingGoals: this.getSavingGoals(season)
        };
    }
    getFinancialTimingAdvice(timeOfDay) {
        const timing = {
            morning: '早晨是规划财务和做重要投资决策的好时机',
            afternoon: '下午适合分析投资组合和调整策略',
            evening: '晚上是检查消费和制定明日计划的时间'
        };
        return timing[timeOfDay] || timing.morning;
    }
    getInvestmentAdvice(season) {
        const advice = {
            spring: '春季适合投资成长型项目和技能提升',
            summer: '夏季可以适当增加股票等激进投资',
            autumn: '秋季是收获期，适合总结投资经验',
            winter: '冬季建议保守投资，注重风险控制'
        };
        return advice[season] || advice.spring;
    }
    getSpendingTips(season) {
        const tips = {
            spring: ['投资自己', '购买学习资料', '健康投资'],
            summer: ['适度娱乐', '旅游消费', '社交投资'],
            autumn: ['理财投资', '大额消费', '年度规划'],
            winter: ['健康保养', '保暖投资', '节日消费']
        };
        return tips[season] || tips.spring;
    }
    getSavingGoals(season) {
        const goals = {
            spring: '新开始基金，学习投资',
            summer: '旅行基金，投资收益',
            autumn: '年度储蓄，投资总结',
            winter: '健康基金，保险规划'
        };
        return goals[season] || goals.spring;
    }
    suggestNextAction(suggestions) {
        const { immediateAdvice } = suggestions;
        return {
            primaryAction: immediateAdvice.immediateAction,
            supportingActions: immediateAdvice.luckyElements.colors.slice(0, 2),
            timing: immediateAdvice.luckyElements.timeSlot,
            urgency: immediateAdvice.urgency
        };
    }
    assessRecommendationPriority(suggestions) {
        const { immediateAdvice } = suggestions;
        return immediateAdvice.urgency || 'medium';
    }
    /**
     * 获取用户档案
     */
    getUserProfile(userId) {
        return this.userProfiles.get(userId);
    }
    /**
     * 更新用户档案
     */
    updateUserProfile(userId, updates) {
        const existing = this.userProfiles.get(userId);
        if (existing) {
            this.userProfiles.set(userId, { ...existing, ...updates });
            return true;
        }
        return false;
    }
    /**
     * 删除用户档案
     */
    deleteUserProfile(userId) {
        return this.userProfiles.delete(userId);
    }
    /**
     * 获取所有用户档案
     */
    getAllUserProfiles() {
        return Array.from(this.userProfiles.values());
    }
}
exports.IntelligentBaziService = IntelligentBaziService;
exports.default = IntelligentBaziService;
//# sourceMappingURL=intelligentBaziService.js.map