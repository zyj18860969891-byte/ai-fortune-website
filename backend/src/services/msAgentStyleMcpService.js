// 简化的 MCP 服务实现
const axios = require('axios');

class MsAgentStyleMcpService {
  constructor() {
    this.mcpConfig = {
      mcpServers: {
        default: {
          type: 'streamable_http',
          url: process.env.MODELSCOPE_BASE_URL || 'https://api-inference.modelscope.cn/v1',
          headers: {
            'Authorization': `Bearer ${process.env.MODELSCOPE_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      }
    };
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new MsAgentStyleMcpService();
    }
    return this.instance;
  }

  async callMcpServer(serverName, messages, options = {}) {
    try {
      const config = this.mcpConfig.mcpServers[serverName];
      if (!config) {
        throw new Error(`MCP server ${serverName} not found`);
      }

      const payload = {
        model: process.env.MODELSCOPE_MODEL || 'Qwen/Qwen3-235B-A22B-Instruct-2507',
        messages: messages,
        ...options
      };

      const response = await axios.post(`${config.url}/chat/completions`, payload, {
        headers: config.headers,
        timeout: config.timeout || 30000
      });

      return response.data;
    } catch (error) {
      console.error('MCP server call failed:', error);
      throw error;
    }
  }
}

module.exports = { MsAgentStyleMcpService };