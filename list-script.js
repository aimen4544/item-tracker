/* ===========================================================
   LIST PAGE SCRIPT (list.html)

   Reads the items that index.html saved to localStorage,
   renders the table, and handles delete. Deleting updates
   localStorage too, so the change survives a refresh.
   =========================================================== */

const STORAGE_KEY = "item-tracker-items";

const rowsEl       = document.getElementById("item-rows");
const grandTotalEl = document.getElementById("grand-total");

function loadItems() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveItems(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function escapeForDisplay(rawText) {
  const span = document.createElement("span");
  span.textContent = rawText; // textContent never parses HTML
  return span.innerHTML;      // read it back as escaped markup
}

function formatMoney(amount) {
  return "$" + amount.toFixed(2);
}

function render() {
  const items = loadItems();

  if (items.length === 0) {
    rowsEl.innerHTML =
      '<tr class="empty-row"><td colspan="5">No items yet — add one on the Add page.</td></tr>';
  } else {
    let html = "";
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const lineTotal = item.qty * item.price;

      html += "<tr>";
      html += `<td class="name-cell">${escapeForDisplay(item.name)}</td>`;
      html += `<td class="num">${item.qty}</td>`;
      html += `<td class="num">${formatMoney(item.price)}</td>`;
      html += `<td class="num">${formatMoney(lineTotal)}</td>`;
      html += `<td class="num"><button class="del-btn" data-index="${i}" title="Remove">&times;</button></td>`;
      html += "</tr>";
    }
    rowsEl.innerHTML = html;
  }

  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].qty * items[i].price;
  }
  grandTotalEl.textContent = formatMoney(total);
}

rowsEl.addEventListener("click", function (e) {
  const button = e.target.closest(".del-btn");
  if (!button) return; // click wasn't on a delete button

  const index = Number(button.dataset.index);
  const items = loadItems();
  items.splice(index, 1); // remove exactly one item at that position
  saveItems(items);
  render();
});

render();