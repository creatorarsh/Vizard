// cart.js
const CART_KEY = "vizard_cart_v1";
function loadCart(){ return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); }
function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); window.dispatchEvent(new Event('storage')); }

const cartList = document.getElementById("cartList");
const cartFooter = document.getElementById("cartFooter");

function renderCart(){
  const cart = loadCart();
  cartList.innerHTML = "";
  if(cart.length===0){
    cartList.innerHTML = `<p class="text-muted">Your cart is empty.</p>`;
    cartFooter.innerHTML = '';
    return;
  }
  let total = 0;
  cart.forEach((p, i) => {
    total += Number(p.price);
    const div = document.createElement("div");
    div.className = "card mb-2 p-2";
    div.innerHTML = `
      <div class="row align-items-center">
        <div class="col-3"><img src="${p.image}" class="img-fluid"/></div>
        <div class="col-6">
          <h6>${p.name}</h6>
          <p class="text-muted mb-0">₹${Number(p.price).toLocaleString()}</p>
        </div>
        <div class="col-3 text-end">
          <button class="btn btn-outline-light removeBtn" data-i="${i}">Remove</button>
        </div>
      </div>
    `;
    cartList.appendChild(div);
  });

  cartFooter.innerHTML = `
    <div class="d-flex justify-content-between align-items-center">
      <h5>Total: ₹${total.toLocaleString()}</h5>
      <div>
        <button id="clearCart" class="btn btn-outline-light me-2">Clear</button>
        <button id="proceed" class="btn btn-danger">Proceed to Checkout</button>
      </div>
    </div>
  `;

  document.querySelectorAll(".removeBtn").forEach(btn=>{
    btn.addEventListener("click", (e)=>{
      const i = Number(e.target.getAttribute("data-i"));
      const cart = loadCart();
      cart.splice(i,1);
      saveCart(cart);
      renderCart();
    });
  });

  document.getElementById("clearCart").addEventListener("click", ()=>{
    if(confirm("Clear cart?")){
      saveCart([]);
      renderCart();
    }
  });
  document.getElementById("proceed").addEventListener("click", ()=> location.href = "checkout.html");
}

renderCart();
window.addEventListener("storage", renderCart);
