// ======================================
// NOVAPOS
// ======================================

console.log("🟢 NovaPOS app.js բեռնված է");

// ======================================
// FIREBASE CONFIG
// ======================================

// Firebase-ը պետք է միացված լինի index.html-ում
// window.firebaseApp փոփոխականի միջոցով։

let firebaseAuth = null;
let firebaseDb = null;


// ======================================
// DATA
// ======================================

let products = [
    {
        id: 1,
        name: "Coca Cola 0.5L",
        price: 500,
        barcode: "123456",
        stock: 20
    },
    {
        id: 2,
        name: "Pepsi 0.5L",
        price: 450,
        barcode: "123457",
        stock: 15
    },
    {
        id: 3,
        name: "Ջուր 0.5L",
        price: 300,
        barcode: "123458",
        stock: 30
    }
];

let cart = [];
let sales = [];


// ======================================
// LOCAL STORAGE
// ======================================

function saveData() {
    localStorage.setItem("novapos_products", JSON.stringify(products));
    localStorage.setItem("novapos_sales", JSON.stringify(sales));
}

function loadData() {
    const savedProducts = localStorage.getItem("novapos_products");
    const savedSales = localStorage.getItem("novapos_sales");

    if (savedProducts) {
        try {
            products = JSON.parse(savedProducts);
        } catch (error) {
            console.error("Products load error:", error);
        }
    }

    if (savedSales) {
        try {
            sales = JSON.parse(savedSales);
        } catch (error) {
            console.error("Sales load error:", error);
        }
    }
}


// ======================================
// FIREBASE AUTH
// ======================================

async function initAuth() {
    try {
        const authModule = await import(
            "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"
        );

        if (window.firebaseApp) {
            firebaseAuth = authModule.getAuth(window.firebaseApp);

            console.log("🔥 Firebase Authentication-ը միացված է");
        } else {
            console.warn(
                "⚠️ window.firebaseApp չի գտնվել։ Firebase App-ը միացրու index.html-ում։"
            );
        }

    } catch (error) {
        console.error("❌ Firebase Auth Error:", error);
    }
}


// ======================================
// PRODUCT SEARCH
// ======================================

function findProductByBarcode(barcode) {
    return products.find(
        product => String(product.barcode) === String(barcode)
    );
}

function findProductById(id) {
    return products.find(
        product => Number(product.id) === Number(id)
    );
}


// ======================================
// ADD PRODUCT TO CART
// ======================================

function addToCart(barcode) {

    const product = findProductByBarcode(barcode);

    if (!product) {
        alert("❌ Ապրանքը չի գտնվել");
        return;
    }

    if (product.stock <= 0) {
        alert("❌ Ապրանքը պահեստում չկա");
        return;
    }

    const existingItem = cart.find(
        item => item.id === product.id
    );

    if (existingItem) {

        if (existingItem.quantity >= product.stock) {
            alert("❌ Պահեստում բավարար քանակ չկա");
            return;
        }

        existingItem.quantity++;

    } else {

        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    renderCart();
}


// ======================================
// ADD PRODUCT BY ID
// ======================================

function addProductById(id) {

    const product = findProductById(id);

    if (!product) {
        alert("Ապրանքը չի գտնվել");
        return;
    }

    addToCart(product.barcode);
}


// ======================================
// REMOVE FROM CART
// ======================================

function removeFromCart(id) {

    cart = cart.filter(
        item => item.id !== id
    );

    renderCart();
}


// ======================================
// CHANGE QUANTITY
// ======================================

function changeQuantity(id, quantity) {

    const item = cart.find(
        cartItem => cartItem.id === id
    );

    if (!item) {
        return;
    }

    quantity = Number(quantity);

    if (quantity <= 0) {
        removeFromCart(id);
        return;
    }

    const product = findProductById(id);

    if (!product) {
        return;
    }

    if (quantity > product.stock) {
        alert(
            `❌ Պահեստում կա միայն ${product.stock} հատ`
        );
        return;
    }

    item.quantity = quantity;

    renderCart();
}


// ======================================
// INCREASE QUANTITY
// ======================================

function increaseQuantity(id) {

    const item = cart.find(
        cartItem => cartItem.id === id
    );

    if (!item) {
        return;
    }

    changeQuantity(
        id,
        item.quantity + 1
    );
}


// ======================================
// DECREASE QUANTITY
// ======================================

function decreaseQuantity(id) {

    const item = cart.find(
        cartItem => cartItem.id === id
    );

    if (!item) {
        return;
    }

    changeQuantity(
        id,
        item.quantity - 1
    );
}


// ======================================
// CART TOTAL
// ======================================

function getCartTotal() {

    return cart.reduce(
        (total, item) => {
            return total + (
                Number(item.price) *
                Number(item.quantity)
            );
        },
        0
    );
}


// ======================================
// CART ITEMS COUNT
// ======================================

function getCartItemsCount() {

    return cart.reduce(
        (total, item) => {
            return total + Number(item.quantity);
        },
        0
    );
}


// ======================================
// FORMAT MONEY
// ======================================

function formatMoney(value) {

    return Number(value).toLocaleString("hy-AM") + " ֏";
}


// ======================================
// RENDER CART
// ======================================

function renderCart() {

    const cartElement =
        document.getElementById("cart");

    if (!cartElement) {
        return;
    }

    cartElement.innerHTML = "";

    if (cart.length === 0) {

        cartElement.innerHTML = `
            <div class="empty-cart">
                <div style="font-size:40px;">🛒</div>
                <p>Զամբյուղը դատարկ է</p>
            </div>
        `;

    } else {

        cart.forEach(item => {

            const row =
                document.createElement("div");

            row.className = "cart-item";

            row.innerHTML = `

                <div class="cart-item-info">

                    <strong>
                        ${escapeHTML(item.name)}
                    </strong>

                    <span>
                        ${formatMoney(item.price)}
                    </span>

                </div>

                <div class="cart-item-controls">

                    <button
                        onclick="decreaseQuantity(${item.id})"
                    >
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        onclick="increaseQuantity(${item.id})"
                    >
                        +
                    </button>

                    <button
                        onclick="removeFromCart(${item.id})"
                    >
                        ✕
                    </button>

                </div>

                <strong class="cart-item-total">
                    ${formatMoney(
                        item.price * item.quantity
                    )}
                </strong>
            `;

            cartElement.appendChild(row);
        });
    }

    updateCartTotal();
}


// ======================================
// UPDATE CART TOTAL
// ======================================

function updateCartTotal() {

    const total =
        getCartTotal();

    const totalElement =
        document.getElementById("cart-total");

    if (totalElement) {

        totalElement.textContent =
            formatMoney(total);
    }

    const countElement =
        document.getElementById("cart-count");

    if (countElement) {

        countElement.textContent =
            getCartItemsCount();
    }
}


// ======================================
// CLEAR CART
// ======================================

function clearCart() {

    if (cart.length === 0) {
        return;
    }

    const confirmClear =
        confirm(
            "Վստա՞հ ես, որ ցանկանում ես դատարկել զամբյուղը։"
        );

    if (!confirmClear) {
        return;
    }

    cart = [];

    renderCart();
}


// ======================================
// COMPLETE SALE
// ======================================

function completeSale() {

    if (cart.length === 0) {

        alert("❌ Զամբյուղը դատարկ է");

        return;
    }

    const total =
        getCartTotal();

    // Ստուգում ենք պահեստը
    for (const item of cart) {

        const product =
            findProductById(item.id);

        if (!product) {
            continue;
        }

        if (item.quantity > product.stock) {

            alert(
                `❌ ${product.name}-ի պահեստային քանակը բավարար չէ`
            );

            return;
        }
    }

    // Հանում ենք պահեստից
    cart.forEach(item => {

        const product =
            findProductById(item.id);

        if (product) {

            product.stock -=
                item.quantity;
        }
    });

    // Ստեղծում ենք վաճառքը
    const sale = {

        id: Date.now(),

        items: JSON.parse(
            JSON.stringify(cart)
        ),

        total: total,

        date: new Date().toISOString(),

        readableDate:
            new Date().toLocaleString(
                "hy-AM"
            )
    };

    sales.push(sale);

    saveData();

    cart = [];

    renderCart();
    renderProducts();
    renderDashboard();

    alert(
        `✅ Վաճառքը հաջողությամբ ավարտվեց։\n\nԸնդհանուր՝ ${formatMoney(total)}`
    );
}


// ======================================
// PRODUCTS RENDER
// ======================================

function renderProducts(
    list = products
) {

    const container =
        document.getElementById("products");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (list.length === 0) {

        container.innerHTML = `
            <div class="no-products">
                Ապրանք չի գտնվել
            </div>
        `;

        return;
    }

    list.forEach(product => {

        const card =
            document.createElement("div");

        card.className =
            "product-card";

        const disabled =
            product.stock <= 0
                ? "disabled"
                : "";

        card.innerHTML = `

            <div class="product-card-body">

                <h3>
                    ${escapeHTML(product.name)}
                </h3>

                <div class="product-price">
                    ${formatMoney(product.price)}
                </div>

                <div class="product-barcode">
                    Շտրիխկոդ՝ ${product.barcode}
                </div>

                <div class="product-stock">
                    Պահեստ՝ ${product.stock}
                </div>

            </div>

            <button
                class="add-product-btn"
                ${disabled}
                onclick="addToCart('${product.barcode}')"
            >
                ${product.stock > 0
                    ? "➕ Ավելացնել"
                    : "Չկա պահեստում"}
            </button>
        `;

        container.appendChild(card);
    });
}


// ======================================
// SEARCH PRODUCT
// ======================================

function searchProduct(value) {

    const text =
        String(value)
            .toLowerCase()
            .trim();

    if (!text) {

        renderProducts(products);

        return;
    }

    const filtered =
        products.filter(product => {

            return (
                product.name
                    .toLowerCase()
                    .includes(text)
                ||
                String(product.barcode)
                    .includes(text)
            );
        });

    renderProducts(filtered);
}


// ======================================
// BARCODE SCANNER INPUT
// ======================================

function scanBarcode(barcode) {

    barcode =
        String(barcode)
            .trim();

    if (!barcode) {
        return;
    }

    const product =
        findProductByBarcode(barcode);

    if (!product) {

        alert(
            "❌ Այս շտրիխկոդով ապրանք չկա"
        );

        return;
    }

    addToCart(barcode);
}


// ======================================
// ADD NEW PRODUCT
// ======================================

function addNewProduct(
    name,
    price,
    barcode,
    stock
) {

    name =
        String(name).trim();

    price =
        Number(price);

    barcode =
        String(barcode).trim();

    stock =
        Number(stock);

    if (!name) {
        alert("Մուտքագրիր ապրանքի անունը");
        return false;
    }

    if (!price || price < 0) {
        alert("Մուտքագրիր ճիշտ գին");
        return false;
    }

    if (!barcode) {
        alert("Մուտքագրիր շտրիխկոդ");
        return false;
    }

    if (products.some(
        product =>
            String(product.barcode) === barcode
    )) {

        alert(
            "❌ Այս շտրիխկոդը արդեն օգտագործվում է"
        );

        return false;
    }

    if (stock < 0) {
        stock = 0;
    }

    const newProduct = {

        id:
            Date.now(),

        name:
            name,

        price:
            price,

        barcode:
            barcode,

        stock:
            stock
    };

    products.push(newProduct);

    saveData();

    renderProducts();

    alert(
        "✅ Ապրանքը ավելացվեց"
    );

    return true;
}


// ======================================
// DELETE PRODUCT
// ======================================

function deleteProduct(id) {

    const product =
        findProductById(id);

    if (!product) {
        return;
    }

    const confirmed =
        confirm(
            `Ջնջե՞լ «${product.name}» ապրանքը։`
        );

    if (!confirmed) {
        return;
    }

    products =
        products.filter(
            item => item.id !== id
        );

    cart =
        cart.filter(
            item => item.id !== id
        );

    saveData();

    renderProducts();
    renderCart();
}


// ======================================
// DASHBOARD
// ======================================

function getTodaySales() {

    const today =
        new Date();

    return sales.filter(
        sale => {

            const saleDate =
                new Date(sale.date);

            return (
                saleDate.getFullYear() ===
                    today.getFullYear()
                &&
                saleDate.getMonth() ===
                    today.getMonth()
                &&
                saleDate.getDate() ===
                    today.getDate()
            );
        }
    );
}


function getTodayRevenue() {

    return getTodaySales().reduce(
        (total, sale) => {

            return total +
                Number(sale.total);

        },
        0
    );
}


function renderDashboard() {

    const todaySales =
        getTodaySales();

    const todayRevenue =
        getTodayRevenue();

    const salesElement =
        document.getElementById(
            "today-sales"
        );

    if (salesElement) {

        salesElement.textContent =
            todaySales.length;
    }

    const revenueElement =
        document.getElementById(
            "today-revenue"
        );

    if (revenueElement) {

        revenueElement.textContent =
            formatMoney(todayRevenue);
    }

    const productsElement =
        document.getElementById(
            "products-count"
        );

    if (productsElement) {

        productsElement.textContent =
            products.length;
    }
}


// ======================================
// SALES HISTORY
// ======================================

function renderSales() {

    const container =
        document.getElementById(
            "sales-list"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (sales.length === 0) {

        container.innerHTML = `
            <div>
                Վաճառքներ դեռ չկան
            </div>
        `;

        return;
    }

    const sortedSales =
        [...sales].reverse();

    sortedSales.forEach(sale => {

        const element =
            document.createElement("div");

        element.className =
            "sale-item";

        element.innerHTML = `

            <div>
                <strong>
                    Վաճառք #${sale.id}
                </strong>

                <small>
                    ${sale.readableDate || ""}
                </small>
            </div>

            <strong>
                ${formatMoney(sale.total)}
            </strong>
        `;

        container.appendChild(element);
    });
}


// ======================================
// RESET ALL DATA
// ======================================

function resetNovaPOS() {

    const confirmed =
        confirm(
            "⚠️ Վստա՞հ ես։ Բոլոր ապրանքները և վաճառքները կջնջվեն։"
        );

    if (!confirmed) {
        return;
    }

    localStorage.removeItem(
        "novapos_products"
    );

    localStorage.removeItem(
        "novapos_sales"
    );

    products = [
        {
            id: 1,
            name: "Coca Cola 0.5L",
            price: 500,
            barcode: "123456",
            stock: 20
        },
        {
            id: 2,
            name: "Pepsi 0.5L",
            price: 450,
            barcode: "123457",
            stock: 15
        },
        {
            id: 3,
            name: "Ջուր 0.5L",
            price: 300,
            barcode: "123458",
            stock: 30
        }
    ];

    sales = [];

    cart = [];

    renderProducts();
    renderCart();
    renderDashboard();
    renderSales();

    alert(
        "✅ NovaPOS-ը վերականգնվեց"
    );
}


// ======================================
// HTML SECURITY
// ======================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ======================================
// ENTER KEY — BARCODE
// ======================================

function setupBarcodeInput() {

    const input =
        document.getElementById(
            "barcode-input"
        );

    if (!input) {
        return;
    }

    input.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                event.preventDefault();

                scanBarcode(
                    input.value
                );

                input.value = "";

                input.focus();
            }
        }
    );
}


// ======================================
// SEARCH INPUT
// ======================================

function setupSearchInput() {

    const input =
        document.getElementById(
            "search-input"
        );

    if (!input) {
        return;
    }

    input.addEventListener(
        "input",
        function() {

            searchProduct(
                input.value
            );
        }
    );
}


// ======================================
// GLOBAL FUNCTIONS
// ======================================

window.addToCart =
    addToCart;

window.addProductById =
    addProductById;

window.removeFromCart =
    removeFromCart;

window.changeQuantity =
    changeQuantity;

window.increaseQuantity =
    increaseQuantity;

window.decreaseQuantity =
    decreaseQuantity;

window.clearCart =
    clearCart;

window.completeSale =
    completeSale;

window.searchProduct =
    searchProduct;

window.scanBarcode =
    scanBarcode;

window.addNewProduct =
    addNewProduct;

window.deleteProduct =
    deleteProduct;

window.resetNovaPOS =
    resetNovaPOS;

window.renderProducts =
    renderProducts;

window.renderCart =
    renderCart;

window.renderSales =
    renderSales;

window.renderDashboard =
    renderDashboard;


// ======================================
// START APPLICATION
// ======================================

document.addEventListener(
    "DOMContentLoaded",
    async function() {

        console.log(
            "🚀 NovaPOS-ը սկսվեց"
        );

        // Տվյալների բեռնում
        loadData();

        // UI
        renderProducts();
        renderCart();
        renderDashboard();
        renderSales();

        // Input-ներ
        setupBarcodeInput();
        setupSearchInput();

        // Firebase
        await initAuth();

        console.log(
            "✅ NovaPOS-ը պատրաստ է աշխատանքի"
        );
    }
);
