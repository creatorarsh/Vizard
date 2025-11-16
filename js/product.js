// product.js
const PRODUCTS_KEY = "vizard_products_v1";
const CART_KEY = "vizard_cart_v1";

function loadProducts(){ return JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]"); }
function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); window.dispatchEvent(new Event('storage')); }

const params = new URLSearchParams(location.search);
const id = params.get("id");
const container = document.getElementById("productDetail");

const products = loadProducts();
const product = products.find(p => p.id === id);

if(!product){
  container.innerHTML = `<div class="alert alert-danger">Product not found.</div>`;
} else {
  container.innerHTML = `
    <div class="row">
      <div class="col-md-6 text-center">
        <img src="${product.image}" class="img-fluid" style="max-height:420px;"/>
      </div>
      <div class="col-md-6">
        <h2>${product.name}</h2>
        <h4 class="text-muted">₹${product.price.toLocaleString()}</h4>
        <p>${product.description || ""}</p>
        <div class="d-grid gap-2">
          <button id="addCart" class="btn btn-outline-light">Add to Cart</button>
          <button id="buyNow" class="btn btn-danger">Buy Now</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById("addCart").addEventListener("click", ()=>{
    let cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    cart.push(product);
    saveCart(cart);
    alert("Added to cart!");
  });
  document.getElementById("buyNow").addEventListener("click", ()=>{
    let cart = [product];
    saveCart(cart);
    location.href = "checkout.html";
  });
}
