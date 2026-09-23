/* =========================================================
   MUFFINSMP WEBSITE SCRIPT
   ========================================================= */

const SERVER_IP = "play.muffinsmp.ir";

const API = "https://cullofduty63.cullofduty63.workers.dev/api";

const TOKEN_KEY = "muffin_token";


/* =========================================================
   HELPERS
   ========================================================= */

function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}


function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}


function removeToken() {
    localStorage.removeItem(TOKEN_KEY);
}


async function apiFetch(endpoint, options = {}) {

    const token = getToken();

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    return fetch(`${API}${endpoint}`, {
        ...options,
        headers
    });
}


/* =========================================================
   NAVBAR AUTH
   ========================================================= */

async function updateNavbar() {

    const authArea = document.getElementById("authArea");
    const heroAuthButton = document.getElementById("heroAuthButton");

    if (!authArea) return;

    const token = getToken();

    /* -------------------------
       NOT LOGGED IN
       ------------------------- */

    if (!token) {

        authArea.innerHTML = `
            <a href="login.html" class="nav-login">
                ورود
            </a>
        `;

        if (heroAuthButton) {

            heroAuthButton.href = "login.html";

            heroAuthButton.innerHTML = `
                👤 ورود به حساب
            `;
        }

        return;
    }


    /* -------------------------
       CHECK USER
       ------------------------- */

    try {

        const response = await apiFetch("/me");

        const data = await response.json();


        /* -------------------------
           TOKEN INVALID
           ------------------------- */

        if (!response.ok || !data.success || !data.user) {

            removeToken();

            authArea.innerHTML = `
                <a href="login.html" class="nav-login">
                    ورود
                </a>
            `;

            if (heroAuthButton) {

                heroAuthButton.href = "login.html";

                heroAuthButton.innerHTML = `
                    👤 ورود به حساب
                `;
            }

            return;
        }


        /* -------------------------
           USER LOGGED IN
           ------------------------- */

        const username = data.user.username || "کاربر";


        authArea.innerHTML = `
            <a
                href="panel.html"
                class="nav-user"
                title="ورود به پنل"
            >
                👤 ${escapeHtml(username)}
            </a>

            <a
                href="#"
                class="nav-logout"
                onclick="logout(); return false;"
            >
                🚪 خروج
            </a>
        `;


        if (heroAuthButton) {

            heroAuthButton.href = "panel.html";

            heroAuthButton.innerHTML = `
                👤 پنل کاربری
            `;
        }


    } catch (error) {

        console.error("Auth check error:", error);

        /*
         * اگر API موقتاً در دسترس نبود،
         * توکن را حذف نمی‌کنیم.
         */

        authArea.innerHTML = `
            <a href="login.html" class="nav-login">
                ورود
            </a>
        `;
    }
}


/* =========================================================
   LOGOUT
   ========================================================= */

function logout() {

    removeToken();

    window.location.href = "index.html";
}


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   COPY SERVER IP
   ========================================================= */

async function copyServerIP() {

    try {

        await navigator.clipboard.writeText(SERVER_IP);

        const message = document.getElementById("copyMessage");

        if (message) {

            message.classList.add("show");

            setTimeout(() => {
                message.classList.remove("show");
            }, 2500);
        }

    } catch (error) {

        console.error("Copy error:", error);

        /*
         * Fallback
         */

        const textarea = document.createElement("textarea");

        textarea.value = SERVER_IP;

        document.body.appendChild(textarea);

        textarea.select();

        document.execCommand("copy");

        textarea.remove();

        const message = document.getElementById("copyMessage");

        if (message) {

            message.classList.add("show");

            setTimeout(() => {
                message.classList.remove("show");
            }, 2500);
        }
    }
}


/* =========================================================
   SERVER STATUS
   ========================================================= */

async function checkServerStatus() {

    const statusText = document.getElementById("serverStatus");
    const statusDot = document.getElementById("statusDot");
    const playerCount = document.getElementById("playerCount");

    if (!statusText || !statusDot || !playerCount) {
        return;
    }


    try {

        const response = await fetch(
            `https://api.mcsrvstat.us/3/${SERVER_IP}`
        );

        const data = await response.json();


        if (data.online) {

            statusText.textContent = "سرور آنلاین است";

            statusDot.classList.add("online");

            statusDot.classList.remove("offline");


            const onlinePlayers =
                data.players?.online ?? 0;

            const maxPlayers =
                data.players?.max ?? 0;


            playerCount.textContent =
                `${onlinePlayers} / ${maxPlayers} بازیکن`;


        } else {

            statusText.textContent =
                "سرور آفلاین است";

            statusDot.classList.add("offline");

            statusDot.classList.remove("online");

            playerCount.textContent =
                "0 بازیکن";
        }


    } catch (error) {

        console.error(
            "Server status error:",
            error
        );

        statusText.textContent =
            "خطا در بررسی سرور";

        statusDot.classList.add("offline");

        statusDot.classList.remove("online");

        playerCount.textContent =
            "نامشخص";
    }
}


/* =========================================================
   LOAD SHOP
   ========================================================= */

async function loadShop() {

    try {

        const response = await fetch(
            `${API}/shop`
        );

        const data = await response.json();


        if (!data.success || !data.shop) {
            return;
        }


        /*
         * Update every product price
         */

        Object.entries(data.shop).forEach(
            ([item, product]) => {

                updateShopPrice(
                    item,
                    product.price
                );

            }
        );


    } catch (error) {

        console.error(
            "Shop loading error:",
            error
        );
    }
}


/* =========================================================
   UPDATE SHOP PRICE
   ========================================================= */

function updateShopPrice(item, price) {

    /*
     * Supports:
     *
     * data-shop-item="nova"
     *
     * OR
     *
     * id="price-nova"
     */

    const selectors = [

        `[data-shop-item="${item}"]`,

        `#price-${item}`,

        `#price-${String(item).toLowerCase()}`

    ];


    selectors.forEach(selector => {

        const elements =
            document.querySelectorAll(selector);


        elements.forEach(element => {

            element.textContent =
                `${Number(price).toLocaleString("en-US")} Coin`;

        });

    });
}


/* =========================================================
   BUY PRODUCT
   ========================================================= */

async function buyProduct(type, item) {

    const token = getToken();


    /* -------------------------
       NOT LOGGED IN
       ------------------------- */

    if (!token) {

        window.location.href =
            "login.html";

        return;
    }


    /* -------------------------
       NORMALIZE
       ------------------------- */

    const normalizedType =
        String(type).toLowerCase();

    const normalizedItem =
        String(item).toLowerCase();


    try {

        /*
         * First check account
         */

        const meResponse =
            await apiFetch("/me");

        const meData =
            await meResponse.json();


        if (
            !meResponse.ok ||
            !meData.success ||
            !meData.user
        ) {

            removeToken();

            window.location.href =
                "login.html";

            return;
        }


        const username =
            meData.user.username;


        /*
         * Confirmation
         */

        const productName =
            String(item).toUpperCase();


        const confirmed = confirm(
            `آیا مطمئنی می‌خواهی ${productName} را خریداری کنی؟`
        );


        if (!confirmed) {
            return;
        }


        /*
         * Send purchase request
         */

        const response =
            await apiFetch("/buy", {

                method: "POST",

                body: JSON.stringify({

                    type: normalizedType,

                    item: normalizedItem

                })

            });


        const data =
            await response.json();


        /* -------------------------
           SUCCESS
           ------------------------- */

        if (
            response.ok &&
            data.success
        ) {

            alert(
                `✅ خرید با موفقیت ثبت شد!\n\n` +
                `👤 حساب: ${username}\n` +
                `📦 محصول: ${productName}\n\n` +
                `پس از پردازش، محصول به Minecraft شما ارسال می‌شود.`
            );


            /*
             * Optional panel redirect
             */

            setTimeout(() => {

                window.location.href =
                    "panel.html";

            }, 500);

            return;
        }


        /* -------------------------
           ERROR
           ------------------------- */

        alert(
            `❌ ${data.error || "خرید انجام نشد."}`
        );


    } catch (error) {

        console.error(
            "Purchase error:",
            error
        );

        alert(
            "❌ خطا در ارتباط با سرور."
        );
    }
}


/* =========================================================
   SMOOTH NAVIGATION
   ========================================================= */

function setupSmoothNavigation() {

    const links =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    links.forEach(link => {

        link.addEventListener(
            "click",
            function(event) {

                const targetId =
                    this.getAttribute("href");


                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }


                const target =
                    document.querySelector(
                        targetId
                    );


                if (!target) {
                    return;
                }


                event.preventDefault();


                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );

    });
}


/* =========================================================
   REVEAL ANIMATION
   ========================================================= */

function setupRevealAnimation() {

    const elements =
        document.querySelectorAll(
            ".shop-card, .feature, .rules-box, .telegram-section, .section-title"
        );


    if (!elements.length) {
        return;
    }


    /*
     * If IntersectionObserver exists
     */

    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(

                entries => {

                    entries.forEach(entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );

                            observer.unobserve(
                                entry.target
                            );
                        }

                    });

                },

                {
                    threshold: 0.12
                }

            );


        elements.forEach(element => {

            element.classList.add(
                "reveal"
            );

            observer.observe(
                element
            );

        });

        return;
    }


    /*
     * Fallback
     */

    elements.forEach(element => {

        element.classList.add(
            "visible"
        );

    });
}


/* =========================================================
   TELEGRAM
   ========================================================= */

function setupTelegram() {

    const telegramLinks =
        document.querySelectorAll(
            'a[href*="t.me/muffinsmp"]'
        );


    telegramLinks.forEach(link => {

        link.addEventListener(
            "click",
            () => {

                console.log(
                    "MuffinSMP Telegram opened"
                );

            }
        );

    });
}


/* =========================================================
   PREVENT DOUBLE BUY CLICK
   ========================================================= */

function setupBuyButtons() {

    const buttons =
        document.querySelectorAll(
            ".buy-btn"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            function() {

                if (
                    this.dataset.loading === "true"
                ) {
                    return;
                }

                this.dataset.loading =
                    "true";


                const originalText =
                    this.innerHTML;


                setTimeout(() => {

                    this.dataset.loading =
                        "false";

                    this.innerHTML =
                        originalText;

                }, 1500);

            }
        );

    });
}


/* =========================================================
   PAGE START
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        /*
         * Navbar
         */

        await updateNavbar();


        /*
         * Server status
         */

        checkServerStatus();


        /*
         * Refresh server status
         * every 30 seconds
         */

        setInterval(
            checkServerStatus,
            30000
        );


        /*
         * Shop prices
         */

        loadShop();


        /*
         * UI
         */

        setupSmoothNavigation();

        setupRevealAnimation();

        setupTelegram();

        setupBuyButtons();

    }
);
