// A tiny in-browser stand-in for the Express API, used when VITE_USE_MOCK=true.
// It follows the same rules as the real backend:
//  - quiz answers are only revealed AFTER a submission
//  - only approved papers are visible (researchers also see their own)
//  - XP and badges are calculated here (the "server"), never in the UI
import { seedUsers, seedPapers, stations, lessons, quizzes, badgeDefs, chatTopics } from './data'

const KEY = 'polarconnect_mock_state'
const LEVEL_SIZE = 100

const wait = (ms = 250) => new Promise((r) => setTimeout(r, ms))
function fail(status, message) {
  const err = new Error(message)
  err.status = status
  throw err
}

function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY))
    if (s) return s
  } catch {
    /* start fresh */
  }
  return { users: [], papers: [], statuses: {}, progress: {}, chat: {} }
}
const save = (s) => localStorage.setItem(KEY, JSON.stringify(s))

const allUsers = (s) => [...seedUsers, ...s.users]
const allPapers = (s) => [...seedPapers, ...s.papers].map((p) => ({ ...p, status: s.statuses[p.id] || p.status }))
const publicUser = ({ password, ...u }) => u
const progressOf = (s, uid) => s.progress[uid] || { xp: 0, quizzes: {}, badges: [] }

function userFromToken(s, token) {
  if (!token || !token.startsWith('mock-')) return null
  return allUsers(s).find((u) => u.id === token.slice(5)) || null
}

function levelInfo(xp) {
  const level = Math.floor(xp / LEVEL_SIZE) + 1
  return { xp, level, levelStartXp: (level - 1) * LEVEL_SIZE, nextLevelXp: level * LEVEL_SIZE }
}

function lessonView(l, prog) {
  const q = prog.quizzes[l.quizId]
  return { ...l, completed: Boolean(q), score: q ? q.score : null, total: q ? q.total : null }
}

export async function mockRequest(method, fullPath, body, token) {
  await wait()
  const url = new URL(fullPath, 'http://mock')
  const path = url.pathname
  const q = Object.fromEntries(url.searchParams)
  const state = load()
  const me = userFromToken(state, token)
  const needLogin = () => me || fail(401, 'Please log in to continue.')
  const needRole = (...roles) => {
    needLogin()
    if (!roles.includes(me.role)) fail(403, 'You do not have access to this.')
  }
  let m

  // ---------- auth ----------
  if (method === 'POST' && path === '/auth/login') {
    const u = allUsers(state).find((x) => x.email.toLowerCase() === String(body.email).toLowerCase() && x.password === body.password)
    if (!u) fail(401, 'Incorrect email or password.')
    return { token: `mock-${u.id}`, user: publicUser(u) }
  }
  if (method === 'POST' && path === '/auth/register') {
    if (!body.name || !body.email || !body.password) fail(400, 'Name, email and password are required.')
    if (allUsers(state).some((x) => x.email.toLowerCase() === body.email.toLowerCase())) fail(409, 'An account with this email already exists.')
    const role = body.role === 'researcher' ? 'researcher' : 'student'
    const u = { id: `u${Date.now()}`, name: body.name, email: body.email, password: body.password, role }
    state.users.push(u)
    save(state)
    return { token: `mock-${u.id}`, user: publicUser(u) }
  }
  if (method === 'POST' && path === '/auth/logout') return { ok: true }
  if (method === 'GET' && path === '/auth/me') return { user: publicUser(needLogin()) }

  // ---------- research ----------
  if (method === 'GET' && path === '/research') {
    needLogin()
    let list = allPapers(state)
    if (q.mine === 'true') list = list.filter((p) => p.uploadedBy === me.id)
    else list = list.filter((p) => p.status === 'approved')
    if (q.year) list = list.filter((p) => String(p.year) === q.year)
    if (q.category) list = list.filter((p) => p.category === q.category)
    if (q.station) list = list.filter((p) => p.station === q.station)
    if (q.q) {
      const needle = q.q.toLowerCase()
      list = list.filter((p) => [p.title, p.authors, p.topic, p.abstract, p.expedition].join(' ').toLowerCase().includes(needle))
    }
    list.sort((a, b) => b.year - a.year)
    if (q.limit) list = list.slice(0, Number(q.limit))
    return { items: list }
  }
  if (method === 'POST' && path === '/research') {
    needRole('researcher', 'admin')
    const get = (k) => (body.get ? body.get(k) : body[k])
    if (!get('title') || !get('file')) fail(400, 'A title and a PDF file are required.')
    const paper = {
      id: `p${Date.now()}`,
      title: get('title'), authors: get('authors') || me.name, year: Number(get('year')) || new Date().getFullYear(),
      category: get('category') || 'Climate', station: get('station') || '', expedition: get('expedition') || '',
      topic: get('topic') || '', abstract: get('abstract') || '', pages: 0, status: 'pending', uploadedBy: me.id,
    }
    state.papers.push(paper)
    save(state)
    return paper
  }
  if (method === 'GET' && (m = path.match(/^\/research\/([^/]+)$/))) {
    needLogin()
    const p = allPapers(state).find((x) => x.id === m[1])
    if (!p) fail(404, 'Paper not found.')
    const canSee = p.status === 'approved' || me.role === 'admin' || p.uploadedBy === me.id
    if (!canSee) fail(404, 'Paper not found.')
    return p
  }

  // ---------- admin ----------
  if (method === 'GET' && path === '/admin/research/pending') {
    needRole('admin')
    return { items: allPapers(state).filter((p) => p.status === 'pending') }
  }
  if (method === 'POST' && (m = path.match(/^\/admin\/research\/([^/]+)\/(approve|reject)$/))) {
    needRole('admin')
    const p = allPapers(state).find((x) => x.id === m[1])
    if (!p) fail(404, 'Paper not found.')
    state.statuses[p.id] = m[2] === 'approve' ? 'approved' : 'rejected'
    save(state)
    await wait(600) // the real backend also indexes the paper for the AI here
    return { ...p, status: state.statuses[p.id] }
  }

  // ---------- chat ----------
  if (method === 'POST' && path === '/chat') {
    needLogin()
    const question = String(body.question || '').trim()
    if (!question) fail(400, 'Please type a question.')
    const lower = question.toLowerCase()
    const topic = chatTopics.find((t) => t.match.test(lower))
    await wait(700)
    const papers = allPapers(state)
    const reply = topic
      ? {
          answer: topic.answer,
          sources: topic.sources.map((s) => ({ ...s, title: papers.find((p) => p.id === s.paper_id)?.title || 'Research paper' })),
        }
      : { answer: 'The approved research papers do not cover this question yet, so I would rather not guess. Try asking about ice shelves, sea ice, krill, penguins, ozone or subglacial life.', sources: [] }
    const hist = state.chat[me.id] || []
    hist.push({ role: 'user', content: question }, { role: 'assistant', content: reply.answer, sources: reply.sources })
    state.chat[me.id] = hist.slice(-40)
    save(state)
    return reply
  }
  if (method === 'GET' && path === '/chat/history') {
    needLogin()
    return { items: state.chat[me.id] || [] }
  }

  // ---------- map ----------
  if (method === 'GET' && path === '/stations') {
    needLogin()
    return { items: stations }
  }
  if (method === 'GET' && (m = path.match(/^\/stations\/([^/]+)$/))) {
    needLogin()
    return stations.find((s) => s.id === m[1]) || fail(404, 'Station not found.')
  }

  // ---------- education ----------
  if (method === 'GET' && path === '/education') {
    needLogin()
    const prog = progressOf(state, me.id)
    return { items: lessons.map((l) => lessonView(l, prog)) }
  }
  if (method === 'GET' && (m = path.match(/^\/education\/([^/]+)$/))) {
    needLogin()
    const l = lessons.find((x) => x.id === m[1])
    return l ? lessonView(l, progressOf(state, me.id)) : fail(404, 'Lesson not found.')
  }
  if (method === 'GET' && (m = path.match(/^\/quizzes\/([^/]+)$/))) {
    needLogin()
    const quiz = quizzes[m[1]]
    if (!quiz) fail(404, 'Quiz not found.')
    // answers are stripped before leaving the "server"
    return { id: quiz.id, title: quiz.title, questions: quiz.questions.map(({ id, text, options, hint, difficulty }) => ({ id, text, options, hint, difficulty })) }
  }
  if (method === 'POST' && (m = path.match(/^\/quizzes\/([^/]+)\/submit$/))) {
    needLogin()
    const quiz = quizzes[m[1]]
    if (!quiz) fail(404, 'Quiz not found.')
    const answers = body.answers
    if (!Array.isArray(answers) || answers.length !== quiz.questions.length) fail(400, 'Please answer every question.')

    const results = quiz.questions.map((qq, i) => ({
      questionId: qq.id, correct: answers[i] === qq.answerIndex, correctIndex: qq.answerIndex, explanation: qq.explanation,
    }))
    const score = results.filter((r) => r.correct).length
    const total = quiz.questions.length
    const prog = progressOf(state, me.id)
    const firstTime = !prog.quizzes[quiz.id]

    let xpEarned = 0
    if (firstTime) {
      xpEarned = score * 10 + (score === total ? 20 : 0)
      prog.quizzes[quiz.id] = { score, total }
      prog.xp += xpEarned
    } else if (score > prog.quizzes[quiz.id].score) {
      prog.quizzes[quiz.id] = { score, total }
    }

    const earned = new Set(prog.badges)
    const newBadges = []
    const award = (id) => {
      if (earned.has(id)) return
      earned.add(id)
      newBadges.push(badgeDefs.find((b) => b.id === id))
    }
    if (Object.keys(prog.quizzes).length >= 1) award('first-steps')
    if (score === total) award('sharp-mind')
    if (prog.xp >= 100) award('polar-explorer')
    if (Object.keys(prog.quizzes).length >= Object.keys(quizzes).length) award('ice-scholar')
    prog.badges = [...earned]

    state.progress[me.id] = prog
    save(state)
    return { score, total, xpEarned, newBadges, results, ...levelInfo(prog.xp) }
  }

  // ---------- progress ----------
  if (method === 'GET' && path === '/users/me/progress') {
    needLogin()
    const prog = progressOf(state, me.id)
    return {
      completedQuizzes: Object.entries(prog.quizzes).map(([quizId, v]) => ({ quizId, ...v })),
      totalQuizzes: Object.keys(quizzes).length,
    }
  }
  if (method === 'GET' && path === '/users/me/xp') {
    needLogin()
    return levelInfo(progressOf(state, me.id).xp)
  }
  if (method === 'GET' && path === '/users/me/badges') {
    needLogin()
    const earned = new Set(progressOf(state, me.id).badges)
    return { items: badgeDefs.map((b) => ({ ...b, earned: earned.has(b.id) })) }
  }

  if (method === 'GET' && path === '/health') return { status: 'ok', mode: 'mock' }
  fail(404, `No mock route for ${method} ${path}`)
}
