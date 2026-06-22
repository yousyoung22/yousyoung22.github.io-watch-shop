const products = [
{ id:1, name:"Moissanite tennis chain", price:450000, image:"images/3체인.jpg" },
{ id:2, name:"Corteiz pendent", price:250000, image:"images/검.jpg" },
{ id:3, name:"LIVE YOURS pendent", price:410000, image:"images/글씨.jpg" },
{ id:4, name:"YVL pendent", price:370000, image:"images/나무.jpg" },
{ id:5, name:"King von O'block pendent", price:370000, image:"images/노랑오.jpg" },
{ id:6, name:"Playboi carti star pendent", price:380000, image:"images/별.jpg" },
{ id:7, name:"King von O'block pendent", price:370000, image:"images/빨간오.jpg" },
{ id:8, name:"Murakami pendent", price:290000, image:"images/빨강예티.jpg" },
{ id:9, name:"Candy pendent", price:270000, image:"images/사탕.jpg" },
{ id:10, name:"Sonic pendent", price:380000, image:"images/소닉.jpg" },
{ id:11, name:"Cross pendent", price:260000, image:"images/십자가.jpg" },
{ id:12, name:"Elizabeth pendent", price:300000, image:"images/얼굴.jpg" },
{ id:13, name:"Elizabeth pendent", price:300000, image:"images/왼쪽얼굴.jpg" },
{ id:14, name:"Murakami pendent", price:290000, image:"images/주황예티.jpg" },
{ id:15, name:"Hello kitty pendent", price:320000, image:"images/키티.jpg" },
{ id:16, name:"Platboi carti rabbit pendent", price:230000, image:"images/토끼.jpg" },
{ id:17, name:"Sonic pendent", price:380000, image:"images/파랑소닉.jpg" },
{ id:18, name:"Murakami pendent", price:290000, image:"images/파랑예티.jpg" },
{ id:19, name:"Murakami pendent", price:290000, image:"images/하늘예티.jpg" },
{ id:20, name:"Skull pendent", price:370000, image:"images/해골.jpg" },
{ id:21, name:"Murakami pendent", price:290000, image:"images/흰색예티.jpg" },
{ id:22, name:"King von O'block pendent", price:370000, image:"images/흰오.jpg" }
];

let cart = [];

const grid = document.getElementById("product-grid");

products.forEach(p=>{
grid.innerHTML += `
<div class="product">
<img src="${p.image}">
<h3>${p.name}</h3>
<p>₩${p.price.toLocaleString()}</p>
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
<div class="cart-card">
<img src="${c.image}">
<div class="cart-info">
<div>${c.name}</div>
<div>₩${c.price.toLocaleString()}</div>
</div>
<button class="cart-delete" onclick="remove(${i})">삭제</button>
</div>
`;
});

document.getElementById("total").innerText = "₩" + total.toLocaleString();
document.getElementById("cart-count").innerText = cart.length;
}

function remove(i){
cart.splice(i,1);
update();
}

function openCart(){
document.getElementById("cart-panel").classList.add("active");
document.getElementById("backdrop").classList.add("active");
}

function closeCart(){
document.getElementById("cart-panel").classList.remove("active");
document.getElementById("backdrop").classList.remove("active");
}

function buy(){
alert("결제 완료");
}

function toggleMenu(){
document.getElementById("nav-menu").classList.toggle("active");
}

document.getElementById("cart-btn").onclick = openCart;