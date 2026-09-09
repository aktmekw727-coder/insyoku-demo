/* =========================================================
   炭火酒場 よいどれ - 営業デモ用 スクリプト
   すべてダミーデータ / 条件分岐のみ / 外部通信なし
   ========================================================= */

/* ---------- ダミーデータ ---------- */

const OSUSUME_ITEMS = [
  { name: "炙りしめ鯖", price: "780円", desc: "脂の乗った鯖を香ばしく炙りました" },
  { name: "黒豚炭火焼", price: "980円", desc: "鹿児島黒豚を炭火で香ばしく" },
  { name: "地鶏刺し盛り", price: "1,080円", desc: "新鮮な地鶏を3種盛りで" },
];

const JOREN_ITEMS = [
  { name: "黒豚ガーリックチャーハン", price: "裏メニュー", desc: "常連さんのリクエストから生まれた一品" },
  { name: "店長の気まぐれ刺身盛り", price: "裏メニュー", desc: "その日の仕入れで店長が選ぶ特別盛り" },
  { name: "裏ハイボール", price: "裏メニュー", desc: "ちょっと濃いめ、常連さん向けの一杯" },
];

/* 診断結果テーブル: Q1(気分) x Q2(肉/魚) → 料理 */
const SHINDAN_DISH_TABLE = {
  "gattsuri|niku": "黒豚炭火焼",
  "gattsuri|sakana": "炙りしめ鯖",
  "gattsuri|dotchi": "唐揚げ",
  "karume|niku": "地鶏刺し盛り",
  "karume|sakana": "刺身",
  "karume|dotchi": "炙りしめ鯖",
  "osake|niku": "黒豚ガーリックチャーハン",
  "osake|sakana": "店長の気まぐれ刺身盛り",
  "osake|dotchi": "地鶏刺し盛り",
};

/* 診断結果テーブル: Q3(飲みたいもの) → お酒 */
const SHINDAN_DRINK_TABLE = {
  beer: "生ビール",
  shochu: "芋焼酎「お湯割り」",
  sake: "日本酒「純米吟醸」",
};

/* Q3が「まだ決めてない」場合、料理のジャンルからお酒を提案 */
const DISH_GENRE = {
  "黒豚炭火焼": "niku",
  "炙りしめ鯖": "sakana",
  "唐揚げ": "niku",
  "地鶏刺し盛り": "niku",
  "刺身": "sakana",
  "黒豚ガーリックチャーハン": "niku",
  "店長の気まぐれ刺身盛り": "sakana",
};

const DRINK_COMMENTS = {
  beer: "キンキンに冷えた一杯とジューシーな一皿、最高の組み合わせです",
  shochu: "この組み合わせ、実は常連さん人気No.1",
  sake: "料理の旨みを引き立てる、通も唸る組み合わせです",
  omakase: "迷ったときはコレ。間違いのない鉄板コースです",
};

/* 診断の質問データ */
const SHINDAN_QUESTIONS = [
  {
    key: "q1",
    text: "今日はどんな気分？",
    options: [
      { label: "ガッツリ食べたい", value: "gattsuri" },
      { label: "軽めにいきたい", value: "karume" },
      { label: "お酒メイン", value: "osake" },
    ],
  },
  {
    key: "q2",
    text: "どれが好き？",
    options: [
      { label: "肉", value: "niku" },
      { label: "魚", value: "sakana" },
      { label: "どっちでも", value: "dotchi" },
    ],
  },
  {
    key: "q3",
    text: "今日飲みたいのは？",
    options: [
      { label: "ビール", value: "beer" },
      { label: "焼酎", value: "shochu" },
      { label: "日本酒", value: "sake" },
      { label: "まだ決めてない", value: "mada" },
    ],
  },
];

/* ペアリング: 料理 → お酒 */
const PAIRING_TABLE = {
  "炙りしめ鯖": { drink: "日本酒「純米吟醸」", note: "上品な旨みと鯖の脂が寄り添う王道の組み合わせ" },
  "黒豚炭火焼": { drink: "芋焼酎「お湯割り」", note: "香ばしい炭火の風味を焼酎の旨みが包み込みます" },
  "唐揚げ": { drink: "生ビール", note: "揚げたてのジューシーさに、キレのある一杯を" },
  "刺身": { drink: "日本酒", note: "素材の味を邪魔しない、すっきりとした飲み口が好相性" },
};

/* ---------- 画面切り替え ---------- */

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((el) => {
    el.classList.toggle("active", el.id === id);
  });
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
}

document.querySelectorAll("[data-target]").forEach((el) => {
  el.addEventListener("click", () => {
    const target = el.getAttribute("data-target");
    showScreen(target);
    if (target === "screen-shindan") resetShindan();
  });
});

/* ---------- 1. 今日のおすすめ ---------- */

function renderDishCards(container, items) {
  container.innerHTML = items
    .map(
      (item) => `
        <div class="dish-card">
          <div class="dish-name-row">
            <span class="dish-name">${item.name}</span>
            <span class="dish-price">${item.price}</span>
          </div>
          <p class="dish-desc">${item.desc}</p>
        </div>`
    )
    .join("");
}

renderDishCards(document.getElementById("osusume-list"), OSUSUME_ITEMS);
renderDishCards(document.getElementById("joren-list"), JOREN_ITEMS);

/* ---------- 2. あなたに合う一品診断 ---------- */

let shindanState = {};
let shindanStep = 0;

function resetShindan() {
  shindanState = {};
  shindanStep = 0;
  document.getElementById("shindan-result").hidden = true;
  document.getElementById("shindan-question").hidden = false;
  document.getElementById("shindan-progress").hidden = false;
  renderShindanQuestion();
}

function renderShindanQuestion() {
  const q = SHINDAN_QUESTIONS[shindanStep];
  const container = document.getElementById("shindan-question");

  container.innerHTML = `
    <p class="q-text">${q.text}</p>
    <div class="q-options">
      ${q.options
        .map((opt) => `<button class="option-btn" data-value="${opt.value}">${opt.label}</button>`)
        .join("")}
    </div>
  `;

  container.querySelectorAll(".option-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      shindanState[q.key] = btn.getAttribute("data-value");
      shindanStep++;
      updateShindanProgress();
      if (shindanStep < SHINDAN_QUESTIONS.length) {
        renderShindanQuestion();
      } else {
        renderShindanResult();
      }
    });
  });
}

function updateShindanProgress() {
  const dots = document.querySelectorAll("#shindan-progress .dot");
  dots.forEach((dot, i) => dot.classList.toggle("active", i < shindanStep + 1 || i === shindanStep));
  dots.forEach((dot, i) => dot.classList.toggle("active", i <= shindanStep));
}

function renderShindanResult() {
  const dishKey = `${shindanState.q1}|${shindanState.q2}`;
  const dish = SHINDAN_DISH_TABLE[dishKey] || "黒豚炭火焼";

  let drinkKey = shindanState.q3;
  let drink;
  let commentKey;

  if (drinkKey === "mada") {
    const genre = DISH_GENRE[dish] || "niku";
    drink = genre === "sakana" ? SHINDAN_DRINK_TABLE.sake : SHINDAN_DRINK_TABLE.shochu;
    commentKey = "omakase";
  } else {
    drink = SHINDAN_DRINK_TABLE[drinkKey];
    commentKey = drinkKey;
  }

  document.getElementById("shindan-question").hidden = true;
  document.getElementById("shindan-progress").hidden = true;

  const resultEl = document.getElementById("shindan-result");
  resultEl.hidden = false;
  resultEl.innerHTML = `
    <p class="result-label">あなたには</p>
    <p class="result-combo">${dish}<br>×<br>${drink}<br>がおすすめ！</p>
    <p class="result-stars">スタッフおすすめ度 ★★★★★</p>
    <p class="result-comment">${DRINK_COMMENTS[commentKey] || DRINK_COMMENTS.omakase}</p>
    <button class="retry-btn" id="shindan-retry-btn">もう一度診断する</button>
  `;

  document.getElementById("shindan-retry-btn").addEventListener("click", resetShindan);
}

/* ---------- 3. お酒とのペアリング ---------- */

function renderPairingButtons() {
  const container = document.getElementById("pairing-buttons");
  container.innerHTML = Object.keys(PAIRING_TABLE)
    .map((dish) => `<button class="pairing-btn" data-dish="${dish}">${dish}</button>`)
    .join("");

  container.querySelectorAll(".pairing-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      container.querySelectorAll(".pairing-btn").forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");

      const dish = btn.getAttribute("data-dish");
      const pairing = PAIRING_TABLE[dish];
      const resultEl = document.getElementById("pairing-result");
      resultEl.hidden = false;
      resultEl.innerHTML = `
        <p class="dish-name">${dish}</p>
        <p class="pairing-arrow">とよく合うのは</p>
        <p class="pairing-drink">${pairing.drink}</p>
        <p class="pairing-note">${pairing.note}</p>
      `;
    });
  });
}

renderPairingButtons();

/* ---------- 5. クーポン ---------- */

const COUPON_MESSAGE = "この画面をスタッフに見せると\n本日のおすすめ一品 100円OFF";

document.getElementById("coupon-text").textContent = COUPON_MESSAGE;

document.getElementById("coupon-get-btn").addEventListener("click", () => {
  document.getElementById("coupon-card").hidden = true;
  document.getElementById("coupon-done").hidden = false;
});

/* ---------- 6. ご意見・口コミ ---------- */

const GOOGLE_REVIEW_URL = "https://example.com/dummy-google-review";

document.querySelectorAll("#star-select .star").forEach((star) => {
  star.addEventListener("click", () => {
    const value = Number(star.getAttribute("data-value"));
    document.querySelectorAll("#star-select .star").forEach((s) => {
      s.classList.toggle("filled", Number(s.getAttribute("data-value")) <= value);
    });
    renderReviewResult(value);
  });
});

function renderReviewResult(value) {
  const resultEl = document.getElementById("review-result");
  resultEl.hidden = false;

  if (value >= 4) {
    resultEl.innerHTML = `
      <p class="review-message">ありがとうございます！<br>よければ口コミでも応援していただけると嬉しいです。</p>
      <a class="review-link-btn" href="${GOOGLE_REVIEW_URL}" target="_blank" rel="noopener">Google口コミを書く</a>
      <p class="review-sales-note">※ 満足度の高い人だけ口コミへ誘導するような設計もできます</p>
    `;
  } else {
    resultEl.innerHTML = `
      <p class="review-message">ご意見ありがとうございます。<br>より良いお店づくりに活かします。</p>
      <p class="review-sales-note">※ 満足度の高い人だけ口コミへ誘導するような設計もできます</p>
    `;
  }
}
