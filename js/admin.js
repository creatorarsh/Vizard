// admin.js
const PRODUCTS_KEY = "vizard_products_v1";
const form = document.getElementById("productForm");
const prodId = document.getElementById("prodId");
const prodName = document.getElementById("prodName");
const prodPrice = document.getElementById("prodPrice");
const prodCategory = document.getElementById("prodCategory");
const prodDesc = document.getElementById("prodDesc");
const prodImage = document.getElementById("prodImage");
const productsTable = document.getElementById("productsTable");
const cancelEdit = document.getElementById("cancelEdit");

function loadProducts(){ return JSON.parse(localStorage.getItem(PRODUCTS_KEY) || "[]"); }
function saveProducts(list){ localStorage.setItem(PRODUCTS_KEY, JSON.stringify(list)); window.dispatchEvent(new Event('storage')); }

function renderProducts(){
  const list = loadProducts();
  if(list.length===0){ productsTable.innerHTML = "<p class='text-muted'>No products yet.</p>"; return; }
  productsTable.innerHTML = "";
  list.forEach((p, i)=>{
    const row = document.createElement("div");
    row.className = "card mb-2 p-2";
    row.innerHTML = `
      <div class="row align-items-center">
        <div class="col-2"><img src="${p.image}" class="img-fluid" style="max-height:70px;"></div>
        <div class="col-6"><strong>${p.name}</strong><div class="text-muted">₹${Number(p.price).toLocaleString()} • ${p.category}</div></div>
        <div class="col-4 text-end">
          <button class="btn btn-outline-light btn-sm me-2" onclick="editProduct('${p.id}')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteProduct('${p.id}')">Delete</button>
        </div>
      </div>
    `;
    productsTable.appendChild(row);
  });
}

function resetForm(){
  prodId.value = "";
  prodName.value = "";
  prodPrice.value = "";
  prodCategory.value = "Mobiles";
  prodDesc.value = "";
  prodImage.value = "";
  cancelEdit.style.display = "none";
}

form.addEventListener("submit", async (e)=>{
  e.preventDefault();
  const list = loadProducts();
  // handle image
  let imgData = null;
  if(prodImage.files && prodImage.files[0]){
    imgData = await fileToDataUrl(prodImage.files[0]);
  }
  if(prodId.value){
    // update
    const idx = list.findIndex(x=>x.id===prodId.value);
    if(idx>-1){
      list[idx].name = prodName.value;
      list[idx].price = Number(prodPrice.value);
      list[idx].category = prodCategory.value;
      list[idx].description = prodDesc.value;
      if(imgData) list[idx].image = imgData;
    }
  } else {
    // add new
    const newProd = {
      id: Date.now().toString(),
      name: prodName.value,
      price: Number(prodPrice.value),
      category: prodCategory.value,
      description: prodDesc.value,
      image: imgData || "assets/images/placeholder.png"
    };
    list.unshift(newProd);
  }
  saveProducts(list);
  resetForm();
  renderProducts();
  alert("Saved!");
});

async function fileToDataUrl(file){
  return new Promise((res, rej)=>{
    const fr = new FileReader();
    fr.onload = ()=> res(fr.result);
    fr.onerror = rej;
    fr.readAsDataURL(file);
  });
}

window.editProduct = function(id){
  const list = loadProducts();
  const p = list.find(x=>x.id===id);
  if(!p) return alert("Not found");
  prodId.value = p.id;
  prodName.value = p.name;
  prodPrice.value = p.price;
  prodCategory.value = p.category;
  prodDesc.value = p.description || "";
  cancelEdit.style.display = "inline-block";
  window.scrollTo({top:0,behavior:'smooth'});
};

window.deleteProduct = function(id){
  if(!confirm("Delete product?")) return;
  let list = loadProducts();
  list = list.filter(x=>x.id!==id);
  saveProducts(list);
  renderProducts();
};

cancelEdit.addEventListener("click", ()=>{ resetForm(); });

renderProducts();
