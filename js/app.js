const products = [
{
id:1,
name:"3체인",
price:3200000,
image:"images/3체인.jpg"
},
{
id:2,
name:"검",
price:5400000,
image:"images/검.jpg"
},
{
id:3,
name:"글씨",
price:2100000,
image:"images/글씨.jpg"
},
{
id:4,
name:"나무",
price:1800000,
image:"images/나무.jpg"
},
{
id:5,
name:"노랑오",
price:6900000,
image:"images/노랑오.jpg"
},
{
id:6,
name:"별",
price:2700000,
image:"images/별.jpg"
},
{
id:7,
name:"빨간오",
price:3500000,
image:"images/빨간오.jpg"
},
{
id:8,
name:"빨강예티",
price:8900000,
image:"images/빨강예티.jpg"
}
];{
id:1,
name:"사탕",
price:3200000,
image:"images/사탕.jpg"
},
{
id:1,
name:"소닉",
price:3200000,
image:"images/소닉.jpg"
},
{
id:1,
name:"십자가",
price:3200000,
image:"images/십자가.jpg"
},
{
id:1,
name:"얼굴",
price:3200000,
image:"images/얼굴.jpg"
},
{
id:1,
name:"왼쪽얼굴",
price:3200000,
image:"images/왼쪽얼굴.jpg"
},
{
id:1,
name:"주황예티",
price:3200000,
image:"images/주황예티.jpg"
},
{
id:1,
name:"키티",
price:3200000,
image:"images/키티.jpg"
},
{
id:1,
name:"토끼",
price:3200000,
image:"images/토끼.jpg"
},
{
id:1,
name:"파랑소닉",
price:3200000,
image:"images/파랑소닉.jpg"
},
{
id:1,
name:"파랑예티",
price:3200000,
image:"images/파랑예티.jpg"
},
{
id:1,
name:"하늘예티",
price:3200000,
image:"images/하늘예티.jpg"
},
{
id:1,
name:"해골",
price:3200000,
image:"images/해골.jpg"
},
{
id:1,
name:"흰색예티",
price:3200000,
image:"images/흰색예티.jpg"
},
{
id:1,
name:"흰오",
price:3200000,
image:"images/흰오.jpg"
},

let cart = [];

const grid = document.getElementById("product-grid");

/* PRODUCT RENDER */
products.forEach(p=>{
grid.innerHTML += `
<div class="product">
<img src="${p.image}">
<h3>${p.name}</h3>
<p>${p.price.toLocaleString()}원</p>
<button onclick="addCart(${p.id})">장바구니</button>
</div>
`;
});

/* CART */
function addCart(id){
const item = products.find(p=>p.id===id);
cart.push(item);
updateCart();
openCart();
}

function updateCart(){
const box = document.getElementById("cart-items");
box.innerHTML = "";

let total = 0;

cart.forEach((c,i)=>{
total += c.price;

box.innerHTML += `
<div>
<p>${c.name}</p>
<p>${c.price.toLocaleString()}</p>
<button onclick="removeItem(${i})">삭제</button>
</div>
`;
});

document.getElementById("total").innerText = total;
document.getElementById("cart-count").innerText = cart.length;
}

function removeItem(i){
cart.splice(i,1);
updateCart();
}

function clearCart(){
cart = [];
updateCart();
}

function buy(){
alert("결제 페이지 이동");
}

function openCart(){
document.getElementById("cart-panel").classList.add("active");
}

function closeCart(){
document.getElementById("cart-panel").classList.remove("active");
}

document.getElementById("cart-btn").onclick = openCart;