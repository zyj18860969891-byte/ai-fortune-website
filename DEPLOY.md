# 部署说明（Railway / 通用）

本文件说明如何在 Railway（或类似 PaaS）上把项目部署为“使用完整后端（ModelScope + Bazi MCP）”或“轻量本地 JS-only（演示）”两种模式，并给出本地测试命令。

概览
- 默认行为：`start-railway-js-only.js` 在无额外环境变量时会以“本地 JS-only”模式运行（不调用 ModelScope/MCP）。
- 可选行为：设置环境变量 `USE_COMPLETE_BACKEND=true` 后，程序会尝试优先挂载或启动仓库中已编译好的完整后端（`backend/dist`）。

为什么有两套实现？
- 部署时为了兼容性与稳定性，仓库提供了：
  - `backend`（TypeScript 原始后端，已编译产物位于 `backend/dist`）——集成 ModelScope 与 Bazi MCP。
  - `start-railway-js-only.js`（纯 JS 降级实现）——仅在本地生成模拟/快速响应，适合无法或暂时不使用外部 API 的场景。

优先恢复完整后端的策略
- 如果你希望上线时使用原始后端（推荐用于生产/真实推理），请在部署平台设置以下环境变量：

必填环境变量（至少）
- USE_COMPLETE_BACKEND = true
  - 打开后，`start-railway-js-only.js` 会尝试挂载 `./backend/dist/routes/fortune` 或直接 `require('./backend/dist/app')` 并启动完整后端应用。

- MODELSCOPE_API_KEY 或 MODELSCOPE_TOKEN
  - ModelScope 的 API Key（后端服务会读取 `process.env.MODELSCOPE_API_KEY` 或 `MODELSCOPE_TOKEN`，视实现而定）。

推荐/按需环境变量
- MODELSCOPE_MODEL_ID 或 MODELSCOPE_MODEL （例如 `ZhipuAI/GLM-4.6`）
- MODELSCOPE_BASE_URL 或 MODELSCOPE_BASEURL（自定义 ModelScope endpoint）
- BAZI_MCP_URL （八字 MCP 服务 URL）
- BAZI_MCP_TIMEOUT（可选，毫秒）
- FRONTEND_URL（前端地址，用于 CORS/日志展示）
- PORT（可选，默认 8080）

部署时的 Start Command（Railway）
- 推荐：

  node start-railway-js-only.js

  说明：该脚本会根据 `USE_COMPLETE_BACKEND` 决定：
  - true：尝试启动 `backend/dist/app`（需要 `backend` 的运行时依赖存在）；
  - false（或未设置）：回退到本地 JS-only 路由（`/api/fortune/chat` 等由脚本内部实现）。

- 备选（若你想使用 proxy 模式，将前端请求代理到独立后端）：

  node start-railway-full-stack.js

  说明：该脚本会在 root 进程中构建并以子进程启动 `backend`（需要构建环境，如 `tsc` 可用），并在 root 进程上代理 `/api/*` 到后端服务。

依赖安装（Railway/部署注意）
- 我在根 `package.json` 中添加了 `postinstall`：`cd backend && npm ci --production || true`
  - 目的：在部署时自动在 `backend` 下安装 production 依赖（如 `axios`、`@modelcontextprotocol/sdk` 等），以便 `backend/dist` 的编译产物可以正常 require 并运行。
  - 注意：某些平台可能会屏蔽子目录的 postinstall 或网络限制导致依赖安装失败，请确认 CI/CD/Platform 能够执行 `npm ci` 并访问 npm registry。

本地测试（PowerShell）
- 在仓库根目录执行：

  # 安装 root 依赖并触发 postinstall（会为 backend 安装 production 依赖）
  npm ci

  # 以完整后端模式运行（前提：backend/dist 已存在，或 backend 的 production 依赖可用）
  $env:USE_COMPLETE_BACKEND='true'; $env:PORT='8080'; node .\start-railway-js-only.js

  # 或者以本地 JS-only 模式运行（不启用完整后端）
  $env:USE_COMPLETE_BACKEND=''; $env:PORT='8080'; node .\start-railway-js-only.js

如果 `backend/dist` 不存在但你想在部署端构建 TypeScript：

  # 进入 backend 并安装 dev 依赖 / 构建
  cd backend
  npm ci
  npm run build   # 运行 tsc，生成 dist
  cd ..

常见问题与排查
- 启动时报错 `Cannot find module 'axios'` 或 `@modelcontextprotocol/sdk`：说明 `backend` 的 production 依赖未被正确安装。解决：确保 `postinstall` 在部署期间执行，或手动在 `backend` 目录运行 `npm ci`。
- 如果部署平台禁止运行子进程或构建（例如无法安装 devDependencies）：优先使用 `backend/dist` 中的已编译 JS 文件并设置 `USE_COMPLETE_BACKEND=true`，同时在 `backend` 下预先 `npm ci --production` 后再部署（或通过 CI 将 node_modules 一并打包）。

安全与密钥管理
- 请在平台的 Secret/Environment 配置中设置 ModelScope 与 MCP 的密钥，不要把 API Key 写入代码或提交到仓库。

下一步建议
1. 在 Railway 上设置环境变量（`USE_COMPLETE_BACKEND=true` 以及 ModelScope/MCP 的 Key）。
2. 部署并观察日志（`Health` 与 `Environment Check` endpoint 可用于快速验证）。
3. 如需我代为验证，本地我可以在仓库中执行 `npm ci` 与一次完整启动并排查错误（需你确认我可以安装依赖）。

如果需要，我可以把这套部署说明整理成 Railway 的“环境变量清单”并附带截图/示例（或把 root 的 start 指令直接改为 `node start-railway-js-only.js`）。
