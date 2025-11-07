// 类型定义转换为 JavaScript 常量
const FortuneRequest = {
  QUESTION: 'question',
  TYPE: 'type',
  CONTEXT: 'context',
  BIRTH_INFO: 'birthInfo',
  USER_ID: 'userId',
  SESSION_ID: 'sessionId'
};

const FortuneResponse = {
  ID: 'id',
  QUESTION: 'question',
  TYPE: 'type',
  RESULT: 'result',
  PREDICTION: 'prediction',
  CONFIDENCE: 'confidence',
  TIMESTAMP: 'timestamp'
};

const ChatMessage = {
  ROLE: 'role',
  CONTENT: 'content',
  TIMESTAMP: 'timestamp'
};

module.exports = {
  FortuneRequest,
  FortuneResponse,
  ChatMessage
};