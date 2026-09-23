```js
/* =========================================
   MUFFIN SMP - MAIN SCRIPT
   ========================================= */

const SERVER_IP = "play.muffinsmp.ir";
const API = "https://cullofduty63.cullofduty63.workers.dev/api";


/* =========================================
   COPY SERVER IP
   ========================================= */

function copyServerIP() {

    const message =
        document.getElementById("copyMessage");

    navigator.clipboard.writeText(SERVER_IP)
        .then(() => {

            if (!message) return;

            message.classList.add("show");

            setTimeout(() => {
                message.classList.remove("show");
            }, 2000);

        })
        .catch(() => {

            const input =
                document.createElement("input");

            input.value = SERVER_IP;

            document.body.appendChild(input);

            input.select();

            document.execCommand("copy");

            input.remove();

            if (message) {

                message.classList.add("show");

                setTimeout(() => {
                    message.classList.remove("show");
                }, 2000);

            }

        });

}


/* =========================================
   SERVER STATUS
   ========================================= */

async function updateServerStatus() {

    const status =
        document.getElementById("serverStatus");

    const players =
        document.getElementById("playerCount");

    const dot =
        document.getElementById("statusDot");


    if (!status || !players || !dot) {
        return;
    }


    status.textContent =
        "در حال بررسی...";

    players.textContent =
        "Checking...";

    dot.style.background =
        "#f1c40f";

    dot.style.boxShadow =
        "0 0 15px rgba(241,196,60,.7)";


    const controller =
        new AbortController();

    const timeout =
        setTimeout(
            () => controller.abort(),
            8000
        );


    try {

        const response =
            await fetch(
                `https://api.mcsrvstat.us/3/${SERVER_IP}`,
                {
                    cache: "no-store",
                    signal: controller.signal
                }
            );


        clearTimeout(timeout);


        if (!response.ok) {
            throw new Error(
                "Status API error"
            );
        }


        const data =
            await response.json();


        if (data.online) {

            const online =
                data.players?.online ?? 0;

            const max =
                data.players?.max ?? 0;


            status.textContent =
                "🟢 سرور آنلاین است";


            players.textContent =
                `${online} / ${max} Players Online`;


            dot.style.background =
                "#2ecc71";


            dot.style.boxShadow =
                "0 0 15px rgba(46,204,113,.8)";

        } else {

            status.textContent =
                "🔴 سرور آفلاین است";


            players.textContent =
                "Server Offline";


            dot.style.background =
                "#e74c3c";


            dot.style.boxShadow =
                "0 0 15px rgba(231,76,60,.8)";

        }

    } catch (error) {

        clearTimeout(timeout);


        console.error(
            "MuffinSMP Server Status:",
            error
        );


        status.textContent =
            "⚠️ وضعیت سرور نامشخص";


        players.textContent =
            "Unable to check server";


        dot.style.background =
            "#f1c40f";


        dot.style.boxShadow =
            "0 0 15px rgba(241,196,60,.7)";

    }

}


/* =========================================
   LOAD SHOP FROM CLOUDFLARE API
   ========================================= */

async function loadShop() {

    try {

        const response =
            await fetch(
                `${API}/shop`,
                {
                    method: "GET",
                    cache: "no-store"
                }
            );


        const data =
            await response.json();


        console.log(
            "MuffinSMP Shop API:",
            data
        );


        if (!response.ok || !data.success) {

            throw new Error(
                data.error ||
                "Shop API error"
            );

        }


        const shop =
            data.shop;


        if (!shop) {

            throw new Error(
                "Shop data not found"
            );

        }


        /*
         * =====================================
         * RANKS
         * =====================================
         */

        updateShopPrice(
            "nova",
            shop.nova?.price
        );

        updateShopPrice(
            "vanta",
            shop.vanta?.price
        );

        updateShopPrice(
            "apex",
            shop.apex?.price
        );

        updateShopPrice(
            "sponsor",
            shop.sponsor?.price
        );


        /*
         * =====================================
         * KEYS
         * =====================================
         */

        updateShopPrice(
            "prime",
            shop.prime?.price
        );

        updateShopPrice(
            "gold",
            shop.gold?.price
        );

        updateShopPrice(
            "crimson",
            shop.crimson?.price
        );

        updateShopPrice(
            "amethyst",
            shop.amethyst?.price
        );


        console.log(
            "MuffinSMP Shop Loaded"
        );

    } catch (error) {

        console.error(
            "MuffinSMP Shop Error:",
            error
        );

    }

}


/* =========================================
   UPDATE SHOP PRICE
   ========================================= */

function updateShopPrice(
    item,
    price
) {

    if (
        price === undefined ||
        price === null
    ) {
        return;
    }


    /*
     * چند روش مختلف برای پیدا کردن
     * قیمت در HTML
     */

    const elements =
        document.querySelectorAll(
            `[data-shop-item="${item}"]`
        );


    elements.forEach(element => {

        element.textContent =
            Number(price).toLocaleString(
                "en-US"
            ) + " Coin";

    });


    /*
     * اگر HTML با ID ساخته شده باشد
     */

    const idElement =
        document.getElementById(
            `price-${item}`
        );


    if (idElement) {

        idElement.textContent =
            Number(price).toLocaleString(
                "en-US"
            ) + " Coin";

    }

}


/* =========================================
   BUY PRODUCT
   ========================================= */

function buyProduct(
    type,
    item
) {

    const token =
        localStorage.getItem(
            "muffin_token"
        );


    /*
     * اگر لاگین نشده باشد
     */

    if (!token) {

        window.location.href =
            "login.html";

        return;

    }


    /*
     * اگر لاگین باشد
     */

    window.location.href =
        "panel.html?shop=" +
        encodeURIComponent(type) +
        "&item=" +
        encodeURIComponent(item);

}


/* =========================================
   NAVBAR SCROLL
   ========================================= */

window.addEventListener(
    "scroll",
    () => {

        const navbar =
            document.querySelector(
                ".navbar"
            );


        if (!navbar) {
            return;
        }


        if (window.scrollY > 30) {

            navbar.style.background =
                "rgba(7,5,11,.96)";

            navbar.style.boxShadow =
                "0 10px 40px rgba(0,0,0,.25)";

        } else {

            navbar.style.background =
                "rgba(7,5,11,.82)";

            navbar.style.boxShadow =
                "none";

        }

    }
);


/* =========================================
   REVEAL ANIMATION
   ========================================= */

const revealElements =
    document.querySelectorAll(
        ".shop-card, .feature, .rules-box, .telegram-section"
    );


if (
    "IntersectionObserver" in window
) {

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.style.opacity =
                                "1";

                            entry.target.style.transform =
                                "translateY(0)";

                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.08
            }
        );


    revealElements.forEach(
        element => {

            element.style.opacity =
                "0";

            element.style.transform =
                "translateY(25px)";

            element.style.transition =
                "opacity .6s ease, transform .6s ease";

            observer.observe(
                element
            );

        }
    );

}


/* =========================================
   TELEGRAM
   ========================================= */

document.addEventListener(
    "click",
    event => {

        const telegram =
            event.target.closest(
                'a[href*="t.me/muffinsmp"]'
            );


        if (!telegram) {
            return;
        }


        console.log(
            "MuffinSMP Telegram opened"
        );

    }
);


/* =========================================
   START
   ========================================= */

updateServerStatus();

loadShop();


setInterval(
    updateServerStatus,
    30000
);
```
