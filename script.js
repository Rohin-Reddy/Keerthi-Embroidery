/* Kreethi Embroidery
   Shared storefront logic for listing, cart, product detail, WhatsApp sharing,
   and checkout flow. All data stays in localStorage for a backend-free demo.
*/

const BUSINESS_NAME = "Kreethi Embroidery";
const WHATSAPP_NUMBER = "918074432947"; // Replace with your business WhatsApp number.
const RAZORPAY_KEY_ID = ""; // Add your Razorpay test key here if you want the payment widget.
const CART_KEY = "svcrafts_cart";
let currentFilter = "all";
const categoryCatalog = [
  {
    slug: "allover-blouse",
    label: "Allover Blouse",
    prefix: "allover",
    template: [
      { title: "Floral Allover Grid", price: 520, description: "Dense floral repeat layout for full blouse coverage.", image: "images/1.jpeg" },
      { title: "Paisley Allover Mesh", price: 610, description: "Elegant paisley repetition for rich blouse styling.", image: "images/2.jpeg" },
      { title: "Temple Allover Design", price: 580, description: "Traditional temple inspired repeat pattern.", image: "images/3.jpeg" }
    ]
  },
  {
    slug: "blouse-neck",
    label: "Blouse Neck",
    prefix: "blouseneck",
    template: [
      { title: "Round Neck Flower", price: 430, description: "Soft floral neck design for everyday blouses.", image: "images/4.jpeg" },
      { title: "Deep Neck Border", price: 490, description: "Decorative border for deeper neckline styles.", image: "images/5.jpeg" },
      { title: "Princess Neck Yoke", price: 560, description: "Balanced yoke styling for festive blouses.", image: "images/6.jpeg" }
    ]
  },
  {
    slug: "saree-pallus",
    label: "Saree Pallus",
    prefix: "pallu",
    template: [
      { title: "Royal Pallu Panel", price: 780, description: "Large-format saree pallu composition.", image: "images/7.jpeg" },
      { title: "Lotus Drop Pallu", price: 820, description: "Flowing lotus motifs for statement pallus.", image: "images/8.jpeg" },
      { title: "Bridal Grand Pallu", price: 910, description: "Heavy decorative pallu for bridal wear.", image: "images/9.jpeg" }
    ]
  },
  {
    slug: "boat-neck",
    label: "Boat Neck",
    prefix: "boat",
    template: [
      { title: "Boat Neck Vine", price: 410, description: "Graceful vine work for boat neck blouses.", image: "images/10.jpeg" },
      { title: "Boat Neck Motif", price: 450, description: "Central motif framing with clean outlines.", image: "images/11.jpeg" },
      { title: "Boat Neck Pearl", price: 500, description: "Pearl-style decorative boat neck pattern.", image: "images/12.jpeg" }
    ]
  },
  {
    slug: "cut-work",
    label: "Cut Work",
    prefix: "cutwork",
    template: [
      { title: "Cut Work Floral", price: 590, description: "Light cut work floral styling for blouses.", image: "images/13.jpeg" },
      { title: "Cut Work Arch", price: 640, description: "Neat arch borders with a premium finish.", image: "images/14.jpeg" },
      { title: "Cut Work Fusion", price: 670, description: "Modern fusion cut work for stylish outfits.", image: "images/15.jpeg" }
    ]
  },
  {
    slug: "kid-neck",
    label: "Kid Neck",
    prefix: "kidneck",
    template: [
      { title: "Kids Floral Neck", price: 360, description: "Cute floral neck design for children wear.", image: "images/16.jpeg" },
      { title: "Kids Heart Border", price: 380, description: "Playful heart border with soft colors.", image: "images/17.jpeg" },
      { title: "Kids Star Neck", price: 400, description: "Bright star style neck pattern for kids.", image: "images/18.jpeg" }
    ]
  },
  {
    slug: "kutch-work",
    label: "Kutch Work",
    prefix: "kutch",
    template: [
      { title: "Kutch Mirror Row", price: 620, description: "Colorful mirror-inspired kutch styling.", image: "images/19.jpeg" },
      { title: "Kutch Border Mix", price: 650, description: "Bold kutch border with handcrafted feel.", image: "images/20.jpeg" },
      { title: "Kutch Traditional Set", price: 700, description: "Classic kutch embroidery composition.", image: "images/1.jpeg" }
    ]
  },
  {
    slug: "net-designs",
    label: "Net Designs",
    prefix: "net",
    template: [
      { title: "Net Floral Spray", price: 540, description: "Airy floral spray for net fabrics.", image: "images/2.jpeg" },
      { title: "Net Layer Border", price: 580, description: "Layered border styling for transparent fabrics.", image: "images/3.jpeg" },
      { title: "Net Bridal Netting", price: 720, description: "Detailed net embroidery for festive wear.", image: "images/4.jpeg" }
    ]
  },
  {
    slug: "pot-designs",
    label: "Pot Designs",
    prefix: "pot",
    template: [
      { title: "Pot Motif Center", price: 430, description: "Decorative pot motif for blouse centers.", image: "images/5.jpeg" },
      { title: "Pot Border Combo", price: 470, description: "Pot pattern paired with border accents.", image: "images/6.jpeg" },
      { title: "Pot Art Panel", price: 510, description: "Traditional pot art composition in thread.", image: "images/7.jpeg" }
    ]
  },
  {
    slug: "tassels-works",
    label: "Tassels Works",
    prefix: "tassel",
    template: [
      { title: "Sunrise Kuchulu", price: 260, description: "Bright and cheerful tassels with layered threads.", image: "images/11.jpeg" },
      { title: "Rani Pink Tassels", price: 320, description: "Rich tasseled accent set for sarees and dupattas.", image: "images/12.jpeg" },
      { title: "Festive Silk Tassels", price: 370, description: "Silk-feel tassels for premium festive wear.", image: "images/13.jpeg" }
    ]
  }
];

const products = generateCatalog();

function generateCatalog() {
  const items = [];
  categoryCatalog.forEach((category, categoryIndex) => {
    category.template.forEach((template, templateIndex) => {
      for (let variant = 1; variant <= 3; variant += 1) {
        items.push({
          id: `${category.prefix}-${templateIndex + 1}-${variant}`,
          title: `${template.title} ${variant}`,
          category: category.slug,
          categoryLabel: category.label,
          price: template.price + (variant - 1) * 30,
          description: `${template.description} Variant ${variant}.`,
          image: template.image,
          sortOrder: categoryIndex * 100 + templateIndex * 10 + variant
        });
      }
    });
  });
  return items;
}

function makeArt(label, c1, c2) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="675" viewBox="0 0 900 675">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${c1}"/>
          <stop offset="100%" stop-color="${c2}"/>
        </linearGradient>
      </defs>
      <rect width="900" height="675" rx="42" fill="url(#g)"/>
      <circle cx="150" cy="140" r="74" fill="rgba(255,255,255,0.16)"/>
      <circle cx="760" cy="120" r="58" fill="rgba(255,255,255,0.12)"/>
      <circle cx="720" cy="500" r="118" fill="rgba(255,255,255,0.08)"/>
      <path d="M210 470 C310 360, 410 360, 510 470 C610 580, 690 580, 780 430" stroke="rgba(255,255,255,0.22)" stroke-width="18" fill="none" stroke-linecap="round"/>
      <path d="M390 130 C435 90, 485 90, 530 130 C485 170, 435 170, 390 130 Z" fill="rgba(255,255,255,0.18)"/>
      <text x="54" y="610" fill="rgba(255,255,255,0.92)" font-family="Arial, sans-serif" font-size="44" font-weight="700">${label}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function formatPrice(amount) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function addToCart(productId, quantity = 1) {
  const cart = getCart();
  const item = cart.find(entry => entry.id === productId);
  if (item) {
    item.quantity += quantity;
  } else {
    cart.push({ id: productId, quantity });
  }
  saveCart(cart);
}

function updateQuantity(productId, quantity) {
  const cart = getCart()
    .map(item => item.id === productId ? { ...item, quantity } : item)
    .filter(item => item.quantity > 0);
  saveCart(cart);
}

function removeFromCart(productId) {
  const cart = getCart().filter(item => item.id !== productId);
  saveCart(cart);
}

function cartItemsDetailed() {
  return getCart()
    .map(item => {
      const product = products.find(entry => entry.id === item.id);
      return product ? { ...product, quantity: item.quantity } : null;
    })
    .filter(Boolean);
}

function cartTotal() {
  return cartItemsDetailed().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll("[data-cart-count]").forEach(el => {
    el.textContent = count;
  });
}

function whatsappLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function orderMessage(product, qty = 1) {
  return `Hello ${BUSINESS_NAME}, I would like to order ${qty} x ${product.title} (${formatPrice(product.price)} each). Please share details.`;
}

function buildProductCard(product) {
  const article = document.createElement("article");
  article.className = "product-card reveal";
  article.innerHTML = `
    <a href="product.html?id=${encodeURIComponent(product.id)}" aria-label="View details for ${product.title}">
      <div class="product-image" style="background-image:url('${product.image}')"></div>
    </a>
    <div class="product-body">
      <span class="product-category">${product.categoryLabel || product.category}</span>
      <div class="product-meta">
        <h3>${product.title}</h3>
        <span class="product-price">${formatPrice(product.price)}</span>
      </div>
      <p class="product-desc">${product.description}</p>
      <div class="product-actions">
        <button class="btn btn-primary" data-add="${product.id}">Add to Cart</button>
        <a class="btn btn-secondary" href="${whatsappLink(orderMessage(product))}" target="_blank" rel="noopener">Order on WhatsApp</a>
      </div>
    </div>
  `;
  return article;
}

function getFilteredProducts(filter = "all") {
  return products.filter(product => filter === "all" || product.category === filter);
}

function getSearchTerm() {
  return (document.getElementById("product-search")?.value || "").trim().toLowerCase();
}

function renderProductGrid(container, filter = "all") {
  if (!container) return;
  const searchTerm = getSearchTerm();
  const items = getFilteredProducts(filter).filter(product => {
    if (!searchTerm) return true;
    return [
      product.title,
      product.categoryLabel,
      product.category,
      product.description
    ].some(value => String(value).toLowerCase().includes(searchTerm));
  });
  container.innerHTML = "";
  items.forEach(product => container.appendChild(buildProductCard(product)));
}

function renderFeaturedProducts() {
  const container = document.getElementById("featured-products");
  if (!container) return;
  const items = products.slice(0, 6);
  container.innerHTML = "";
  items.forEach(product => container.appendChild(buildProductCard(product)));
  Array.from(container.children).slice(6).forEach(node => node.remove());
}

function renderShopProducts() {
  const container = document.getElementById("shop-products");
  if (!container) return;
  const url = new URL(window.location.href);
  currentFilter = url.searchParams.get("category") || "all";
  renderProductGrid(container, currentFilter);
  document.querySelectorAll("[data-filter]").forEach(button => {
    button.classList.toggle("active", button.dataset.filter === currentFilter);
    button.addEventListener("click", () => {
      currentFilter = button.dataset.filter;
      renderProductGrid(container, currentFilter);
      document.querySelectorAll("[data-filter]").forEach(btn => btn.classList.toggle("active", btn.dataset.filter === currentFilter));
      bindProductButtons(container);
    });
  });
  const search = document.getElementById("product-search");
  if (search) {
    search.addEventListener("input", () => renderProductGrid(container, currentFilter));
  }
  bindProductButtons(container);
}

function bindProductButtons(scope = document) {
  scope.querySelectorAll("[data-add]").forEach(button => {
    button.addEventListener("click", () => {
      addToCart(button.dataset.add, 1);
      flashButton(button, "Added");
    });
  });
}

function flashButton(button, text) {
  const original = button.textContent;
  button.textContent = text;
  setTimeout(() => {
    button.textContent = original;
  }, 900);
}

function renderProductDetail() {
  const mount = document.getElementById("product-detail");
  if (!mount) return;
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id") || products[0].id;
  const product = products.find(entry => entry.id === id) || products[0];
  document.title = `${product.title} | ${BUSINESS_NAME}`;
  mount.innerHTML = `
    <article class="product-detail-card reveal">
      <div class="product-detail-image" style="background-image:url('${product.image}')"></div>
      <div class="product-detail-body">
        <span class="product-category">${product.categoryLabel || product.category}</span>
        <h1>${product.title}</h1>
        <p class="lead">${product.description}</p>
        <p class="product-price">${formatPrice(product.price)}</p>
        <ul class="detail-list">
          <li>Locally stored cart support</li>
          <li>WhatsApp prefilled ordering message</li>
          <li>Responsive design for phones and tablets</li>
        </ul>
        <div class="hero-actions">
          <button class="btn btn-primary" data-add="${product.id}">Add to Cart</button>
          <a class="btn btn-secondary" href="${whatsappLink(orderMessage(product))}" target="_blank" rel="noopener">Order on WhatsApp</a>
          <a class="btn btn-secondary" href="shop.html">Back to Shop</a>
        </div>
      </div>
    </article>
  `;
  bindProductButtons(mount);
}

function renderCartPage() {
  const mount = document.getElementById("cart-items");
  const subtotalEl = document.getElementById("cart-subtotal");
  const totalEl = document.getElementById("cart-total");
  if (!mount || !subtotalEl || !totalEl) return;

  const items = cartItemsDetailed();
  if (!items.length) {
    mount.innerHTML = `
      <div class="card-panel" style="box-shadow:none;">
        <h3>Your cart is empty</h3>
        <p class="lead">Browse the shop and add embroidery designs or tassel works to start your order.</p>
        <a class="btn btn-primary" href="shop.html">Go to Shop</a>
      </div>
    `;
  } else {
    mount.innerHTML = "";
    items.forEach(item => {
      const row = document.createElement("article");
      row.className = "cart-item";
      row.innerHTML = `
        <div class="cart-item-thumb" style="background-image:url('${item.image}')"></div>
        <div>
          <h3>${item.title}</h3>
          <p>${formatPrice(item.price)} each</p>
          <p><strong>${formatPrice(item.price * item.quantity)}</strong></p>
        </div>
        <div class="cart-controls">
          <div class="qty-controls" aria-label="Quantity controls">
            <button class="qty-btn" data-dec="${item.id}">−</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn" data-inc="${item.id}">+</button>
          </div>
          <button class="icon-btn" data-remove="${item.id}">Remove</button>
        </div>
      `;
      mount.appendChild(row);
    });
  }

  subtotalEl.textContent = formatPrice(cartTotal());
  totalEl.textContent = formatPrice(cartTotal());

  mount.addEventListener("click", handleCartActions, { once: true });
}

function handleCartActions(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const inc = target.dataset.inc;
  const dec = target.dataset.dec;
  const remove = target.dataset.remove;
  if (inc) {
    const item = getCart().find(entry => entry.id === inc);
    if (item) updateQuantity(inc, item.quantity + 1);
    renderCartPage();
  }
  if (dec) {
    const item = getCart().find(entry => entry.id === dec);
    if (item) updateQuantity(dec, item.quantity - 1);
    renderCartPage();
  }
  if (remove) {
    removeFromCart(remove);
    renderCartPage();
  }
}

function renderCheckoutPage() {
  const totalEl = document.getElementById("checkout-total");
  if (totalEl) totalEl.textContent = formatPrice(cartTotal());
}

function setupCheckoutForm() {
  const form = document.getElementById("checkout-form");
  if (!form) return;

  form.addEventListener("submit", event => {
    event.preventDefault();
    const fd = new FormData(form);
    const details = {
      name: String(fd.get("name") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      address: String(fd.get("address") || "").trim(),
      payment: String(fd.get("payment") || "upi")
    };

    if (!cartItemsDetailed().length) {
      alert("Your cart is empty. Please add products before checkout.");
      window.location.href = "shop.html";
      return;
    }

    if (details.payment === "razorpay" && RAZORPAY_KEY_ID) {
      openRazorpay(details);
      return;
    }

    const summary = cartItemsDetailed()
      .map(item => `${item.quantity} x ${item.title}`)
      .join(", ");
    const message = `Hello ${BUSINESS_NAME}, I want to place an order.\nName: ${details.name}\nPhone: ${details.phone}\nAddress: ${details.address}\nItems: ${summary}\nTotal: ${formatPrice(cartTotal())}\nPayment: UPI / manual confirmation`;
    window.open(whatsappLink(message), "_blank", "noopener");
  });
}

function openRazorpay(details) {
  const amount = cartTotal() * 100;
  const options = {
    key: RAZORPAY_KEY_ID,
    amount,
    currency: "INR",
    name: BUSINESS_NAME,
    description: "Embroidery and tassel order",
    prefill: {
      name: details.name,
      contact: details.phone
    },
    theme: {
      color: "#8c2f39"
    },
    handler: function () {
      alert("Payment successful in test mode. We will confirm your order shortly.");
    }
  };

  if (typeof window.Razorpay !== "function") {
    alert("Razorpay is unavailable right now. We will switch to UPI/manual confirmation.");
    const summary = cartItemsDetailed()
      .map(item => `${item.quantity} x ${item.title}`)
      .join(", ");
    const message = `Hello ${BUSINESS_NAME}, I want to place an order.\nName: ${details.name}\nPhone: ${details.phone}\nAddress: ${details.address}\nItems: ${summary}\nTotal: ${formatPrice(cartTotal())}\nPayment: UPI / manual confirmation`;
    window.open(whatsappLink(message), "_blank", "noopener");
    return;
  }

  const checkout = new window.Razorpay(options);
  checkout.open();
}

function setupContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  form.addEventListener("submit", event => {
    event.preventDefault();
    const fd = new FormData(form);
    const message = `Hello ${BUSINESS_NAME},\nName: ${fd.get("name")}\nPhone: ${fd.get("phone")}\nMessage: ${fd.get("message")}`;
    window.open(whatsappLink(message), "_blank", "noopener");
  });
}

function setupNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

function initHomePage() {
  renderFeaturedProducts();
  bindProductButtons(document.getElementById("featured-products") || document);
}

function initPage() {
  updateCartCount();
  setupNavToggle();
  bindProductButtons();

  const page = document.body.dataset.page;
  if (page === "home") initHomePage();
  if (page === "shop") renderShopProducts();
  if (page === "product") renderProductDetail();
  if (page === "cart") renderCartPage();
  if (page === "checkout") {
    renderCheckoutPage();
    setupCheckoutForm();
  }
  if (page === "contact") setupContactForm();
}

document.addEventListener("DOMContentLoaded", initPage);
