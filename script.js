let items = [];

const form = document.getElementById("item-form");
const nameInput = document.getElementById("name");
const qtyInput = document.getElementById("qty");
const priceInput = document.getElementById("price");
const errorEl = document.getElementById("form-error");
const rowsEl = document.getElementById("item-rows");
const grandTotalEl = document.getElementById("grand-total");
function formatMoney(amount) {
  return "$" + amount.toFixed(2);
}

function render() {
  if (items.length === 0) {
    rowsEl.innerHTML = '<tr><td colspan="5">No items yet.</td></tr>';
  } else {
    let html = "";
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const lineTotal = item.qty * item.price;
      html += `<tr>
        <td>${item.name}</td>
        <td class="num">${item.qty}</td>
        <td class="num">${formatMoney(item.price)}</td>
        <td class="num">${formatMoney(lineTotal)}</td>
        <td class="num"><button class="del-btn" data-index="${i}">&times;</button></td>
      </tr>`;
    }
    rowsEl.innerHTML = html;
  }

  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].qty * items[i].price;
  }
  grandTotalEl.textContent = formatMoney(total);
}

render();
function isNonEmpty(value) {
  return value.trim().length > 0;
}

function isPositiveWholeNumber(value) {
  const trimmed = value.trim();
  if (trimmed.length === 0) return false;
  for (let i = 0; i < trimmed.length; i++) {
    if (trimmed[i] < "0" || trimmed[i] > "9") return false;
  }
  return Number(trimmed) > 0;
}

function isPositiveOrZeroNumber(value) {
  const trimmed = value.trim();
  if (trimmed.length === 0) return false;
  let dots = 0;
  for (let i = 0; i < trimmed.length; i++) {
    const c = trimmed[i];
    if (c === ".") { dots++; if (dots > 1) return false; }
    else if (c < "0" || c > "9") return false;
  }
  return Number(trimmed) >= 0;
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  errorEl.textContent = "";

  const name = nameInput.value;
  const qty = qtyInput.value;
  const price = priceInput.value;

  if (!isNonEmpty(name)) {
    errorEl.textContent = "Please enter an item name.";
    return;
  }
  if (!isPositiveWholeNumber(qty)) {
    errorEl.textContent = "Quantity must be a whole number greater than 0.";
    return;
  }
  if (!isPositiveOrZeroNumber(price)) {
    errorEl.textContent = "Price must be 0 or greater.";
    return;
  }

  items.push({ name: name.trim(), qty: Number(qty), price: Number(price) });
  form.reset();
  render();
});
rowsEl.addEventListener("click", function (e) {
  const button = e.target.closest(".del-btn");
  if (!button) return;
  const index = Number(button.dataset.index);
  items.splice(index, 1);
  render();
});