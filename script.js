alert.log("JS loaded");

// ================== CONFIG ==================
const SHEET_URL =
  "https://script.google.com/macros/s/AKfycbzJPOpVY_X1LaAxwuXlMIXhP63h-y6DLMVVxo0nNGq2vOe83cUBSnwFs16qaQr5LXTGSw/exec";

// ================== DATA ==================
const WILAYAS = {
  "1": "أدرار", "2": "الشلف", "3": "الأغواط", "4": "أم البواقي",
  "5": "باتنة", "6": "بجاية", "7": "بسكرة", "8": "بشار",
  "9": "البليدة", "10": "البويرة", "11": "تمنراست", "12": "تبسة",
  "13": "تلمسان", "14": "تيارت", "15": "تيزي وزو", "16": "الجزائر",
  "17": "الجلفة", "18": "جيجل", "19": "سطيف", "20": "سعيدة",
  "21": "سكيكدة", "22": "سيدي بلعباس", "23": "عنابة", "24": "قالمة",
  "25": "قسنطينة", "26": "المدية", "27": "مستغانم", "28": "المسيلة",
  "29": "معسكر", "30": "ورقلة", "31": "وهران", "32": "البيض",
  "33": "إليزي", "34": "برج بوعريريج", "35": "بومرداس", "36": "الطارف",
  "37": "تندوف", "38": "تيسمسيلت", "39": "الوادي", "40": "خنشلة",
  "41": "سوق أهراس", "42": "تيبازة", "43": "ميلة", "44": "عين الدفلى",
  "45": "النعامة", "46": "عين تموشنت", "47": "غرداية", "48": "غليزان",
  "49": "تيميمون", "50": "برج باجي مختار", "51": "أولاد جلال",
  "52": "بني عباس", "53": "عين صالح", "54": "عين قزام",
  "55": "تقرت", "56": "جانت", "57": "المغير", "58": "المنيعة"
};

// BALADIYAT[wilayaName] = [ "بلدية1", "بلدية2", ... ]
const BALADIYAT = {};

// ================== INIT ==================
document.addEventListener("DOMContentLoaded", init);

function init() {
  loadBaladiyatData();
}

// ================== LOAD DATA ==================
function loadBaladiyatData() {
  fetch("baladiyat.json")
    .then(res => {
      if (!res.ok) throw new Error("Failed to load baladiyat.json");
      return res.json();
    })
    .then(buildBaladiyatMap)
    .then(fillWilayas)
    .catch(err => console.error("DATA ERROR:", err));
}

function buildBaladiyatMap(data) {
  data.forEach(item => {
    const wilayaName = WILAYAS[item.wilaya_id];
    if (!wilayaName) return;

    if (!BALADIYAT[wilayaName]) {
      BALADIYAT[wilayaName] = [];
    }

    BALADIYAT[wilayaName].push(item.ar_name);
  });
}

// ================== UI ==================
function fillWilayas() {
  document.querySelectorAll("[id^='wilaya']").forEach(select => {
    select.length = 1;

    Object.values(WILAYAS).forEach(wilayaName => {
      if (!BALADIYAT[wilayaName]) return;

      const opt = document.createElement("option");
      opt.value = wilayaName;
      opt.textContent = wilayaName;
      select.appendChild(opt);
    });

    const index = select.id.replace("wilaya", "");
    select.addEventListener("change", () => loadBaladiya(index));
  });
}

function loadBaladiya(index) {
  const wilayaSelect = document.getElementById("wilaya" + index);
  const baladiyaSelect = document.getElementById("baladiya" + index);

  if (!wilayaSelect || !baladiyaSelect) return;

  baladiyaSelect.length = 1;

  const wilayaName = wilayaSelect.value;
  const communes = BALADIYAT[wilayaName];
  if (!communes) return;

  const fragment = document.createDocumentFragment();
  communes.forEach(name => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    fragment.appendChild(opt);
  });

  baladiyaSelect.appendChild(fragment);
}

// ================== ORDER ==================
function sendOrder(id, product) {
  const name = document.getElementById("name" + id).value.trim();
  const phone = document.getElementById("phone" + id).value.trim();
  const wilaya = document.getElementById("wilaya" + id).value;
  const msg = document.getElementById("msg" + id);

  if (!name || !phone || wilaya.includes("اختر")) {
    showMsg(msg, "يرجى ملء جميع الحقول", "red");
    return;
  }

  showMsg(msg, "جاري الإرسال...", "blue");

  fetch(SHEET_URL, {
    method: "POST",
    body: JSON.stringify({ name, phone, wilaya, product })
  })
    .then(res => res.json())
    .then(() => showMsg(msg, "تم إرسال طلبك بنجاح ✅", "green"))
    .catch(() => showMsg(msg, "حدث خطأ، حاول لاحقاً", "red"));
}

function showMsg(el, text, color) {
  el.style.color = color;
  el.textContent = text;
  }
window.onload = loadWilayas;
