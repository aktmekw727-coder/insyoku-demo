/* =========================================================
   あんどあーる - ご提案用サンプル 店舗設定
   すべてダミーデータです。実際の在庫・予約可否とは異なります。
   住所・電話番号など未確認の情報は掲載していません。
   ========================================================= */

const STORE_CONFIG = {
  storeName: "あんどあーる",
  storeNameEn: "&R",
  areaBadge: "ご提案用サンプル",
  genre: "ヘア・着付け・ネイルなど",

  heroLead: "ヘア・着付け・メイク・ネイルまで。Instagramでご紹介しているメニューのご提案ページです。",
  heroImage: "hero",

  aboutText:
    "ヘア・着付け・メイク・ネイルなど、Instagramでご紹介しているメニューの一部をこちらにまとめました。現在の予約方法や最新情報はInstagramをご確認ください。",

  channels: [
    { label: "Instagram" },
  ],

  courses: [
    {
      name: "成人式前撮り",
      price: "料金はお問い合わせください",
      desc: "成人式の前撮りメニューです。",
      image: "menu-photo",
    },
    {
      name: "着付けセット",
      price: "¥22,000",
      desc: "着付けのメニューです。",
      image: "menu-kimono",
    },
    {
      name: "韓国カット＋カラー",
      price: "¥10,200",
      desc: "カット＋カラーのメニューです。",
      image: "menu-cut-color",
    },
    {
      name: "15分ヘアセット",
      price: "¥2,000",
      desc: "ヘアセットのメニューです。",
      image: "menu-hairset",
    },
    {
      name: "黄金比フルメイク",
      price: "¥4,500",
      desc: "フルメイクのメニューです。",
      image: "menu-makeup",
    },
    {
      name: "ロングネイル",
      price: "¥8,000",
      desc: "ネイルのメニューです。",
      image: "menu-nail",
    },
    {
      name: "Body & Eye Jewelry",
      price: "料金はお問い合わせください",
      desc: "ジュエリー装飾のメニューです。",
      image: "menu-jewelry",
    },
  ],

  bookingDays: [
    { date: "9/17", day: "木", slots: [["10:00", "○"], ["13:00", "△"], ["16:00", "○"]] },
    { date: "9/18", day: "金", slots: [["10:00", "○"], ["13:00", "○"], ["16:00", "△"]] },
    { date: "9/19", day: "土", slots: [["10:00", "△"], ["13:00", "－"], ["16:00", "○"]] },
    { date: "9/20", day: "日", slots: [["10:00", "○"], ["13:00", "△"], ["16:00", "△"]] },
    { date: "9/21", day: "月", slots: [["10:00", "△"], ["13:00", "○"], ["16:00", "－"]] },
  ],

  adminSample: [
    { datetime: "9/17 13:00", channel: "Web", status: "承認待ち" },
    { datetime: "9/17 16:00", channel: "Instagram DM", status: "確定" },
    { datetime: "9/18 10:00", channel: "Web", status: "確定" },
  ],
};
