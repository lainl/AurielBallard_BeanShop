

// Load cart from localStorage or initialize an empty cart
let cart = JSON.parse(localStorage.getItem('cart')) || {};


function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}


function updateCartIconCount() {
  const cartIcon = document.getElementById('shoppingBagIcon');
  if (cartIcon) {
    const itemCount = Object.values(cart).reduce((acc, qty) => acc + qty, 0);
    cartIcon.textContent = itemCount;
  }
}

function addToCart(productName, quantity = 1) {
  if (cart[productName]) {
    cart[productName] += quantity;
  } else {
    cart[productName] = quantity;
  }
  saveCart();
  updateCartIconCount();
}


function removeFromCart(productName) {
  delete cart[productName];
  saveCart();
  updateCartIconCount();
}


function updateItemQuantity(productName, quantity) {
  if (quantity <= 0) {
    removeFromCart(productName);
  } else {
    cart[productName] = quantity;
    saveCart();
    updateCartIconCount();
  }
}


function getItemQuantity(productName) {
  return cart[productName] || 0;
}


document.addEventListener('DOMContentLoaded', updateCartIconCount);
