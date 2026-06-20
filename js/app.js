const products = [
{ id:1, name:"3체인", price:1200000, image:"images/3체인.jpg" },
{ id:2, name:"검", price:900000, image:"images/검.jpg" },
{ id:3, name:"글씨", price:1100000, image:"images/글씨.jpg" },
{ id:4, name:"나무", price:1500000, image:"images/나무.jpg" },
{ id:5, name:"노랑오", price:1300000, image:"images/노랑오.jpg" },
{ id:6, name:"별", price:1700000, image:"images/별.jpg" },
{ id:7, name:"빨간오", price:1600000, image:"images/빨간오.jpg" },
{ id:8, name:"빨강예티", price:2100000, image:"images/빨강예티.jpg" },
{ id:9, name:"사탕", price:800000, image:"images/사탕.jpg" },
{ id:10, name:"소닉", price:2500000, image:"images/소닉.jpg" },
{ id:11, name:"십자가", price:3000000, image:"images/십자가.jpg" },
{ id:12, name:"얼굴", price:1800000, image:"images/얼굴.jpg" },
{ id:13, name:"왼쪽얼굴", price:1900000, image:"images/왼쪽얼굴.jpg" },
{ id:14, name:"주황예티", price:2200000, image:"images/주황예티.jpg" },
{ id:15, name:"키티", price:2600000, image:"images/키티.jpg" },
{ id:16, name:"토끼", price:1400000, image:"images/토끼.jpg" },
{ id:17, name:"파랑소닉", price:2400000, image:"images/파랑소닉.jpg" },
{ id:18, name:"파랑예티", price:2300000, image:"images/파랑예티.jpg" },
{ id:19, name:"하늘예티", price:2000000, image:"images/하늘예티.jpg" },
{ id:20, name:"해골", price:2800000, image:"images/해골.jpg" },
{ id:21, name:"흰색예티", price:2100000, image:"images/흰색예티.jpg" },
{ id:22, name:"흰오", price:1700000, image:"images/흰오.jpg" }
];

let cart = [];

const grid = document.getElementById("product-grid");

products.forEach(p=>{
grid.innerHTML += `
<div class="product">
<img src="${p.image}">
<h3>${p.name}</h3>
<p>${p.price.toLocaleString()}원</p>
<button onclick="add(${p.id})">장바구니</button>
</div>
`;
});

function add(id){
const item = products.find(p=>p.id===id);
cart.push(item);
update();
openCart();
}

function update(){
let box = document.getElementById("cart-items");
box.innerHTML = "";
let total = 0;

cart.forEach((c,i)=>{
total += c.price;
box.innerHTML += `
<div>
<p>${c.name}</p>
<p>${c.price.toLocaleString()}원</p>
<button onclick="remove(${i})">삭제</button>
</div>
`;
});

document.getElementById("total").innerText = total;
document.getElementById("cart-count").innerText = cart.length;
}

function remove(i){
cart.splice(i,1);
update();
}

function clearCart(){
cart=[];
update();
}

function buy(){
alert("결제 완료");
}

function openCart(){
document.getElementById("cart-panel").classList.add("active");
document.querySelector(".cart-backdrop").classList.add("active");
}

function closeCart(){
document.getElementById("cart-panel").classList.remove("active");
document.querySelector(".cart-backdrop").classList.remove("active");
}

document.getElementById("cart-btn").onclick=openCart;