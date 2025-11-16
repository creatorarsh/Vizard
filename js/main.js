// main.js
// If localStorage has products use them, otherwise seed with sample products
const PRODUCTS_KEY = "vizard_products_v1";
const CART_KEY = "vizard_cart_v1";

const sampleProducts = [
  { id: "1", name: "iPhone 17", price: 129999, category: "Mobiles", description: "Latest iPhone 17 — blazing fast.", image: "assets/images/iphone17.png" },
  { id: "2", name: "iPhone 14", price: 79999, category: "Mobiles", description: "iPhone 14 — reliable & sleek.", image: "assets/images/iphone14.png" },
  { id: "3", name: "Samsung Galaxy S23", price: 69999, category: "Mobiles", description: "Samsung flagship.", image: "assets/images/s23.png" },
  { id: "4", name: "Noise Headphones", price: 2999, category: "Accessories", description: "Immersive audio.", image: "assets/images/headphones.png" }
];

function loadProductsFromStorage(){
  const raw = localStorage.getItem(PRODUCTS_KEY);
  if(!raw){
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(sampleProducts));
    return sampleProducts;
  }
  try{ return JSON.parse(raw); } catch(e){ localStorage.setItem(PRODUCTS_KEY, JSON.stringify(sampleProducts)); return sampleProducts; }
}

let allProducts = loadProductsFromStorage();
const productList = document.getElementById("productList");
const searchInput = document.getElementById("searchInput");
const categoryButtons = document.querySelectorAll(".category-btn");
const cartCountEl = document.getElementById("cartCount");

function updateCartCount(){
  const cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  cartCountEl.innerText = cart.length;
}
updateCartCount();

function displayProducts(products){
  productList.innerHTML = "";
  if(!products || products.length===0){
    productList.innerHTML = `<div class="col-12 text-center text-muted">No products found.</div>`;
    return;
  }
  products.forEach(p=>{
    const col = document.createElement("div");
    col.className = "col-md-3 col-6 mb-4";
    col.innerHTML = `
      <div class="card text-center p-2">
        <img src="${p.image}" alt="${escapeHtml(p.name)}" height="150" loading="lazy">
        <div class="card-body">
          <h5>${escapeHtml(p.name)}</h5>
          <p class="text-muted mb-1">₹${numberWithCommas(p.price)}</p>
          <a href="product.html?id=${encodeURIComponent(p.id)}" class="btn btn-danger w-100">View</a>
        </div>
      </div>
    `;
    productList.appendChild(col);
  });
}

function numberWithCommas(x){ return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }

// initial display
displayProducts(allProducts);

// Search
if(searchInput){
  searchInput.addEventListener("input", ()=> {
    const q = searchInput.value.trim().toLowerCase();
    const filtered = allProducts.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    displayProducts(filtered);
  });
}

// Category filter
categoryButtons.forEach(btn=>{
  btn.addEventListener("click", ()=>{
    categoryButtons.forEach(b=>b.classList.remove("btn-danger"));
    categoryButtons.forEach(b=>b.classList.add("btn-outline-light"));
    btn.classList.remove("btn-outline-light");
    btn.classList.add("btn-danger");

    const cat = btn.getAttribute("data-cat");
    if(cat === "All") displayProducts(allProducts);
    else displayProducts(allProducts.filter(p=>p.category === cat));
  });
});

// listen to storage changes (so admin.html in another tab updates view)
window.addEventListener("storage", (e)=>{
  if(e.key === PRODUCTS_KEY){
    allProducts = loadProductsFromStorage();
    displayProducts(allProducts);
  }
  if(e.key === CART_KEY) updateCartCount();
});
