// 直接测试去重算法
export class DeduplicationTest {
  
  /**
   * 清理重复的内容
   */
  private removeDuplicates(text: string): string {
    console.log('🧹 开始清理重复内容，原始长度:', text.length);
    
    // 智能分割文本，识别重复段落
    const lines = text.split('\n');
    const result: string[] = [];
    const seenContent = new Set<string>();
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // 跳过空行
      if (!trimmedLine) {
        continue;
      }
      
      // 特殊处理：检查是否与已见内容重复或相似
      if (this.isDuplicateContent(trimmedLine, seenContent)) {
        console.log('🗑️ 跳过重复内容:', trimmedLine.substring(0, 50) + '...');
        continue;
      }
      
      // 将内容添加到结果中
      seenContent.add(trimmedLine);
      result.push(trimmedLine);
    }
    
    // 重新组织段落结构
    let cleaned = this.reorganizeParagraphs(result);
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim();
    
    console.log('🧹 清理完成，新长度:', cleaned.length);
    return cleaned;
  }

  /**
   * 检查内容是否重复（基于相似性）
   */
  private isDuplicateContent(content: string, seenContent: Set<string>): boolean {
    // 直接匹配
    if (seenContent.has(content)) {
      return true;
    }
    
    // 检查相似性（模糊匹配）
    for (const seen of seenContent) {
      if (this.calculateSimilarity(content, seen) > 0.8) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * 计算两个字符串的相似度
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) {
      return 1.0;
    }
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  /**
   * 计算Levenshtein距离
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) {
      matrix[0][i] = i;
    }
    
    for (let j = 0; j <= str2.length; j++) {
      matrix[j][0] = j;
    }
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        if (str1.charAt(i - 1) === str2.charAt(j - 1)) {
          matrix[j][i] = matrix[j - 1][i - 1];
        } else {
          matrix[j][i] = Math.min(
            matrix[j - 1][i - 1] + 1,
            matrix[j][i - 1] + 1,
            matrix[j - 1][i] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  /**
   * 重新组织段落结构
   */
  private reorganizeParagraphs(lines: string[]): string {
    const paragraphs: string[] = [];
    let currentParagraph: string[] = [];
    
    for (const line of lines) {
      // 如果是新的内容标题或特殊标记，开始新段落
      if (line.startsWith('🌟') || line.startsWith('💪') || 
          line.startsWith('⚠️') || line.startsWith('💡') || 
          line.startsWith('🌸') || line.startsWith('👋') || 
          line.startsWith('😊')) {
        
        // 保存当前段落
        if (currentParagraph.length > 0) {
          paragraphs.push(currentParagraph.join('\n\n'));
          currentParagraph = [];
        }
        currentParagraph.push(line);
      } else {
        // 继续当前段落
        currentParagraph.push(line);
      }
    }
    
    // 添加最后一个段落
    if (currentParagraph.length > 0) {
      paragraphs.push(currentParagraph.join('\n\n'));
    }
    
    return paragraphs.join('\n\n');
  }

  // 暴露给测试使用
  public testRemoveDuplicates(text: string): string {
    return this.removeDuplicates(text);
  }
}

// 运行测试
const tester = new DeduplicationTest();

const testText = `👋 您好！欢迎使用八字排盘系统！

😊 今天运势很好

🌟 八字排盘显示

您今天会遇到好运气

👋 您好！欢迎使用八字排盘系统！

😊 今天运势很好

🌟 八字排盘显示

您今天会遇到好运气

💪 运势分析

🌸 今日适合...

👋 您好！欢迎使用八字排盘系统！

🌟 八字排盘显示`;

console.log('🧪 测试文本长度:', testText.length);
console.log('📄 原始文本:');
console.log(testText);
console.log('\n' + '='.repeat(50) + '\n');

const cleaned = tester.testRemoveDuplicates(testText);

console.log('🧹 清理后长度:', cleaned.length);
console.log('📄 清理后文本:');
console.log(cleaned);
console.log('\n' + '='.repeat(50));
console.log('✅ 去重测试完成');