let products = [];
let cart = [];
let currentProduct = null;
let currentSlide = 0;
let selectedOption = null;
let sessionUser = null;
let adminPath = "";
let myProfile = { name:"", phone:"", address:"" };
const ADMIN_LOGIN_ENDPOINT = "/api/seoul-ice-7799-vault-door-x9q7-auth";

const grid = document.getElementById("product-grid");
const cartPanel = document.getElementById("cart-panel");
const backdrop = document.getElementById("backdrop");
const cartItems = document.getElementById("cart-items");
const totalEl = document.getElementById("total");
const cartCount = document.getElementById("cart-count");
const navMenu = document.getElementById("nav-menu");
const productModal = document.getElementById("product-modal");
const accountBtn = document.getElementById("account-btn");

const money = price => "₩" + Number(price || 0).toLocaleString("ko-KR");

function muteMedia(root = document){
    root.querySelectorAll("audio, video").forEach(media => {
        media.muted = true;
        media.defaultMuted = true;
        media.volume = 0;
        media.setAttribute("muted", "");

        if(!media.dataset.soundGuarded){
            media.dataset.soundGuarded = "true";
            media.addEventListener("volumechange", () => {
                if(!media.muted) media.muted = true;
                if(media.volume !== 0) media.volume = 0;
            });
        }
    });
}

muteMedia();

new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            if(node.nodeType === Node.ELEMENT_NODE) muteMedia(node);
        });
    });
}).observe(document.documentElement, { childList:true, subtree:true });

function escapeHtml(value){
    return String(value ?? "")
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#039;");
}

function getOptionColor(label){
    const colors = {
        "Default":"#111318",
        "White":"#f8fafc",
        "Red":"#d64545",
        "Orange":"#f2994a",
        "Blue":"#2f80ed",
        "Sky Blue":"#8fd3ff",
        "Black":"#111318",
        "Yellow":"#f2c94c",
        "노랑":"#f2c94c",
        "빨강":"#d64545",
        "흰색":"#f8fafc",
        "주황":"#f2994a",
        "파랑":"#2f80ed",
        "하늘":"#8fd3ff",
        "기본":"#111318",
        "검정":"#111318"
    };

    return colors[label] || "#98a2b3";
}

function optionDots(product){
    if(!product.options || product.options.length === 0) return "";

    return `
        <div class="option-dots" aria-label="상품 옵션">
            ${product.options.map(option => `
                <span title="${escapeHtml(option.label)}" style="--dot:${getOptionColor(option.label)}"></span>
            `).join("")}
        </div>
    `;
}

async function loadProducts(){
    try{
        const response = await fetch("/api/products");
        if(!response.ok) throw new Error("상품을 불러오지 못했습니다.");
        products = await response.json();
        renderProducts();
    }catch(error){
        grid.innerHTML = `
            <div class="empty-product-state">
                <strong>상품을 불러오지 못했습니다.</strong>
                <p>서버가 실행 중인지 확인해주세요.</p>
            </div>
        `;
    }
}

function renderProducts(){
    grid.innerHTML = products.map(product => `
        <div class="product">
            <div class="product-img" data-action="detail" data-id="${Number(product.id)}">
                ${product.options && product.options.length ? `<span class="product-badge">OPTIONS</span>` : ""}
                <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy">
            </div>

            <div class="product-info">
                <div class="product-meta">
                    <span>SEOUL ICE</span>
                </div>

                <h3>${escapeHtml(product.name)}</h3>

                <div class="product-price-row">
                    <p class="price">${money(product.price)}</p>
                    ${optionDots(product)}
                </div>

                <div class="product-actions">
                    <button class="detail-btn" type="button" data-action="detail" data-id="${Number(product.id)}">상세보기</button>
                    <button class="add-btn" type="button" data-action="add" data-id="${Number(product.id)}">담기</button>
                </div>
            </div>
        </div>
    `).join("");

    grid.querySelectorAll(".product-img img").forEach(image => {
        image.addEventListener("error", () => {
            const frame = image.closest(".product-img");
            frame.classList.add("missing");
            image.remove();
        }, { once:true });
    });
}

grid.addEventListener("click", event => {
    const target = event.target.closest("[data-action]");
    if(!target) return;

    const id = Number(target.dataset.id);
    const action = target.dataset.action;

    if(action === "detail") openProductModal(id);
    if(action === "add") handleProductAdd(id);
});

function handleProductAdd(id){
    const item = products.find(product => Number(product.id) === Number(id));
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
    const item = products.find(product => Number(product.id) === Number(id));
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

function cartTotal(){
    return cart.reduce((sum, item) => sum + Number(item.price || 0), 0);
}

function update(){
    if(cart.length === 0){
        cartItems.innerHTML = `
            <div class="empty-cart">
                <p>아직 담긴 상품이 없습니다.<br>원하는 아이스를 선택해보세요.</p>
            </div>
        `;
    }else{
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-card">
                <img src="${escapeHtml(item.cartImage || item.image)}" alt="${escapeHtml(item.name)}">
                <div>
                    <div class="cart-name">${escapeHtml(item.name)}</div>
                    <div class="cart-price">${money(item.price)}</div>
                    ${item.selectedOption ? `<div class="cart-option">${escapeHtml(item.optionName)} : ${escapeHtml(item.selectedOption)}</div>` : ""}
                </div>
                <button class="cart-delete" type="button" onclick="remove(${index})">&times;</button>
            </div>
        `).join("");
    }

    totalEl.innerText = money(cartTotal());
    cartCount.innerText = cart.length;
}

function remove(index){
    cart.splice(index, 1);
    update();
}

function hasActiveOverlay(){
    const accountModal = document.getElementById("account-modal");
    const checkoutModal = document.getElementById("checkout-modal");

    return cartPanel.classList.contains("active")
        || productModal.classList.contains("active")
        || Boolean(accountModal && accountModal.classList.contains("active"))
        || Boolean(checkoutModal && checkoutModal.classList.contains("active"));
}

function syncBackdrop(){
    backdrop.classList.toggle("active", hasActiveOverlay());
}

function openCart(){
    cartPanel.classList.add("active");
    syncBackdrop();
}

function closeCart(){
    cartPanel.classList.remove("active");
    syncBackdrop();
}

function buy(){
    if(cart.length === 0){
        alert("장바구니에 상품을 먼저 담아주세요.");
        return;
    }

    closeCart();
    openCheckout();
}

function openProductModal(id){
    currentProduct = products.find(product => Number(product.id) === Number(id));
    currentSlide = 0;

    if(!currentProduct) return;

    selectedOption = findDefaultOption(currentProduct);

    document.getElementById("modal-name").innerText = currentProduct.name;
    document.getElementById("modal-price").innerText = money(currentProduct.price);

    renderOptions();

    document.getElementById("modal-add-btn").onclick = () => {
        const optionValue = selectedOption ? selectedOption.label : "";
        closeProductModal();
        add(currentProduct.id, optionValue);
    };

    productModal.classList.add("active");
    syncBackdrop();

    renderSlide();
}

function renderOptions(){
    const optionBox = document.getElementById("modal-options");

    if(!currentProduct.options || currentProduct.options.length === 0){
        optionBox.innerHTML = "";
        optionBox.hidden = true;
        return;
    }

    optionBox.hidden = false;
    optionBox.innerHTML = `
        <label>${escapeHtml(currentProduct.optionName || "옵션 선택")}</label>
        <div class="option-grid">
            ${currentProduct.options.map((option, index) => `
                <button
                    class="option-chip ${selectedOption && selectedOption.label === option.label ? "active" : ""}"
                    type="button"
                    data-option-index="${index}">
                    ${escapeHtml(option.label)}
                </button>
            `).join("")}
        </div>
        <p class="option-required">옵션을 선택한 뒤 장바구니에 담아주세요.</p>
    `;
}

document.getElementById("modal-options").addEventListener("click", event => {
    const chip = event.target.closest("[data-option-index]");
    if(!chip || !currentProduct || !currentProduct.options) return;
    changeProductOption(Number(chip.dataset.optionIndex));
});

function changeProductOption(optionIndex){
    selectedOption = currentProduct.options[optionIndex];
    currentSlide = 0;
    renderOptions();
    renderSlide();
}

function closeProductModal(){
    productModal.classList.remove("active");
    syncBackdrop();
}

function getCurrentModalImages(){
    if(!currentProduct) return [];

    const source = selectedOption || currentProduct;
    const images = Array.isArray(source.detailImages) && source.detailImages.length
        ? source.detailImages
        : [source.image || currentProduct.image];

    return images.filter(Boolean);
}

function renderSlide(){
    if(!currentProduct) return;

    const images = getCurrentModalImages();
    if(images.length === 0) return;

    if(currentSlide >= images.length){
        currentSlide = 0;
    }

    const galleryCount = document.getElementById("modal-gallery-count");
    if(galleryCount){
        galleryCount.textContent = `${currentSlide + 1} / ${images.length}`;
    }

    const modalImage = document.getElementById("modal-image");
    modalImage.onerror = function(){
        this.onerror = null;
        this.src = currentProduct.image || "images/logo.png";
    };
    modalImage.src = images[currentSlide];
    modalImage.alt = currentProduct.name;

    document.getElementById("modal-thumbs").innerHTML = images.map((image, index) => `
        <button type="button" class="${index === currentSlide ? "active" : ""}" onclick="goSlide(${index})">
            <img src="${escapeHtml(image)}" alt="" onerror="this.parentElement.style.display='none'">
        </button>
    `).join("");

    const hasMultipleImages = images.length > 1;
    document.querySelectorAll(".slide-btn").forEach(button => {
        button.hidden = !hasMultipleImages;
    });
    document.getElementById("modal-thumbs").hidden = !hasMultipleImages;
}

function changeSlide(direction){
    if(!currentProduct) return;

    const images = getCurrentModalImages();
    if(images.length === 0) return;

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

async function refreshSession(){
    try{
        const response = await fetch("/api/me");
        const data = await response.json();
        sessionUser = data.authenticated ? data.user : null;
        adminPath = data.adminPath || "";
    }catch{
        sessionUser = null;
        adminPath = "";
    }

    if(sessionUser){
        accountBtn.textContent = "MY";
        accountBtn.classList.add("logged-in");
    }else{
        accountBtn.textContent = "LOGIN";
        accountBtn.classList.remove("logged-in");
    }

    updateAccountModal();
}

function ensureAccountModal(){
    if(document.getElementById("account-modal")) return;

    document.body.insertAdjacentHTML("beforeend", `
        <div id="account-modal" class="utility-modal">
            <div class="utility-box auth-box">
                <button class="utility-close" type="button" onclick="closeAccountModal()" aria-label="로그인창 닫기">&times;</button>
                <p class="eyebrow">Account</p>
                <h2>로그인</h2>
                <div id="auth-user-box" class="auth-user-box"></div>

                <div id="auth-tabs" class="auth-tabs">
                    <button class="active" type="button" data-auth-tab="login">로그인</button>
                    <button type="button" data-auth-tab="register">회원가입</button>
                </div>

                <form id="account-login-form" class="auth-form">
                    <label>이메일<input id="login-email" type="text" required autocomplete="username"></label>
                    <label>비밀번호<input id="login-password" type="password" required autocomplete="current-password"></label>
                    <button class="utility-primary" type="submit">로그인</button>
                </form>

                <form id="account-register-form" class="auth-form" style="display:none">
                    <label>이름<input id="register-name" required autocomplete="name"></label>
                    <label>이메일<input id="register-email" type="email" required autocomplete="email"></label>
                    <label>비밀번호<input id="register-password" type="password" required autocomplete="new-password"></label>
                    <button class="utility-primary" type="submit">회원가입</button>
                </form>

                <button id="account-logout-btn" class="utility-secondary" type="button" style="display:none">로그아웃</button>
                <div id="auth-status" class="utility-status"></div>
            </div>
        </div>
    `);

    document.querySelectorAll("[data-auth-tab]").forEach(button => {
        button.addEventListener("click", () => showAuthTab(button.dataset.authTab));
    });

    document.getElementById("account-login-form").addEventListener("submit", submitLogin);
    document.getElementById("account-register-form").addEventListener("submit", submitRegister);
    document.getElementById("account-logout-btn").addEventListener("click", submitLogout);
}

function showAuthTab(tab){
    document.querySelectorAll("[data-auth-tab]").forEach(button => {
        button.classList.toggle("active", button.dataset.authTab === tab);
    });

    document.getElementById("account-login-form").style.display = tab === "login" ? "grid" : "none";
    document.getElementById("account-register-form").style.display = tab === "register" ? "grid" : "none";
}

function updateAccountModal(){
    const modal = document.getElementById("account-modal");
    if(!modal) return;

    const userBox = document.getElementById("auth-user-box");
    const tabs = document.getElementById("auth-tabs");
    const loginForm = document.getElementById("account-login-form");
    const registerForm = document.getElementById("account-register-form");
    const logoutBtn = document.getElementById("account-logout-btn");

    if(sessionUser){
        userBox.innerHTML = `
            <strong>${escapeHtml(sessionUser.name || sessionUser.email)}</strong>
            ${sessionUser.role === "admin" ? `<a class="admin-open-link" href="${escapeHtml(adminPath || "/")}">상품관리 열기</a>` : `<button class="utility-primary" type="button" onclick="openMyPage()">마이페이지 열기</button>`}
        `;
        userBox.style.display = "grid";
        tabs.style.display = "none";
        loginForm.style.display = "none";
        registerForm.style.display = "none";
        logoutBtn.style.display = "block";
    }else{
        userBox.style.display = "none";
        tabs.style.display = "grid";
        logoutBtn.style.display = "none";
        showAuthTab("login");
    }
}

async function loadMyProfile(){
    if(!sessionUser || sessionUser.role !== "user") return;

    const response = await fetch("/api/profile");
    const data = await response.json();
    if(!response.ok) throw new Error(data.error || "회원 정보를 불러오지 못했습니다.");
    myProfile = data.profile || { name:"", phone:"", address:"" };
}

async function openMyPage(){
    if(!sessionUser){
        openAccountModal();
        return;
    }

    if(sessionUser.role === "admin"){
        location.href = adminPath || "/";
        return;
    }

    location.href = "/mypage";
}

function openAccountModal(){
    ensureAccountModal();
    updateAccountModal();
    document.getElementById("auth-status").textContent = "";
    document.getElementById("account-modal").classList.add("active");
    syncBackdrop();
}

function closeAccountModal(){
    const modal = document.getElementById("account-modal");
    if(modal) modal.classList.remove("active");
    syncBackdrop();
}

async function submitLogin(event){
    event.preventDefault();
    const status = document.getElementById("auth-status");
    status.textContent = "";
    const loginId = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    const isAdminLogin = !loginId.includes("@");

    const response = await fetch(isAdminLogin ? ADMIN_LOGIN_ENDPOINT : "/api/login", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify(isAdminLogin
            ? { username:loginId, password }
            : { email:loginId, password })
    });
    const data = await response.json();

    if(!response.ok){
        status.textContent = data.error || "로그인에 실패했습니다.";
        return;
    }

    if(data.user && data.user.role === "admin"){
        location.href = data.adminPath || adminPath || "/";
        return;
    }

    if(data.user && data.user.role === "user"){
        location.href = "/";
        return;
    }

    status.textContent = "로그인되었습니다.";
    await refreshSession();
    closeAccountModal();
}

async function submitRegister(event){
    event.preventDefault();
    const status = document.getElementById("auth-status");
    status.textContent = "";

    const response = await fetch("/api/signup", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({
            name:document.getElementById("register-name").value,
            email:document.getElementById("register-email").value,
            password:document.getElementById("register-password").value
        })
    });
    const data = await response.json();

    if(!response.ok){
        status.textContent = data.error || "회원가입에 실패했습니다.";
        return;
    }

    location.href = "/";
}

async function submitLogout(){
    await fetch("/api/logout", { method:"POST" });
    await refreshSession();
    closeAccountModal();
}

function ensureCheckoutModal(){
    if(document.getElementById("checkout-modal")) return;

    document.body.insertAdjacentHTML("beforeend", `
        <div id="checkout-modal" class="utility-modal">
            <div class="utility-box checkout-box">
                <button class="utility-close" type="button" onclick="closeCheckout()" aria-label="결제창 닫기">&times;</button>
                <p class="eyebrow">주문 결제</p>
                <h2>결제 정보</h2>
                <p class="utility-copy">주문 정보를 확인하고 결제 방식을 선택해주세요.</p>

                <div id="checkout-items" class="checkout-items"></div>

                <form id="checkout-form" class="checkout-form">
                    <div class="utility-form-grid">
                        <label>이름<input id="checkout-name" required autocomplete="name"></label>
                        <label>연락처<input id="checkout-phone" required autocomplete="tel"></label>
                    </div>
                    <label>배송 주소<input id="checkout-address" autocomplete="street-address"></label>
                    <div class="checkout-payment-field">
                        <span>결제 방식</span>
                        <input id="checkout-payment" type="hidden" value="카드 결제">
                        <div class="checkout-payment-options">
                            <button class="checkout-payment-option active" type="button" data-payment-value="카드 결제">
                                <strong>카드결제</strong>
                                <small>주문 즉시 결제 완료</small>
                            </button>
                            <button class="checkout-payment-option" type="button" data-payment-value="계좌이체">
                                <strong>계좌이체</strong>
                                <small>입금 확인 후 진행</small>
                            </button>
                        </div>
                    </div>
                    <label>요청사항<textarea id="checkout-memo" rows="3"></textarea></label>
                    <button class="utility-secondary checkout-reset" type="button" onclick="resetCheckoutFields()">입력 초기화</button>
                    <button class="utility-primary" type="submit">주문하기</button>
                </form>

                <div id="checkout-status" class="utility-status"></div>
            </div>
        </div>
    `);

    document.getElementById("checkout-form").addEventListener("submit", submitCheckout);
    document.getElementById("checkout-form").addEventListener("click", event => {
        const option = event.target.closest("[data-payment-value]");
        if(option) setCheckoutPayment(option.dataset.paymentValue);
    });
}

function renderCheckout(){
    document.getElementById("checkout-items").innerHTML = `
        ${cart.map(item => `
            <div class="checkout-item">
                <img src="${escapeHtml(item.cartImage || item.image)}" alt="">
                <div>
                    <strong>${escapeHtml(item.name)}</strong>
                    ${item.selectedOption ? `<span>${escapeHtml(item.optionName)} : ${escapeHtml(item.selectedOption)}</span>` : ""}
                </div>
                <b>${money(item.price)}</b>
            </div>
        `).join("")}
        <div class="checkout-total">
            <span>Total</span>
            <strong>${money(cartTotal())}</strong>
        </div>
    `;
}

async function openCheckout(){
    ensureCheckoutModal();
    renderCheckout();
    resetCheckoutFields();

    if(sessionUser && sessionUser.role === "user"){
        try{
            await loadMyProfile();
        }catch{
            myProfile = { name:sessionUser.name || "", phone:"", address:"" };
        }

        document.getElementById("checkout-name").value = myProfile.name || sessionUser.name || "";
        document.getElementById("checkout-phone").value = myProfile.phone || "";
        document.getElementById("checkout-address").value = myProfile.address || "";
    }else if(sessionUser && !document.getElementById("checkout-name").value){
        document.getElementById("checkout-name").value = sessionUser.name || "";
    }

    document.getElementById("checkout-modal").classList.add("active");
    syncBackdrop();
}

function resetCheckoutFields(){
    document.getElementById("checkout-name").value = "";
    document.getElementById("checkout-phone").value = "";
    document.getElementById("checkout-address").value = "";
    setCheckoutPayment("카드 결제");
    document.getElementById("checkout-memo").value = "";
    document.getElementById("checkout-status").textContent = "";
}

function setCheckoutPayment(value){
    const input = document.getElementById("checkout-payment");
    if(input) input.value = value;
    document.querySelectorAll(".checkout-payment-option").forEach(option => {
        option.classList.toggle("active", option.dataset.paymentValue === value);
    });
}

function closeCheckout(){
    const modal = document.getElementById("checkout-modal");
    if(modal) modal.classList.remove("active");
    syncBackdrop();
}

async function submitCheckout(event){
    event.preventDefault();
    const status = document.getElementById("checkout-status");
    status.textContent = "";

    const payload = {
        customer:{
            name:document.getElementById("checkout-name").value,
            phone:document.getElementById("checkout-phone").value,
            address:document.getElementById("checkout-address").value,
            memo:document.getElementById("checkout-memo").value,
            paymentMethod:document.getElementById("checkout-payment").value
        },
        items:cart,
        total:cartTotal()
    };

    const response = await fetch("/api/orders", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify(payload)
    });
    const data = await response.json();

    if(!response.ok){
        status.textContent = data.error || "주문 저장에 실패했습니다.";
        return;
    }

    status.textContent = `주문이 접수되었습니다. 주문번호 ${data.order.id}`;
    cart = [];
    update();
    if(sessionUser && sessionUser.role === "user"){
        setTimeout(() => {
            closeCheckout();
            location.href = "/mypage";
        }, 700);
        return;
    }

    setTimeout(closeCheckout, 900);
}

document.getElementById("cart-btn").onclick = openCart;
accountBtn.onclick = () => {
    if(!sessionUser){
        openAccountModal();
        return;
    }

    if(sessionUser.role === "admin"){
        location.href = adminPath || "/";
        return;
    }

    openMyPage();
};

navMenu.addEventListener("click", event => {
    if(event.target.closest("a")) navMenu.classList.remove("active");
});

document.addEventListener("keydown", event => {
    if(event.key === "Escape"){
        closeCart();
        closeProductModal();
        closeAccountModal();
        closeCheckout();
        navMenu.classList.remove("active");
    }

    if(productModal.classList.contains("active") && event.key === "ArrowLeft"){
        changeSlide(-1);
    }

    if(productModal.classList.contains("active") && event.key === "ArrowRight"){
        changeSlide(1);
    }
});

window.remove = remove;
window.closeCart = closeCart;
window.buy = buy;
window.closeProductModal = closeProductModal;
window.changeSlide = changeSlide;
window.goSlide = goSlide;
window.toggleMenu = toggleMenu;
window.closeAccountModal = closeAccountModal;
window.openMyPage = openMyPage;
window.submitLogout = submitLogout;
window.closeCheckout = closeCheckout;
window.resetCheckoutFields = resetCheckoutFields;

loadProducts();
refreshSession();
update();
