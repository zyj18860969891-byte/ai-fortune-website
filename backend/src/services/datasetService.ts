import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

export class DatasetService {
  private apiKey: string;
  private baseUrl: string = 'https://modelscope.cn/api/v1/datasets';
  private datasets: Map<string, any[]> = new Map();
  private localDataPath: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    // 设置本地数据路径
    this.localDataPath = path.join(__dirname, '../../data');
    console.log('本地数据路径:', this.localDataPath);
  }

  /**
   * 从本地加载数据集
   * @param datasetId 数据集ID
   */
  private loadLocalDataset(datasetId: string): any[] {
    try {
      // 根据数据集ID确定本地文件名
      let fileName;
      if (datasetId === 'dclef233/bazi-non-reasoning-10k') {
        fileName = 'bazi-dataset.json';
      } else if (datasetId === 'wjy779738920/fortune-telling') {
        fileName = 'fortune-dataset.json';
      } else {
        fileName = `${datasetId.replace('/', '-')}.json`;
      }

      const filePath = path.join(this.localDataPath, fileName);
      console.log(`尝试从本地加载数据集: ${filePath}`);

      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContent);
        console.log(`成功从本地加载数据集: ${fileName}, 共 ${data.length} 条记录`);
        return data;
      } else {
        console.log(`本地未找到数据集文件: ${filePath}`);
        return [];
      }
    } catch (error) {
      console.error('加载本地数据集失败:', error);
      return [];
    }
  }

  /**
   * 加载指定的数据集
   * @param datasetId 数据集ID
   * @param subsetName 子集名称
   */
  async loadDataset(datasetId: string, subsetName: string = 'default'): Promise<any[]> {
    try {
      // 检查缓存
      const cacheKey = `${datasetId}-${subsetName}`;
      if (this.datasets.has(cacheKey)) {
        console.log(`从缓存加载数据集: ${datasetId}`);
        return this.datasets.get(cacheKey) || [];
      }

      console.log(`正在加载数据集: ${datasetId}`);
      
      // 尝试从本地加载数据集
      let localData = this.loadLocalDataset(datasetId);
      if (localData.length > 0) {
        // 如果本地数据集存在，直接返回
        this.datasets.set(cacheKey, localData);
        return localData;
      }
      
      // 构建API请求URL - 使用ModelScope的文件API来获取实际数据
      let fileUrl;
      if (datasetId === 'wjy779738920/fortune-telling') {
        // 对于算命数据集，使用不同的API端点
        fileUrl = `https://www.modelscope.cn/api/v1/datasets/${datasetId}/revision/files`;
      } else {
        // 对于八字数据集，使用标准API端点
        fileUrl = `https://modelscope.cn/api/v1/datasets/${datasetId}/revision/files`;
      }
      
      console.log('Dataset File API URL:', fileUrl);
      console.log('Dataset API Key:', this.apiKey.substring(0, 10) + '...');
      
// 发送请求获取数据集文件列表
      let params;
      if (datasetId === 'wjy779738920/fortune-telling') {
        params = {
          Revision: 'master',
          Files: 'true'
        };
      } else {
        params = {
          subset_name: subsetName,
          split: 'train'
        };
      }

      const fileResponse = await axios.get(fileUrl, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        params: params,
        timeout: 10000
      });

      console.log('Dataset files response:', fileResponse.data);
      
      // 获取第一个数据文件
      const files = fileResponse.data?.Files || [];
      if (files.length === 0) {
        console.log(`数据集 ${datasetId} 没有找到数据文件`);
        return [];
      }

      const firstFile = files[0];
      const dataUrl = `https://www.modelscope.cn/api/v1/datasets/${datasetId}/revision/files/${firstFile.Path}`;
      
      console.log('Loading data from:', dataUrl);
      
      // 下载实际数据
      const dataResponse = await axios.get(dataUrl, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      let data = [];
      try {
        // 尝试解析JSON数据
        if (typeof dataResponse.data === 'string') {
          data = JSON.parse(dataResponse.data);
        } else {
          data = dataResponse.data;
        }
        
        // 如果数据是数组，直接使用
        if (Array.isArray(data)) {
          console.log(`成功加载数据集 ${datasetId}: ${data.length} 条记录`);
        } else if (data.messages && Array.isArray(data.messages)) {
          // 如果数据是OpenAI格式的对话数据，转换为我们的格式
          data = data.messages.map((msg: any, index: number) => ({
            id: index,
            role: msg.role,
            content: msg.content,
            type: msg.role === 'user' ? 'question' : 'answer'
          }));
          console.log(`成功加载数据集 ${datasetId}: ${data.length} 条对话记录`);
        } else if (data.data && Array.isArray(data.data)) {
          // 如果数据包装在data字段中
          data = data.data;
          console.log(`成功加载数据集 ${datasetId}: ${data.length} 条记录`);
        } else {
          // 其他格式，包装一下
          data = [data];
          console.log(`成功加载数据集 ${datasetId}: 1 条记录`);
        }
      } catch (parseError) {
        console.error('数据解析失败:', parseError);
        data = [];
      }
      
      // 缓存数据
      this.datasets.set(cacheKey, data);
      return data;
    } catch (error: any) {
      console.error(`加载数据集失败 ${datasetId}:`, error.message);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      return [];
    }
  }

  /**
   * 根据关键词搜索数据集中的相关内容
   * @param dataset 数据集
   * @param keywords 关键词
   */
  searchDataset(dataset: any[], keywords: string[]): any[] {
    if (!dataset || dataset.length === 0 || !keywords || keywords.length === 0) {
      return [];
    }

    return dataset.filter(item => {
      // 检查item中的各个字段是否包含关键词
      const itemText = JSON.stringify(item).toLowerCase();
      return keywords.some(keyword => itemText.includes(keyword.toLowerCase()));
    });
  }

  /**
   * 获取随机数据项
   * @param dataset 数据集
   * @param count 数量
   */
  getRandomItems(dataset: any[], count: number = 1): any[] {
    if (!dataset || dataset.length === 0) {
      return [];
    }

    if (count >= dataset.length) {
      return [...dataset];
    }

    const shuffled = [...dataset].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  /**
   * 预加载常用数据集
   */
  async preloadDatasets(): Promise<void> {
    try {
      console.log('开始预加载数据集...');
      
      // 预加载八字命理数据集
      await this.loadDataset('dclef233/bazi-non-reasoning-10k');
      
      // 预加载算命数据集
      await this.loadDataset('wjy779738920/fortune-telling');
      
      console.log('数据集预加载完成');
    } catch (error) {
      console.error('数据集预加载失败:', error);
    }
  }
}