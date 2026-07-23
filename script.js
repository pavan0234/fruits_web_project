const products = [
  {
    id: 1,
    name: "Mango Burst",
    category: "Juices",
    price: 80,
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=900&q=80",
    desc: "Sweet mango delight with a refreshing summer twist."
  },
  {
    id: 2,
    name: "Orange Glow",
    category: "Juices",
    price: 70,
    badge: "Popular",
    image: "https://images.unsplash.com/photo-1615484477778-ca3b77940c25?auto=format&fit=crop&w=900&q=80",
    desc: "Fresh orange juice made with premium citrus fruits."
  },
  {
    id: 3,
    name: "Green Boost",
    category: "Boosters",
    price: 90,
    badge: "New",
    image: "https://images.unsplash.com/photo-1547595628-c61a29f496f0?auto=format&fit=crop&w=900&q=80",
    desc: "A healthy green booster for a fresh start to your day."
  },
  {
    id: 4,
    name: "Berry Smoothie",
    category: "Smoothies",
    price: 110,
    badge: "Fresh",
    image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=900&q=80",
    desc: "Creamy berry smoothie with rich tropical flavor."
  },
  {
    id: 5,
    name: "Pineapple Punch",
    category: "Juices",
    price: 85,
    badge: "Tropical",
    image: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=900&q=80",
    desc: "A bright and juicy pineapple punch."
  },
  {
    id: 6,
    name: "Lemon Zest",
    category: "Wellness",
    price: 75,
    badge: "Healthy",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBUAfgufsE4dJ6HEgT9sYKWsSyb9Y89AR-2LvOS-q0tg&s=10",
    desc: "Refreshing lemon wellness drink with natural citrus."
  }
];

let cart = loadCart();
let activeCategory = "All";
let searchTerm = "";
let currentProductId = null;
let recentAdds = [];
let isLoggedIn = sessionStorage.getItem("freshCartLoggedIn") === "true";

const supportDetails = {
  email: "kapavan42gamil.com",
  phone: "8185917809",
  address: "Andhra Pradesh, Kadapa"
};

const elements = {
  loginScreen: document.getElementById("loginScreen"),
  app: document.getElementById("app"),
  loginForm: document.getElementById("loginForm"),
  emailInput: document.getElementById("emailInput"),
  loginError: document.getElementById("loginError"),
  productsGrid: document.getElementById("productsGrid"),
  searchInput: document.getElementById("searchInput"),
  categoryFilters: document.getElementById("categoryFilters"),
  detailContent: document.getElementById("detailContent"),
  cartItems: document.getElementById("cartItems"),
  cartSummary: document.getElementById("cartSummary"),
  checkoutForm: document.getElementById("checkoutForm"),
  orderMessage: document.getElementById("orderMessage"),
  toast: document.getElementById("toast"),
  addedItemsList: document.getElementById("addedItemsList"),
  cartBadge: document.getElementById("cartBadge"),
  supportMessages: document.getElementById("supportMessages"),
  supportForm: document.getElementById("supportForm"),
  supportInput: document.getElementById("supportInput")
};

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem("freshCart")) || [];
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem("freshCart", JSON.stringify(cart));
}

function clearCartState() {
  cart = [];
  recentAdds = [];
  try {
    localStorage.removeItem("freshCart");
  } catch {}
  renderCart();
  renderAddedItems();
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => {
    elements.toast.classList.remove("show");
  }, 2200);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showView(viewName) {
  document.querySelectorAll(".view").forEach(view => {
    view.classList.toggle("active", view.id === `${viewName}View`);
  });

  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.view === viewName);
  });
}

function restoreAppState() {
  const params = new URLSearchParams(window.location.search);
  const targetView = params.get("view") || "home";

  if (isLoggedIn) {
    elements.loginScreen.classList.add("hidden");
    elements.app.classList.remove("hidden");
    showView(targetView);
    renderCart();
    renderAddedItems();
  } else {
    clearCartState();
    elements.loginScreen.classList.remove("hidden");
    elements.app.classList.add("hidden");
    elements.loginError.textContent = "";
    elements.emailInput.value = "";
    showView("home");
  }
}

function renderProducts() {
  const filteredProducts = products.filter(product => {
    const matchCategory = activeCategory === "All" || product.category === activeCategory;
    const matchSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.desc.toLowerCase().includes(searchTerm);

    return matchCategory && matchSearch;
  });

  if (filteredProducts.length === 0) {
    elements.productsGrid.innerHTML = `<div class="empty-state">No products found.</div>`;
    return;
  }

  elements.productsGrid.innerHTML = filteredProducts.map(product => `
    <article class="product-card">
      <img src="${product.image}" alt="${product.name}" />
      <span class="badge-small">${product.badge}</span>
      <h3>${product.name}</h3>
      <p>${product.desc}</p>
      <div class="product-footer">
        <strong>₹${product.price}</strong>
        <div>
          <button type="button" class="btn secondary-btn" data-view="detail" data-id="${product.id}">View</button>
          <button type="button" class="add-btn" data-id="${product.id}">Add</button>
        </div>
      </div>
    </article>
  `).join("");
}

function renderDetail() {
  if (!currentProductId) return;
  const product = products.find(item => item.id === currentProductId);
  if (!product) return;

  elements.detailContent.innerHTML = `
    <img src="${product.image}" alt="${product.name}" />
    <h2>${product.name}</h2>
    <p class="badge-small">${product.badge}</p>
    <p>${product.desc}</p>
    <p><strong>Category:</strong> ${product.category}</p>
    <p><strong>Price:</strong> ₹${product.price}</p>

    <div class="detail-actions">
      <button type="button" class="btn primary-btn" data-action="add-detail" data-id="${product.id}">Add to Cart</button>
      <button type="button" class="btn secondary-btn" data-action="back">Back to Products</button>
    </div>
  `;
}

function getCartTotal() {
  return cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
}

function renderCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  if (elements.cartBadge) {
    elements.cartBadge.textContent = totalItems;
  }

  if (cart.length === 0) {
    elements.cartItems.innerHTML = `<div class="empty-state">Your cart is empty.</div>`;
  } else {
    elements.cartItems.innerHTML = cart.map(item => {
      const product = products.find(p => p.id === item.id);
      if (!product) return "";
      return `
        <div class="cart-item">
          <div>
            <h4>${product.name}</h4>
            <p>₹${product.price} × ${item.qty}</p>
          </div>
          <div class="cart-actions">
            <button class="qty-btn" data-action="decrease" data-id="${item.id}">-</button>
            <span>${item.qty}</span>
            <button class="qty-btn" data-action="increase" data-id="${item.id}">+</button>
            <button class="remove-btn" data-action="remove" data-id="${item.id}">Remove</button>
          </div>
        </div>
      `;
    }).join("");
  }

  const totalPrice = getCartTotal();

  const upi = `upi://pay?pa=8185917809-2@ybl&pn=Your%20Business&am=${totalPrice}&cu=INR`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upi)}`;

  elements.cartSummary.innerHTML = `
    <h3>Order Summary</h3>
    <p>Items: ${totalItems}</p>
    <p>Total: ₹${totalPrice}</p>
    <div class="qr-box">
      <img src="${qrUrl}" alt="Payment QR" />
      <p>Scan to pay</p>
    </div>
    <button type="button" class="btn primary-btn full-btn" data-view="checkout">Proceed to Checkout</button>
  `;
}

function renderAddedItems() {
  if (!elements.addedItemsList) return;

  if (recentAdds.length === 0) {
    elements.addedItemsList.innerHTML = `<p class="empty-state">No items added yet.</p>`;
    return;
  }

  elements.addedItemsList.innerHTML = recentAdds.map(item => {
    const product = products.find(p => p.id === item.id);
    const image = product ? product.image : "";
    return `
      <div class="added-item">
        <img src="${image}" alt="${item.name}" />
        <div class="added-item-info">
          <span>${item.name}</span>
          <strong>x${item.qty}</strong>
        </div>
      </div>
    `;
  }).join("");
}

function addToCart(id) {
  const existingItem = cart.find(item => item.id === id);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ id, qty: 1 });
  }

  const product = products.find(item => item.id === id);
  if (product) {
    const lastAdded = recentAdds[0];
    if (lastAdded && lastAdded.id === id) {
      lastAdded.qty += 1;
    } else {
      recentAdds.unshift({ id, name: product.name, qty: 1 });
    }
    if (recentAdds.length > 6) {
      recentAdds = recentAdds.slice(0, 6);
    }
  }

  saveCart();
  renderCart();
  renderAddedItems();
  if (elements.addedItemsList) {
    elements.addedItemsList.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
  showToast("Item added to cart");
}

function updateCart(id, action) {
  const item = cart.find(item => item.id === id);
  if (!item) return;

  if (action === "increase") {
    item.qty += 1;
  } else if (action === "decrease") {
    item.qty -= 1;
    if (item.qty <= 0) {
      cart = cart.filter(cartItem => cartItem.id !== id);
    }
  } else if (action === "remove") {
    cart = cart.filter(cartItem => cartItem.id !== id);
  }

  const cartIsEmpty = cart.length === 0;
  if (cartIsEmpty) {
    clearCartState();
  } else {
    saveCart();
    renderCart();
    renderAddedItems();
  }

  if (cartIsEmpty) {
    showToast("Your cart is empty");
  }
}

function addSupportMessage(text, sender = "bot") {
  if (!elements.supportMessages) return;

  const bubble = document.createElement("div");
  bubble.className = `support-bubble ${sender}`;
  bubble.textContent = text;
  elements.supportMessages.appendChild(bubble);
  elements.supportMessages.scrollTop = elements.supportMessages.scrollHeight;
}

function getSupportReply(message) {
  const text = message.toLowerCase();

  if (text.includes("email") || text.includes("mail")) {
    return `You can reach us at ${supportDetails.email}.`;
  }

  if (text.includes("number") || text.includes("phone") || text.includes("call")) {
    return `You can call or SMS ${supportDetails.phone}.`;
  }

  if (text.includes("address") || text.includes("location") || text.includes("where")) {
    return `We are based in ${supportDetails.address}.`;
  }

  if (text.includes("order") || text.includes("delivery") || text.includes("track")) {
    return "I can help with order updates, delivery timing, and tracking questions.";
  }

  if (text.includes("refund") || text.includes("return")) {
    return "I can guide you through refund and return requests quickly.";
  }

  if (text.includes("price") || text.includes("product") || text.includes("juice")) {
    return "I can help you choose fresh products and answer pricing questions.";
  }

  return "I’m your 24/7 FreshCart AI assistant. I can help with orders, deliveries, product suggestions, returns, and support contact details.";
}

function initSupportChat() {
  if (!elements.supportMessages || !elements.supportForm || !elements.supportInput) return;

  addSupportMessage(`Hello! I’m your 24/7 FreshCart support agent. I can help with orders, delivery, returns, or product questions. You can also contact us at ${supportDetails.email} or call ${supportDetails.phone}.`, "bot");

  elements.supportForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const userText = elements.supportInput.value.trim();
    if (!userText) return;

    addSupportMessage(userText, "user");
    elements.supportInput.value = "";

    window.setTimeout(() => {
      addSupportMessage(getSupportReply(userText), "bot");
    }, 450);
  });
}

function bindEvents() {
  elements.loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = elements.emailInput.value.trim();

    if (!isValidEmail(email)) {
      elements.loginError.textContent = "Please enter a valid email address.";
      return;
    }

    elements.loginError.textContent = "";
    sessionStorage.setItem("freshCartLoggedIn", "true");
    sessionStorage.setItem("freshCartEmail", email);
    isLoggedIn = true;
    elements.loginScreen.classList.add("hidden");
    elements.app.classList.remove("hidden");
    showToast(`Welcome, ${email}`);
    showView("home");
    renderCart();
    renderAddedItems();
  });

  document.querySelectorAll(".nav-btn, .hero-actions button, [data-view]").forEach(button => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const viewName = button.dataset.view;
      if (viewName) {
        showView(viewName);
      }
    });
  });

  elements.searchInput.addEventListener("input", (e) => {
    searchTerm = e.target.value.trim().toLowerCase();
    renderProducts();
  });

  elements.categoryFilters.addEventListener("click", (e) => {
    const button = e.target.closest(".filter-btn");
    if (!button) return;

    document.querySelectorAll(".filter-btn").forEach(btn => {
      btn.classList.toggle("active", btn === button);
    });

    activeCategory = button.dataset.filter;
    renderProducts();
  });

  elements.productsGrid.addEventListener("click", (e) => {
    e.preventDefault();
    const addBtn = e.target.closest(".add-btn");
    const viewBtn = e.target.closest("[data-view='detail']");
    if (addBtn) {
      addToCart(Number(addBtn.dataset.id));
    }
    if (viewBtn) {
      currentProductId = Number(viewBtn.dataset.id);
      renderDetail();
      showView("detail");
    }
  });

  elements.detailContent.addEventListener("click", (e) => {
    e.preventDefault();
    const addBtn = e.target.closest("[data-action='add-detail']");
    const backBtn = e.target.closest("[data-action='back']");
    if (addBtn) {
      addToCart(Number(addBtn.dataset.id));
    }
    if (backBtn) {
      showView("products");
    }
  });

  elements.cartItems.addEventListener("click", (e) => {
    const button = e.target.closest("button[data-action]");
    if (!button) return;
    updateCart(Number(button.dataset.id), button.dataset.action);
  });

  elements.cartSummary.addEventListener("click", (e) => {
    const button = e.target.closest("[data-view='checkout']");
    if (button) {
      showView("checkout");
    }
  });

  elements.checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      clearCartState();
      elements.orderMessage.className = "message error";
      elements.orderMessage.textContent = "Your cart is empty. Add products first.";
      return;
    }

    const formData = new FormData(elements.checkoutForm);
    const name = formData.get("name") || "Customer";

    elements.orderMessage.className = "message success";
    elements.orderMessage.textContent = `Thank you, ${name}! Your order has been placed successfully.`;

    cart = [];
    recentAdds = [];
    saveCart();
    renderCart();
    renderAddedItems();
    elements.checkoutForm.reset();
    showToast("Order placed successfully");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  bindEvents();
  restoreAppState();
  renderProducts();
  renderCart();
  renderDetail();
  renderAddedItems();
  initSupportChat();
});