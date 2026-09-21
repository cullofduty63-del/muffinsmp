/* =====================================================
   MUFFINSMP WEBSITE
   ===================================================== */


/* ================= SERVER SETTINGS ================= */

const SERVER_IP = "play.muffinsmp.ir";
const TELEGRAM_USERNAME = "@muffinsmp";
const TELEGRAM_URL = "https://t.me/muffinsmp";


/* ================= IP COPY ================= */

async function copyIP() {

    const ipElement = document.getElementById("serverIP");

    if (!ipElement) return;

    const ip = ipElement.innerText.trim();

    try {

        await navigator.clipboard.writeText(ip);

        const message = document.getElementById("copyMessage");

        if (message) {

            message.classList.add("show");

            setTimeout(() => {
                message.classList.remove("show");
            }, 2000);

        }

        showToast("✅ IP سرور کپی شد!");

    } catch (error) {

        console.error("Copy IP Error:", error);

        showToast("❌ کپی کردن IP انجام نشد.");

    }

}


/* ================= TOAST ================= */

function showToast(message) {

    const toast = document.getElementById("toast");

    if (!toast) return;

    toast.innerText = message;

    toast.classList.add("show");

    clearTimeout(window.toastTimeout);

    window.toastTimeout = setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}


/* ================= SERVER STATUS ================= */

async function updateServerStatus() {

    const status = document.getElementById("serverStatus");
    const players = document.getElementById("playerCount");
    const dot = document.getElementById("statusDot");
    const refresh = document.getElementById("statusRefresh");


    if (!status || !players || !dot) return;


    /* ================= CHECKING ================= */

    status.innerText = "🟡 در حال بررسی سرور...";
    players.innerText = "در حال دریافت اطلاعات...";
    
    dot.className = "status-dot checking";

    if (refresh) {
        refresh.style.opacity = "1";
    }


    try {

        const controller = new AbortController();

        const timeout = setTimeout(() => {
            controller.abort();
        }, 8000);


        const response = await fetch(
            `https://api.mcsrvstat.us/3/${SERVER_IP}`,
            {
                method: "GET",
                cache: "no-store",
                signal: controller.signal
            }
        );


        clearTimeout(timeout);


        if (!response.ok) {

            throw new Error(
                `API Error: ${response.status}`
            );

        }


        const data = await response.json();


        /* ================= ONLINE ================= */

        if (data.online === true) {

            const online =
                Number.isFinite(data.players?.online)
                    ? data.players.online
                    : 0;


            const max =
                Number.isFinite(data.players?.max)
                    ? data.players.max
                    : "؟";


            status.innerText =
                "🟢 سرور آنلاین است";


            players.innerText =
                `${online} / ${max} بازیکن آنلاین`;


            dot.className =
                "status-dot online";


        }


        /* ================= OFFLINE ================= */

        else {

            status.innerText =
                "🔴 سرور آفلاین است";


            players.innerText =
                "سرور در حال حاضر آفلاین است";


            dot.className =
                "status-dot offline";

        }


    }

    catch (error) {

        console.error(
            "MuffinSMP Server Status Error:",
            error
        );


        status.innerText =
            "⚠️ وضعیت سرور نامشخص است";


        players.innerText =
            "امکان دریافت وضعیت سرور وجود ندارد";


        /*
         * وضعیت نامشخص را Offline واقعی نشان نمی‌دهیم.
         * چون ممکن است API موقتاً جواب نداده باشد.
         */

        dot.className =
            "status-dot checking";

    }


    if (refresh) {

        refresh.style.opacity = ".35";

    }

}


/* ================= INITIAL SERVER CHECK ================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateServerStatus();

    }
);


/* ================= AUTO UPDATE ================= */

setInterval(
    updateServerStatus,
    30000
);


/* ================= TELEGRAM PURCHASE ================= */

function purchaseMessage(type, name) {

    showToast(
        `🛒 برای خرید ${type} ${name} به تلگرام ما پیام دهید: ${TELEGRAM_USERNAME}`
    );


    /*
     * بعد از نمایش پیام، Telegram باز می‌شود.
     */

    setTimeout(() => {

        window.open(
            TELEGRAM_URL,
            "_blank",
            "noopener,noreferrer"
        );

    }, 900);

}


/* ================= BUY RANK ================= */

function buyRank(rank) {

    purchaseMessage(
        "رنک",
        rank
    );

}


/* ================= BUY KEY ================= */

function buyKey(key) {

    purchaseMessage(
        "کلید",
        `${key} Key`
    );

}


/* ================= NAVBAR ================= */

window.addEventListener(
    "scroll",
    () => {

        const navbar =
            document.querySelector(".navbar");


        if (!navbar) return;


        if (window.scrollY > 30) {

            navbar.classList.add("scrolled");

        }

        else {

            navbar.classList.remove("scrolled");

        }

    },
    {
        passive: true
    }
);


/* ================= SCROLL ANIMATION ================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const elements =
            document.querySelectorAll(".reveal");


        if (!elements.length) return;


        const observer =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach(
                        (entry) => {

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

                        }
                    );

                },
                {
                    threshold: 0.12
                }
            );


        elements.forEach(
            (element, index) => {

                element.style.transitionDelay =
                    `${Math.min(index * 45, 300)}ms`;


                observer.observe(
                    element
                );

            }
        );

    }
);


/* ================= SMOOTH TELEGRAM BUTTON ================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const telegramLinks =
            document.querySelectorAll(
                'a[href*="t.me/muffinsmp"]'
            );


        telegramLinks.forEach(
            (link) => {

                link.addEventListener(
                    "click",
                    () => {

                        showToast(
                            "✈️ در حال انتقال به Telegram..."
                        );

                    }
                );

            }
        );

    }
);


/* ================= CONSOLE BRANDING ================= */

console.log(
    "%c🍩 MuffinSMP",
    "font-size:24px;font-weight:bold;color:#c44cff;"
);

console.log(
    "%cServer: " + SERVER_IP,
    "font-size:14px;color:#aaa;"
);

console.log(
    "%cTelegram: " + TELEGRAM_USERNAME,
    "font-size:14px;color:#2AABEE;"
);
