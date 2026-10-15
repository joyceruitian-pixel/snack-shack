const items = [
  { id:'doritos', name:'Doritos', description:'Cheesy tortilla chips.', price:1.25, image:'doritos.png', category:'salty' },
  { id:'hot-cheeto', name:'Hot Cheetos', description:'Spicy cheese-flavored snacks.', price:1.25, image:'hot_cheeto.png', category:'salty' },
  { id:'kitkat', name:'KitKat', description:'Crisp wafers covered in chocolate.', price:1.25, image:'kitkat.png', category:'sweet' },
  { id:'reeses', name:'Reese’s', description:'Chocolate and peanut butter candy.', price:1.50, image:'reeses.png', category:'sweet' },
  { id:'skittles', name:'Skittles', description:'Fruit-flavored chewy candy.', price:1.00, image:'skittles.png', category:'sweet' },
  { id:'sour-patch-kids', name:'Sour Patch Kids', description:'Soft candy with a sour coating.', price:1.25, image:'sour_patch_kids.png', category:'sweet' },
  { id:'takis', name:'Takis', description:'Rolled corn snacks with a spicy flavor.', price:1.25, image:'takis.png', category:'salty' },
  { id:'trolli', name:'Trolli', description:'Colorful, chewy gummy candy.', price:1.25, image:'trolli.png', category:'sweet' }
];
let cart = {};
const money = value => `$${value.toFixed(2)}`;
const menuGrid = document.querySelector('#menuGrid');

function renderMenu(category = 'all') {
  const visible = items.filter(item => category === 'all' || item.category === category);
  menuGrid.innerHTML = visible.map(item => `<article class="menu-item"><img class="item-image" src="images/${item.image}" alt="" aria-hidden="true"><div class="item-info"><h3 class="item-name">${item.name}</h3><p class="item-desc">${item.description}</p></div><div class="item-bottom"><strong class="price">${money(item.price)}</strong><button class="add-button" type="button" data-add="${item.id}" aria-label="Add ${item.name} to order">+ Add</button></div></article>`).join('');
}

function renderCart() {
  const entries = Object.entries(cart).filter(([, qty]) => qty > 0);
  const count = entries.reduce((sum, [, qty]) => sum + qty, 0);
  const total = entries.reduce((sum, [id, qty]) => sum + items.find(item => item.id === id).price * qty, 0);
  document.querySelector('#cartCount').textContent = count;
  document.querySelector('#cartLink').setAttribute('aria-label', `View order, ${count} ${count === 1 ? 'item' : 'items'}`);
  document.querySelector('#orderCount').textContent = `${count} ${count === 1 ? 'item' : 'items'}`;
  document.querySelector('#orderFooter').hidden = !count;
  document.querySelector('#orderItems').innerHTML = count ? entries.map(([id, qty]) => { const item = items.find(entry => entry.id === id); return `<div class="order-row"><img class="row-image" src="images/${item.image}" alt="" aria-hidden="true"><div class="row-details"><div class="row-name">${item.name}</div><div class="row-price">${money(item.price)} each</div></div><div class="quantity"><button type="button" data-change="${id}" data-amount="-1" aria-label="Remove one ${item.name}">−</button><span>${qty}</span><button type="button" data-change="${id}" data-amount="1" aria-label="Add one ${item.name}">+</button></div></div>`; }).join('') : '<div class="empty-order"><span aria-hidden="true">🧃</span><p>Your order is empty.</p></div>';
  document.querySelector('#orderTotal').textContent = money(total);
}

menuGrid.addEventListener('click', event => { const button = event.target.closest('[data-add]'); if (!button) return; cart[button.dataset.add] = (cart[button.dataset.add] || 0) + 1; renderCart(); document.querySelector('#order').scrollIntoView({ behavior:'smooth', block:'center' }); });
document.querySelector('.category-tabs').addEventListener('click', event => { const tab = event.target.closest('.tab'); if (!tab) return; document.querySelectorAll('.tab').forEach(button => { button.classList.toggle('active', button === tab); button.setAttribute('aria-selected', button === tab); }); renderMenu(tab.dataset.category); });
document.querySelector('#orderItems').addEventListener('click', event => { const button = event.target.closest('[data-change]'); if (!button) return; const id = button.dataset.change; cart[id] = (cart[id] || 0) + Number(button.dataset.amount); if (cart[id] <= 0) delete cart[id]; renderCart(); });
document.querySelector('#clearButton').addEventListener('click', () => { cart = {}; renderCart(); });
document.querySelector('#checkoutButton').addEventListener('click', () => { const count = Object.values(cart).reduce((sum, qty) => sum + qty, 0); if (!count) return; const orderNumber = Math.floor(100 + Math.random() * 900); document.querySelector('#confirmationText').textContent = `Order #${orderNumber} has been confirmed for ${count} ${count === 1 ? 'snack' : 'snacks'}. Pickup is at the Student Commons during the lunch period.`; cart = {}; renderCart(); document.querySelector('#confirmation').hidden = false; document.querySelector('#order').hidden = true; document.querySelector('#confirmation').focus({ preventScroll:true }); document.querySelector('#confirmation').scrollIntoView({ behavior:'smooth', block:'start' }); });
document.querySelector('#newOrderButton').addEventListener('click', () => { cart = {}; renderCart(); document.querySelector('#confirmation').hidden = true; document.querySelector('#order').hidden = false; document.querySelector('#menu').scrollIntoView({ behavior:'smooth' }); });
renderMenu(); renderCart();
