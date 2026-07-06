const app = document.querySelector("#app");
const modalRoot = document.querySelector("#modal-root");
const toastRoot = document.querySelector("#toast-root");

const users = [];

const papers = [];

const outlines = [];

const questionBank = [];

const state = {
  authMode: "register",
  selectedRole: "student",
  searchUser: "",
  registerName: "",
  user: null,
  view: "home",
  studentSubject: "初中化学",
  practiceSource: "",
  practiceMode: "顺序刷题",
  selectedAnswer: "",
  submitted: false,
  favorite: false,
  knowledgeSort: "easy",
  teacherSubject: "初中化学",
  answerMode: "auto",
  outlineMode: "none",
  uploadFiles: [],
  answerFile: "",
  parseResult: null,
  paperFilter: "待校验",
  activeQuestion: 0,
  modal: null,
  confirmMode: "unpublish",
  toastTimer: null
};

const statusClassMap = {
  "已发布": "green",
  "已生效": "green",
  "已归类": "green",
  "已保存": "green",
  "待校验": "orange",
  "待补归类": "orange",
  "归类待确认": "orange",
  "缺答案": "orange",
  "缺题干": "red",
  "选项异常": "red",
  "未匹配大纲": "orange",
  "答案异常": "red",
  "未启用大纲": "red",
  "归类失败": "purple",
  "未电子化": "",
  "草稿": "",
  "待生效": "orange"
};

const fallbackParse = {
  summary: {
    files: ["待解析试卷"],
    pages: 0,
    questionCount: 0,
    imageQuestionCount: 0,
    answerWarnings: 0,
    missingAnswerCount: 0,
    unclassifiedCount: 0,
    pendingReviewCount: 0
  }
};

function icon(name, size = 20) {
  const paths = {
    home: '<path d="m3 10 9-7 9 7v9a2 2 0 0 1-2 2h-4v-6H9v6H5a2 2 0 0 1-2-2z"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8"/><path d="M8 17h5"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M17 8 12 3 7 8"/><path d="M12 3v12"/>',
    cloud: '<path d="M17.5 19H7a5 5 0 1 1 1.2-9.85A7 7 0 0 1 21 12a4 4 0 0 1-3.5 7z"/><path d="M12 12v7"/><path d="m8.5 15.5 3.5-3.5 3.5 3.5"/>',
    layers: '<path d="m12 2 9 5-9 5-9-5 9-5z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
    chart: '<path d="M3 3v18h18"/><path d="M7 16V9"/><path d="M12 16V5"/><path d="M17 16v-3"/>',
    settings: '<path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5z"/><path d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.04.04a2 2 0 1 1-2.83 2.83l-.04-.04A1.8 1.8 0 0 0 15 19.4a1.8 1.8 0 0 0-1 .6 1.8 1.8 0 0 0-.4 1.1V21a2 2 0 1 1-4 0v-.1a1.8 1.8 0 0 0-.4-1.1 1.8 1.8 0 0 0-1-.6 1.8 1.8 0 0 0-1.98.36l-.04.04a2 2 0 1 1-2.83-2.83l.04-.04A1.8 1.8 0 0 0 4.6 15a1.8 1.8 0 0 0-.6-1 1.8 1.8 0 0 0-1.1-.4H3a2 2 0 1 1 0-4h.1a1.8 1.8 0 0 0 1.1-.4 1.8 1.8 0 0 0 .6-1 1.8 1.8 0 0 0-.36-1.98l-.04-.04A2 2 0 1 1 7.23 3.35l.04.04A1.8 1.8 0 0 0 9 4.6a1.8 1.8 0 0 0 1-.6 1.8 1.8 0 0 0 .4-1.1V3a2 2 0 1 1 4 0v.1a1.8 1.8 0 0 0 .4 1.1 1.8 1.8 0 0 0 1 .6 1.8 1.8 0 0 0 1.98-.36l.04-.04a2 2 0 1 1 2.83 2.83l-.04.04A1.8 1.8 0 0 0 19.4 9c.2.4.4.7.8.9.3.2.7.3 1.1.3h.1a2 2 0 1 1 0 4h-.1a1.8 1.8 0 0 0-1.1.4c-.4.2-.6.5-.8.9z"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
    user: '<path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',
    left: '<path d="m15 18-6-6 6-6"/>',
    down: '<path d="m6 9 6 6 6-6"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    zap: '<path d="M13 2 3 14h8l-1 8 10-12h-8l1-8z"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    clipboard: '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="m9 14 2 2 4-4"/>',
    shuffle: '<path d="M16 3h5v5"/><path d="M4 20 21 3"/><path d="M21 16v5h-5"/><path d="m15 15 6 6"/><path d="m4 4 5 5"/>',
    network: '<circle cx="12" cy="5" r="3"/><circle cx="5" cy="19" r="3"/><circle cx="19" cy="19" r="3"/><path d="M10.4 7.6 6.6 16.4"/><path d="m13.6 7.6 3.8 8.8"/><path d="M8 19h8"/>',
    star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3-6.2 3.3L7 14.2 2 9.3l6.9-1L12 2z"/>',
    bookmark: '<path d="M19 21 12 17 5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
    beaker: '<path d="M9 3h6"/><path d="M10 3v5l-5 9a3 3 0 0 0 2.6 4.5h8.8A3 3 0 0 0 19 17l-5-9V3"/><path d="M8 14h8"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>',
    trash: '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>',
    send: '<path d="m22 2-7 20-4-9-9-4 20-7z"/><path d="M22 2 11 13"/>',
    ban: '<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6 18.4 18.4"/>',
    sitemap: '<path d="M12 5v6"/><rect x="8" y="2" width="8" height="6" rx="1"/><rect x="3" y="16" width="6" height="6" rx="1"/><rect x="15" y="16" width="6" height="6" rx="1"/><path d="M5 16v-3h14v3"/><path d="M12 11v5"/>',
    plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    warning: '<path d="m10.3 3.9-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3.1l-8-14a2 2 0 0 0-3.4 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/><path d="M20 4 14.5 9.5"/>',
    list: '<path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/>'
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.file}</svg>`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function badge(label) {
  const cls = statusClassMap[label] || "";
  return `<span class="status-badge ${cls}">${escapeHtml(label)}</span>`;
}

function roleLabel(role) {
  return role === "teacher" ? "教师" : "学生";
}

function showToast(message) {
  window.clearTimeout(state.toastTimer);
  toastRoot.innerHTML = `<div class="toast">${escapeHtml(message)}</div>`;
  state.toastTimer = window.setTimeout(() => {
    toastRoot.innerHTML = "";
  }, 2200);
}

function currentQuestion() {
  return questionBank[state.activeQuestion] || null;
}

function clampQuestionIndex(index) {
  if (!questionBank.length) return 0;
  return Math.min(Math.max(0, index), questionBank.length - 1);
}

function createEmptyParseResult(payload = {}) {
  return {
    ok: true,
    summary: {
      ...fallbackParse.summary,
      files: payload.files?.length ? payload.files : fallbackParse.summary.files,
      subject: payload.subject || state.teacherSubject,
      uploadedAt: formatLocalMinute()
    }
  };
}

function formatLocalMinute(date = new Date()) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function uploadedFileName(file) {
  if (typeof file === "string") return file.split(/[\\/]/).pop() || file;
  return file?.name || "未命名文件";
}

function titleFromFileName(fileName) {
  return fileName.replace(/\.[^.]+$/, "") || fileName;
}

function addOutlineFromFile(file) {
  const fileName = uploadedFileName(file);
  const title = titleFromFileName(fileName);
  const updated = formatLocalMinute();
  const existing = outlines.find((item) => item.fileName === fileName || item.title === title);
  const outline = {
    id: existing?.id || `outline-${Date.now()}`,
    title,
    fileName,
    subject: state.teacherSubject,
    uploader: state.user?.name || "本机用户",
    updated,
    status: "已生效",
    count: existing?.count || 1,
    nodes: existing?.nodes?.length
      ? existing.nodes
      : [
          {
            title,
            text: "已导入大纲文件，可在后续版本继续维护知识点层级和说明。",
            chips: [state.teacherSubject, fileName],
            active: true
          }
        ]
  };

  if (existing) {
    Object.assign(existing, outline);
  } else {
    outlines.unshift(outline);
  }
  state.outlineMode = "existing";
  state.view = "teacher-outline";
  return outline;
}

function questionIssueStatus(question) {
  if (!question.stem.trim()) return "缺题干";
  if (question.options.some((option) => !String(option || "").trim())) return "选项异常";
  const answer = String(question.answer || "").trim().toUpperCase();
  if (!answer) return "缺答案";
  const letters = answer.split("");
  const validLetters = new Set(question.options.map((option, index) => String(option || "").trim() ? "ABCD"[index] : "").filter(Boolean));
  const uniqueLetters = new Set(letters);
  if (letters.some((letter) => !validLetters.has(letter)) || uniqueLetters.size !== letters.length) return "答案异常";
  if (!String(question.knowledge || "").trim()) return "归类失败";
  return "";
}

function questionReviewStats() {
  const stats = {
    questionCount: questionBank.length,
    answerWarnings: 0,
    missingAnswerCount: 0,
    unclassifiedCount: 0,
    pendingReviewCount: 0,
    stemMissingCount: 0,
    optionIssueCount: 0
  };

  questionBank.forEach((question) => {
    const issue = questionIssueStatus(question);
    const status = issue || question.status;
    if (status === "缺答案") stats.missingAnswerCount += 1;
    if (status === "答案异常") stats.answerWarnings += 1;
    if (status === "归类失败" || status === "未匹配大纲" || status === "归类待确认") stats.unclassifiedCount += 1;
    if (status === "待校验") stats.pendingReviewCount += 1;
    if (status === "缺题干") stats.stemMissingCount += 1;
    if (status === "选项异常") stats.optionIssueCount += 1;
  });

  return stats;
}

function syncParseSummary() {
  if (!state.parseResult?.summary) return;
  Object.assign(state.parseResult.summary, questionReviewStats());
}

function saveCurrentQuestion() {
  const question = currentQuestion();
  if (!question) {
    showToast("当前没有可审核的题目");
    return;
  }
  const issue = questionIssueStatus(question);
  question.status = issue || "已保存";
  question.reviewedAt = formatLocalMinute();
  syncParseSummary();
  showToast(issue ? `仍需处理：${issue}` : "题目已审核通过，问题状态已清除");
  render();
}

function visibleUsers() {
  return users.filter((user) => {
    const matchesRole = user.role === state.selectedRole;
    const matchesSearch = !state.searchUser || user.name.includes(state.searchUser.trim());
    return matchesRole && matchesSearch;
  });
}

function hasPublishedPapers() {
  return papers.some((paper) => paper.status === "已发布");
}

function hasOutlines() {
  return outlines.length > 0;
}

function renderEmptyState(title, text, actionLabel = "", actionAttrs = "", iconName = "file") {
  return `
    <div class="empty-panel">
      <span class="soft-icon">${icon(iconName, 38)}</span>
      <strong>${escapeHtml(title)}</strong>
      <p>${escapeHtml(text)}</p>
      ${actionLabel ? `<button class="primary-button" ${actionAttrs} type="button">${escapeHtml(actionLabel)}</button>` : ""}
    </div>
  `;
}

function renderBrand(compact = false) {
  return `
    <div class="brand">
      <img class="brand-logo" src="./assets/app-icon.png" alt="试题管家图标" />
      <div class="brand-text">
        <div class="brand-title">试题<span>管家</span></div>
        ${compact ? "" : '<div class="brand-subtitle">本地优先试题工作台</div>'}
      </div>
    </div>
  `;
}

function renderHome() {
  const filtered = visibleUsers();
  return `
    <div class="window-frame">
      <div class="home-frame">
        <header class="home-nav">
          ${renderBrand(true)}
          <div class="home-nav-links">
            <button type="button">本地优先</button>
            <button type="button">纸质数字化</button>
            <button class="language-button" type="button">简体中文 ${icon("down", 16)}</button>
          </div>
        </header>
        <main class="home-main">
          <section class="hero-panel">
            <div class="hero-content">
              <h1>试题管家</h1>
              <div class="hero-point-list">
                <div class="hero-point">
                  <span class="icon-box">${icon("layers")}</span>
                  <div>
                    <h3>本地优先，数据安全</h3>
                    <p>所有试卷和练习记录默认保存在本机，离线也可使用。</p>
                  </div>
                </div>
                <div class="hero-point">
                  <span class="icon-box">${icon("target")}</span>
                  <div>
                    <h3>纸质转数字，高效管理</h3>
                    <p>支持 PDF、Word、TXT 试卷上传，进入题目校验和发布流程。</p>
                  </div>
                </div>
                <div class="hero-point">
                  <span class="icon-box">${icon("network")}</span>
                  <div>
                    <h3>教师校验，发布练习</h3>
                    <p>解析完成后先进入校验台，确认题干、选项、答案和解析后再发布。</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="hero-visual" aria-hidden="true">
              <div class="flask"><span class="bubble one"></span><span class="bubble two"></span></div>
              <div class="molecule"><span></span><span></span><span></span><span></span></div>
              <div class="paper-stack">
                <div class="paper-line"></div>
                <div class="paper-line short"></div>
                <div class="paper-line"></div>
              </div>
            </div>
            <div class="hero-bottom-strip">
              <div class="hero-mini">
                <span class="icon-box">${icon("shield")}</span>
                <div><strong>完全本地</strong><span>数据仅存储在您的设备上</span></div>
              </div>
              <div class="hero-mini">
                <span class="icon-box">${icon("zap")}</span>
                <div><strong>快速高效</strong><span>本地处理，响应迅速</span></div>
              </div>
              <div class="hero-mini">
                <span class="icon-box">${icon("lock")}</span>
                <div><strong>隐私安全</strong><span>试题资产归用户掌控</span></div>
              </div>
            </div>
          </section>
          <aside class="auth-panel">
            <div class="tabs" role="tablist" aria-label="登录注册">
              <button class="${state.authMode === "login" ? "active" : ""}" data-auth-mode="login" type="button">登录</button>
              <button class="${state.authMode === "register" ? "active" : ""}" data-auth-mode="register" type="button">注册</button>
            </div>
            <div class="form-stack">
              <label class="field">
                <span>身份</span>
                <span class="input-shell">${icon("user")}<select data-field="selectedRole">
                  <option value="student" ${state.selectedRole === "student" ? "selected" : ""}>学生</option>
                  <option value="teacher" ${state.selectedRole === "teacher" ? "selected" : ""}>教师</option>
                </select></span>
              </label>
              ${
                state.authMode === "login"
                  ? `<label class="field"><span>姓名</span><span class="input-shell">${icon("search")}<input data-field="searchUser" value="${escapeHtml(state.searchUser)}" placeholder="搜索本地用户" /></span></label>`
                  : `<label class="field"><span>姓名</span><span class="input-shell">${icon("user")}<input data-field="registerName" value="${escapeHtml(state.registerName)}" placeholder="请输入姓名" /></span></label>`
              }
              <button class="primary-button wide-button" data-action="${state.authMode === "login" ? "login-from-form" : "register-from-form"}" type="button">${state.authMode === "login" ? "登录本地账号" : "创建并进入"}</button>
              <button class="secondary-button wide-button" data-action="open-auth-modal" type="button">${state.authMode === "login" ? "打开登录面板" : "更多注册选项"}</button>
            </div>
            ${
              users.length
                ? `<div class="form-divider">最近登录</div><div class="recent-list">${filtered.slice(0, 3).map((user) => renderRecentUser(user)).join("")}</div>`
                : renderEmptyState("暂无本地账号", "首次使用请创建学生或教师账号。账号信息仅保存在本机。", "创建本地账号", 'data-auth-mode="register"', "user")
            }
          </aside>
        </main>
      </div>
    </div>
  `;
}

function renderRecentUser(user) {
  return `
    <button class="recent-row" data-action="login-user" data-user-id="${user.id}" type="button">
      <span class="avatar ${user.role === "teacher" ? "teacher" : ""}">${escapeHtml(user.initial)}</span>
      <span><strong>${escapeHtml(user.name)}</strong><span>${roleLabel(user.role)}</span></span>
      <span>${escapeHtml(user.last)}</span>
      ${icon("chevron", 16)}
    </button>
  `;
}

function renderAppShell() {
  const noSidebar = state.view === "teacher-question";
  return `
    <div class="window-frame">
      <div class="desktop-frame">
        <div class="app-shell ${noSidebar ? "no-sidebar" : ""}">
          ${renderTopbar()}
          ${noSidebar ? "" : renderSidebar()}
          <main class="main-content">
            ${renderCurrentView()}
          </main>
        </div>
      </div>
    </div>
  `;
}

function renderTopbar() {
  const isTeacher = state.user?.role === "teacher";
  const currentFile = state.parseResult?.summary?.files?.[0] || "待解析试卷";
  const title = state.view === "teacher-question"
    ? `<div class="current-paper">${icon("file")}<span>试卷名称：${escapeHtml(currentFile)}</span><small>${icon("edit", 16)}</small></div>`
    : state.view === "parse"
      ? `<div class="current-paper">${icon("file")}<span>当前试卷：${escapeHtml(currentFile)}</span><small>${icon("edit", 16)}</small></div>`
      : "";
  return `
    <header class="app-topbar">
      <div class="top-left">
        ${renderBrand(true)}
        ${title}
      </div>
      <div class="top-right">
        ${state.view === "teacher-question" ? '<button class="secondary-button" data-view="teacher-list" type="button">' + icon("left", 18) + "返回列表</button>" : ""}
        <button class="ghost-button icon-button" type="button" title="搜索">${icon("search")}</button>
        <button class="ghost-button icon-button" type="button" title="通知">${icon("bell")}</button>
        <div class="user-chip">
          <span class="avatar ${isTeacher ? "teacher" : ""}">${escapeHtml(state.user?.initial || "U")}</span>
          <span><span class="user-name">${escapeHtml(state.user?.name || "")}</span><span class="user-role">${roleLabel(state.user?.role)}</span></span>
          ${icon("down", 16)}
        </div>
      </div>
    </header>
  `;
}

function renderSidebar() {
  const isTeacher = state.user?.role === "teacher";
  const studentNav = [["home", "首页", "home", ""]];
  if (hasPublishedPapers()) {
    studentNav.push(["practice", "刷题", "file", ""]);
    if (hasOutlines()) studentNav.push(["student-knowledge", "知识点", "book", ""]);
  }
  const nav = isTeacher
    ? [
        ["home", "首页", "home", ""],
        ["teacher-list", "试卷管理", "file", ""],
        ["teacher-outline", "知识点大纲", "list", ""]
      ]
    : studentNav;
  return `
    <aside class="sidebar">
      <nav class="sidebar-nav" aria-label="主导航">
        ${nav.map(([view, label, iconName, count]) => `
          <button class="nav-item ${state.view === view || (state.view === "parse" && view === "teacher-list") || (state.view === "teacher-import" && view === "home") ? "active" : ""}" data-view="${view}" type="button">
            <span class="sidebar-icon">${icon(iconName)}</span>
            ${label}
            ${count ? `<span class="nav-count">${count}</span>` : ""}
          </button>
        `).join("")}
      </nav>
      <div class="sidebar-footer">
        <button class="nav-item" data-action="logout" type="button">
          <span class="sidebar-icon">${icon("logout")}</span>
          退出登录
        </button>
      </div>
    </aside>
  `;
}

function renderCurrentView() {
  if (state.user?.role === "teacher") {
    if (state.view === "teacher-import") return renderTeacherImport();
    if (state.view === "parse") return renderParseProgress();
    if (state.view === "teacher-list") return renderPaperList();
    if (state.view === "teacher-outline") return renderTeacherOutline();
    if (state.view === "teacher-question") return renderTeacherQuestion();
    return renderTeacherHome();
  }

  if (state.view === "student-knowledge") return renderStudentKnowledge();
  if (state.view === "practice") return renderPractice();
  return renderStudentHome();
}

function renderPlaceholder(title, text) {
  return `
    <section class="panel" style="min-height: 620px;">
      <div class="panel-header">
        <div>
          <h2>${escapeHtml(title)}</h2>
          <p>${escapeHtml(text)}</p>
        </div>
      </div>
      <div style="display:grid;place-items:center;min-height:500px;color:var(--muted);">
        <div style="text-align:center;">
          <div class="soft-icon" style="margin:0 auto 18px;">${icon("settings", 36)}</div>
          <strong>该模块已预留入口</strong>
        </div>
      </div>
    </section>
  `;
}

function renderStudentHome() {
  if (!hasPublishedPapers()) {
    return `
      <section class="student-home-grid">
        <div class="selector-row" style="grid-template-columns:minmax(260px,360px) 1fr;">
          <div class="selector-card">
            <span class="metric-icon">${icon("book", 30)}</span>
            <label>学科<select data-field="studentSubject">
              <option ${state.studentSubject === "初中化学" ? "selected" : ""}>初中化学</option>
              <option ${state.studentSubject === "初中物理" ? "selected" : ""}>初中物理</option>
            </select></label>
            ${icon("down", 18)}
          </div>
          <div class="panel">
            ${renderEmptyState("暂无可练习内容", "当前还没有已发布试卷。教师发布试卷后，学生端练习入口会自动出现。", "", "", "layers")}
          </div>
        </div>
      </section>
    `;
  }

  const publishedPapers = papers.filter((paper) => paper.status === "已发布");
  const featureCards = [
    renderStudentFeature("顺序刷题", "按试卷题目顺序练习，适合完整复习与校验掌握情况。", "chart", "", "顺序刷题"),
    renderStudentFeature("随机刷题", "从已发布试卷中随机抽题，适合快速自测。", "shuffle", "green", "随机刷题")
  ];
  if (hasOutlines()) {
    featureCards.push(renderStudentFeature("知识点学习", "按教师上传的大纲查看知识点与相关题目。", "network", "purple", "knowledge"));
  }

  return `
    <section class="student-home-grid">
      <div class="selector-row">
        <div class="selector-card">
          <span class="metric-icon">${icon("book", 30)}</span>
          <label>学科<select data-field="studentSubject">
            <option ${state.studentSubject === "初中化学" ? "selected" : ""}>初中化学</option>
            <option ${state.studentSubject === "初中物理" ? "selected" : ""}>初中物理</option>
          </select></label>
          ${icon("down", 18)}
        </div>
        <div class="selector-card">
          <span class="metric-icon">${icon("layers", 30)}</span>
          <label>练习来源<select data-field="practiceSource">
            ${publishedPapers.map((paper) => `<option ${state.practiceSource === paper.title ? "selected" : ""}>${escapeHtml(paper.title)}</option>`).join("")}
          </select></label>
          ${icon("down", 18)}
        </div>
      </div>
      <div class="feature-grid">
        ${featureCards.join("")}
      </div>
    </section>
  `;
}

function renderStudentFeature(title, text, iconName, color, mode) {
  const action = mode === "knowledge" ? 'data-view="student-knowledge"' : `data-action="start-practice" data-mode="${mode}"`;
  return `
    <article class="feature-tile">
      <span class="feature-icon ${color}">${icon(iconName, 38)}</span>
      <div>
        <h2>${escapeHtml(title)}</h2>
        <p>${escapeHtml(text)}</p>
      </div>
      <button class="secondary-button" ${action} type="button">${mode === "knowledge" ? "去学习" : "去练习"}</button>
    </article>
  `;
}

function renderStudentKnowledge() {
  if (!hasOutlines() || !hasPublishedPapers()) {
    return renderEmptyState("暂无知识点内容", "当前没有可用知识点大纲或已发布题目。教师上传大纲并发布试卷后，此入口会自动开放。", "", "", "book");
  }

  return `
    <section class="knowledge-layout">
      <aside class="tree-panel">
        <div class="tree-header">
          <h2>知识点目录</h2>
          <button class="icon-button" type="button">${icon("down", 16)}</button>
        </div>
        <div class="tree-list">
          <div class="tree-item active">${icon("book", 18)} 化学实验</div>
          <div class="tree-item indent">${icon("file", 16)} 常见仪器与基本操作</div>
          <div class="tree-item indent">${icon("file", 16)} 物质的检验与鉴别</div>
          <div class="tree-item indent">${icon("file", 16)} 气体的制备与净化</div>
          <div class="tree-item indent">${icon("file", 16)} 物质的分离与提纯</div>
          <div class="tree-item indent">${icon("file", 16)} 实验方案的设计与评价</div>
          <div class="tree-item">${icon("book", 18)} 气体制取</div>
          <div class="tree-item">${icon("book", 18)} 离子反应</div>
          <div class="tree-item">${icon("book", 18)} 氧化还原</div>
          <div class="tree-item">${icon("book", 18)} 物质的量</div>
        </div>
      </aside>
      <main class="knowledge-main">
        <h1>化学实验</h1>
        <h2 style="margin-top:28px;">讲解内容</h2>
        <div class="segmented">
          <button class="${state.knowledgeSort === "easy" ? "active" : ""}" data-action="set-knowledge-sort" data-sort="easy" type="button">由易到难</button>
          <button class="${state.knowledgeSort === "outline" ? "active" : ""}" data-action="set-knowledge-sort" data-sort="outline" type="button">按大纲顺序</button>
        </div>
        <section class="lecture-block">
          <span class="soft-icon">${icon("beaker", 42)}</span>
          <div>
            <h2>知识点讲解</h2>
            <p>化学实验是学习化学的重要途径，通过实验可以观察化学现象、验证化学原理、探究物质的组成与性质。掌握常见仪器的使用方法、基本操作技巧及实验设计思路，是学好化学的基础。</p>
            <p><strong>学习目标：</strong></p>
            <p>认识并正确使用常见化学仪器；掌握基本实验操作的要点与注意事项；能够根据实验目的设计合理的实验方案并进行评价。</p>
          </div>
          <aside class="keyword-box">
            <h3>关键词</h3>
            <div class="keyword-list">
              <span>实验仪器</span><span>基本操作</span><span>实验现象</span><span>实验设计</span><span>安全规范</span>
            </div>
          </aside>
        </section>
        <section class="example-block">
          <span class="soft-icon" style="color:var(--green);background:var(--green-soft);">${icon("clipboard", 42)}</span>
          <div>
            <h2>典型例题与方法总结</h2>
            <p>通过典型例题，帮助理解知识点的应用场景与解题思路，总结解题方法与注意事项，提升实验分析与设计能力。</p>
            <button class="ghost-button small-button" data-action="start-practice" data-mode="知识点刷题" type="button">查看相关例题（12） ${icon("chevron", 14)}</button>
          </div>
        </section>
        <div class="bottom-fixed-action">
          <button class="primary-button" data-action="start-practice" data-mode="知识点刷题" type="button">练本知识点</button>
        </div>
      </main>
    </section>
  `;
}

function renderPractice() {
  if (!hasPublishedPapers()) {
    return renderEmptyState("暂无可刷题目", "当前没有已发布试卷。请等待教师发布试卷后再开始练习。", "", "", "file");
  }
  const q = currentQuestion();
  if (!q) {
    return renderEmptyState("暂无题目", "当前练习来源还没有题目数据。后续接入解析或 API 后会在这里展示题目。", "", "", "file");
  }
  const submitted = state.submitted;
  const total = questionBank.length;
  const progress = total ? ((state.activeQuestion + 1) / total) * 100 : 0;
  return `
    <section class="practice-layout">
      <main class="practice-card">
        <div class="question-progress">
          <button class="secondary-button" data-action="prev-question" type="button">${icon("chevron", 16)} 上一题</button>
          <div class="dot-track">
            ${Array.from({ length: Math.min(Math.max(total, 1), 8) }).map((_, index) => `<span class="${index < state.activeQuestion ? "done" : index === state.activeQuestion ? "active" : ""}"></span>`).join("")}
            <strong>${state.activeQuestion + 1} / ${total}</strong>
          </div>
          <button class="secondary-button" data-action="next-question" type="button">下一题 ${icon("chevron", 16)}</button>
        </div>
        <div class="question-meta-row">
          <span>${icon("book", 18)} 学科：${escapeHtml(state.studentSubject)}</span>
          <span>${icon("layers", 18)} 来源：${escapeHtml(state.practiceSource)}</span>
          <span>题目进度：<strong style="color:var(--accent);">${state.activeQuestion + 1}</strong> / ${total}</span>
        </div>
        <div class="question-stem"><span class="type-tag">${q.type}</span>${escapeHtml(q.stem)}</div>
        <div class="answer-options">
          ${q.options.map((option, index) => {
            const letter = "ABCD"[index];
            const active = state.selectedAnswer === letter;
            const correct = submitted && letter === q.answer;
            return `
              <button class="answer-option ${active ? "active" : ""} ${correct ? "correct" : ""}" data-answer="${letter}" type="button">
                <span class="radio-dot"></span>
                <span class="letter">${letter}</span>
                <span>${escapeHtml(option)}</span>
                ${correct ? icon("check", 22) : ""}
              </button>
            `;
          }).join("")}
        </div>
        ${submitted ? renderAnswerResult(q) : ""}
        <div class="practice-bottom">
          <button class="primary-button" data-action="${submitted ? "next-question" : "submit-answer"}" type="button">${submitted ? "下一题" : "提交答案"} ${submitted ? icon("chevron", 18) : ""}</button>
        </div>
      </main>
      <aside class="side-stack">
        <section class="side-panel">
          <h2>题目来源</h2>
          <div class="side-row"><span>${icon("layers")}</span><strong>${escapeHtml(state.practiceSource || "已发布试卷")}</strong><span>${icon("chevron", 16)}</span></div>
          <div class="side-row"><span>${icon("chart")}</span><strong>${q.difficulty}</strong><span>${icon("chevron", 16)}</span></div>
          <div class="side-row"><span>${icon("target")}</span><strong>${q.knowledge}</strong><span>${icon("chevron", 16)}</span></div>
        </section>
        <section class="side-panel">
          <div style="display:flex;justify-content:space-between;align-items:center;"><h2>题目进度</h2><strong style="color:var(--accent);">${state.activeQuestion + 1} / ${questionBank.length}</strong></div>
          <div class="progress-line" style="width:100%;margin-top:20px;"><span style="--value:${progress}%;"></span></div>
        </section>
      </aside>
    </section>
  `;
}

function renderAnswerResult(q) {
  return `
    <section class="result-panel">
      <span class="result-icon">${icon("check", 34)}</span>
      <div>
        <h2>回答正确</h2>
        <p>正确答案：<strong class="status-badge green">${q.answer}</strong></p>
      </div>
      <div>
        <strong>解析：</strong>
        <p>${escapeHtml(q.explanation)}</p>
      </div>
    </section>
  `;
}

function renderTeacherHome() {
  return `
    <section class="teacher-home-grid">
      <div class="panel">
        <div class="panel-header">
          <h2>试卷管理</h2>
          <button class="primary-button" data-view="teacher-import" type="button">${icon("upload", 18)} 试卷上传</button>
        </div>
        ${renderDropzone("将文件拖拽到此处，或点击上传", "支持 PDF、Word、TXT 格式，文件大小 ≤ 100MB")}
        <div class="panel-header" style="border-top:1px solid var(--line);">
          <div><h2>最近编辑的试卷</h2></div>
        </div>
        <div class="list-stack">
          ${papers.length ? papers.slice(0, 2).map((paper) => `
            <div class="paper-row">
              <span class="list-icon">${icon("file", 26)}</span>
              <div class="list-main"><strong>${escapeHtml(paper.title)}</strong><span>共 ${paper.count} 题 · 更新于 ${escapeHtml(paper.uploadedAt)}</span></div>
              <button class="secondary-button" data-view="teacher-question" type="button">继续编辑</button>
            </div>
          `).join("") : renderEmptyState("暂无试卷", "上传 PDF、Word 或 TXT 试卷后，这里会显示最近编辑记录。", "上传试卷", 'data-view="teacher-import"', "file")}
        </div>
      </div>
      <div class="panel">
        <div class="panel-header">
          <h2>知识点大纲</h2>
          <button class="primary-button" data-view="teacher-outline" type="button">${icon("upload", 18)} 大纲上传</button>
        </div>
        <div class="panel-header" style="border-bottom:0;padding-bottom:12px;"><h2 style="font-size:16px;">现有大纲列表</h2></div>
        <div class="list-stack">
          ${outlines.length ? outlines.map((item) => `
            <div class="outline-row">
              <span class="list-icon">${icon("file", 24)}</span>
              <div class="list-main"><strong>${escapeHtml(item.title)}</strong><span>更新于 ${escapeHtml(item.updated)} ｜ ${item.count} 个知识点</span></div>
              ${badge(item.status)}
              <button class="icon-button" data-view="teacher-outline" type="button">${icon("edit", 18)}</button>
            </div>
          `).join("") : renderEmptyState("暂无知识点大纲", "上传 Word、TXT 或 Markdown 大纲后，可用于题目归类和知识点刷题。", "上传大纲", 'data-view="teacher-outline"', "book")}
        </div>
      </div>
    </section>
  `;
}

function renderDropzone(title, subtitle) {
  return `
    <label class="dropzone" data-action="select-paper-files">
      <input type="file" multiple accept=".pdf,.doc,.docx,.txt" />
      <span class="dropzone-icon">${icon("cloud", 64)}</span>
      <strong>${escapeHtml(title)}</strong>
      <span>${escapeHtml(subtitle)}</span>
      <button class="secondary-button" type="button" data-action="select-paper-files">选择文件</button>
    </label>
  `;
}

function renderTeacherImport() {
  return `
    <section class="import-grid">
      <div class="panel">
        <div class="panel-header"><h2>上传资料</h2></div>
        ${renderDropzone("将文件拖拽到此处，或点击上传", "支持 PDF、Word、TXT 格式，文件大小 ≤ 100MB")}
        ${renderUploadedFiles()}
        <div class="panel-header" style="border-top:1px solid var(--line);"><h2 style="font-size:16px;">答案文件（可选）</h2></div>
        <div class="dropzone" style="min-height:122px;" data-action="open-answer-file">
          <span class="dropzone-icon" style="font-size:38px;">${icon("upload", 42)}</span>
          <strong>${state.answerFile ? escapeHtml(state.answerFile) : "拖拽或选择答案文件（如有）"}</strong>
          <span>支持 PDF、Word、TXT 格式，选择“答案单独成文件”时必填</span>
        </div>
      </div>
      <div class="panel">
        <div class="form-panel">
          <div>
            <h2>答案识别</h2>
            <div class="option-grid" style="margin-top:16px;">
              ${renderChoice("answerMode", "auto", "智能识别", "自动定位并识别答案区域", "target")}
              ${renderChoice("answerMode", "tail", "答案在文末", "答案集中在试卷正文末尾", "list")}
              ${renderChoice("answerMode", "inline", "答案跟随每题", "每题答案跟在题目之后", "clipboard")}
              ${renderChoice("answerMode", "file", "答案单独成文件", "答案在单独的文件中", "file")}
            </div>
          </div>
          <label class="select-field">
            <span class="field-label">学科类别</span>
            <select data-field="teacherSubject"><option>初中化学</option><option>初中物理</option></select>
          </label>
          <div>
            <span class="field-label">知识点大纲</span>
            <div class="option-grid" style="grid-template-columns:repeat(${hasOutlines() ? 3 : 2},1fr);margin-top:10px;">
              ${hasOutlines() ? renderChoice("outlineMode", "existing", "已有大纲", "从现有大纲中选择", "layers") : ""}
              ${renderChoice("outlineMode", "upload", "上传新大纲", "上传并关联新大纲", "upload")}
              ${renderChoice("outlineMode", "none", "暂不使用大纲", "后续再进行关联", "ban")}
            </div>
          </div>
          <button class="primary-button wide-button" data-action="digitize" type="button">电子化</button>
        </div>
      </div>
    </section>
  `;
}

function renderChoice(field, value, title, subtitle, iconName) {
  const active = state[field] === value;
  return `
    <button class="choice-card ${active ? "active" : ""}" data-choice-field="${field}" data-choice-value="${value}" type="button">
      <span class="choice-radio"></span>
      <span class="tool-icon">${icon(iconName, 28)}</span>
      <span><strong>${escapeHtml(title)}</strong><span>${escapeHtml(subtitle)}</span></span>
    </button>
  `;
}

function renderUploadedFiles() {
  if (!state.uploadFiles.length) return "";
  return state.uploadFiles.map((file) => {
    const name = typeof file === "string" ? file.split(/[\\/]/).pop() : file.name;
    return `
      <div class="file-card">
        <span class="list-icon" style="color:var(--red);background:var(--red-soft);">${icon("file", 24)}</span>
        <div class="list-main"><strong>${escapeHtml(name)}</strong><span>本地文件 · 等待后续解析接入</span></div>
        <div><span style="color:var(--green);font-size:12px;">上传完成</span><div class="progress-line"><span></span></div></div>
        <button class="icon-button" data-action="remove-file" type="button">${icon("x", 18)}</button>
      </div>
    `;
  }).join("");
}

function renderParseProgress() {
  const summary = state.parseResult?.summary || fallbackParse.summary;
  const reviewStats = questionReviewStats();
  const parsePercent = reviewStats.questionCount ? 68 : 0;
  const uploadedAt = summary.uploadedAt || "未上传";
  return `
    <section class="parse-page">
      <div class="parse-hero">
        <span class="list-icon">${icon("file", 28)}</span>
        <div>
          <h1>${escapeHtml(summary.files?.[0] || "待解析试卷")}</h1>
          <p>离线空 UI 占位　　页数：${summary.pages ?? 0} 页　　上传时间：${escapeHtml(uploadedAt)}</p>
          <div class="progress-line" style="width:80%;margin-top:22px;"><span style="--value:${parsePercent}%;"></span></div>
        </div>
        <div class="big-percent">${parsePercent}%<br /><small style="font-size:12px;color:var(--muted);">总进度</small></div>
      </div>
      <div class="stage-grid">
        ${renderStage(1, "文件读取", parsePercent, parsePercent ? "已完成" : "待接入", "file", parsePercent ? "green" : "")}
        ${renderStage(2, "页面解析", 0, "待接入", "image", "")}
        ${renderStage(3, "OCR / 文本抽取", 0, "待接入", "target", "")}
        ${renderStage(4, "题目识别", 0, "待接入", "network", "")}
        ${renderStage(5, "答案匹配", 0, "待接入", "clipboard", "")}
        ${renderStage(6, "知识点归类", 0, "待接入", "sitemap", "")}
        ${renderStage(7, "结构化校验", 0, "待接入", "shield", "")}
      </div>
      <div class="summary-strip">
        <div class="summary-heading">
          <strong>解析结果汇总</strong>
          <span>保留已识别内容，可进入编辑继续校验</span>
        </div>
        ${renderSummaryItem("识别题数", reviewStats.questionCount || summary.questionCount || 0, "file")}
        ${renderSummaryItem("含图题", summary.imageQuestionCount ?? 0, "image")}
        ${renderSummaryItem("答案异常", reviewStats.answerWarnings, "warning", "red")}
        ${renderSummaryItem("缺答案", reviewStats.missingAnswerCount, "warning", "orange")}
        ${renderSummaryItem("归类失败", reviewStats.unclassifiedCount, "sitemap", "purple")}
        ${renderSummaryItem("待校验", reviewStats.pendingReviewCount, "search")}
        <button class="primary-button" data-view="teacher-question" type="button">查看编辑空态 ${icon("chevron", 18)}</button>
      </div>
    </section>
  `;
}

function renderStage(index, title, percent, status, iconName, tone) {
  const color = tone === "green" ? "var(--green)" : tone === "orange" ? "var(--orange)" : "var(--accent)";
  return `
    <div class="stage-card">
      <span class="stage-icon" style="color:${color};background:${tone === "orange" ? "var(--orange-soft)" : tone === "green" ? "var(--green-soft)" : "var(--accent-soft)"};">${icon(iconName, 26)}</span>
      <div>
        <strong>${index}. ${escapeHtml(title)}</strong>
        <div class="progress-line" style="width:100%;margin-top:14px;"><span style="--value:${percent}%;background:${color};"></span></div>
      </div>
      <div style="text-align:right;"><strong>${percent}%</strong><small style="display:block;color:${color};margin-top:8px;">${escapeHtml(status)}</small></div>
    </div>
  `;
}

function renderSummaryItem(label, value, iconName, tone = "blue") {
  const color = tone === "red" ? "var(--red)" : tone === "orange" ? "var(--orange)" : tone === "purple" ? "var(--purple)" : "var(--accent)";
  return `<div class="summary-item"><span style="color:${color};">${icon(iconName, 28)}</span><strong>${value}</strong><span>${escapeHtml(label)}</span></div>`;
}

function renderPaperList() {
  const counts = {
    "未电子化": papers.filter((paper) => paper.status === "未电子化").length,
    "待校验": papers.filter((paper) => paper.status === "待校验").length,
    "已发布": papers.filter((paper) => paper.status === "已发布").length,
    "未启用大纲": papers.filter((paper) => paper.status === "未启用大纲").length,
    "待补归类": papers.filter((paper) => paper.status === "待补归类").length
  };
  const filtered = papers.filter((paper) => state.paperFilter === "待校验" ? true : paper.status === state.paperFilter);
  return `
    <section class="paper-list-layout">
      <aside class="status-nav">
        ${Object.entries(counts).map(([label, count]) => `
          <button class="${state.paperFilter === label ? "active" : ""}" data-paper-filter="${label}" type="button">
            ${icon(label === "已发布" ? "check" : label === "未启用大纲" ? "clock" : label === "待补归类" ? "sitemap" : "file", 20)}
            ${label}<span class="nav-count">${count}</span>
          </button>
        `).join("")}
      </aside>
      <main class="paper-list-main">
        <div class="view-title">
          <h1>试卷列表</h1>
        </div>
        <div class="toolbar">
          <span class="input-shell">${icon("search")}<input placeholder="搜索试卷" /></span>
          <label class="select-field" style="display:block;"><select data-field="teacherSubject"><option>初中化学</option><option>初中物理</option></select></label>
          <button class="primary-button" data-view="teacher-import" type="button">${icon("upload", 18)} 上传试卷</button>
        </div>
        ${
          filtered.length
            ? `<div class="table">
                <div class="table-head"><span></span><span>试卷名称</span><span>学科</span><span>状态</span><span>归类状态</span><span>操作</span></div>
                ${filtered.map((paper) => `
                  <div class="table-row">
                    <input type="checkbox" />
                    <div class="paper-row" style="grid-template-columns:42px 1fr;padding:0;border:0;min-height:auto;">
                      <span style="color:var(--accent);">${icon("file", 28)}</span>
                      <div class="list-main"><strong>${escapeHtml(paper.title)}</strong><span>上传于 ${paper.uploadedAt} ｜ ${paper.count} 题</span></div>
                    </div>
                    <span>${paper.subject}</span>
                    ${badge(paper.status)}
                    <span>${paper.classStatus === "-" ? "-" : badge(paper.classStatus)}</span>
                    <div class="row-actions">
                      <button class="icon-button" data-view="teacher-question" title="编辑" type="button">${icon("edit", 18)}</button>
                      <button class="icon-button" data-action="open-publish" title="发布" type="button">${icon("send", 18)}</button>
                      <button class="icon-button" data-action="open-confirm" data-confirm="unpublish" title="取消发布" type="button">${icon("ban", 18)}</button>
                      <button class="icon-button" data-modal="reclassify" title="补归类" type="button">${icon("sitemap", 18)}</button>
                      <button class="icon-button" data-action="open-confirm" data-confirm="delete" title="删除" type="button">${icon("trash", 18)}</button>
                    </div>
                  </div>
                `).join("")}
              </div>`
            : renderEmptyState("暂无试卷", "上传并电子化试卷后，可在这里继续编辑、发布和管理。", "上传试卷", 'data-view="teacher-import"', "file")
        }
      </main>
    </section>
  `;
}

function renderTeacherOutline() {
  if (!hasOutlines()) {
    return `
      <section class="panel" style="min-height:720px;">
        <div class="panel-header">
          <div>
            <h2>知识点大纲</h2>
            <p>当前没有知识点大纲。上传大纲后，试卷可按知识点归类，学生端才会出现知识点学习入口。</p>
          </div>
          <button class="primary-button" data-action="select-outline-file" type="button">${icon("upload", 18)} 上传大纲</button>
        </div>
        ${renderEmptyState("暂无知识点大纲", "支持 Word、TXT、Markdown 大纲文件。未上传前，导入试卷可选择“暂不使用大纲”。", "上传大纲", 'data-action="select-outline-file"', "book")}
      </section>
    `;
  }

  const activeOutline = outlines[0];
  const nodes = activeOutline.nodes?.length ? activeOutline.nodes : [{
    title: activeOutline.title,
    text: "已导入大纲文件，可继续补充知识点层级。",
    chips: [activeOutline.subject],
    active: true
  }];

  return `
    <section class="outline-layout">
      <aside class="tree-panel">
        <div class="tree-header"><h2>知识点大纲</h2><button class="icon-button" data-action="select-outline-file" type="button">${icon("plus", 18)}</button></div>
        <div class="tree-list">
          ${outlines.map((outline, index) => `<div class="tree-item ${index === 0 ? "active" : ""}">${icon("book", 18)} ${escapeHtml(outline.title)}</div>`).join("")}
          ${nodes.map((node) => `<div class="tree-item indent ${node.active ? "active" : ""}">${icon("file", 16)} ${escapeHtml(node.title)}</div>`).join("")}
        </div>
      </aside>
      <main class="outline-main">
        <div class="outline-form">
          <label class="text-field"><span class="field-label">大纲名称</span><input value="${escapeHtml(activeOutline.title)}" readonly /></label>
          <label class="select-field"><span class="field-label">所属学科</span><select><option>${escapeHtml(activeOutline.subject)}</option></select></label>
          <label class="text-field"><span class="field-label">上传者</span><input value="${escapeHtml(activeOutline.uploader)}" readonly /></label>
        </div>
        <div class="outline-editor-panel">
          <div class="outline-toolbar">
            ${["plus", "x", "chevron", "down", "list", "edit", "layers"].map((item) => `<button class="icon-button" type="button">${icon(item, 18)}</button>`).join("")}
          </div>
          <div class="outline-content">
            ${nodes.map((node) => renderOutlineNode(node.title, node.text, node.chips || [], node.active)).join("")}
          </div>
        </div>
        <div style="display:flex;justify-content:flex-end;gap:14px;margin-top:18px;">
          <button class="primary-button" data-action="save-outline" type="button">保存</button>
          <button class="secondary-button" data-view="home" type="button">取消</button>
        </div>
      </main>
    </section>
  `;
}

function renderOutlineNode(title, text, chips, active) {
  return `
    <div class="outline-node ${active ? "active" : ""}">
      <strong>${escapeHtml(title)}</strong>
      ${text ? `<p>${escapeHtml(text)}</p>` : ""}
      ${chips.length ? `<div class="chip-row">${chips.map((chip) => `<span class="chip">${escapeHtml(chip)}</span>`).join("")}</div>` : ""}
    </div>
  `;
}

function renderTeacherQuestion() {
  const q = currentQuestion();
  if (!q) {
    return `
      <section class="panel" style="min-height:720px;">
        <div class="panel-header">
          <div>
            <h2>题目编辑</h2>
            <p>当前没有题目数据。这里先保留编辑器入口，后续接入解析或 API 后会展示题干、选项、答案和解析。</p>
          </div>
          <button class="primary-button" data-view="teacher-import" type="button">${icon("upload", 18)} 上传试卷</button>
        </div>
        ${renderEmptyState("暂无题目", "空 UI 模式不会内置题库。可以先浏览试卷上传、解析进度、发布校验等界面。", "返回试卷管理", 'data-view="teacher-list"', "file")}
      </section>
    `;
  }
  return `
    <section class="question-editor">
      <aside class="question-nav">
        <div class="question-nav-head"><span>题目列表 ${questionBank.length}</span><span>${icon("search", 18)}</span></div>
        <div class="question-list">
          ${questionBank.map((question, index) => {
            const displayStatus = question.status;
            const hasIssue = !["已保存", "已发布"].includes(displayStatus);
            return `
              <button class="question-nav-row ${state.activeQuestion === index ? "active" : ""}" data-question-index="${index}" type="button">
                <strong>${String(question.number).padStart(2, "0")}</strong>
                ${badge(displayStatus)}
                ${hasIssue ? icon("warning", 16) : '<span style="width:10px;height:10px;border-radius:999px;background:var(--accent);"></span>'}
              </button>
            `;
          }).join("")}
        </div>
      </aside>
      <main class="editor-workspace">
        <section class="preview-panel">
          <div class="preview-toolbar"><span>原文 / 截图预览</span><span>${icon("search", 18)} ${icon("search", 18)} ${icon("plus", 18)} 100% ${icon("down", 18)}</span></div>
          <div class="paper-preview"><div class="paper-preview-content">${q.number}. ${escapeHtml(q.stem)}（　）<br />A. ${escapeHtml(q.options[0])}　　　　B. ${escapeHtml(q.options[1])}<br />C. ${escapeHtml(q.options[2])}　　　　D. ${escapeHtml(q.options[3])}</div></div>
        </section>
        <section class="editor-form-grid">
          <div class="panel form-panel">
            <label class="textarea-field"><span class="field-label">题干 *</span><textarea data-question-field="stem">${escapeHtml(q.stem)}</textarea></label>
            <div class="option-editor">
              <span class="field-label">选项 *</span>
              ${q.options.map((option, index) => `<label class="option-line"><span>${"ABCD"[index]}</span><input data-option-index="${index}" value="${escapeHtml(option)}" /><button type="button">${icon("x", 16)}</button></label>`).join("")}
              <button class="secondary-button small-button" type="button">${icon("plus", 16)} 添加选项</button>
            </div>
          </div>
          <div class="panel form-panel">
            <label class="select-field"><span class="field-label">正确答案 *</span><select data-question-field="answer"><option value="" ${q.answer ? "" : "selected"}>未选择</option>${["A", "B", "C", "D", "AC", "ABC"].map((item) => `<option value="${item}" ${q.answer === item ? "selected" : ""}>${item}</option>`).join("")}</select></label>
            <label class="select-field"><span class="field-label">知识点</span><select data-question-field="knowledge"><option>${escapeHtml(q.knowledge)}</option><option>化学实验 / 气体制备</option><option>离子反应 / 方程式书写</option></select></label>
            <label class="textarea-field"><span class="field-label">解析 *</span><textarea data-question-field="explanation">${escapeHtml(q.explanation)}</textarea></label>
            <label class="select-field"><span class="field-label">题目难度</span><select data-question-field="difficulty">${["极易", "易", "中等", "难", "极难"].map((item) => `<option ${q.difficulty === item ? "selected" : ""}>${item}</option>`).join("")}</select></label>
          </div>
        </section>
        <div style="display:flex;justify-content:flex-end;gap:14px;">
          <button class="secondary-button" data-action="next-edit-question" type="button">下一题</button>
          <button class="secondary-button" type="button">取消</button>
          <button class="primary-button" data-action="save-question" type="button">${icon("file", 18)} 保存并审核</button>
          <button class="primary-button" data-action="open-publish" type="button">${icon("send", 18)} 发布</button>
        </div>
      </main>
    </section>
  `;
}

function renderModal() {
  if (!state.modal) {
    modalRoot.innerHTML = "";
    return;
  }
  const content = {
    auth: renderAuthModal,
    answerFile: renderAnswerFileModal,
    publish: renderPublishModal,
    reclassify: renderReclassifyModal,
    bank: renderBankModal,
    confirm: renderConfirmModal
  }[state.modal]?.();
  modalRoot.innerHTML = content || "";
}

function renderModalShell(title, body, footer, size = "") {
  return `
    <div class="modal-backdrop">
      <section class="modal ${size}" role="dialog" aria-modal="true" aria-label="${escapeHtml(title)}" data-modal-panel>
        <header class="modal-header">
          <h2>${escapeHtml(title)}</h2>
          <button class="close-button" data-action="close-modal" type="button">×</button>
        </header>
        <div class="modal-body">${body}</div>
        ${footer ? `<footer class="modal-footer">${footer}</footer>` : ""}
      </section>
    </div>
  `;
}

function renderAuthModal() {
  const body = `
    <div class="tabs">
      <button class="${state.authMode === "login" ? "active" : ""}" data-auth-mode="login" type="button">登录</button>
      <button class="${state.authMode === "register" ? "active" : ""}" data-auth-mode="register" type="button">注册</button>
    </div>
    <div class="field">
      <span>身份</span>
      <div class="role-grid">
        ${["student", "teacher"].map((role) => `
          <button class="role-card ${state.selectedRole === role ? "active" : ""}" data-role="${role}" type="button">
            ${icon("user", 22)} <strong>${roleLabel(role)}</strong><span class="check-dot"></span>
          </button>
        `).join("")}
      </div>
    </div>
    ${
      state.authMode === "login"
        ? users.length
          ? `<label class="field"><span class="input-shell">${icon("search")}<input data-field="searchUser" value="${escapeHtml(state.searchUser)}" placeholder="搜索姓名" /></span></label><div class="field"><span>最近登录</span><div class="recent-list">${visibleUsers().map((user) => renderRecentUser(user)).join("")}</div></div>`
          : renderEmptyState("暂无本地账号", "请先创建学生或教师账号。", "创建本地账号", 'data-auth-mode="register"', "user")
        : `<label class="field"><span>姓名</span><span class="input-shell">${icon("user")}<input data-field="registerName" value="${escapeHtml(state.registerName)}" placeholder="请输入姓名" /></span></label>`
    }
  `;
  const footer = `<button class="secondary-button" data-action="close-modal" type="button">取消</button><button class="primary-button" data-action="${state.authMode === "login" ? "login-from-form" : "register-from-form"}" type="button">确认进入</button>`;
  return renderModalShell("登录 / 注册", body, footer, "medium");
}

function renderAnswerFileModal() {
  const body = `
    <div class="upload-mini-zone" data-action="select-answer-file">
      <span style="color:var(--accent);">${icon("upload", 56)}</span>
      <strong>拖拽或点击上传答案文件</strong>
      <span>支持 Word / TXT / PDF</span>
    </div>
    ${
      state.answerFile
        ? `<div class="modal-file-row">
            <span class="list-icon">${icon("file", 22)}</span>
            <div class="list-main"><strong>${escapeHtml(state.answerFile)}</strong><span>已选择</span></div>
            <button class="icon-button" data-action="clear-answer-file" type="button">${icon("x", 18)}</button>
          </div>`
        : ""
    }
  `;
  const footer = `<button class="secondary-button" data-action="close-modal" type="button">取消</button><button class="primary-button" data-action="confirm-answer-file" type="button">确认</button>`;
  return renderModalShell("答案文件上传", body, footer, "medium");
}

function renderPublishModal() {
  const stats = questionReviewStats();
  const prohibited = [
    ["无题目", stats.questionCount ? 0 : 1],
    ["缺题干", stats.stemMissingCount],
    ["缺答案", stats.missingAnswerCount],
    ["选项异常", stats.optionIssueCount],
    ["答案无法匹配", stats.answerWarnings],
    ["未校验", stats.pendingReviewCount]
  ].filter(([, count]) => count > 0);
  const warnings = [
    ["归类 / 大纲待处理", stats.unclassifiedCount]
  ].filter(([, count]) => count > 0);
  const prohibitedTotal = prohibited.reduce((total, [, count]) => total + count, 0);
  const warningTotal = warnings.reduce((total, [, count]) => total + count, 0);
  const body = `
    <div class="summary-card">
      <div><span class="list-icon">${icon("file", 24)}</span><div><span class="meta-line">试卷名称</span><strong>${escapeHtml(state.parseResult?.summary?.files?.[0] || "当前试卷")}</strong></div></div>
      <div><span class="list-icon">${icon("chart", 24)}</span><div><span class="meta-line">题目总数</span><strong>${stats.questionCount} 题</strong></div></div>
    </div>
    <div class="validation-grid">
      <section class="validation-group">
        <div class="validation-title danger"><span>${icon("warning", 18)} 禁止项（存在以下问题将无法发布）</span><strong>${prohibitedTotal}</strong></div>
        ${prohibited.length ? prohibited.map(([label, count]) => `<div class="validation-row"><span style="color:var(--red);">${icon("x", 16)}</span><span>${label}</span><strong>${count} 题</strong></div>`).join("") : '<div class="validation-row"><span style="color:var(--green);">' + icon("check", 16) + '</span><span>无禁止项</span><strong>0 题</strong></div>'}
      </section>
      <section class="validation-group">
        <div class="validation-title warning"><span>${icon("warning", 18)} 警告项（可继续发布，建议优化）</span><strong>${warningTotal}</strong></div>
        ${warnings.length ? warnings.map(([label, count]) => `<div class="validation-row"><span style="color:var(--orange);">${icon("warning", 16)}</span><span>${label}</span><strong>${count} 题</strong></div>`).join("") : '<div class="validation-row"><span style="color:var(--green);">' + icon("check", 16) + '</span><span>无警告项</span><strong>0 题</strong></div>'}
      </section>
    </div>
  `;
  const footer = `<button class="secondary-button" data-action="close-modal" type="button">取消</button><button class="primary-button" ${prohibitedTotal ? "disabled" : ""} type="button">${icon("send", 18)} 发布</button>`;
  return renderModalShell("发布校验", body, footer, "large");
}

function renderReclassifyModal() {
  const rows = papers
    .filter((paper) => paper.status === "待补归类" || paper.classStatus === "归类失败" || paper.classStatus === "归类待确认")
    .map((paper) => [paper.title, paper.count, paper.uploadedAt, paper.classStatus || "待补归类", true]);

  if (!hasOutlines() || !rows.length) {
    const title = hasOutlines() ? "暂无可补归类试卷" : "暂无知识点大纲";
    const text = hasOutlines()
      ? "当前没有需要重新归类的试卷。"
      : "上传知识点大纲后，才能对试卷执行补归类。";
    const body = renderEmptyState(title, text, hasOutlines() ? "上传试卷" : "上传大纲", hasOutlines() ? 'data-view="teacher-import"' : 'data-action="select-outline-file"', "sitemap");
    const footer = `<button class="secondary-button" data-action="close-modal" type="button">关闭</button>`;
    return renderModalShell("试卷补归类", body, footer, "medium");
  }

  const body = `
    <div class="option-grid">
      <label class="select-field"><span class="field-label">学科选择</span><select><option>初中化学</option><option>初中物理</option></select></label>
      <label class="select-field"><span class="field-label">目标知识点大纲</span><select>${outlines.map((outline) => `<option>${escapeHtml(outline.title || outline.name)}</option>`).join("")}</select></label>
    </div>
    <div class="field"><span>可补归类试卷</span>
      <div class="data-table">
        <div class="data-table-row head"><span><input type="checkbox" checked /></span><span>试卷名称</span><span>题目数</span><span>上次处理时间</span><span>当前状态</span><span></span></div>
        ${rows.map(([name, count, date, status, checked]) => `<div class="data-table-row"><span><input type="checkbox" ${checked ? "checked" : ""} /></span><span>${icon("file", 18)} ${name}</span><span>${count} 题</span><span>${date}</span><span>${badge(status)}</span><span>${icon("chevron", 16)}</span></div>`).join("")}
      </div>
    </div>
  `;
  const footer = `<button class="secondary-button" data-action="close-modal" type="button">稍后处理</button><button class="primary-button" data-action="start-reclassify" type="button">开始归类</button>`;
  return renderModalShell("试卷补归类", body, footer, "large");
}

function renderBankModal() {
  const rows = papers.filter((paper) => paper.status === "已发布");

  if (!rows.length) {
    const body = renderEmptyState("暂无已发布试卷", "发布试卷后，学生端才会出现对应练习来源。", "上传试卷", 'data-view="teacher-import"', "layers");
    const footer = `<button class="secondary-button" data-action="close-modal" type="button">关闭</button>`;
    return renderModalShell("练习来源", body, footer, "medium");
  }

  const body = `
    <div class="option-grid">
      <label class="select-field"><span class="field-label">学科选择</span><select><option>初中化学</option><option>初中物理</option></select></label>
      <label class="text-field"><span class="field-label">练习来源名称</span><input placeholder="请输入名称" /></label>
    </div>
    <div class="field"><span>已发布试卷</span>
      <div class="data-table">
        <div class="data-table-row head" style="grid-template-columns:42px 1.4fr .7fr .9fr .7fr;"><span><input type="checkbox" checked /></span><span>试卷名称</span><span>题目数</span><span>发布时间</span><span>状态</span></div>
        ${rows.map((paper) => `<div class="data-table-row" style="grid-template-columns:42px 1.4fr .7fr .9fr .7fr;"><span><input type="checkbox" checked /></span><span>${icon("file", 18)} ${escapeHtml(paper.title)}</span><span>${paper.count} 题</span><span>${paper.uploadedAt}</span><span>${badge("已发布")}</span></div>`).join("")}
      </div>
    </div>
    <div class="info-band" style="margin:0;">${icon("warning", 16)} 学生端练习来源会同步所选已发布试卷。</div>
  `;
  const footer = `<button class="secondary-button" data-action="close-modal" type="button">取消</button><button class="primary-button" data-action="save-bank" type="button">保存</button>`;
  return renderModalShell("练习来源", body, footer, "large");
}

function renderConfirmModal() {
  const isDelete = state.confirmMode === "delete";
  const body = `
    <div class="tabs" style="margin-bottom:10px;">
      <button class="${!isDelete ? "active" : ""}" data-confirm-tab="unpublish" type="button">取消发布</button>
      <button class="${isDelete ? "active" : ""}" data-confirm-tab="delete" type="button">删除</button>
    </div>
    <div class="confirm-visual">
      <div><span class="soft-icon">${icon("layers", 34)}</span><strong>学生端练习</strong></div>
      <div style="color:var(--accent);">${icon("chevron", 34)}</div>
      <div><span class="soft-icon">${icon("layers", 34)}</span><strong>已发布试卷</strong></div>
    </div>
    <p style="line-height:1.8;color:#344054;">该试卷将从学生端练习入口中移除，学生侧将不再可见。</p>
  `;
  const footer = `<button class="secondary-button" data-action="close-modal" type="button">取消</button><button class="${isDelete ? "danger-button" : "primary-button"}" data-action="confirm-operation" type="button">确认操作</button>`;
  return renderModalShell("操作确认", body, footer, "medium");
}

function loginAs(user) {
  state.user = user;
  state.view = "home";
  state.modal = null;
  render();
}

function loginFromForm() {
  const existing = visibleUsers()[0] || users.find((item) => item.role === state.selectedRole);
  if (!existing) {
    state.authMode = "register";
    state.modal = null;
    showToast("暂无本地账号，请先创建账号");
    render();
    return;
  }
  loginAs(existing);
}

function registerFromForm() {
  const name = state.registerName.trim() || (state.selectedRole === "teacher" ? "新老师" : "新同学");
  loginAs({
    id: `u-${Date.now()}`,
    name,
    role: state.selectedRole,
    initial: name.slice(0, 1).toUpperCase()
  });
}

function selectPaperFiles() {
  const input = document.createElement("input");
  input.type = "file";
  input.multiple = true;
  input.accept = ".pdf,.doc,.docx,.txt";
  input.onchange = () => {
    state.uploadFiles = Array.from(input.files || []);
    render();
  };
  input.click();
}

function selectAnswerFile() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".pdf,.doc,.docx,.txt";
  input.onchange = () => {
    const file = input.files?.[0];
    state.answerFile = file?.name || state.answerFile;
    render();
  };
  input.click();
}

function selectOutlineFile() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".doc,.docx,.md,.txt";
  input.onchange = () => {
    if (input.files?.[0]) {
      const outline = addOutlineFromFile(input.files[0]);
      showToast(`已上传大纲：${outline.title}`);
    }
    render();
  };
  input.click();
}

async function startDigitize() {
  if (!state.uploadFiles.length) {
    showToast("请先上传试卷文件");
    return;
  }
  if (state.answerMode === "file" && !state.answerFile) {
    state.modal = "answerFile";
    render();
    return;
  }

  state.view = "parse";
  state.modal = null;
  render();

  const payload = {
    files: state.uploadFiles.map((file) => (typeof file === "string" ? file : file.name)),
    answerMode: state.answerMode,
    outlineMode: state.outlineMode,
    subject: state.teacherSubject,
    answerFile: state.answerFile
  };

  state.parseResult = createEmptyParseResult(payload);
  render();
}

function updateQuestionField(target) {
  const q = currentQuestion();
  if (!q) return;
  const field = target.dataset.questionField;
  if (!field) return;
  q[field] = target.value;
}

function updateOption(target) {
  const q = currentQuestion();
  if (!q) return;
  const index = Number(target.dataset.optionIndex);
  if (Number.isFinite(index)) q.options[index] = target.value;
}

function render() {
  app.innerHTML = state.user ? renderAppShell() : renderHome();
  renderModal();
}

document.addEventListener("click", (event) => {
  const modalPanel = event.target.closest("[data-modal-panel]");
  const actionTarget = event.target.closest("[data-action], [data-view], [data-auth-mode], [data-role], [data-user-id], [data-choice-field], [data-paper-filter], [data-question-index], [data-modal], [data-confirm-tab], [data-answer]");
  if (!actionTarget) return;

  if (actionTarget.dataset.modalPanel) return;
  if (event.target.classList.contains("modal-backdrop") && !modalPanel) {
    state.modal = null;
    render();
    return;
  }

  const { action, view, authMode, role, userId, choiceField, choiceValue, paperFilter, questionIndex, modal, confirmTab, answer } = actionTarget.dataset;

  if (authMode) {
    state.authMode = authMode;
    render();
    return;
  }

  if (role) {
    state.selectedRole = role;
    render();
    return;
  }

  if (userId) {
    const user = users.find((item) => item.id === userId);
    if (user) loginAs(user);
    return;
  }

  if (view) {
    if (view === "practice") {
      state.practiceMode = "顺序刷题";
      state.submitted = false;
      state.selectedAnswer = "";
    }
    if (view === "teacher-bank") {
      state.modal = "bank";
    } else {
      state.view = view;
    }
    render();
    return;
  }

  if (choiceField) {
    state[choiceField] = choiceValue;
    render();
    return;
  }

  if (paperFilter) {
    state.paperFilter = paperFilter;
    render();
    return;
  }

  if (questionIndex !== undefined) {
    state.activeQuestion = clampQuestionIndex(Number(questionIndex));
    render();
    return;
  }

  if (modal) {
    state.modal = modal;
    render();
    return;
  }

  if (confirmTab) {
    state.confirmMode = confirmTab;
    render();
    return;
  }

  if (answer) {
    if (!state.submitted) state.selectedAnswer = answer;
    render();
    return;
  }

  switch (action) {
    case "open-auth-modal":
      state.modal = "auth";
      render();
      break;
    case "login-from-form":
      loginFromForm();
      break;
    case "register-from-form":
      registerFromForm();
      break;
    case "logout":
      state.user = null;
      state.view = "home";
      render();
      break;
    case "close-modal":
      state.modal = null;
      render();
      break;
    case "select-paper-files":
      event.preventDefault();
      selectPaperFiles();
      break;
    case "remove-file":
      state.uploadFiles = [];
      render();
      break;
    case "open-answer-file":
      state.modal = "answerFile";
      render();
      break;
    case "select-answer-file":
      selectAnswerFile();
      break;
    case "select-outline-file":
      selectOutlineFile();
      break;
    case "clear-answer-file":
      state.answerFile = "";
      render();
      break;
    case "confirm-answer-file":
      if (!state.answerFile) {
        showToast("请先选择答案文件");
      } else {
        state.modal = null;
        render();
      }
      break;
    case "digitize":
      startDigitize();
      break;
    case "open-publish":
      state.modal = "publish";
      render();
      break;
    case "open-confirm":
      state.confirmMode = actionTarget.dataset.confirm || "unpublish";
      state.modal = "confirm";
      render();
      break;
    case "confirm-operation":
      state.modal = null;
      showToast(state.confirmMode === "delete" ? "已删除试卷并同步学生端练习" : "已取消发布并同步学生端练习");
      render();
      break;
    case "save-bank":
      state.modal = null;
      showToast("学生端练习来源已更新");
      render();
      break;
    case "start-reclassify":
      state.modal = null;
      state.view = "parse";
      showToast("已进入轻量补归类进度");
      render();
      break;
    case "save-outline":
      if (outlines[0]) outlines[0].updated = formatLocalMinute();
      state.modal = null;
      showToast("知识点大纲已保存");
      render();
      break;
    case "save-question":
      saveCurrentQuestion();
      break;
    case "start-practice":
      state.practiceMode = actionTarget.dataset.mode || "顺序刷题";
      state.view = "practice";
      state.activeQuestion = 0;
      state.selectedAnswer = "";
      state.submitted = false;
      render();
      break;
    case "submit-answer":
      if (!state.selectedAnswer) {
        showToast("请先选择答案");
      } else {
        state.submitted = true;
        render();
      }
      break;
    case "next-question":
      state.activeQuestion = clampQuestionIndex(state.activeQuestion + 1);
      state.submitted = false;
      state.selectedAnswer = "";
      showToast("已切换到下一题");
      render();
      break;
    case "prev-question":
      state.activeQuestion = clampQuestionIndex(state.activeQuestion - 1);
      state.submitted = false;
      state.selectedAnswer = "";
      showToast("已回到上一题，可重新作答");
      render();
      break;
    case "toggle-favorite":
      state.favorite = !state.favorite;
      render();
      break;
    case "set-knowledge-sort":
      state.knowledgeSort = actionTarget.dataset.sort;
      render();
      break;
    case "prev-edit-question":
      state.activeQuestion = clampQuestionIndex(state.activeQuestion - 1);
      render();
      break;
    case "next-edit-question":
      state.activeQuestion = clampQuestionIndex(state.activeQuestion + 1);
      render();
      break;
    default:
      break;
  }
});

document.addEventListener("change", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement)) return;
  const field = target.dataset.field;
  if (field) {
    state[field] = target.value;
    render();
  }
  updateQuestionField(target);
  updateOption(target);
});

document.addEventListener("input", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;
  const field = target.dataset.field;
  if (field) state[field] = target.value;
  updateQuestionField(target);
  updateOption(target);
});

document.addEventListener("keydown", (event) => {
  if (!state.user || state.view !== "practice") return;
  if (event.key === "ArrowRight") {
    state.activeQuestion = clampQuestionIndex(state.activeQuestion + 1);
    state.selectedAnswer = "";
    state.submitted = false;
    showToast("已切换到下一题");
    render();
  }
  if (event.key === "ArrowLeft") {
    state.activeQuestion = clampQuestionIndex(state.activeQuestion - 1);
    state.selectedAnswer = "";
    state.submitted = false;
    showToast("已回到上一题，可重新作答");
    render();
  }
});

document.addEventListener("dragover", (event) => {
  const dropzone = event.target.closest(".dropzone");
  if (!dropzone) return;
  event.preventDefault();
  dropzone.classList.add("dragging");
});

document.addEventListener("dragleave", (event) => {
  const dropzone = event.target.closest(".dropzone");
  if (!dropzone) return;
  dropzone.classList.remove("dragging");
});

document.addEventListener("drop", (event) => {
  const dropzone = event.target.closest(".dropzone");
  if (!dropzone) return;
  event.preventDefault();
  dropzone.classList.remove("dragging");
  const files = Array.from(event.dataTransfer.files || []);
  if (!files.length) return;
  if (state.modal === "answerFile" || state.answerMode === "file") {
    state.answerFile = files[0].name;
  } else {
    state.uploadFiles = files;
  }
  render();
});

render();
