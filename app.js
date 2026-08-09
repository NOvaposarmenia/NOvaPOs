// ======================================
// NOVAPOS APP
// ======================================

console.log("🟢 NovaPOS app.js բեռնված է");


// ======================================
// FIREBASE CONFIG
// ======================================
//
// ⚠️ ԱՅՍ ՏԵՂԸ ԴԻՐ ՔՈ FIREBASE CONFIG-Ը
//
// Firebase Console
// → Project settings
// → Your apps
// → Web app
// → SDK setup and configuration
//
// ======================================

const firebaseConfig = {

    apiKey: "ՔՈ_API_KEY",

    authDomain:
        "ՔՈ_PROJECT_ID.firebaseapp.com",

    projectId:
        "ՔՈ_PROJECT_ID",

    storageBucket:
        "ՔՈ_PROJECT_ID.appspot.com",

    messagingSenderId:
        "ՔՈ_MESSAGING_SENDER_ID",

    appId:
        "ՔՈ_APP_ID"
};


// ======================================
// FIREBASE
// ======================================

let firebaseApp = null;
let firebaseAuth = null;

let firebaseReady = false;


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
// FIREBASE INITIALIZATION
// ======================================

async function initFirebase() {

    try {

        const appModule = await import(
            "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"
        );

        const authModule = await import(
            "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"
        );


        firebaseApp =
            appModule.initializeApp(
                firebaseConfig
            );


        firebaseAuth =
            authModule.getAuth(
                firebaseApp
            );


        firebaseReady = true;


        console.log(
            "🔥 Firebase App-ը միացված է"
        );


        firebaseAuth.onAuthStateChanged(
            function(user) {

                if (user) {

                    console.log(
                        "👤 Մուտք գործած օգտատեր:",
                        user.email
                    );

                    showApp(user);

                } else {

                    console.log(
                        "👤 Օգտատեր մուտք գործած չէ"
                    );

                    showAuth();
                }
            }
        );


        setAuthStatus(
            "Firebase-ը պատրաստ է ✅"
        );


    } catch (error) {

        console.error(
            "❌ Firebase Error:",
            error
        );

        setAuthStatus(
            "Firebase-ի միացման սխալ ❌"
        );
    }
}


// ======================================
// AUTH STATUS
// ======================================

function setAuthStatus(message) {

    const element =
        document.getElementById(
            "auth-status"
        );

    if (element) {

        element.textContent =
            message;
    }
}


// ======================================
// REGISTER
// ======================================

async function registerUser() {

    if (!firebaseReady || !firebaseAuth) {

        alert(
            "❌ Firebase-ը դեռ պատրաստ չէ"
        );

        return;
    }


    const emailElement =
        document.getElementById(
            "register-email"
        );

    const passwordElement =
        document.getElementById(
            "register-password"
        );


    const email =
        emailElement.value.trim();

    const password =
        passwordElement.value;


    if (!email) {

        alert(
            "❌ Մուտքագրիր Email-ը"
        );

        return;
    }


    if (!password) {

        alert(
            "❌ Մուտքագրիր գաղտնաբառը"
        );

        return;
    }


    if (password.length < 6) {

        alert(
            "❌ Գաղտնաբառը պետք է լինի առնվազն 6 նիշ"
        );

        return;
    }


    try {

        const authModule =
            await import(
                "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"
            );


        const result =
            await authModule
                .createUserWithEmailAndPassword(
                    firebaseAuth,
                    email,
                    password
                );


        console.log(
            "✅ Գրանցումը հաջողվեց:",
            result.user.email
        );


        alert(
            "✅ Հաշիվը հաջողությամբ ստեղծվեց"
        );


    } catch (error) {

        console.error(
            "❌ Registration error:",
            error
        );


        switch (error.code) {

            case "auth/email-already-in-use":

                alert(
                    "❌ Այս Email-ը արդեն գրանցված է"
                );

                break;


            case "auth/invalid-email":

                alert(
                    "❌ Email-ը սխալ է"
                );

                break;


            case "auth/weak-password":

                alert(
                    "❌ Գաղտնաբառը շատ թույլ է"
                );

                break;


            default:

                alert(
                    "❌ Գրանցման սխալ\n\n" +
                    error.message
                );
        }
    }
}


// ======================================
// LOGIN
// ======================================

async function loginUser() {

    if (!firebaseReady || !firebaseAuth) {

        alert(
            "❌ Firebase-ը դեռ պատրաստ չէ"
        );

        return;
    }


    const email =
        document
            .getElementById(
                "register-email"
            )
            .value
            .trim();


    const password =
        document
            .getElementById(
                "register-password"
            )
            .value;


    if (!email || !password) {

        alert(
            "❌ Մուտքագրիր Email և գաղտնաբառ"
        );

        return;
    }


    try {

        const authModule =
            await import(
                "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"
            );


        const result =
            await authModule
                .signInWithEmailAndPassword(
                    firebaseAuth,
                    email,
                    password
                );


        console.log(
            "✅ Մուտքը հաջողվեց:",
            result.user.email
        );


    } catch (error) {

        console.error(
            "❌ Login error:",
            error
        );


        switch (error.code) {

            case "auth/invalid-credential":

                alert(
                    "❌ Email-ը կամ գաղտնաբառը սխալ է"
                );

                break;


            case "auth/user-not-found":

                alert(
                    "❌ Այս օգտատերը գոյություն չունի"
                );

                break;


            case "auth/wrong-password":

                alert(
                    "❌ Գաղտնաբառը սխալ է"
                );

                break;


            case "auth/invalid-email":

                alert(
                    "❌ Email-ը սխալ է"
                );

                break;


            default:

                alert(
                    "❌ Մուտքի սխալ\n\n" +
                    error.message
                );
        }
    }
}


// ======================================
// LOGOUT
// ======================================

async function logoutUser() {

    if (!firebaseAuth) {
        return;
    }


    try {

        const authModule =
            await import(
                "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"
            );


        await authModule.signOut(
            firebaseAuth
        );


        console.log(
            "👋 Օգտատերը դուրս եկավ"
        );


    } catch (error) {

        console.error(
            "Logout error:",
            error
        );
    }
}


// ======================================
// SHOW AUTH
// ======================================

function showAuth() {

    const authSection =
        document.getElementById(
            "auth-section"
        );

    const appSection =
        document.getElementById(
            "app-section"
        );


    if (authSection) {

        authSection.classList.remove(
            "hidden"
        );
    }


    if (appSection) {

        appSection.classList.add(
            "hidden"
        );
    }
}


// ======================================
// SHOW APP
// ======================================

function showApp(user) {

    const authSection =
        document.getElementById(
            "auth-section"
        );

    const appSection =
        document.getElementById(
            "app-section"
        );


    if (authSection) {

        authSection.classList.add(
            "hidden"
        );
    }


    if (appSection) {

        appSection.classList.remove(
            "hidden"
        );
    }


    const userEmail =
        document.getElementById(
            "user-email"
        );


    if (userEmail && user) {

        userEmail.textContent =
            user.email;
    }


    renderProducts();
    renderCart();
    renderDashboard();
    renderSales();
}


// ======================================
// LOCAL STORAGE
// ======================================

function loadData() {

    const savedProducts =
        localStorage.getItem(
            "novapos_products"
        );


    const savedSales =
        localStorage.getItem(
            "novapos_sales"
        );


    if (savedProducts) {

        try {

            products =
                JSON.parse(
                    savedProducts
                );

        } catch (error) {

            console.error(
                "Products load error:",
                error
            );
        }
    }


    if (savedSales) {

        try {

            sales =
                JSON.parse(
                    savedSales
                );

        } catch (error) {

            console.error(
                "Sales load error:",
                error
            );
        }
    }
}


// ======================================
// SAVE DATA
// ======================================

function saveData() {

    localStorage.setItem(
        "novapos_products",
        JSON.stringify(products)
    );


    localStorage.setItem(
        "novapos_sales",
        JSON.stringify(sales)
    );
}


// ======================================
// FIND PRODUCT
// ======================================

function findProductByBarcode(
    barcode
) {

    return products.find(
        product =>
            String(product.barcode) ===
            String(barcode)
    );
}


function findProductById(id) {

    return products.find(
        product =>
            Number(product.id) ===
            Number(id)
    );
}


// ======================================
// MONEY
// ======================================

function formatMoney(value) {

    return (
        Number(value)
            .toLocaleString("hy-AM")
        + " ֏"
    );
}


// ======================================
// ADD TO CART
// ======================================

function addToCart(barcode) {

    const product =
        findProductByBarcode(
            barcode
        );


    if (!product) {

        alert(
            "❌ Ապրանքը չի գտնվել"
        );

        return;
    }


    if (product.stock <= 0) {

        alert(
            "❌ Ապրանքը պահեստում չկա"
        );

        return;
    }


    const existing =
        cart.find(
            item =>
                item.id ===
                product.id
        );


    if (existing) {

        if (
            existing.quantity >=
            product.stock
        ) {

            alert(
                "❌ Պահեստում բավարար քանակ չկա"
            );

            return;
        }


        existing.quantity++;

    } else {

        cart.push({

            id:
                product.id,

            name:
                product.name,

            price:
                product.price,

            quantity:
                1
        });
    }


    renderCart();
}


// ======================================
// CART TOTAL
// ======================================

function getCartTotal() {

    return cart.reduce(
        (total, item) => {

            return total +
                (
                    Number(item.price) *
                    Number(item.quantity)
                );

        },
        0
    );
}


// ======================================
// CART COUNT
// ======================================

function getCartItemsCount() {

    return cart.reduce(
        (total, item) => {

            return total +
                Number(item.quantity);

        },
        0
    );
}


// ======================================
// RENDER CART
// ======================================

function renderCart() {

    const cartElement =
        document.getElementById(
            "cart"
        );


    if (!cartElement) {
        return;
    }


    cartElement.innerHTML = "";


    if (cart.length === 0) {

        cartElement.innerHTML = `
            <div class="empty-cart">
                🛒
                <p>Զամբյուղը դատարկ է</p>
            </div>
        `;

    } else {

        cart.forEach(item => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "cart-item";


            row.innerHTML = `

                <div class="cart-item-info">

                    <strong>
                        ${escapeHTML(
                            item.name
                        )}
                    </strong>

                    <span>
                        ${formatMoney(
                            item.price
                        )}
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
                        item.price *
                        item.quantity
                    )}

                </strong>
            `;


            cartElement.appendChild(
                row
            );
        });
    }


    updateCartTotal();
}


// ======================================
// UPDATE TOTAL
// ======================================

function updateCartTotal() {

    const totalElement =
        document.getElementById(
            "cart-total"
        );


    if (totalElement) {

        totalElement.textContent =
            formatMoney(
                getCartTotal()
            );
    }
}


// ======================================
// REMOVE
// ======================================

function removeFromCart(id) {

    cart =
        cart.filter(
            item =>
                item.id !== id
        );


    renderCart();
}


// ======================================
// INCREASE
// ======================================

function increaseQuantity(id) {

    const item =
        cart.find(
            x => x.id === id
        );


    if (!item) {
        return;
    }


    const product =
        findProductById(id);


    if (!product) {
        return;
    }


    if (
        item.quantity >=
        product.stock
    ) {

        alert(
            "❌ Պահեստում այլևս չկա"
        );

        return;
    }


    item.quantity++;

    renderCart();
}


// ======================================
// DECREASE
// ======================================

function decreaseQuantity(id) {

    const item =
        cart.find(
            x => x.id === id
        );


    if (!item) {
        return;
    }


    item.quantity--;


    if (item.quantity <= 0) {

        removeFromCart(id);

        return;
    }


    renderCart();
}


// ======================================
// CLEAR CART
// ======================================

function clearCart() {

    if (cart.length === 0) {
        return;
    }


    if (
        !confirm(
            "Դատարկե՞լ զամբյուղը։"
        )
    ) {

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

        alert(
            "❌ Զամբյուղը դատարկ է"
        );

        return;
    }


    for (const item of cart) {

        const product =
            findProductById(
                item.id
            );


        if (
            !product ||
            item.quantity >
            product.stock
        ) {

            alert(
                "❌ Պահեստում բավարար քանակ չկա"
            );

            return;
        }
    }


    const total =
        getCartTotal();


    cart.forEach(item => {

        const product =
            findProductById(
                item.id
            );


        if (product) {

            product.stock -=
                item.quantity;
        }
    });


    const sale = {

        id:
            Date.now(),

        items:
            JSON.parse(
                JSON.stringify(cart)
            ),

        total:
            total,

        date:
            new Date().toISOString(),

        readableDate:
            new Date().toLocaleString(
                "hy-AM"
            )
    };


    sales.push(sale);


    cart = [];


    saveData();


    renderProducts();
    renderCart();
    renderDashboard();
    renderSales();


    alert(
        "✅ Վաճառքը հաջողությամբ ավարտվեց\n\n" +
        "Ընդհանուր՝ " +
        formatMoney(total)
    );
}


// ======================================
// RENDER PRODUCTS
// ======================================

function renderProducts(
    list = products
) {

    const container =
        document.getElementById(
            "products"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (list.length === 0) {

        container.innerHTML = `
            <p>Ապրանք չի գտնվել</p>
        `;

        return;
    }


    list.forEach(product => {

        const card =
            document.createElement(
                "div"
            );


        card.className =
            "product-card";


        card.innerHTML = `

            <h3>
                ${escapeHTML(
                    product.name
                )}
            </h3>


            <div class="product-price">

                ${formatMoney(
                    product.price
                )}

            </div>


            <div>
                Շտրիխկոդ՝
                ${product.barcode}
            </div>


            <div class="product-stock">

                Պահեստ՝
                ${product.stock}

            </div>


            <button
                class="add-product-btn"
                ${
                    product.stock <= 0
                        ? "disabled"
                        : ""
                }
                onclick="addToCart('${product.barcode}')"
            >

                ${
                    product.stock > 0
                        ? "➕ Ավելացնել"
                        : "Չկա պահեստում"
                }

            </button>
        `;


        container.appendChild(
            card
        );
    });
}


// ======================================
// SEARCH
// ======================================

function searchProduct(value) {

    const text =
        String(value)
            .toLowerCase()
            .trim();


    if (!text) {

        renderProducts();

        return;
    }


    const filtered =
        products.filter(
            product => {

                return (
                    product.name
                        .toLowerCase()
                        .includes(text)
                    ||
                    String(
                        product.barcode
                    ).includes(text)
                );
            }
        );


    renderProducts(
        filtered
    );
}


// ======================================
// BARCODE
// ======================================

function scanBarcode(barcode) {

    barcode =
        String(barcode)
            .trim();


    if (!barcode) {
        return;
    }


    const product =
        findProductByBarcode(
            barcode
        );


    if (!product) {

        alert(
            "❌ Այս շտրիխկոդով ապրանք չկա"
        );

        return;
    }


    addToCart(
        barcode
    );
}


// ======================================
// CREATE PRODUCT
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

        alert(
            "Մուտքագրիր ապրանքի անունը"
        );

        return false;
    }


    if (
        !Number.isFinite(price) ||
        price < 0
    ) {

        alert(
            "Մուտքագրիր ճիշտ գին"
        );

        return false;
    }


    if (!barcode) {

        alert(
            "Մուտքագրիր շտրիխկոդ"
        );

        return false;
    }


    if (
        products.some(
            product =>
                String(
                    product.barcode
                ) === barcode
        )
    ) {

        alert(
            "❌ Այս շտրիխկոդը արդեն կա"
        );

        return false;
    }


    if (
        !Number.isFinite(stock) ||
        stock < 0
    ) {

        stock = 0;
    }


    products.push({

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
    });


    saveData();

    renderProducts();
    renderDashboard();


    alert(
        "✅ Ապրանքը ավելացվեց"
    );


    return true;
}


// ======================================
// CREATE PRODUCT FROM HTML
// ======================================

function createProductFromForm() {

    const name =
        document.getElementById(
            "new-product-name"
        ).value;


    const price =
        document.getElementById(
            "new-product-price"
        ).value;


    const barcode =
        document.getElementById(
            "new-product-barcode"
        ).value;


    const stock =
        document.getElementById(
            "new-product-stock"
        ).value;


    const success =
        addNewProduct(
            name,
            price,
            barcode,
            stock
        );


    if (success) {

        document.getElementById(
            "new-product-name"
        ).value = "";


        document.getElementById(
            "new-product-price"
        ).value = "";


        document.getElementById(
            "new-product-barcode"
        ).value = "";


        document.getElementById(
            "new-product-stock"
        ).value = "";
    }
}


// ======================================
// DASHBOARD
// ======================================

function getTodaySales() {

    const today =
        new Date();


    return sales.filter(
        sale => {

            const date =
                new Date(
                    sale.date
                );


            return (
                date.getFullYear() ===
                    today.getFullYear()
                &&
                date.getMonth() ===
                    today.getMonth()
                &&
                date.getDate() ===
                    today.getDate()
            );
        }
    );
}


function getTodayRevenue() {

    return getTodaySales().reduce(
        (total, sale) => {

            return total +
                Number(
                    sale.total
                );

        },
        0
    );
}


function renderDashboard() {

    const todaySales =
        getTodaySales();


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
            formatMoney(
                getTodayRevenue()
            );
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

        container.innerHTML =
            "<p>Վաճառքներ դեռ չկան</p>";

        return;
    }


    [...sales]
        .reverse()
        .forEach(
            sale => {

                const element =
                    document.createElement(
                        "div"
                    );


                element.className =
                    "sale-item";


                element.innerHTML = `

                    <div>

                        <strong>
                            Վաճառք #${sale.id}
                        </strong>

                        <small>
                            ${
                                sale.readableDate ||
                                ""
                            }
                        </small>

                    </div>


                    <strong>

                        ${formatMoney(
                            sale.total
                        )}

                    </strong>
                `;


                container.appendChild(
                    element
                );
            }
        );
}


// ======================================
// RESET
// ======================================

function resetNovaPOS() {

    if (
        !confirm(
            "⚠️ Վստա՞հ ես։ Բոլոր տվյալները կվերականգնվեն։"
        )
    ) {

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
// ESCAPE HTML
// ======================================

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


// ======================================
// INPUT EVENTS
// ======================================

function setupInputs() {

    const barcodeInput =
        document.getElementById(
            "barcode-input"
        );


    if (barcodeInput) {

        barcodeInput.addEventListener(
            "keydown",
            function(event) {

                if (
                    event.key ===
                    "Enter"
                ) {

                    event.preventDefault();


                    scanBarcode(
                        barcodeInput.value
                    );


                    barcodeInput.value = "";


                    barcodeInput.focus();
                }
            }
        );
    }


    const searchInput =
        document.getElementById(
            "search-input"
        );


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function() {

                searchProduct(
                    searchInput.value
                );
            }
        );
    }
}


// ======================================
// GLOBAL FUNCTIONS
// ======================================

window.registerUser =
    registerUser;

window.loginUser =
    loginUser;

window.logoutUser =
    logoutUser;

window.addToCart =
    addToCart;

window.removeFromCart =
    removeFromCart;

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

window.createProductFromForm =
    createProductFromForm;

window.resetNovaPOS =
    resetNovaPOS;

window.renderProducts =
    renderProducts;

window.renderCart =
    renderCart;


// ======================================
// START
// ======================================

document.addEventListener(
    "DOMContentLoaded",
    async function() {

        console.log(
            "🚀 NovaPOS-ը սկսվում է..."
        );


        loadData();


        setupInputs();


        renderProducts();
        renderCart();
        renderDashboard();
        renderSales();


        await initFirebase();


        console.log(
            "✅ NovaPOS-ը պատրաստ է աշխատանքի"
        );
    }
);
