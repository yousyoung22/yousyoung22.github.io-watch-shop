const products = [

{
id:1,
name:"3체인",
price:4900000,
image:"images/3체인.jpg"
},

{
id:2,
name:"검",
price:3200000,
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
price:6500000,
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
price:3400000,
image:"images/빨간오.jpg"
},

{
id:8,
name:"빨강예티",
price:3900000,
image:"images/빨강예티.jpg"
},

{
id:9,
name:"사탕",
price:1700000,
image:"images/사탕.jpg"
},

{
id:10,
name:"소닉",
price:7200000,
image:"images/소닉.jpg"
},

{
id:11,
name:"십자가",
price:1100000,
image:"images/십자가.jpg"
},

{
id:12,
name:"얼굴",
price:1200000,
image:"images/얼굴.jpg"
},

{
id:13,
name:"왼쪽얼굴",
price:1300000,
image:"images/왼쪽얼굴.jpg"
},

{
id:14,
name:"주황예티",
price:1400000,
image:"images/주황예티.jpg"
},

{
id:15,
name:"키티",
price:1500000,
image:"images/키티.jpg"
},

{
id:16,
name:"토끼",
price:1600000,
image:"images/토끼.jpg"
},

{
id:17,
name:"파랑소닉",
price:1700000,
image:"images/파랑소닉.jpg"
},

{
id:18,
name:"파랑예티",
price:1800000,
image:"images/파랑예티.jpg"
},

{
id:19,
name:"하늘예티",
price:1900000,
image:"images/하늘예티.jpg"
},

{
id:20,
name:"해골",
price:2000000,
image:"images/해골.jpg"
},

{
id:21,
name:"흰색예티",
price:2100000,
image:"images/흰색예티.jpg"
},

{
id:22,
name:"흰오",
price:2200000,
image:"images/흰오.jpg"
},


const grid=document.getElementById("product-grid");

products.forEach(product=>{

grid.innerHTML+=`
<div class="product">

<img src="${product.image}">

<div class="product-info">

<h3>${product.name}</h3>

<div class="price">
${product.price.toLocaleString()}원
</div>

<button class="btn"
onclick="showProduct(${product.id})">
상세보기
</button>

</div>

</div>
`;

});

let cart=[];

function showProduct(id){

const p=products.find(x=>x.id===id);

document.getElementById("modal-img").src=p.image;
document.getElementById("modal-title").innerText=p.name;
document.getElementById("modal-price").innerText=p.price.toLocaleString()+"원";

document.getElementById("modal-cart-btn").onclick=()=>{

addToCart(p);

};

document.getElementById("product-modal")
.classList.add("active");
}

document.getElementById("close-modal")
.onclick=()=>{

document.getElementById("product-modal")
.classList.remove("active");

};

function addToCart(product){

cart.push(product);

updateCart();

document.getElementById("cart-panel")
.classList.add("active");

}

function updateCart(){

const cartItems=
document.getElementById("cart-items");

cartItems.innerHTML="";

let total=0;

cart.forEach((item,index)=>{

total+=item.price;

cartItems.innerHTML+=`

<div class="cart-item">

<h4>${item.name}</h4>

<p>${item.price.toLocaleString()}원</p>

<button class="remove-btn"
onclick="removeItem(${index})">
삭제
</button>

</div>

`;

});

document.getElementById("total-price")
.innerText=total.toLocaleString();

document.getElementById("cart-count")
.innerText=cart.length;

}

function removeItem(index){

cart.splice(index,1);

updateCart();

}

document.querySelector(".clear-btn")
.onclick=()=>{

cart=[];

updateCart();

};

document.getElementById("cart-btn")
.onclick=()=>{

document.getElementById("cart-panel")
.classList.add("active");

};

document.getElementById("close-cart")
.onclick=()=>{

document.getElementById("cart-panel")
.classList.remove("active");

};

document.querySelector(".buy-btn")
.onclick=()=>{

if(cart.length===0){

alert("장바구니가 비어있습니다.");
return;

}

alert("결제 페이지로 이동합니다.");

};