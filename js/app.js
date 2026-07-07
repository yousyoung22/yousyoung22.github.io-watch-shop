function detailImages(image){
    const dot = image.lastIndexOf(".");
    const base = image.slice(0, dot);
    const ext = image.slice(dot);
    return [image, `${base}_상세1${ext}`, `${base}_상세2${ext}`];
}

const oblockOptions = [
    { label:"노랑", image:"images/노랑오.jpg", detailImages:detailImages("images/노랑오.jpg") },
    { label:"빨강", image:"images/빨간오.jpg", detailImages:detailImages("images/빨간오.jpg") },
    { label:"흰색", image:"images/흰오.jpg", detailImages:detailImages("images/흰오.jpg") }
];

const yetiOptions = [
    { label:"빨강", image:"images/빨강예티.jpg", detailImages:detailImages("images/빨강예티.jpg") },
    { label:"주황", image:"images/주황예티.jpg", detailImages:detailImages("images/주황예티.jpg") },
    { label:"파랑", image:"images/파랑예티.jpg", detailImages:detailImages("images/파랑예티.jpg") },
    { label:"하늘", image:"images/하늘예티.jpg", detailImages:detailImages("images/하늘예티.jpg") },
    { label:"흰색", image:"images/흰색예티.jpg", detailImages:detailImages("images/흰색예티.jpg") }
];

const sonicOptions = [
    { label:"기본", image:"images/소닉.jpg", detailImages:detailImages("images/소닉.jpg") },
    { label:"파랑", image:"images/파랑소닉.jpg", detailImages:detailImages("images/파랑소닉.jpg") }
];

const products = [
    { id:1, category:"chain", name:"Moissanite tennis chain", price:450000, image:"images/3체인.jpg", detailImages:detailImages("images/3체인.jpg"), material:"Moissanite setting" },
    { id:2, category:"pendant", name:"Corteiz pendant", price:250000, image:"images/검.jpg", detailImages:detailImages("images/검.jpg"), material:"Pendant" },
    { id:3, category:"pendant", name:"LIVE YOURS pendant", price:410000, image:"images/글씨.jpg", detailImages:detailImages("images/글씨.jpg"), material:"Lettering pendant" },
    { id:4, category:"pendant", name:"YVL pendant", price:370000, image:"images/나무.jpg", detailImages:detailImages("images/나무.jpg"), material:"Hand-set stones" },
    { id:5, category:"pendant", name:"King von O'block pendant", price:370000, image:"images/노랑오.jpg", detailImages:detailImages("images/노랑오.jpg"), material:"Color pendant", optionName:"컬러", options:oblockOptions },
    { id:6, category:"pendant", name:"Playboi carti star pendant", price:380000, image:"images/별.jpg", detailImages:detailImages("images/별.jpg"), material:"Star pendant" },
    { id:7, category:"pendant", name:"King von O'block pendant", price:370000, image:"images/빨간오.jpg", detailImages:detailImages("images/빨간오.jpg"), material:"Color pendant", optionName:"컬러", options:oblockOptions },
    { id:8, category:"character", name:"Murakami yeti pendant", price:290000, image:"images/빨강예티.jpg", detailImages:detailImages("images/빨강예티.jpg"), material:"Character pendant", optionName:"예티 컬러", options:yetiOptions },
    { id:9, category:"pendant", name:"Candy pendant", price:270000, image:"images/사탕.jpg", detailImages:detailImages("images/사탕.jpg"), material:"Pendant" },
    { id:10, category:"character", name:"Sonic pendant", price:380000, image:"images/소닉.jpg", detailImages:detailImages("images/소닉.jpg"), material:"Character pendant", optionName:"소닉 컬러", options:sonicOptions },
    { id:11, category:"pendant", name:"Cross pendant", price:260000, image:"images/십자가.jpg", detailImages:detailImages("images/십자가.jpg"), material:"Cross pendant" },
    { id:12, category:"pendant", name:"Elizabeth pendant", price:300000, image:"images/얼굴.jpg", detailImages:detailImages("images/얼굴.jpg"), material:"Portrait pendant" },
    { id:13, category:"pendant", name:"Elizabeth pendant", price:300000, image:"images/왼쪽얼굴.jpg", detailImages:detailImages("images/왼쪽얼굴.jpg"), material:"Portrait pendant" },
    { id:14, category:"character", name:"Murakami yeti pendant", price:290000, image:"images/주황예티.jpg", detailImages:detailImages("images/주황예티.jpg"), material:"Character pendant", optionName:"예티 컬러", options:yetiOptions },
    { id:15, category:"character", name:"Hello kitty pendant", price:320000, image:"images/키티.jpg", detailImages:detailImages("images/키티.jpg"), material:"Character pendant" },
    { id:16, category:"character", name:"Playboi carti rabbit pendant", price:230000, image:"images/토끼.jpg", detailImages:detailImages("images/토끼.jpg"), material:"Character pendant" },
    { id:17, category:"character", name:"Sonic pendant", price:380000, image:"images/파랑소닉.jpg", detailImages:detailImages("images/파랑소닉.jpg"), material:"Character pendant", optionName:"소닉 컬러", options:sonicOptions },
    { id:18, category:"character", name:"Murakami yeti pendant", price:290000, image:"images/파랑예티.jpg", detailImages:detailImages("images/파랑예티.jpg"), material:"Character pendant", optionName:"예티 컬러", options:yetiOptions },
    { id:19, category:"character", name:"Murakami yeti pendant", price:290000, image:"images/하늘예티.jpg", detailImages:detailImages("images/하늘예티.jpg"), material:"Character pendant", optionName:"예티 컬러", options:yetiOptions },
    { id:20, category:"pendant", name:"Skull pendant", price:370000, image:"images/해골.jpg", detailImages:detailImages("images/해골.jpg"), material:"Skull pendant" },
    { id:21, category:"character", name:"Murakami yeti pendant", price:290000, image:"images/흰색예티.jpg", detailImages:detailImages("images/흰색예티.jpg"), material:"Character pendant", optionName:"예티 컬러", options:yetiOptions },
    { id:22, category:"pendant", name:"King von O'block pendant", price:370000, image:"images/흰오.jpg", detailImages:detailImages("images/흰오.jpg"), material:"Color pendant", optionName:"컬러", options:oblockOptions }
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

const money = price => "\u20a9" + price.toLocaleString("ko-KR");

function getVisibleProducts(){
    if(currentFilter === "all") return products;
    return products.filter(product => product.category === currentFilter);
}

function renderProducts(){
    grid.innerHTML = getVisibleProducts().map(product => `
        <div class="product">
            <div class="product-img" data-action="detail" data-id="${product.id}">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>

            <p class="product-meta">${product.category}</p>
            <h3>${product.name}</h3>
            <p class="price">${money(product.price)}</p>

            <div class="product-actions">
                <button class="detail-btn" type="button" data-action="detail" data-id="${product.id}">상세보기</button>
                <button class="add-btn" type="button" data-action="add" data-id="${product.id}">담기</button>
            </div>
        </div>
    `).join("");
}

grid.addEventListener("click", function(event){
    const target = event.target.closest("[data-action]");
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

filterButtons.addEventListener("click", function(event){
    const button = event.target.closest("[data-filter]");
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
    const item = products.find(product => product.id === id);
    if(!item) return;

    if(item.options && item.options.length > 0){
        openProductModal(id);
        return;
    }

    add(id);
}

function findDefaultOption(product){
    if(!product.options || product.options.length === 0) return null;
    return product.options.find(option => option.image === product.image) || product.options[0];
}

function add(id, optionLabel = ""){
    const item = products.find(product => product.id === id);
    if(!item) return;

    const option = item.options
        ? item.options.find(opt => opt.label === optionLabel) || findDefaultOption(item)
        : null;

    cart.push({
        id:item.id,
        name:item.name,
        price:item.price,
        image:item.image,
        material:item.material,
        optionName:item.optionName || "",
        selectedOption:option ? option.label : "",
        cartImage:option ? option.image : item.image
    });

    update();
    openCart();
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
        cartItems.innerHTML = cart.map((item, index) => {
            total += item.price;

            return `
                <div class="cart-card">
                    <img src="${item.cartImage || item.image}" alt="${item.name}">
                    <div>
                        <div class="cart-name">${item.name}</div>
                        <div class="cart-price">${money(item.price)}</div>
                        ${item.selectedOption ? `<div class="cart-option">${item.optionName} : ${item.selectedOption}</div>` : ""}
                    </div>
                    <button class="cart-delete" type="button" onclick="remove(${index})">&times;</button>
                </div>
            `;
        }).join("");
    }

    totalEl.innerText = money(total);
    cartCount.innerText = cart.length;
}

function remove(index){
    cart.splice(index, 1);
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
    currentProduct = products.find(product => product.id === id);
    currentSlide = 0;

    if(!currentProduct) return;

    selectedOption = findDefaultOption(currentProduct);

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
        <div class="option-grid">
            ${currentProduct.options.map((option, index) => `
                <button
                    class="option-chip ${selectedOption && selectedOption.label === option.label ? "active" : ""}"
                    type="button"
                    onclick="changeProductOption(${index})">
                    ${option.label}
                </button>
            `).join("")}
        </div>
        <p class="option-required">옵션을 선택한 뒤 장바구니에 담아주세요.</p>
    `;
}

function changeProductOption(optionIndex){
    selectedOption = currentProduct.options[optionIndex];
    currentSlide = 0;
    renderOptions();
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

    if(selectedOption && selectedOption.detailImages){
        return selectedOption.detailImages;
    }

    if(currentProduct.detailImages && currentProduct.detailImages.length){
        return currentProduct.detailImages;
    }

    return [currentProduct.image];
}

function renderSlide(){
    if(!currentProduct) return;

    const images = getCurrentModalImages();

    if(currentSlide >= images.length){
        currentSlide = 0;
    }

    const modalImage = document.getElementById("modal-image");
    modalImage.onerror = function(){
        this.onerror = null;
        this.src = selectedOption ? selectedOption.image : currentProduct.image;
    };
    modalImage.src = images[currentSlide];
    modalImage.alt = currentProduct.name;

    document.getElementById("modal-thumbs").innerHTML = images.map((image, index) => `
        <button type="button" class="${index === currentSlide ? "active" : ""}" onclick="goSlide(${index})">
            <img src="${image}" alt="" onerror="this.parentElement.style.display='none'">
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

document.addEventListener("keydown", event => {
    if(event.key === "Escape"){
        closeCart();
        closeProductModal();
        navMenu.classList.remove("active");
    }

    if(productModal.classList.contains("active") && event.key === "ArrowLeft"){
        changeSlide(-1);
    }

    if(productModal.classList.contains("active") && event.key === "ArrowRight"){
        changeSlide(1);
    }
});

renderProducts();
update();