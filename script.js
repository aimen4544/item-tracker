/* ===========================================================
   ADD PAGE SCRIPT (index.html)

   This page only adds items. The List page (list.html) is a
   real, separate page — clicking the nav link reloads the
   browser. A plain JS array in memory can't survive a page
   reload, so we use localStorage (the browser's built-in
   key/value storage) purely to carry items from this page
   over to list.html.
   =========================================================== */

const STORAGE_KEY = "item-tracker-items";

const form       = document.getElementById("item-form");
const nameInput  = document.getElementById("name");
const qtyInput   = document.getElementById("qty");
const priceInput = document.getElementById("price");
const errorEl    = document.getElementById("form-error");
const successEl  = document.getElementById("form-success");


/* ===========================================================
   Validation helpers — unchanged from before. HTML validation
   is still off (novalidate, type="text" everywhere), so these
   checks are still hand-written.
   =========================================================== */

function isNonEmpty(value) {
  return value.trim().length > 0;
}

function isPositiveWholeNumber(value) {
  const trimmed = value.trim();
  if (trimmed.length === 0) return false;
  for (let i = 0; i < trimmed.length; i++) {
    const char = trimmed[i];
    if (char < "0" || char > "9") return false;
  }
  return Number(trimmed) > 0;
}

function isPositiveOrZeroNumber(value) {
  const trimmed = value.trim();
  if (trimmed.length === 0) return false;

  let dotCount = 0;
  for (let i = 0; i < trimmed.length; i++) {
    const char = trimmed[i];
    if (char === ".") {
      dotCount++;
      if (dotCount > 1) return false;
    } else if (char < "0" || char > "9") {
      return false;
    }
  }
  return Number(trimmed) >= 0;
}


/* ===========================================================
   localStorage helpers. loadItems reads the array that's
   already saved (or an empty array the very first time).
   saveItems writes the whole array back as a JSON string,
   since localStorage only stores text.
   =========================================================== */

function loadItems() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveItems(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}


/* ===========================================================
   Form submit: validate, then load the existing list, add the
   new item, and save it straight back.
   =========================================================== */

form.addEventListener("submit", function (e) {
  e.preventDefault();
  errorEl.textContent = "";
  successEl.textContent = "";

  const name = nameInput.value;
  const qty = qtyInput.value;
  const price = priceInput.value;

  if (!isNonEmpty(name)) {
    errorEl.textContent = "Please enter an item name.";
    return;
  }
  if (!isPositiveWholeNumber(qty)) {
    errorEl.textContent = "Quantity must be a whole number greater than 0 (e.g. 1, 2, 10).";
    return;
  }
  if (!isPositiveOrZeroNumber(price)) {
    errorEl.textContent = "Price must be a number 0 or greater (e.g. 0, 9.99).";
    return;
  }

  const items = loadItems();
  items.push({
    name: name.trim(),
    qty: Number(qty.trim()),
    price: Number(price.trim())
  });
  saveItems(items);

  form.reset();
  nameInput.focus();
  successEl.textContent = `"${name.trim()}" added — view it on the Items page.`;
});