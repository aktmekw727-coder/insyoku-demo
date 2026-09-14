/* =========================================================
   店舗別営業デモ 共通テンプレート スクリプト
   すべてダミーデータ / 条件分岐のみ / 外部通信なし
   店舗ごとの内容は同じフォルダの config.js (STORE_CONFIG) で指定する
   ========================================================= */

/* ---------- 写真プレースホルダー生成（仮画像バッジ付き） ---------- */

function photoBox(slug, caption, extraClass) {
  return `
    <div class="photo ${extraClass || ""}" data-caption="${caption}">
      <span class="photo-badge">仮画像</span>
      <img src="assets/images/${slug}.jpg" alt="${caption}" loading="lazy" onerror="this.remove()">
    </div>`;
}

/* ---------- ヘッダー: モバイルナビ ---------- */

function initNav() {
  const navToggle = document.getElementById("nav-toggle");
  const navMobile = document.getElementById("nav-mobile");
  if (!navToggle || !navMobile) return;

  navToggle.addEventListener("click", () => {
    navMobile.classList.toggle("open");
  });

  navMobile.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => navMobile.classList.remove("open"))
  );
}

/* ---------- 来店経路（Instagram / LINE / Google からの流入想定） ---------- */

function renderChannels(config) {
  const el = document.getElementById("channel-strip");
  if (!el || !config.channels) return;
  el.innerHTML = config.channels
    .map((c) => `<span class="channel-chip">${c.label}</span>`)
    .join("");
}

/* ---------- コース紹介 ---------- */

function renderCourses(config) {
  const el = document.getElementById("course-grid");
  if (!el) return;
  el.innerHTML = config.courses
    .map(
      (course) => `
    <div class="course-card">
      ${photoBox(course.image, course.name, "photo--card")}
      <div class="course-body">
        <div class="course-name-row">
          <span class="course-name">${course.name}</span>
          <span class="course-price">${course.price}</span>
        </div>
        <p class="course-desc">${course.desc}</p>
      </div>
    </div>`
    )
    .join("");
}

/* ---------- 店舗情報カード ---------- */

function renderStoreInfo(config) {
  const photoEl = document.getElementById("store-photo");
  if (photoEl) {
    photoEl.innerHTML = photoBox(config.interiorImage || "interior", `${config.storeName}の店内`, "photo--wide");
  }

  const listEl = document.getElementById("store-info-list");
  if (listEl) {
    listEl.innerHTML = `
      <li>${iconSvg("pin")}<span>${config.address}</span></li>
      <li>${iconSvg("phone")}<a href="${config.phoneHref}">${config.phone}</a></li>
      <li>${iconSvg("clock")}<span>${config.hoursNote}</span></li>
      <li>${iconSvg("seat")}<span>${config.seats}</span></li>
    `;
  }
}

function iconSvg(name) {
  return `<svg class="icon" aria-hidden="true"><use href="#icon-${name}"></use></svg>`;
}

/* ---------- 予約カレンダー ---------- */

function renderBookingCalendar(config) {
  const el = document.getElementById("booking-calendar");
  if (!el) return;

  el.innerHTML = config.bookingDays
    .map(
      (day) => `
    <div class="booking-day">
      <div class="booking-date"><strong>${day.date}</strong><span>${day.day}</span></div>
      ${day.slots
        .map(
          ([time, state]) => `
        <button class="slot-btn ${state === "－" ? "disabled" : ""}" ${state === "－" ? "disabled" : ""} data-date="${day.date}（${day.day}）" data-time="${time}">
          <span>${time}</span><b>${state}</b>
        </button>`
        )
        .join("")}
    </div>`
    )
    .join("");

  el.querySelectorAll(".slot-btn:not(.disabled)").forEach((button) =>
    button.addEventListener("click", () => openBookingModal(button.dataset.date, button.dataset.time))
  );
}

/* ---------- 予約希望モーダル ---------- */

let bookingModal, bookingForm, bookingSent;

function initBookingModal() {
  bookingModal = document.getElementById("booking-modal");
  bookingForm = document.getElementById("booking-form");
  bookingSent = document.getElementById("booking-sent");
  if (!bookingModal) return;

  document.getElementById("booking-close").addEventListener("click", closeBookingModal);
  document.getElementById("booking-done").addEventListener("click", closeBookingModal);
  bookingModal.addEventListener("click", (event) => {
    if (event.target === bookingModal) closeBookingModal();
  });
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    bookingForm.hidden = true;
    bookingSent.hidden = false;
  });
}

function openBookingModal(date, time) {
  document.getElementById("selected-slot").textContent = `${date} ${time}`;
  bookingModal.hidden = false;
  document.body.classList.add("modal-open");
}

function closeBookingModal() {
  bookingModal.hidden = true;
  document.body.classList.remove("modal-open");
  bookingForm.hidden = false;
  bookingSent.hidden = true;
  bookingForm.reset();
}

/* ---------- 管理画面サンプル ---------- */

function renderAdminSample(config) {
  const el = document.getElementById("admin-board");
  if (!el || !config.adminSample) return;

  el.innerHTML =
    `<div class="admin-row admin-row-head"><span>日時</span><span>予約経路</span><span>状態</span></div>` +
    config.adminSample
      .map(
        (row) => `
      <div class="admin-row">
        <span>${row.datetime}</span>
        <span>${row.channel}</span>
        <span class="status ${row.status === "確定" ? "status-ok" : "status-wait"}">${row.status}</span>
      </div>`
      )
      .join("");
}

/* ---------- 初期化 ---------- */

function initStorePage(config) {
  document.title = `${config.storeName} | ${config.areaBadge}`;

  initNav();
  renderChannels(config);
  renderCourses(config);
  renderStoreInfo(config);
  renderBookingCalendar(config);
  initBookingModal();
  renderAdminSample(config);
}

if (typeof STORE_CONFIG !== "undefined") {
  initStorePage(STORE_CONFIG);
}
