import { useEffect, useMemo, useRef, useState } from 'react'
import { CATEGORIES, RESOURCES, TOPICS, WEEK_MODELS, fetchArticles } from './data/articles'

const badgeClass = (t) => {
  const key = t.toLowerCase()
  if (key.includes('agent') || key.includes('react')) return 'badge badge--agent'
  if (key.includes('new model') || key.includes('openclaw')) return 'badge badge--new'
  if (key.includes('model') || key.includes('merge') || key.includes('moe')) return 'badge badge--model'
  if (key.includes('learn') || key.includes('学习')) return 'badge badge--learn'
  if (key.includes('open') || key.includes('tool')) return 'badge badge--tool'
  return 'badge'
}

const fmtMeta = (a) => `${a.date} · ${a.author} · ${a.readMins} min · 👍 ${a.likes}`

const clip = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

function App() {
  const [theme, setTheme] = useState('light')
  const [cat, setCat] = useState('featured')
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)
  const [articles, setArticles] = useState([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [modelsOpen, setModelsOpen] = useState(true)
  const [toast, setToast] = useState('')
  const [activeArticle, setActiveArticle] = useState(null)
  const [comments, setComments] = useState([
    { name: 'dev_iris', time: '2026-03-16', text: '希望加一个“本周最热”排序入口。' },
    { name: 'ops_lee', time: '2026-03-16', text: '代码片段复制很实用，建议支持多语言高亮。' },
  ])

  const toastTimer = useRef(null)
  const lastFocus = useRef(null)

  const showToast = (msg) => {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 1400)
  }

  useEffect(() => {
    const stored = localStorage.getItem('llmd_theme')
    const initial = stored === 'dark' ? 'dark' : 'light'
    setTheme(initial)
    document.documentElement.setAttribute('data-theme', initial)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('llmd_theme', theme)
  }, [theme])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchArticles().then((list) => {
      if (cancelled) return
      setArticles(list)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => {
    const byCat = articles.filter((a) => a.categoryId === cat)
    const s = q.trim().toLowerCase()
    if (!s) return byCat
    return byCat.filter((a) => `${a.title} ${a.excerpt}`.toLowerCase().includes(s))
  }, [articles, cat, q])

  const todayCount = useMemo(() => {
    const today = new Date()
    const y = today.getFullYear()
    const m = String(today.getMonth() + 1).padStart(2, '0')
    const d = String(today.getDate()).padStart(2, '0')
    const iso = `${y}-${m}-${d}`
    return articles.filter((a) => a.date === iso).length
  }, [articles])

  useEffect(() => {
    if (!activeArticle) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveArticle(null)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeArticle])

  useEffect(() => {
    if (activeArticle) {
      lastFocus.current = document.activeElement
      return
    }
    if (lastFocus.current && typeof lastFocus.current.focus === 'function') {
      lastFocus.current.focus()
    }
  }, [activeArticle])

  const onSelectCat = (id) => {
    setCat(id)
    setQ('')
    setMobileMenuOpen(false)
  }

  const catLabel = CATEGORIES.find((c) => c.id === cat)?.label ?? '分类'

  return (
    <div className="app">
      <header className="header">
        <div className="container header__inner">
          <a className="brand" href="./">
            <span className="brand__mark" aria-hidden="true">
              🔷
            </span>
            <span className="brand__name">LLM Daily</span>
          </a>

          <nav className="navcats" aria-label="分类">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`navcats__item ${c.id === cat ? 'is-active' : ''}`}
                onClick={() => onSelectCat(c.id)}
              >
                {c.label}
              </button>
            ))}
          </nav>

          <div className="actions">
            <button className="iconbtn" type="button" aria-label="搜索" onClick={() => setSearchOpen((v) => !v)}>
              🔍
            </button>
            <button
              className="iconbtn"
              type="button"
              aria-label="深色模式切换"
              onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            >
              🌙
            </button>
            <a className="iconbtn" href="/rss.xml" aria-label="RSS 订阅">
              📬
            </a>
          </div>
        </div>

        {searchOpen ? (
          <div className="container searchbar">
            <input
              className="searchbar__input"
              type="search"
              placeholder="搜索文章标题 / 摘要…（当前分类）"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        ) : null}

        <div className="container mobilebar">
          <button className="hamburger" type="button" aria-label="打开菜单" onClick={() => setMobileMenuOpen((v) => !v)}>
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div className="mobilebar__brand">LLM Daily</div>
          <div className="mobilebar__right">
            <button
              className="iconbtn"
              type="button"
              aria-label="深色模式切换"
              onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            >
              🌙
            </button>
          </div>
        </div>

        {mobileMenuOpen ? (
          <div className="container mobilemenu">
            <div className="mobilemenu__grid">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`navcats__item ${c.id === cat ? 'is-active' : ''}`}
                  onClick={() => onSelectCat(c.id)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </header>

      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__copy">
            <h1 className="hero__title">每天 5 分钟，追踪大模型前沿</h1>
            <p className="hero__subtitle">Agent 架构 · 模型迭代 · 开源实践 · 技术解读</p>
            <div className="hero__cta">
              <button className="btn btn--primary" type="button" onClick={() => showToast('订阅入口（占位）')}>
                📥 订阅更新
              </button>
              <a className="btn btn--ghost" href="https://github.com/" target="_blank" rel="noreferrer">
                ⭐ GitHub 星标
              </a>
            </div>
          </div>
          <div className="hero__bg" aria-hidden="true">
            <div className="hero__net"></div>
            <div className="hero__code"></div>
          </div>
        </div>
      </section>

      <main className="main">
        <div className="container layout">
          <section className="feed" aria-label="文章列表">
            <div className="feed__head">
              <div className="feed__title">{catLabel}</div>
              <div className="feed__meta">{q ? `筛选结果：${filtered.length} 篇` : `共 ${filtered.length} 篇`}</div>
            </div>
            <div className="feed__list">
              {loading
                ? new Array(5).fill(0).map((_, i) => (
                    <article key={i} className="card">
                      <div className="card__inner">
                        <div className="card__badges">
                          <div className="skeleton" style={{ width: 84, height: 22 }}></div>
                          <div className="skeleton" style={{ width: 92, height: 22 }}></div>
                        </div>
                        <div className="skeleton" style={{ marginTop: 12, width: '88%', height: 22 }}></div>
                        <div className="skeleton" style={{ marginTop: 10, width: '96%', height: 16 }}></div>
                        <div className="skeleton" style={{ marginTop: 6, width: '70%', height: 16 }}></div>
                        <div style={{ marginTop: 12, display: 'flex', gap: 10 }}>
                          <div className="skeleton" style={{ width: 110, height: 14 }}></div>
                          <div className="skeleton" style={{ width: 86, height: 14 }}></div>
                          <div className="skeleton" style={{ width: 96, height: 14 }}></div>
                        </div>
                        <div className="skeleton" style={{ marginTop: 14, width: '100%', height: 106 }}></div>
                      </div>
                    </article>
                  ))
                : filtered.map((a) => {
                    const codeBlock = a.body.find((b) => b.type === 'code')
                    const preview = codeBlock ? codeBlock.text.split('\n').slice(0, 3).join('\n') : null
                    return (
                      <article
                        key={a.id}
                        className="card"
                        onClick={() => {
                          setActiveArticle(a)
                        }}
                      >
                        <div className="card__inner">
                          <div className="card__badges">
                            {a.tags.map((t) => (
                              <span key={t} className={badgeClass(t)}>
                                [{t}]
                              </span>
                            ))}
                          </div>
                          <h3 className="card__title">
                            <button
                              type="button"
                              className="titlebtn"
                              onClick={(e) => {
                                e.stopPropagation()
                                setActiveArticle(a)
                              }}
                            >
                              {a.title}
                            </button>
                          </h3>
                          <p className="card__excerpt">{a.excerpt}</p>
                          <div className="card__meta">{fmtMeta(a)}</div>
                          {preview ? (
                            <div className="codebox" onClick={(e) => e.stopPropagation()}>
                              <div className="codebox__head">
                                <div className="codebox__lang">{codeBlock.lang.toUpperCase()}</div>
                                <div className="codebox__actions">
                                  <button
                                    className="mini"
                                    type="button"
                                    onClick={async () => {
                                      const ok = await clip(codeBlock.text)
                                      showToast(ok ? '代码已复制' : '复制失败：浏览器权限限制')
                                    }}
                                  >
                                    复制
                                  </button>
                                  <button
                                    className="mini"
                                    type="button"
                                    onClick={() => {
                                      setActiveArticle(a)
                                    }}
                                  >
                                    查看完整
                                  </button>
                                </div>
                              </div>
                              <pre>
                                <code>{preview}</code>
                              </pre>
                            </div>
                          ) : null}
                        </div>
                      </article>
                    )
                  })}
            </div>
          </section>

          <aside className="sidebar" aria-label="侧边栏">
            <div className="sidecard">
              {loading ? (
                <>
                  <div className="sidecard__title">
                    <div className="skeleton" style={{ width: 130, height: 18 }}></div>
                    <div className="skeleton" style={{ width: 38, height: 18, borderRadius: 999 }}></div>
                  </div>
                  <div className="list" style={{ marginTop: 12 }}>
                    {new Array(3).fill(0).map((_, i) => (
                      <div key={i} className="skeleton" style={{ height: 16 }}></div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="sidecard__title">
                    <div>📅 今日更新概览</div>
                    <div className="chipcount">{todayCount}</div>
                  </div>
                  <div className="list">
                    <div className="rowlink">
                      <span className="rowlink__left">
                        <span className="dot"></span>
                        <span>新增文章</span>
                      </span>
                      <span>{todayCount}</span>
                    </div>
                    <div className="rowlink">
                      <span className="rowlink__left">
                        <span className="dot"></span>
                        <span>互动增长</span>
                      </span>
                      <span>+{Math.max(12, todayCount * 9)}</span>
                    </div>
                    <a className="rowlink" href="/rss.xml">
                      <span className="rowlink__left">
                        <span className="dot"></span>
                        <span>RSS 订阅提示</span>
                      </span>
                      <span>启用</span>
                    </a>
                  </div>
                </>
              )}
            </div>

            <div className="sidecard">
              {loading ? (
                <>
                  <div className="sidecard__title">
                    <div className="skeleton" style={{ width: 130, height: 18 }}></div>
                  </div>
                  <div className="topics" style={{ marginTop: 12 }}>
                    {new Array(10).fill(0).map((_, i) => (
                      <div
                        key={i}
                        className="skeleton"
                        style={{ width: 70 + Math.floor(Math.random() * 60), height: 28, borderRadius: 999 }}
                      ></div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="sidecard__title">
                    <div>🔖 热门话题云</div>
                  </div>
                  <div className="topics">
                    {TOPICS.map((t) => (
                      <button
                        key={t}
                        className="topic"
                        type="button"
                        onClick={() => {
                          setSearchOpen(true)
                          setQ(t.replace('#', ''))
                          showToast(`按话题筛选：${t}`)
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="sidecard">
              {loading ? (
                <>
                  <div className="sidecard__title">
                    <div className="skeleton" style={{ width: 130, height: 18 }}></div>
                  </div>
                  <div className="list" style={{ marginTop: 12 }}>
                    {new Array(4).fill(0).map((_, i) => (
                      <div key={i} className="skeleton" style={{ height: 16 }}></div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="sidecard__title">
                    <div>📦 本周新增模型清单</div>
                  </div>
                  <div className="collapsible" data-open={modelsOpen ? 'true' : 'false'}>
                    <button className="collapsebtn" type="button" onClick={() => setModelsOpen((v) => !v)}>
                      <span>{modelsOpen ? '收起清单' : '展开清单'}</span>
                      <span className="chev">▾</span>
                    </button>
                    {modelsOpen ? (
                      <div className="collapsebody">
                        {WEEK_MODELS.map((m) => (
                          <div key={m.name} className="modelitem">
                            <div className="rowlink">
                              <span className="rowlink__left">
                                <span className="dot"></span>
                                <span>{m.name}</span>
                              </span>
                            </div>
                            <div className="modeldetail">{m.detail}</div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </>
              )}
            </div>

            <div className="sidecard">
              {loading ? (
                <>
                  <div className="sidecard__title">
                    <div className="skeleton" style={{ width: 130, height: 18 }}></div>
                  </div>
                  <div className="list" style={{ marginTop: 12 }}>
                    {new Array(4).fill(0).map((_, i) => (
                      <div key={i} className="skeleton" style={{ height: 16 }}></div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="sidecard__title">
                    <div>🔗 实用资源</div>
                  </div>
                  <div className="list">
                    {RESOURCES.map((r) => (
                      <a key={r.href} className="rowlink" href={r.href} target="_blank" rel="noreferrer">
                        <span className="rowlink__left">
                          <span className="dot"></span>
                          <span>{r.label}</span>
                        </span>
                        <span>↗</span>
                      </a>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="sidecard">
              {loading ? (
                <>
                  <div className="sidecard__title">
                    <div className="skeleton" style={{ width: 130, height: 18 }}></div>
                  </div>
                  <div className="list" style={{ marginTop: 12 }}>
                    {new Array(2).fill(0).map((_, i) => (
                      <div key={i} className="skeleton" style={{ height: 16 }}></div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="sidecard__title">
                    <div>💬 开发者留言区</div>
                  </div>
                  <CommentBox
                    comments={comments}
                    onAdd={(text) => {
                      const today = new Date()
                      const y = today.getFullYear()
                      const m = String(today.getMonth() + 1).padStart(2, '0')
                      const d = String(today.getDate()).padStart(2, '0')
                      setComments((cs) => [{ name: 'you', time: `${y}-${m}-${d}`, text }, ...cs])
                      showToast('留言已添加（本地）')
                    }}
                  />
                </>
              )}
            </div>
          </aside>
        </div>
      </main>

      <footer className="footer">
        <div className="container footer__inner">
          <div className="footer__left">© 2026 LLM Daily · 内容由社区贡献</div>
          <div className="footer__mid">
            <button className="linkbtn" type="button" onClick={() => showToast('关于本站（占位）')}>
              关于本站
            </button>
            <span className="sep">·</span>
            <button className="linkbtn" type="button" onClick={() => showToast('投稿指南（占位）')}>
              投稿指南
            </button>
            <span className="sep">·</span>
            <button className="linkbtn" type="button" onClick={() => showToast('隐私政策（占位）')}>
              隐私政策
            </button>
          </div>
          <div className="footer__right">
            <a className="social" href="https://github.com/" aria-label="GitHub" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a className="social" href="https://twitter.com/" aria-label="Twitter" target="_blank" rel="noreferrer">
              Twitter
            </a>
            <a className="social" href="https://discord.com/" aria-label="Discord" target="_blank" rel="noreferrer">
              Discord
            </a>
          </div>
        </div>
      </footer>

      {toast ? <div className="toast is-on">{toast}</div> : <div className="toast"></div>}

      {activeArticle ? (
        <ArticleModal
          article={activeArticle}
          onClose={() => setActiveArticle(null)}
          onCopy={async (text) => {
            const ok = await clip(text)
            showToast(ok ? '代码已复制' : '复制失败：浏览器权限限制')
          }}
        />
      ) : null}
    </div>
  )
}

function CommentBox({ comments, onAdd }) {
  const [v, setV] = useState('')
  return (
    <div className="commentbox">
      <textarea value={v} onChange={(e) => setV(e.target.value)} placeholder="留言（仅前端演示，不会上传）"></textarea>
      <button
        className="btn btn--primary"
        type="button"
        style={{ height: 38, justifyContent: 'center' }}
        onClick={() => {
          const t = v.trim()
          if (!t) return
          onAdd(t)
          setV('')
        }}
      >
        提交留言
      </button>
      <div className="commentlist">
        {comments.slice(0, 6).map((c, i) => (
          <div key={`${c.name}-${i}`} className="comment">
            <div className="comment__meta">
              @{c.name} · {c.time}
            </div>
            <div className="comment__text">{c.text}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ArticleModal({ article, onClose, onCopy }) {
  const closeBtnRef = useRef(null)

  useEffect(() => {
    closeBtnRef.current?.focus()
  }, [])

  const codeBlocks = article.body.filter((b) => b.type === 'code')

  return (
    <div
      className="overlay"
      role="dialog"
      aria-modal="true"
      aria-label="文章详情"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal__head">
          <div className="modal__title">{article.title}</div>
          <button className="iconbtn" type="button" aria-label="关闭" ref={closeBtnRef} onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal__meta">
          <div className="modal__badges">
            {article.tags.map((t) => (
              <span key={t} className={badgeClass(t)}>
                [{t}]
              </span>
            ))}
          </div>
          <div className="muted">{fmtMeta(article)}</div>
        </div>
        <div className="modal__body">
          {article.body.map((b, i) => {
            if (b.type === 'p') return <p key={i}>{b.text}</p>
            if (b.type === 'code') {
              return (
                <div key={i} className="codebox">
                  <div className="codebox__head">
                    <div className="codebox__lang">{b.lang.toUpperCase()}</div>
                    <div className="codebox__actions">
                      <button className="mini" type="button" onClick={() => onCopy(b.text)}>
                        复制
                      </button>
                    </div>
                  </div>
                  <pre>
                    <code>{b.text}</code>
                  </pre>
                </div>
              )
            }
            return null
          })}

          {codeBlocks.length === 0 ? null : <div className="divider"></div>}
          {codeBlocks.length === 0 ? null : (
            <div className="muted" style={{ fontSize: 12 }}>
              本页代码示例可一键复制（本地原型演示）。
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
