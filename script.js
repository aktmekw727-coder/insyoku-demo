/* =========================================================
   焼肉 陣力 - 営業デモサイト スクリプト
   すべてダミーデータ / 条件分岐のみ / 外部通信なし
   ========================================================= */

/* ---------- ダミーデータ ---------- */

const CATEGORIES = [
  { label: "焼肉メニュー", desc: "牛・豚・鶏・ホルモン", icon: "flame", image: "karubi", tab: "karubi" },
  { label: "盛り合わせ・セット", desc: "セットメニュー", icon: "plates", image: "family-set", tab: "moriawase" },
  { label: "ランチメニュー", desc: "ご飯・麺", icon: "bowl", image: "bara-don", tab: "lunch" },
  { label: "一品料理・ご飯・麺", desc: "サイドメニュー", icon: "noodle", image: "ippin", tab: "gohan" },
  { label: "お子様メニュー", desc: "ご家族みんなで", icon: "kids", image: "kids-menu", tab: "" },
];

const RECOMMEND_ITEMS = [
  { name: "陣力カルビ", price: "¥1,200", desc: "和牛の旨みを堪能できる、人気No.1カルビ", image: "karubi" },
  { name: "特選カルビ", price: "¥3,200", desc: "サシの入った贅沢な一枚", image: "tokusen-karubi" },
  { name: "上タン塩", price: "¥1,600", desc: "まずはこれ。陣力の定番", image: "tongue" },
  { name: "ハラミ", price: "¥1,200", desc: "柔らかく旨みたっぷりの人気部位", image: "harami" },
  { name: "黒豚バラ焼", price: "¥830", desc: "鹿屋の黒豚を炭火で香ばしく", image: "kurobuta" },
  { name: "ファミリーセット", price: "¥7,000", desc: "家族みんなで楽しめる人気のセット", image: "family-set" },
  { name: "鹿屋黒豚ばら丼", price: "¥1,300", desc: "ランチで人気の黒豚ばら丼", image: "bara-don" },
];

const MENU_TABS = [
  { id: "karubi", label: "カルビ", items: [
    { name: "陣力カルビ", price: "¥1,200" },
    { name: "特選カルビ", price: "¥3,200" },
    { name: "上カルビ", price: "¥1,800" },
  ]},
  { id: "rosu", label: "ロース", items: [
    { name: "上ロース", price: "¥1,800" },
    { name: "ロース", price: "¥1,200" },
  ]},
  { id: "tan", label: "タン", items: [
    { name: "上タン塩", price: "¥1,600" },
    { name: "タン先", price: "¥980" },
  ]},
  { id: "harami", label: "ハラミ", items: [
    { name: "ハラミ", price: "¥1,200" },
    { name: "特選ハラミ", price: "¥1,800" },
  ]},
  { id: "horumon", label: "ホルモン", items: [
    { name: "陣力ホルモン", price: "¥780" },
    { name: "ミノ", price: "¥680" },
  ]},
  { id: "buta", label: "豚肉", items: [
    { name: "黒豚バラ焼", price: "¥830" },
    { name: "黒豚トロロース", price: "¥980" },
  ]},
  { id: "tori", label: "鶏", items: [
    { name: "若鶏もも", price: "¥780" },
    { name: "手羽先", price: "¥580" },
  ]},
  { id: "kaisen", label: "海鮮", items: [
    { name: "イカ", price: "¥780" },
    { name: "エビ", price: "¥880" },
  ]},
  { id: "yasai", label: "野菜", items: [
    { name: "野菜盛り合わせ", price: "¥580" },
    { name: "焼きねぎ", price: "¥380" },
  ]},
  { id: "salad", label: "サラダ", items: [
    { name: "陣力サラダ", price: "¥580" },
    { name: "トマトサラダ", price: "¥480" },
  ]},
  { id: "kimuchi", label: "キムチ・ナムル", items: [
    { name: "キムチ盛り合わせ", price: "¥480" },
    { name: "ナムル", price: "¥380" },
  ]},
  { id: "gohan", label: "ご飯・麺", items: [
    { name: "鹿屋黒豚ばら丼", price: "¥1,300" },
    { name: "クッパ", price: "¥680" },
    { name: "冷麺", price: "¥780" },
  ]},
  { id: "moriawase", label: "盛り合わせ", items: [
    { name: "カルビ&タン盛り合わせ", price: "¥2,400" },
    { name: "4種盛り", price: "¥3,000" },
  ]},
  { id: "set", label: "セット", items: [
    { name: "ファミリーセット", price: "¥7,000" },
    { name: "陣力コース", price: "¥4,500" },
  ]},
  { id: "lunch", label: "ランチ", items: [
    { name: "黒豚ばら丼ランチ", price: "¥1,300" },
    { name: "カルビランチ", price: "¥1,200" },
    { name: "ロースランチ", price: "¥1,300" },
  ]},
];

const ITEM_PRICES = {};
MENU_TABS.forEach((tab) => tab.items.forEach((item) => (ITEM_PRICES[item.name] = item.price)));
RECOMMEND_ITEMS.forEach((item) => (ITEM_PRICES[item.name] = item.price));
ITEM_PRICES["お子様メニュー"] = "¥600〜";
ITEM_PRICES["4種盛り"] = "¥3,000";

/* ---------- 診断の質問 ---------- */

const DIAG_QUESTIONS = [
  {
    key: "people",
    text: "人数は？",
    options: [
      { label: "1人", value: "1" },
      { label: "2人", value: "2" },
      { label: "3〜4人", value: "mid" },
      { label: "5人以上", value: "big" },
    ],
  },
  {
    key: "mood",
    text: "今日の気分は？",
    options: [
      { label: "とにかく肉を食べたい", value: "meat" },
      { label: "家族で楽しみたい", value: "family" },
      { label: "少し贅沢したい", value: "luxury" },
      { label: "いろいろ食べたい", value: "variety" },
    ],
  },
  {
    key: "budget",
    text: "予算は？",
    options: [
      { label: "〜3,000円", value: "low" },
      { label: "3,000〜5,000円", value: "mid" },
      { label: "5,000〜8,000円", value: "high" },
      { label: "8,000円以上", value: "premium" },
    ],
  },
];

const peopleLabel = (people) => ({ "1": "1人", "2": "2人", mid: "3〜4人", big: "5人以上" }[people]);

/* 人数・気分・予算から「おすすめの組み合わせ」を条件分岐で組み立てる */
function buildRecommendation({ people, mood, budget }) {
  if (people === "1") {
    const items = ["鹿屋黒豚ばら丼"];
    let comment = "ランチにもひとり飲みにもぴったりな一杯。がっつり派なら上タン塩をプラスしても◎";
    if (mood === "luxury" || budget === "high" || budget === "premium") {
      items.push("上タン塩");
      comment = "一人でも、ちょっと贅沢に。黒豚ばら丼と上タン塩の組み合わせが人気です";
    }
    return { title: "1人ランチ・ひとり飲みなら", items, comment };
  }

  const label = peopleLabel(people);
  let title = "";
  let items = [];
  let comment = "";

  if (mood === "family" || people === "big") {
    title = people === "big" ? `${label}のご家族・グループなら` : `${label}で家族利用なら`;
    items = ["ファミリーセット", "上タン塩", "お子様メニュー"];
    comment =
      people === "big"
        ? "大人数でも取り分けやすい構成。お子様連れのご家族にも人気です"
        : "家族みんなで楽しめる、陣力の人気No.1コースです";
  } else if (mood === "luxury") {
    title = `${label}で少し贅沢したいなら`;
    items = people === "2" ? ["特選カルビ", "上タン塩", "ハラミ"] : ["特選カルビ", "上タン塩", "ハラミ", "陣力カルビ"];
    comment = "サシの入った特選カルビを中心に、ちょっと贅沢な組み合わせです";
  } else if (mood === "meat") {
    title = `${label}でガッツリ肉を楽しむなら`;
    items = people === "mid" ? ["陣力カルビ", "ハラミ", "黒豚バラ焼", "カルビ&タン盛り合わせ"] : ["陣力カルビ", "ハラミ", "黒豚バラ焼"];
    comment = "とにかく肉!という日はこの組み合わせで間違いなしです";
  } else {
    title = `${label}でいろいろ楽しむなら`;
    items = ["陣力カルビ", "上タン塩", "4種盛り"];
    comment = "色々な部位を少しずつ。初めての方にもおすすめの組み合わせです";
  }

  if (budget === "low") {
    items = items.filter((i) => i !== "特選カルビ" && i !== "ファミリーセット");
    if (items.length === 0) items = ["陣力カルビ", "上タン塩"];
    comment += "（予算に合わせて品数を調整しています）";
  }

  return { title, items, comment };
}

/* ---------- アイコン ---------- */

function iconSvg(name) {
  return `<svg class="icon" aria-hidden="true"><use href="#icon-${name}"></use></svg>`;
}

/* ---------- 写真プレースホルダー生成 ---------- */

function photoHtml(slug, caption, extraClass) {
  return `
    <div class="photo ${extraClass || ""}" data-caption="${caption}">
      <img src="assets/images/${slug}.jpg" alt="${caption}" loading="lazy" onerror="this.remove()">
    </div>`;
}

/* ---------- ヘッダー: モバイルナビ ---------- */

const navToggle = document.getElementById("nav-toggle");
const navMobile = document.getElementById("nav-mobile");

navToggle.addEventListener("click", () => {
  navMobile.classList.toggle("open");
});

navMobile.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => navMobile.classList.remove("open"))
);

/* ---------- カテゴリカード ---------- */

function renderCategories() {
  const el = document.getElementById("category-grid");
  el.innerHTML = CATEGORIES.map(
    (c, i) => `
    <button class="category-card" data-tab="${c.tab || ""}" data-index="${i}">
      ${photoHtml(c.image, c.label)}
      <span class="category-body">
        <span class="category-icon">${iconSvg(c.icon)}</span>
        <span>
          <span class="category-label">${c.label}</span>
          <div class="category-desc">${c.desc}</div>
        </span>
      </span>
    </button>`
  ).join("");

  el.querySelectorAll(".category-card").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.getAttribute("data-tab");
      if (tab) {
        document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
        activateTab(tab);
      } else {
        document.getElementById("family-appeal").scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

/* ---------- おすすめカード ---------- */

function renderRecommend() {
  const el = document.getElementById("recommend-grid");
  el.innerHTML = RECOMMEND_ITEMS.map(
    (item) => `
    <div class="dish-card">
      ${photoHtml(item.image, item.name, "photo--card")}
      <div class="dish-body">
        <div class="dish-name-row">
          <span class="dish-name">${item.name}</span>
          <span class="dish-price">${item.price}</span>
        </div>
        <p class="dish-desc">${item.desc}</p>
      </div>
    </div>`
  ).join("");
}

/* ---------- メニュー詳細タブ ---------- */

function renderMenuTabs() {
  const tabBar = document.getElementById("tab-bar");
  const panels = document.getElementById("tab-panels");

  tabBar.innerHTML = MENU_TABS.map(
    (tab, i) => `<button class="tab-chip${i === 0 ? " active" : ""}" data-tab="${tab.id}">${tab.label}</button>`
  ).join("");

  panels.innerHTML = MENU_TABS.map(
    (tab, i) => `
    <div class="tab-panel${i === 0 ? " active" : ""}" id="panel-${tab.id}">
      ${tab.items
        .map(
          (item) => `
        <div class="menu-row">
          <span class="menu-row-name">${item.name}</span>
          <span class="menu-row-price">${item.price}</span>
        </div>`
        )
        .join("")}
    </div>`
  ).join("");

  tabBar.querySelectorAll(".tab-chip").forEach((btn) => {
    btn.addEventListener("click", () => activateTab(btn.getAttribute("data-tab")));
  });
}

function activateTab(tabId) {
  document.querySelectorAll(".tab-chip").forEach((b) => b.classList.toggle("active", b.getAttribute("data-tab") === tabId));
  document.querySelectorAll(".tab-panel").forEach((p) => p.classList.toggle("active", p.id === `panel-${tabId}`));
  const chip = document.querySelector(`.tab-chip[data-tab="${tabId}"]`);
  if (chip) chip.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
}

/* ---------- 診断ウィジェット ---------- */

let diagState = {};
let diagStep = 0;

function resetDiagnosis() {
  diagState = {};
  diagStep = 0;
  document.getElementById("diag-result").hidden = true;
  document.getElementById("diag-question").hidden = false;
  document.getElementById("diag-progress").hidden = false;
  renderDiagQuestion();
}

function renderDiagQuestion() {
  const q = DIAG_QUESTIONS[diagStep];
  const el = document.getElementById("diag-question");
  el.innerHTML = `
    <p class="q-text">${q.text}</p>
    <div class="q-options">
      ${q.options.map((opt) => `<button class="option-btn" data-value="${opt.value}">${opt.label}</button>`).join("")}
    </div>`;

  el.querySelectorAll(".option-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      diagState[q.key] = btn.getAttribute("data-value");
      diagStep++;
      updateDiagProgress();
      if (diagStep < DIAG_QUESTIONS.length) {
        renderDiagQuestion();
      } else {
        renderDiagResult();
      }
    });
  });
}

function updateDiagProgress() {
  document.querySelectorAll("#diag-progress .dot").forEach((dot, i) => dot.classList.toggle("active", i <= diagStep));
}

function renderDiagResult() {
  const { title, items, comment } = buildRecommendation(diagState);

  document.getElementById("diag-question").hidden = true;
  document.getElementById("diag-progress").hidden = true;

  const el = document.getElementById("diag-result");
  el.hidden = false;
  el.innerHTML = `
    <p class="diag-result-label">診断結果</p>
    <p class="diag-result-title">${title}</p>
    <div class="diag-items">
      ${items
        .map(
          (name) => `
        <div class="diag-item">
          ${iconSvg("check")}
          <span class="diag-item-name">${name}</span>
          <span class="diag-item-price">${ITEM_PRICES[name] || ""}</span>
        </div>`
        )
        .join("")}
    </div>
    <p class="diag-comment">${comment}</p>
    <button class="retry-btn" id="diag-retry-btn">もう一度診断する</button>`;

  document.getElementById("diag-retry-btn").addEventListener("click", resetDiagnosis);
}

document.getElementById("diag-start-btn").addEventListener("click", () => {
  document.getElementById("diagnosis-widget").scrollIntoView({ behavior: "smooth", block: "start" });
});

/* ---------- クーポン ---------- */

const COUPON_MESSAGE = "この画面をスタッフに見せると\n本日のおすすめ一品 100円OFF";

document.getElementById("coupon-text").textContent = COUPON_MESSAGE;

document.getElementById("coupon-get-btn").addEventListener("click", () => {
  document.getElementById("coupon-card").hidden = true;
  document.getElementById("coupon-done").hidden = false;
});

/* ---------- 口コミ（評価による誘導の出し分けはしない） ---------- */

document.querySelectorAll("#star-select .star-btn").forEach((star) => {
  star.addEventListener("click", () => {
    const value = Number(star.getAttribute("data-value"));
    document.querySelectorAll("#star-select .star-btn").forEach((s) => {
      s.classList.toggle("filled", Number(s.getAttribute("data-value")) <= value);
    });
    document.getElementById("review-result").hidden = false;
  });
});

/* ---------- 初期描画 ---------- */

renderCategories();
renderRecommend();
renderMenuTabs();
resetDiagnosis();
