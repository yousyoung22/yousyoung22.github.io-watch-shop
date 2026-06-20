const products = [

{
id:1,
name:"다이아몬드 링",
price:4900000,
image:"images/1.jpg"
},

{
id:2,
name:"럭셔리 목걸이",
price:3200000,
image:"images/2.jpg"
},

{
id:3,
name:"화이트골드 팔찌",
price:2100000,
image:"images/3.jpg"
},

{
id:4,
name:"프리미엄 이어링",
price:1800000,
image:"images/4.jpg"
},

{
id:5,
name:"로얄 다이아 반지",
price:6500000,
image:"images/5.jpg"
},

{
id:6,
name:"클래식 목걸이",
price:2700000,
image:"images/6.jpg"
},

{
id:7,
name:"18K 골드 링",
price:3400000,
image:"images/7.jpg"
},

{
id:8,
name:"플래티넘 팔찌",
price:3900000,
image:"images/8.jpg"
},

{
id:9,
name:"시그니처 이어링",
price:1700000,
image:"images/9.jpg"
},

{
id:10,
name:"럭셔리 세트",
price:7200000,
image:"images/10.jpg"
},

{
id:11,
name:"상품11",
price:1100000,
image:"images/11.jpg"
},

{
id:12,
name:"상품12",
price:1200000,
image:"images/12.jpg"
},

{
id:13,
name:"상품13",
price:1300000,
image:"images/13.jpg"
},

{
id:14,
name:"상품14",
price:1400000,
image:"images/14.jpg"
},

{
id:15,
name:"상품15",
price:1500000,
image:"images/15.jpg"
},

{
id:16,
name:"상품16",
price:1600000,
image:"images/16.jpg"
},

{
id:17,
name:"상품17",
price:1700000,
image:"images/17.jpg"
},

{
id:18,
name:"상품18",
price:1800000,
image:"images/18.jpg"
},

{
id:19,
name:"상품19",
price:1900000,
image:"images/19.jpg"
},

{
id:20,
name:"상품20",
price:2000000,
image:"images/20.jpg"
},

{
id:21,
name:"상품21",
price:2100000,
image:"images/21.jpg"
},

{
id:22,
name:"상품22",
price:2200000,
image:"images/22.jpg"
},

{
id:23,
name:"상품23",
price:2300000,
image:"images/23.jpg"
},

{
id:24,
name:"상품24",
price:2400000,
image:"images/24.jpg"
},

{
id:25,
name:"상품25",
price:2500000,
image:"images/25.jpg"
},

{
id:26,
name:"상품26",
price:2600000,
image:"images/26.jpg"
},

{
id:27,
name:"상품27",
price:2700000,
image:"images/27.jpg"
},

{
id:28,
name:"상품28",
price:2800000,
image:"images/28.jpg"
},

{
id:29,
name:"상품29",
price:2900000,
image:"images/29.jpg"
},

{
id:30,
name:"상품30",
price:3000000,
image:"images/30.jpg"
}

];

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