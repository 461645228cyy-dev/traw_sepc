const iso = (d) => {
  const dt = typeof d === 'string' ? new Date(d) : d
  const y = dt.getFullYear()
  const m = String(dt.getMonth() + 1).padStart(2, '0')
  const day = String(dt.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const now = new Date()

export const CATEGORIES = [
  { id: 'featured', label: '🔥 今日精选' },
  { id: 'agent', label: '🤖 Agent 开发' },
  { id: 'models', label: '📦 模型发布' },
  { id: 'oss', label: '🔧 开源工具' },
  { id: 'learn', label: '📚 学习资源' },
]

export const TOPICS = ['#FunctionCalling', '#RAG', '#ModelMerge', '#AgenticUI', '#Eval', '#SFT', '#ToolUse', '#KVCache']

export const RESOURCES = [
  { label: 'OpenAI 文档', href: 'https://platform.openai.com/docs' },
  { label: 'Hugging Face Hub', href: 'https://huggingface.co/' },
  { label: 'Vercel AI SDK', href: 'https://sdk.vercel.ai/' },
  { label: 'LangChain 社区讨论', href: 'https://github.com/langchain-ai/langchain/discussions' },
]

export const WEEK_MODELS = [
  { name: 'OpenCLAW-7B-Instruct', detail: '工具调用更稳，函数签名对齐更好' },
  { name: 'MiniReasoner-3B', detail: '短链推理增强，适合边端' },
  { name: 'MoE-Fusion-12x2B', detail: '吞吐提升，合并路由策略更新' },
  { name: 'RerankLite-v2', detail: 'RAG 排序更强，延迟更低' },
]

export const ARTICLES = [
  {
    id: 'a1',
    categoryId: 'featured',
    tags: ['RAG', 'Rerank', 'Latency'],
    title: 'RAG 工程化：检索-重排-引用的最小闭环',
    excerpt: '用可观测指标约束每一步：召回、重排、引用一致性与端到端延迟。',
    date: iso(now),
    author: 'Kai',
    readMins: 6,
    likes: 144,
    body: [
      { type: 'p', text: '目标：在不引入过度复杂度的前提下，把检索、重排、引用做成可回归的最小闭环。' },
      { type: 'p', text: '实践建议：先把“引用一致性”当成硬指标——回答必须能被检索到的片段支撑。' },
      {
        type: 'code',
        lang: 'ts',
        text: `type Chunk = { id: string; text: string; score: number }

export async function rag(query: string) {
  const retrieved = await retrieve(query)
  const reranked = await rerank(query, retrieved)
  return synthesize(query, reranked.slice(0, 6))
}`,
      },
      { type: 'p', text: '最后，用日志/追踪把每步耗时与命中率打到同一张仪表盘：你会很快找到瓶颈。' },
    ],
  },
  {
    id: 'a2',
    categoryId: 'agent',
    tags: ['Agent', 'ReAct', 'ToolUse'],
    title: 'Agent 开发实战：ReAct 模式优化技巧',
    excerpt: '从提示模板、工具选择到观察压缩，系统化提升 ReAct 的稳定性与成本效率。',
    date: iso(new Date(now.getTime() - 86400000)),
    author: 'Lin',
    readMins: 7,
    likes: 128,
    body: [
      { type: 'p', text: 'ReAct 的难点不在“会不会用”，而在“能不能稳定跑”。关键在于把输出格式与工具错误恢复写进系统提示。' },
      { type: 'p', text: '建议把观察（Observation）做压缩：只保留与下一步决策有关的字段，避免上下文爆炸。' },
      {
        type: 'code',
        lang: 'ts',
        text: `type Tool = { name: string; run: (input: any) => Promise<any> }

export async function reactLoop(llm: any, tools: Tool[], query: string) {
  const plan = await llm.plan({ query, tools: tools.map(t => t.name) })
  const obs = await tools[plan.tool].run(plan.input)
  return llm.final({ query, obs })
}`,
      },
      { type: 'p', text: '最后加上回放（replay）能力：把每次工具输入输出持久化，线上问题才可复现。' },
    ],
  },
  {
    id: 'a3',
    categoryId: 'models',
    tags: ['New Model', 'OpenCLAW', 'Eval'],
    title: 'OpenCLAW 发布：更强函数调用与更少幻觉',
    excerpt: '对齐函数签名、参数类型与错误恢复策略后，工具调用成功率显著提升。',
    date: iso(new Date(now.getTime() - 2 * 86400000)),
    author: 'Mika',
    readMins: 5,
    likes: 96,
    body: [
      { type: 'p', text: '本次更新主要聚焦在工具调用：包含参数类型约束、返回值一致性与多轮修正策略。' },
      {
        type: 'code',
        lang: 'json',
        text: `{
  "name": "search",
  "parameters": {
    "type": "object",
    "properties": { "q": { "type": "string" } },
    "required": ["q"]
  }
}`,
      },
      { type: 'p', text: '建议配套离线评测：把“工具调用成功率”“错误恢复成功率”纳入回归。' },
    ],
  },
  {
    id: 'a4',
    categoryId: 'oss',
    tags: ['Open Source', 'AgenticUI', 'DX'],
    title: '开源工具：一套开发者友好的 Agent 工作台 UI',
    excerpt: '极简面板 + 运行轨迹可视化 + 一键回放，提升调试效率与复现能力。',
    date: iso(new Date(now.getTime() - 3 * 86400000)),
    author: 'Nora',
    readMins: 4,
    likes: 82,
    body: [
      { type: 'p', text: '对于 Agent 工作台，开发者最关心三件事：状态、轨迹、可复现。UI 设计要为这三点服务。' },
      { type: 'p', text: '建议把每步的“意图/工具/输入/输出/耗时/错误”做成统一的事件卡片。' },
      { type: 'p', text: '一键回放则要求事件结构稳定，可被离线重放与对比。' },
    ],
  },
  {
    id: 'a5',
    categoryId: 'learn',
    tags: ['学习资源', 'Eval', 'SFT'],
    title: '从 0 到 1：离线评测与数据闭环（收藏级清单）',
    excerpt: '指标、基准集、标注、回归与监控：一份可直接落地的评测体系模板。',
    date: iso(new Date(now.getTime() - 5 * 86400000)),
    author: 'Yao',
    readMins: 9,
    likes: 210,
    body: [
      { type: 'p', text: '离线评测的目标不是“刷分”，而是让模型迭代可控：每次发布都知道好在哪里、坏在哪里。' },
      { type: 'p', text: '最小闭环：定义指标 → 构建基准集 → 自动评测 → 失败样本回流 → 再训练/再对齐。' },
      {
        type: 'code',
        lang: 'py',
        text: `def score(pred, ref):
    if pred.strip() == ref.strip():
        return 1
    return 0

metrics = {"exact_match": sum(score(p, r) for p, r in pairs) / len(pairs)}`,
      },
      { type: 'p', text: '把评测脚本和数据集版本化，才能把线上回归问题定位到具体变更。' },
    ],
  },
]

export async function fetchArticles() {
  await new Promise((r) => setTimeout(r, 650))
  return ARTICLES.slice().sort((a, b) => (a.date < b.date ? 1 : -1))
}

