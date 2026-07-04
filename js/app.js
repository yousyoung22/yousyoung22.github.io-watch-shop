const products = [
{ id:1, name:"Moissanite tennis chain", price:450000, image:"images/3체인.jpg" },
{ id:2, name:"Corteiz pendant", price:250000, image:"images/검.jpg" },
{ id:3, name:"LIVE YOURS pendant", price:410000, image:"images/글씨.jpg" },
{ id:4, name:"YVL pendant", price:370000, image:"images/나무.jpg" },
{ id:5, name:"King von O'block pendant", price:370000, image:"images/노랑오.jpg" },
{ id:6, name:"Playboi carti star pendant", price:380000, image:"images/별.jpg" },
{ id:7, name:"King von O'block pendant", price:370000, image:"images/빨간오.jpg" },
{ id:8, name:"Murakami pendant", price:290000, image:"images/빨강예티.jpg" },
{ id:9, name:"Candy pendant", price:270000, image:"images/사탕.jpg" },
{ id:10, name:"Sonic pendant", price:380000, image:"images/소닉.jpg" },
{ id:11, name:"Cross pendant", price:260000, image:"images/십자가.jpg" },
{ id:12, name:"Elizabeth pendant", price:300000, image:"images/얼굴.jpg" },
{ id:13, name:"Elizabeth pendant", price:300000, image:"images/왼쪽얼굴.jpg" },
{ id:14, name:"Murakami pendant", price:290000, image:"images/주황예티.jpg" },
{ id:15, name:"Hello kitty pendant", price:320000, image:"images/키티.jpg" },
{ id:16, name:"Playboi carti rabbit pendant", price:230000, image:"images/토끼.jpg" },
{ id:17, name:"Sonic pendant", price:380000, image:"images/파랑소닉.jpg" },
{ id:18, name:"Murakami pendant", price:290000, image:"images/파랑예티.jpg" },
{ id:19, name:"Murakami pendant", price:290000, image:"images/하늘예티.jpg" },
{ id:20, name:"Skull pendant", price:370000, image:"images/해골.jpg" },
{ id:21, name:"Murakami pendant", price:290000, image:"images/흰색예티.jpg" },
{ id:22, name:"King von O'block pendant", price:370000, image:"images/흰오.jpg" }
];

let cart = [];

const grid = document.getElementById("product-grid");
const cartPanel = document.getElementById("cart-panel");
const backdrop = document.getElementById("backdrop");
const cartItems = document.getElementById("cart-items");
const totalEl = document.getElementById("total");
const cartCount = document.getElementById("cart-count");
const navMenu = document.getElementById("nav-menu");

const money = price => "₩" + price.toLocaleString("ko-KR");

function renderProducts(){
    grid.innerHTML = products.map(p => `
        <div class="product">
            <div class="product-img">
                <img src="${p.image}" alt="${p.name}" loading="lazy">
                <span class="badge">SEOUL ICE</span>
            </div>
            <h3>${p.name}</h3>
            <p class="price">${money(p.price)}</p>
            <button type="button" onclick="add(${p.id})">담기</button>
        </div>
    `).join("");
}

function add(id){
    const item = products.find(p => p.id === id);
    if(!item) return;

    cart.push(item);
    update();
    openCart();
}

function update(){
    let total = 0;

    if(cart.length === 0){
        cartItems.innerHTML = `
            <div class="empty-cart">
                <p>아직 담긴 상품이 없습니다.<br>마음에 드는 피스를 골라보세요.</p>
            </div>
        `;
    }else{
        cartItems.innerHTML = cart.map((c,i) => {
            total += c.price;

            return `
                <div class="cart-card">
                    <img src="${c.image}" alt="${c.name}">
                    <div class="cart-info">
                        <div class="cart-name">${c.name}</div>
                        <div class="cart-price">${money(c.price)}</div>
                    </div>
                    <button class="cart-delete" type="button" onclick="remove(${i})">×</button>
                </div>
            `;
        }).join("");
    }

    totalEl.innerText = money(total);
    cartCount.innerText = cart.length;
}

function remove(i){
    cart.splice(i,1);
    update();
}

function openCart(){
    cartPanel.classList.add("active");
    backdrop.classList.add("active");
}

function closeCart(){
    cartPanel.classList.remove("active");
    backdrop.classList.remove("active");
}

function buy(){
    if(cart.length === 0){
        alert("장바구니에 상품을 먼저 담아주세요.");
        return;
    }

    alert("결제 완료");
    cart = [];
    update();
    closeCart();
}

function toggleMenu(){
    navMenu.classList.toggle("active");
}

document.getElementById("cart-btn").onclick = openCart;

document.querySelectorAll("#nav-menu a").forEach(link => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("active");
    });
});

document.addEventListener("keydown", e => {
    if(e.key === "Escape"){
        closeCart();
        navMenu.classList.remove("active");
    }
});

renderProducts();
update();