// ======================================
// NOVAPOS
// ======================================

console.log("🎭 NovaPOS app.js պատրաստ է");


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
// FIREBASE AUTH
// ======================================

let firebaseAuth = null;

async function initAuth() {

    try {

        const authModule = await import(
            "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js"
        );

        const auth = authModule.getAuth();

        firebaseAuth = auth;

        authModule.onAuthStateChanged(
            auth,
            function(user) {

                if (user) {

                    console.log(
                        "👤 Մուտք գործած օգտատեր:",
                        user.email
                    );

                    currentUser = user;

                    showPOS();

                } else {

                    console.log(
                        "🔒 Մուտք գործած օգտատեր չկա"
                    );

                    showLogin();
                }
            }
        );

        window.firebaseAuthModule = authModule;

    } catch (error) {

        console.error(
            "❌ Firebase Authentication error:",
            error
        );
    }
}


// ======================================
// CURRENT USER
// ======================================

let currentUser = null;


// ======================================
// LOGIN
// ======================================

async function loginUser() {

    const emailElement =
        document.getElementById("loginEmail");

    const passwordElement =
        document.getElementById("loginPassword");

    const errorElement =
        document.getElementById("loginError");


    if (!emailElement || !passwordElement) {

        console.error(
            "❌ Login դաշտերը դեռ index.html-ում չկան"
        );

        return;
    }


    const email =
        emailElement.value.trim();

    const password =
        passwordElement.value;


    if (errorElement) {
        errorElement.textContent = "";
    }


    if (!email || !password) {

        if (errorElement) {

            errorElement.textContent =
                "Լրացրու email-ը և գաղտնաբառը։";
        }

        return;
    }


    try {

        await window.firebaseAuthModule
            .signInWithEmailAndPassword(
                firebaseAuth,
                email,
                password
            );

    } catch (error) {

        console.error(error);

        if (errorElement) {

            errorElement.textContent =
                "Մուտքը չհաջողվեց։ Ստուգիր տվյալները։";
        }
    }
}


// ======================================
// REGISTER
// ======================================

async function registerUser() {

    const emailElement =
        document.getElementById("registerEmail");

    const passwordElement =
        document.getElementById("registerPassword");

    const errorElement =
        document.getElementById("registerError");


    if (!emailElement || !passwordElement) {

        console.error(
            "❌ Register դաշտերը դեռ index.html-ում չկան"
        );

        return;
    }


    const email =
        emailElement.value.trim();

    const password =
        passwordElement.value;


    if (errorElement) {
        errorElement.textContent = "";
    }


    if (!email || !password) {

        if (errorElement) {

            errorElement.textContent =
                "Լրացրու բոլոր դաշտերը։";
        }

        return;
    }


    if (password.length < 6) {

        if (errorElement) {

            errorElement.textContent =
                "Գաղտնաբառը պետք է լինի առնվազն 6 նիշ։";
        }

        return;
    }


    try {

        await window.firebaseAuthModule
            .createUserWithEmailAndPassword(
                firebaseAuth,
                email,
                password
            );

    } catch (error) {

        console.error(error);

        if (errorElement) {

            if (
                error.code ===
                "auth/email-already-in-use"
            ) {

                errorElement.textContent =
                    "Այս email-ը արդեն գրանցված է։";

            } else {

                errorElement.textContent =
                    "Գրանցումը չհաջողվեց։";
            }
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

        await window.firebaseAuthModule
            .signOut(firebaseAuth);

    } catch (error) {

        console.error(error);
    }
}


// ======================================
// SHOW LOGIN
// ======================================

function showLogin() {

    const loginScreen =
        document.getElementById(
            "loginScreen"
        );

    const posApp =
        document.getElementById(
            "posApp"
        );


    if (loginScreen) {

        loginScreen.style.display =
            "flex";
    }


    if (posApp) {

        posApp.style.display =
            "none";
    }
}


// ======================================
// SHOW POS
// ======================================

function showPOS() {

    const loginScreen =
        document.getElementById(
            "loginScreen"
        );

    const posApp =
        document.getElementById(
            "posApp"
        );


    if (loginScreen) {

        loginScreen.style.display =
            "none";
    }


    if (posApp) {

        posApp.style.display =
            "block";
    }


    renderProducts();
    renderCart();
    updateDashboard();
}


// ======================================
// PAGE
// ======================================

function showPage(page) {

    const pages =
        document.querySelectorAll(
            ".page"
        );


    pages.forEach(function(item) {

        item.classList.remove(
            "active"
        );

    });


    const selected =
        document.getElementById(page);


    if (selected) {

        selected.classList.add(
            "active"
        );
    }


    const titles = {

        dashboard: "Dashboard",

        products: "Ապրանքներ",

        sales: "Վաճառքներ"

    };


    const title =
        document.getElementById(
            "pageTitle"
        );


    if (title) {

        title.textContent =
            titles[page] || "NovaPOS";
    }


    if (
        page === "products"
    ) {

        renderProductTable();
    }


    if (
        page === "sales"
    ) {

        renderSales();
    }
}


// ======================================
// PRODUCTS
// ======================================

function renderProducts() {

    const grid =
        document.getElementById(
            "productsGrid"
        );


    if (!grid) {
        return;
    }


    const searchInput =
        document.getElementById(
            "searchInput"
        );


    let search = "";


    if (searchInput) {

        search =
            searchInput.value
                .toLowerCase()
                .trim();
    }


    grid.innerHTML = "";


    products.forEach(function(product) {

        const name =
            String(product.name)
                .toLowerCase();

        const barcode =
            String(product.barcode);


        if (
            search &&
            !name.includes(search) &&
            !barcode.includes(search)
        ) {

            return;
        }


        const card =
            document.createElement(
                "div"
            );


        card.className =
            "product";


        card.innerHTML =
            "<h3>" +
            escapeHTML(product.name) +
            "</h3>" +

            "<div class='product-price'>" +
            formatMoney(product.price) +
            "</div>" +

            "<div class='product-stock'>" +
            "Պահեստ՝ " +
            product.stock +
            "</div>" +

            "<button onclick='addToCart(" +
            product.id +
            ")'>" +
            "+ Ավելացնել" +
            "</button>";


        grid.appendChild(card);

    });


    const count =
        document.getElementById(
            "productCount"
        );


    if (count) {

        count.textContent =
            products.length;
    }
}


// ======================================
// ADD TO CART
// ======================================

function addToCart(productId) {

    const product =
        products.find(function(item) {

            return item.id === productId;

        });


    if (!product) {
        return;
    }


    if (product.stock <= 0) {

        alert(
            "Ապրանքը պահեստում չկա։"
        );

        return;
    }


    const existing =
        cart.find(function(item) {

            return item.id === productId;

        });


    if (existing) {

        if (
            existing.quantity >=
            product.stock
        ) {

            alert(
                "Պահեստում բավարար քանակ չկա։"
            );

            return;
        }


        existing.quantity++;

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
// CART
// ======================================

function renderCart() {

    const container =
        document.getElementById(
            "cartItems"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (cart.length === 0) {

        container.innerHTML =
            "<p class='empty'>" +
            "Զամբյուղը դատարկ է" +
            "</p>";

        updateTotal();

        return;
    }


    cart.forEach(function(item) {

        const div =
            document.createElement(
                "div"
            );


        div.className =
            "cart-item";


        div.innerHTML =
            "<div>" +

            "<strong>" +
            escapeHTML(item.name) +
            "</strong>" +

            "<small>" +
            formatMoney(item.price) +
            "</small>" +

            "</div>" +

            "<div class='cart-controls'>" +

            "<button onclick='changeQuantity(" +
            item.id +
            ", -1)'>−</button>" +

            "<span>" +
            item.quantity +
            "</span>" +

            "<button onclick='changeQuantity(" +
            item.id +
            ", 1)'>+</button>" +

            "</div>";


        container.appendChild(div);

    });


    updateTotal();
}


// ======================================
// QUANTITY
// ======================================

function changeQuantity(
    id,
    amount
) {

    const item =
        cart.find(function(product) {

            return product.id === id;

        });


    if (!item) {
        return;
    }


    const product =
        products.find(function(product) {

            return product.id === id;

        });


    item.quantity =
        item.quantity + amount;


    if (
        product &&
        item.quantity >
        product.stock
    ) {

        item.quantity =
            product.stock;
    }


    if (
        item.quantity <= 0
    ) {

        cart =
            cart.filter(function(product) {

                return product.id !== id;

            });
    }


    renderCart();
}


// ======================================
// TOTAL
// ======================================

function getCartTotal() {

    let total = 0;


    cart.forEach(function(item) {

        total =
            total +
            item.price *
            item.quantity;

    });


    return total;
}


function updateTotal() {

    const element =
        document.getElementById(
            "cartTotal"
        );


    if (element) {

        element.textContent =
            formatMoney(
                getCartTotal()
            );
    }
}


// ======================================
// PAYMENT
// ======================================

function openPayment() {

    if (cart.length === 0) {

        alert(
            "Զամբյուղը դատարկ է։"
        );

        return;
    }


    const total =
        document.getElementById(
            "paymentTotal"
        );


    if (total) {

        total.textContent =
            formatMoney(
                getCartTotal()
            );
    }


    const modal =
        document.getElementById(
            "paymentModal"
        );


    if (modal) {

        modal.classList.add(
            "show"
        );
    }
}


function closePayment() {

    const modal =
        document.getElementById(
            "paymentModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );
    }
}


function completePayment(method) {

    if (cart.length === 0) {
        return;
    }


    const total =
        getCartTotal();


    cart.forEach(function(item) {

        const product =
            products.find(function(p) {

                return p.id === item.id;

            });


        if (product) {

            product.stock =
                product.stock -
                item.quantity;
        }
    });


    sales.push({

        id: Date.now(),

        date:
            new Date()
                .toLocaleString(
                    "hy-AM"
                ),

        total: total,

        method: method,

        items:
            cart.map(function(item) {

                return {

                    name: item.name,

                    price: item.price,

                    quantity: item.quantity

                };

            })

    });


    cart = [];


    closePayment();

    renderProducts();

    renderCart();

    updateDashboard();

    renderSales();


    alert(
        "✅ Վճարումը հաջողությամբ կատարվեց։"
    );
}


// ======================================
// PRODUCT MODAL
// ======================================

function openProductModal() {

    const modal =
        document.getElementById(
            "productModal"
        );


    if (modal) {

        modal.classList.add(
            "show"
        );
    }
}


function closeProductModal() {

    const modal =
        document.getElementById(
            "productModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );
    }
}


// ======================================
// ADD PRODUCT
// ======================================

function addProduct() {

    const nameElement =
        document.getElementById(
            "productName"
        );

    const priceElement =
        document.getElementById(
            "productPrice"
        );

    const barcodeElement =
        document.getElementById(
            "productBarcode"
        );

    const stockElement =
        document.getElementById(
            "productStock"
        );


    if (
        !nameElement ||
        !priceElement ||
        !stockElement
    ) {

        return;
    }


    const name =
        nameElement.value.trim();

    const price =
        Number(
            priceElement.value
        );

    const barcode =
        barcodeElement
            ? barcodeElement.value.trim()
            : "";

    const stock =
        Number(
            stockElement.value
        );


    if (
        !name ||
        price <= 0 ||
        stock < 0
    ) {

        alert(
            "Լրացրու ապրանքի տվյալները։"
        );

        return;
    }


    products.push({

        id: Date.now(),

        name: name,

        price: price,

        barcode:
            barcode ||
            String(Date.now()),

        stock: stock

    });


    nameElement.value = "";

    priceElement.value = "";

    if (barcodeElement) {
        barcodeElement.value = "";
    }

    stockElement.value = "";


    closeProductModal();

    renderProducts();

    renderProductTable();

    updateDashboard();
}


// ======================================
// PRODUCT TABLE
// ======================================

function renderProductTable() {

    const container =
        document.getElementById(
            "productTable"
        );


    if (!container) {
        return;
    }


    if (products.length === 0) {

        container.innerHTML =
            "<p>Ապրանքներ չկան։";

        return;
    }


    let html =
        "<table>" +

        "<thead>" +

        "<tr>" +

        "<th>Ապրանք</th>" +

        "<th>Barcode</th>" +

        "<th>Գին</th>" +

        "<th>Պահեստ</th>" +

        "</tr>" +

        "</thead>" +

        "<tbody>";


    products.forEach(function(product) {

        html +=
            "<tr>" +

            "<td>" +
            escapeHTML(product.name) +
            "</td>" +

            "<td>" +
            escapeHTML(product.barcode) +
            "</td>" +

            "<td>" +
            formatMoney(product.price) +
            "</td>" +

            "<td>" +
            product.stock +
            "</td>" +

            "</tr>";
    });


    html +=
        "</tbody>" +
        "</table>";


    container.innerHTML =
        html;
}


// ======================================
// SALES
// ======================================

function renderSales() {

    const container =
        document.getElementById(
            "salesTable"
        );


    if (!container) {
        return;
    }


    if (sales.length === 0) {

        container.innerHTML =
            "<p>Վաճառքներ դեռ չկան։</p>";

        return;
    }


    let html =
        "<table>" +

        "<thead>" +

        "<tr>" +

        "<th>Ամսաթիվ</th>" +

        "<th>Գումար</th>" +

        "<th>Վճարում</th>" +

        "</tr>" +

        "</thead>" +

        "<tbody>";


    sales.forEach(function(sale) {

        html +=
            "<tr>" +

            "<td>" +
            escapeHTML(sale.date) +
            "</td>" +

            "<td>" +
            formatMoney(sale.total) +
            "</td>" +

            "<td>" +
            escapeHTML(sale.method) +
            "</td>" +

            "</tr>";
    });


    html +=
        "</tbody>" +
        "</table>";


    container.innerHTML =
        html;
}


// ======================================
// DASHBOARD
// ======================================

function updateDashboard() {

    let total = 0;


    sales.forEach(function(sale) {

        total =
            total +
            sale.total;

    });


    const todaySales =
        document.getElementById(
            "todaySales"
        );


    if (todaySales) {

        todaySales.textContent =
            formatMoney(total);
    }


    const salesCount =
        document.getElementById(
            "salesCount"
        );


    if (salesCount) {

        salesCount.textContent =
            sales.length;
    }


    const productCount =
        document.getElementById(
            "productCount"
        );


    if (productCount) {

        productCount.textContent =
            products.length;
    }
}


// ======================================
// HELPERS
// ======================================

function formatMoney(number) {

    return Number(number)
        .toLocaleString("hy-AM") +
        " ֏";
}


function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ======================================
// START
// ======================================

initAuth();