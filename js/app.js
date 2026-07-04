function detailImages(image){
    const dot = image.lastIndexOf(".");
    const base = image.slice(0, dot);
    const ext = image.slice(dot);
    return [image, `${base}_상세1${ext}`, `${base}_상세2${ext}`];
}

const products = [
{ id:1, category:"chain", name:"Moissanite tennis chain", price:450000, image:"images/3체인.jpg", detailImages:detailImages("images/3체인.jpg"), material:"Moissanite setting" },
{ id:2, category:"pendant", name:"Corteiz pendant", price:250000, image:"images/검.jpg", detailImages:detailImages("images/검.jpg"), material:"Custom pendant" },
{ id:3, category:"pendant", name:"LIVE YOURS pendant", price:410000, image:"images/글씨.jpg", detailImages:detailImages("images/글씨.jpg"), material:"Lettering pendant" },
{ id:4, category:"pendant", name:"YVL pendant", price:370000, image:"images/나무.jpg", detailImages:detailImages("images/나무.jpg"), material:"Hand-set stones" },
{
    id:5,
    category:"pendant",
    name:"King von O'block pendant",
    price:370000,
    image:"images/노랑오.jpg",
    detailImages:detailImages("images/노랑오.jpg"),
    material:"Color custom pendant",
    optionName:"컬러",
    options:[
        { label:"노랑", image:"images/노랑오.jpg" },
        { label:"빨강", image:"images/빨간오.jpg" },
        { label:"흰색", image:"images/흰오.jpg" }
    ]
},
{ id:6, category:"pendant", name:"Playboi carti star pendant", price:380000, image:"images/별.jpg", detailImages:detailImages("images/별.jpg"), material:"Star pendant" },
{
    id:7,
    category:"pendant",
    name:"King von O'block pendant",
    price:370000,
    image:"images/빨간오.jpg",
    detailImages:detailImages("images/빨간오.jpg"),
    material:"Color custom pendant",
    optionName:"컬러",
    options:[
        { label:"빨강", image:"images/빨간오.jpg" },
        { label:"노랑", image:"images/노랑오.jpg" },
        { label:"흰색", image:"images/흰오.jpg" }
    ]
},
{
    id:8,
    category:"character",
    name:"Murakami yeti pendant",
    price:290000,
    image:"images/빨강예티.jpg",
    detailImages:detailImages("images/빨강예티.jpg"),
    material:"Character pendant",
    optionName:"예티 컬러",
    options:[
        { label:"빨강", image:"images/빨강예티.jpg" },
        { label:"주황", image:"images/주황예티.jpg" },
        { label:"파랑", image:"images/파랑예티.jpg" },
        { label:"하늘", image:"images/하늘예티.jpg" },
        { label:"흰색", image:"images/흰색예티.jpg" }
    ]
},
{ id:9, category:"pendant", name:"Candy pendant", price:270000, image:"images/사탕.jpg", detailImages:detailImages("images/사탕.jpg"), material:"Custom pendant" },
{
    id:10,
    category:"character",
    name:"Sonic pendant",
    price:380000,
    image:"images/소닉.jpg",
    detailImages:detailImages("images/소닉.jpg"),
    material:"Character pendant",
    optionName:"소닉 컬러",
    options:[
        { label:"기본", image:"images/소닉.jpg" },
        { label:"파랑", image:"images/파랑소닉.jpg" }
    ]
},
{ id:11, category:"pendant", name:"Cross pendant", price:260000, image:"images/십자가.jpg", detailImages:detailImages("images/십자가.jpg"), material:"Cross pendant" },
{ id:12, category:"pendant", name:"Elizabeth pendant", price:300000, image:"images/얼굴.jpg", detailImages:detailImages("images/얼굴.jpg"), material:"Portrait pendant" },
{ id:13, category:"pendant", name:"Elizabeth pendant", price:300000, image:"images/왼쪽얼굴.jpg", detailImages:detailImages("images/왼쪽얼굴.jpg"), material:"Portrait pendant" },
{
    id:14,
    category:"character",
    name:"Murakami yeti pendant",
    price:290000,
    image:"images/주황예티.jpg",
    detailImages:detailImages("images/주황예티.jpg"),
    material:"Character pendant",
    optionName:"예티 컬러",
    options:[
        { label:"주황", image:"images/주황예티.jpg" },
        { label:"빨강", image:"images/빨강예티.jpg" },
        { label:"파랑", image:"images/파랑예티.jpg" },
        { label:"하늘", image:"images/하늘예티.jpg" },
        { label:"흰색", image:"images/흰색예티.jpg" }
    ]
},
{ id:15, category:"character", name:"Hello kitty pendant", price:320000, image:"images/키티.jpg", detailImages:detailImages("images/키티.jpg"), material:"Character pendant" },
{ id:16, category:"character", name:"Playboi carti rabbit pendant", price:230000, image:"images/토끼.jpg", detailImages:detailImages("images/토끼.jpg"), material:"Character pendant" },
{
    id:17,
    category:"character",
    name:"Sonic pendant",
    price:380000,
    image:"images/파랑소닉.jpg",
    detailImages:detailImages("images/파랑소닉.jpg"),
    material:"Character pendant",
    optionName:"소닉 컬러",
    options:[
        { label:"파랑", image:"images/파랑소닉.jpg" },
        { label:"기본", image:"images/소닉.jpg" }
    ]
},
{
    id:18,
    category:"character",
    name:"Murakami yeti pendant",
    price:290000,
    image:"images/파랑예티.jpg",
    detailImages:detailImages("images/파랑예티.jpg"),
    material:"Character pendant",
    optionName:"예티 컬러",
    options:[
        { label:"파랑", image:"images/파랑예티.jpg" },
        { label:"하늘", image:"images/하늘예티.jpg" },
        { label:"주황", image:"images/주황예티.jpg" },
        { label:"빨강", image:"images/빨강예티.jpg" },
        { label:"흰색", image:"images/흰색예티.jpg" }
    ]
},
{
    id:19,
    category:"character",
    name:"Murakami yeti pendant",
    price:290000,
    image:"images/하늘예티.jpg",
    detailImages:detailImages("images/하늘예티.jpg"),
    material:"Character pendant",
    optionName:"예티 컬러",
    options:[
        { label:"하늘", image:"images/하늘예티.jpg" },
        { label:"파랑", image:"images/파랑예티.jpg" },
        { label:"주황", image:"images/주황예티.jpg" },
        { label:"빨강", image:"images/빨강예티.jpg" },
        { label:"흰색", image:"images/흰색예티.jpg" }
    ]
},
{ id:20, category:"pendant", name:"Skull pendant", price:370000, image:"images/해골.jpg", detailImages:detailImages("images/해골.jpg"), material:"Skull pendant" },
{
    id:21,
    category:"character",
    name:"Murakami yeti pendant",
    price:290000,
    image:"images/흰색예티.jpg",
    detailImages:detailImages("images/흰색예티.jpg"),
    material:"Character pendant",
    optionName:"예티 컬러",
    options:[
        { label:"흰색", image:"images/흰색예티.jpg" },
        { label:"하늘", image:"images/하늘예티.jpg" },
        { label:"파랑", image:"images/파랑예티.jpg" },
        { label:"주황", image:"images/주황예티.jpg" },
        { label:"빨강", image:"images/빨강예티.jpg" }
    ]
},
{
    id:22,
    category:"pendant",
    name:"King von O'block pendant",
    price:370000,
    image:"images/흰오.jpg",
    detailImages:detailImages("images/흰오.jpg"),
    material:"Color custom pendant",
    optionName:"컬러",
    options:[
        { label:"흰색", image:"images/흰오.jpg" },
        { label:"노랑", image:"images/노랑오.jpg" },
        { label:"빨강", image:"images/빨간오.jpg" }
    ]
}
];

let cart = [];
let currentProduct = null;
let currentSlide = 0;
let selectedOption = null;
let currentFilter = "all";

const grid = document.getElementById("product-grid");
const cartPanel = document.getElementById("cart-panel");
const backdrop = document.getElementById("backdrop");
const cartItems = document.getElementById("cart-items");
const totalEl = document.getElementById("total");
const cartCount = document.getElementById("cart-count");
const navMenu = document.getElementById("nav-menu");
const productModal = document.getElementById("product-modal");
const filterButtons = document.getElementById("filter-buttons");

const money = price => "₩" + price.toLocaleString("ko-KR");

function getVisibleProducts(){
    if(currentFilter === "all") return products;
    return products.filter(product => product.category === currentFilter);
}

function renderProducts(){
    grid.innerHTML = getVisibleProducts().map(p => `
        <div class="product">
            <div class="product-img" data-action="detail" data-id="${p.id}">
                <img src="${p.image}" alt="${p.name}" loading="lazy">
            </div>

            <p class="product-meta">${p.category}</p>
            <h3>${p.name}</h3>
            <p class="price">${money(p.price)}</p>

            <div class="product-actions">
                <button class="detail-btn" type="button" data-action="detail" data-id="${p.id}">상세보기</button>
                <button class="add-btn" type="button" data-action="add" data-id="${p.id}">담기</button>
            </div>
        </div>
    `).join("");
}

grid.addEventListener("click", function(e){
    const target = e.target.closest("[data-action]");
    if(!target) return;

    const id = Number(target.dataset.id);
    const action = target.dataset.action;

    if(action === "detail"){
        openProductModal(id);
    }

    if(action === "add"){
        handleProductAdd(id);
    }
});

filterButtons.addEventListener("click", function(e){
    const button = e.target.closest("[data-filter]");
    if(!button) return;

    currentFilter = button.dataset.filter;

    document.querySelectorAll("[data-filter]").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.filter === currentFilter);
    });

    renderProducts();
});

document.querySelectorAll("[data-filter-link]").forEach(link => {
    link.addEventListener("click", () => {
        currentFilter = link.dataset.filterLink;

        document.querySelectorAll("[data-filter]").forEach(btn => {
            btn.classList.toggle("active", btn.dataset.filter === currentFilter);
        });

        renderProducts();
    });
});

function handleProductAdd(id){
    const item = products.find(p => p.id === id);
    if(!item) return;

    if(item.options && item.options.length > 0){
        openProductModal(id);
        return;
    }

    add(id);
}

function add(id, option = ""){
    const item = products.find(p => p.id === id);
    if(!item) return;

    const optionImage = getOptionImage(item, option);

    cart.push({
        ...item,
        selectedOption:option,
        cartImage:optionImage || item.image
    });

    update();
    openCart();
}

function getOptionImage(product, optionLabel){
    if(!product.options || !optionLabel) return product.image;

    const found = product.options.find(option => option.label === optionLabel);
    return found ? found.image : product.image;
}

function update(){
    let total = 0;

    if(cart.length === 0){
        cartItems.innerHTML = `
            <div class="empty-cart">
                <p>아직 담긴 상품이 없습니다.<br>원하는 피스를 선택해보세요.</p>
            </div>
        `;
    }else{
        cartItems.innerHTML = cart.map((c,i) => {
            total += c.price;

            return `
                <div class="cart-card">
                    <img src="${c.cartImage || c.image}" alt="${c.name}">
                    <div>
                        <div class="cart-name">${c.name}</div>
                        <div class="cart-price">${money(c.price)}</div>
                        ${c.selectedOption ? `<div class="cart-option">${c.optionName || "옵션"} : ${c.selectedOption}</div>` : ""}
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

    if(!productModal.classList.contains("active")){
        backdrop.classList.remove("active");
    }
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

function openProductModal(id){
    currentProduct = products.find(p => p.id === id);
    currentSlide = 0;

    if(!currentProduct) return;

    selectedOption = currentProduct.options ? currentProduct.options[0] : null;

    document.getElementById("modal-name").innerText = currentProduct.name;
    document.getElementById("modal-price").innerText = money(currentProduct.price);
    document.getElementById("modal-material").innerText = currentProduct.material;

    renderOptions();

    document.getElementById("modal-add-btn").onclick = () => {
        const optionValue = selectedOption ? selectedOption.label : "";
        closeProductModal();
        add(currentProduct.id, optionValue);
    };

    productModal.classList.add("active");
    backdrop.classList.add("active");

    renderSlide();
}

function renderOptions(){
    const optionBox = document.getElementById("modal-options");

    if(!currentProduct.options || currentProduct.options.length === 0){
        optionBox.innerHTML = "";
        return;
    }

    optionBox.innerHTML = `
        <label>${currentProduct.optionName || "옵션 선택"}</label>
        <select id="product-option" onchange="changeProductOption(this.value)">
            ${currentProduct.options.map(option => `
                <option value="${option.label}">${option.label}</option>
            `).join("")}
        </select>
        <p class="option-required">옵션 선택 후 장바구니에 담아주세요.</p>
    `;
}

function changeProductOption(optionLabel){
    selectedOption = currentProduct.options.find(option => option.label === optionLabel);
    currentSlide = 0;
    renderSlide();
}

function closeProductModal(){
    productModal.classList.remove("active");

    if(!cartPanel.classList.contains("active")){
        backdrop.classList.remove("active");
    }
}

function getCurrentModalImages(){
    if(!currentProduct) return [];

    const baseImages = currentProduct.detailImages && currentProduct.detailImages.length
        ? currentProduct.detailImages
        : [currentProduct.image];

    if(selectedOption){
        const restImages = baseImages.filter(img => img !== currentProduct.image);
        return [selectedOption.image, ...restImages];
    }

    return baseImages;
}

function renderSlide(){
    if(!currentProduct) return;

    const images = getCurrentModalImages();

    if(currentSlide >= images.length){
        currentSlide = 0;
    }

    document.getElementById("modal-image").src = images[currentSlide];
    document.getElementById("modal-image").alt = currentProduct.name;

    document.getElementById("modal-thumbs").innerHTML = images.map((img, index) => `
        <button type="button" class="${index === currentSlide ? "active" : ""}" onclick="goSlide(${index})">
            <img src="${img}" alt="">
        </button>
    `).join("");
}

function changeSlide(direction){
    if(!currentProduct) return;

    const images = getCurrentModalImages();
    currentSlide = (currentSlide + direction + images.length) % images.length;
    renderSlide();
}

function goSlide(index){
    currentSlide = index;
    renderSlide();
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
        closeProductModal();
        navMenu.classList.remove("active");
    }

    if(productModal.classList.contains("active") && e.key === "ArrowLeft"){
        changeSlide(-1);
    }

    if(productModal.classList.contains("active") && e.key === "ArrowRight"){
        changeSlide(1);
    }
});

renderProducts();
update();