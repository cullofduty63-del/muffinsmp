/* =========================================================
   MUFFINSMP WEBSITE + USER PANEL
   ========================================================= */

/* =========================================================
   CONFIG
   ========================================================= */

const SERVER_IP = "play.muffinsmp.ir";

const TELEGRAM_USERNAME = "@muffinsmp";
const TELEGRAM_URL = "https://t.me/muffinsmp";

/*
 * Backend API
 *
 * Production:
 * https://api.muffinsmp.ir/api
 *
 * Local testing:
 * http://localhost:3000/api
 */
const API_BASE_URL = "https://api.muffinsmp.ir/api";

const TOKEN_KEY = "muffin_token";


/* =========================================================
   SMALL HELPERS
   ========================================================= */

function $(id) {
    return document.getElementById(id);
}

function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

function isLoggedIn() {
    return !!getToken();
}

function formatNumber(number) {
    return Number(number || 0).toLocaleString("en-US");
}


/* =========================================================
   TOAST
   ========================================================= */

let toastTimer = null;

function showToast(message) {

    const toast = $("toast");

    if (!toast) {
        return;
    }

    toast.innerText = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}


/* =========================================================
   COPY SERVER IP
   ========================================================= */

async function copyIP() {

    const ipElement = $("serverIP");

    if (!ipElement) {
        return;
    }

    const ip = ipElement.innerText.trim();

    try {

        if (navigator.clipboard && window.isSecureContext) {

            await navigator.clipboard.writeText(ip);

        } else {

            const textarea = document.createElement("textarea");

            textarea.value = ip;
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";

            document.body.appendChild(textarea);

            textarea.focus();
            textarea.select();

            document.execCommand("copy");

            textarea.remove();
        }

        const message = $("copyMessage");

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


/* =========================================================
   SERVER STATUS
   ========================================================= */

let statusController = null;

async function updateServerStatus() {

    const status = $("serverStatus");
    const players = $("playerCount");
    const dot = $("statusDot");
    const refresh = $("statusRefresh");

    if (!status || !players || !dot) {
        return;
    }

    /*
     * Cancel previous request
     */

    if (statusController) {
        statusController.abort();
    }

    statusController = new AbortController();

    const timeout = setTimeout(() => {
        statusController.abort();
    }, 8000);

    status.innerText = "در حال بررسی سرور...";
    players.innerText = "در حال دریافت تعداد بازیکنان...";

    dot.classList.add("checking");

    try {

        const response = await fetch(
            `https://api.mcsrvstat.us/3/${SERVER_IP}`,
            {
                method: "GET",
                cache: "no-store",
                signal: statusController.signal
            }
        );

        clearTimeout(timeout);

        if (!response.ok) {
            throw new Error("Server status API error");
        }

        const data = await response.json();

        dot.classList.remove("checking");

        if (data.online) {

            const online = data.players?.online ?? 0;
            const max = data.players?.max ?? 0;

            status.innerText = "🟢 سرور آنلاین است";

            players.innerText =
                `${formatNumber(online)} / ${formatNumber(max)} Players Online`;

            dot.style.background = "#2ecc71";
            dot.style.boxShadow =
                "0 0 15px rgba(46,204,113,.8)";

            if (refresh) {
                refresh.innerText = "●";
                refresh.style.color = "#2ecc71";
            }

        } else {

            status.innerText = "🔴 سرور آفلاین است";

            players.innerText = "Server Offline";

            dot.style.background = "#e74c3c";
            dot.style.boxShadow =
                "0 0 15px rgba(231,76,60,.8)";

            if (refresh) {
                refresh.innerText = "●";
                refresh.style.color = "#e74c3c";
            }

        }

    } catch (error) {

        clearTimeout(timeout);

        if (error.name === "AbortError") {

            status.innerText = "⚠️ زمان بررسی تمام شد";
            players.innerText = "Unable to check server";

        } else {

            console.error("Server Status Error:", error);

            status.innerText = "⚠️ وضعیت سرور نامشخص است";
            players.innerText = "Unable to check server";

        }

        dot.classList.remove("checking");

        dot.style.background = "#f1c40f";
        dot.style.boxShadow =
            "0 0 15px rgba(241,196,60,.7)";

        if (refresh) {
            refresh.innerText = "●";
            refresh.style.color = "#f1c40f";
        }
    }
}


/* =========================================================
   AUTH MODAL
   ========================================================= */

function openAuthModal() {

    /*
     * If user is already logged in,
     * go directly to panel.
     */

    if (isLoggedIn()) {

        window.location.href = "panel.html";

        return;
    }

    const modal = $("authModal");

    if (!modal) {
        return;
    }

    modal.classList.add("show");

    document.body.classList.add("modal-open");

    switchAuthTab("login");
}


function closeAuthModal() {

    const modal = $("authModal");

    if (!modal) {
        return;
    }

    modal.classList.remove("show");

    document.body.classList.remove("modal-open");

    clearAuthMessage();
}


function clearAuthMessage() {

    const message = $("authMessage");

    if (message) {
        message.innerText = "";
        message.className = "auth-message";
    }
}


function showAuthMessage(message, type = "error") {

    const element = $("authMessage");

    if (!element) {
        return;
    }

    element.innerText = message;

    element.className = "auth-message";

    element.classList.add(type);
}


function switchAuthTab(type) {

    const loginForm = $("loginForm");
    const registerForm = $("registerForm");

    const loginTab = $("loginTab");
    const registerTab = $("registerTab");

    if (!loginForm || !registerForm) {
        return;
    }

    clearAuthMessage();

    if (type === "register") {

        loginForm.classList.add("hidden");
        registerForm.classList.remove("hidden");

        if (loginTab) {
            loginTab.classList.remove("active");
        }

        if (registerTab) {
            registerTab.classList.add("active");
        }

    } else {

        registerForm.classList.add("hidden");
        loginForm.classList.remove("hidden");

        if (registerTab) {
            registerTab.classList.remove("active");
        }

        if (loginTab) {
            loginTab.classList.add("active");
        }
    }
}


/* =========================================================
   LOGIN
   ========================================================= */

async function loginUser(email, password) {

    const response = await fetch(
        `${API_BASE_URL}/auth/login`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })
        }
    );

    let data;

    try {
        data = await response.json();
    } catch {
        data = {};
    }

    if (!response.ok) {

        throw new Error(
            data.error || "ورود انجام نشد."
        );
    }

    if (!data.token) {
        throw new Error("توکن ورود از سرور دریافت نشد.");
    }

    localStorage.setItem(
        TOKEN_KEY,
        data.token
    );

    return data;
}


/* =========================================================
   REGISTER
   ========================================================= */

async function registerUser(
    username,
    email,
    password
) {

    const response = await fetch(
        `${API_BASE_URL}/auth/register`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                username,
                email,
                password
            })
        }
    );

    let data;

    try {
        data = await response.json();
    } catch {
        data = {};
    }

    if (!response.ok) {

        throw new Error(
            data.error || "ثبت‌نام انجام نشد."
        );
    }

    if (!data.token) {
        throw new Error("توکن ثبت‌نام از سرور دریافت نشد.");
    }

    localStorage.setItem(
        TOKEN_KEY,
        data.token
    );

    return data;
}


/* =========================================================
   GET CURRENT USER
   ========================================================= */

async function getCurrentUser() {

    const token = getToken();

    if (!token) {
        return null;
    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/me`,
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`
                },

                cache: "no-store"
            }
        );

        if (!response.ok) {

            if (
                response.status === 401 ||
                response.status === 403
            ) {

                localStorage.removeItem(TOKEN_KEY);

            }

            return null;
        }

        const data = await response.json();

        return data.user || null;

    } catch (error) {

        console.error(
            "Get Current User Error:",
            error
        );

        return null;
    }
}


/* =========================================================
   UPDATE NAVBAR ACCOUNT
   ========================================================= */

function updateNavbarUser(user) {

    const loginButton = $("loginButton");
    const accountMini = $("accountMini");

    const username = $("navUsername");
    const coins = $("navCoins");
    const shards = $("navShards");

    if (!user) {

        if (loginButton) {
            loginButton.classList.remove("hidden");
        }

        if (accountMini) {
            accountMini.classList.add("hidden");
        }

        return;
    }

    if (loginButton) {
        loginButton.classList.add("hidden");
    }

    if (accountMini) {
        accountMini.classList.remove("hidden");
    }

    if (username) {
        username.innerText =
            user.username || "کاربر";
    }

    if (coins) {
        coins.innerText =
            formatNumber(user.coins);
    }

    if (shards) {
        shards.innerText =
            formatNumber(user.shards);
    }
}


/* =========================================================
   LOAD USER
   ========================================================= */

async function loadUser() {

    const user = await getCurrentUser();

    updateNavbarUser(user);

    return user;
}


/* =========================================================
   ACCOUNT DROPDOWN
   ========================================================= */

function toggleAccountMenu() {

    const dropdown = $("accountDropdown");

    if (!dropdown) {
        return;
    }

    dropdown.classList.toggle("show");
}


document.addEventListener("click", function(event) {

    const accountMini = $("accountMini");
    const dropdown = $("accountDropdown");

    if (!accountMini || !dropdown) {
        return;
    }

    if (!accountMini.contains(event.target)) {

        dropdown.classList.remove("show");

    }

});


/* =========================================================
   LOGOUT
   ========================================================= */

function logoutUser() {

    localStorage.removeItem(TOKEN_KEY);

    const dropdown = $("accountDropdown");

    if (dropdown) {
        dropdown.classList.remove("show");
    }

    updateNavbarUser(null);

    showToast("✅ از حساب خارج شدی.");

    setTimeout(() => {

        if (
            window.location.pathname.includes("panel.html")
        ) {

            window.location.href = "index.html";

        }

    }, 700);
}


/* =========================================================
   LOGIN FORM EVENT
   ========================================================= */

const loginForm = $("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            const email =
                $("loginEmail")?.value.trim();

            const password =
                $("loginPassword")?.value || "";

            if (!email || !password) {

                showAuthMessage(
                    "ایمیل و رمز عبور را وارد کنید."
                );

                return;
            }

            const submitButton =
                loginForm.querySelector(
                    'button[type="submit"]'
                );

            const oldText =
                submitButton?.innerText || "";

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerText =
                    "⏳ در حال ورود...";
            }

            clearAuthMessage();

            try {

                await loginUser(
                    email,
                    password
                );

                showAuthMessage(
                    "✅ ورود موفق بود!",
                    "success"
                );

                await loadUser();

                setTimeout(() => {

                    closeAuthModal();

                    window.location.href =
                        "panel.html";

                }, 500);

            } catch (error) {

                console.error(
                    "Login Error:",
                    error
                );

                showAuthMessage(
                    error.message ||
                    "ورود انجام نشد."
                );

            } finally {

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.innerText =
                        oldText;
                }
            }
        }
    );
}


/* =========================================================
   REGISTER FORM EVENT
   ========================================================= */

const registerForm = $("registerForm");

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            const username =
                $("registerUsername")?.value.trim();

            const email =
                $("registerEmail")?.value.trim();

            const password =
                $("registerPassword")?.value || "";

            if (!username || !email || !password) {

                showAuthMessage(
                    "همه فیلدها را کامل کنید."
                );

                return;
            }

            if (username.length < 3) {

                showAuthMessage(
                    "نام کاربری باید حداقل ۳ کاراکتر باشد."
                );

                return;
            }

            if (password.length < 8) {

                showAuthMessage(
                    "رمز عبور باید حداقل ۸ کاراکتر باشد."
                );

                return;
            }

            const submitButton =
                registerForm.querySelector(
                    'button[type="submit"]'
                );

            const oldText =
                submitButton?.innerText || "";

            if (submitButton) {

                submitButton.disabled = true;

                submitButton.innerText =
                    "⏳ در حال ساخت اکانت...";
            }

            clearAuthMessage();

            try {

                await registerUser(
                    username,
                    email,
                    password
                );

                showAuthMessage(
                    "✅ اکانت با موفقیت ساخته شد!",
                    "success"
                );

                await loadUser();

                setTimeout(() => {

                    closeAuthModal();

                    window.location.href =
                        "panel.html";

                }, 600);

            } catch (error) {

                console.error(
                    "Register Error:",
                    error
                );

                showAuthMessage(
                    error.message ||
                    "ثبت‌نام انجام نشد."
                );

            } finally {

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.innerText =
                        oldText;
                }
            }
        }
    );
}


/* =========================================================
   BUY RANK
   ========================================================= */

async function buyRank(rank) {

    await purchaseProduct(
        "rank",
        rank
    );
}


/* =========================================================
   BUY KEY
   ========================================================= */

async function buyKey(key) {

    await purchaseProduct(
        "key",
        key
    );
}


/* =========================================================
   PURCHASE PRODUCT
   ========================================================= */

async function purchaseProduct(
    type,
    name
) {

    /*
     * Not logged in:
     * open login modal
     */

    if (!isLoggedIn()) {

        openAuthModal();

        showAuthMessage(
            "برای خرید ابتدا وارد حساب خودت شو."
        );

        return;
    }


    /*
     * Current backend requires Minecraft
     * to be linked before purchasing.
     */

    const token = getToken();

    if (!token) {

        openAuthModal();

        return;
    }


    showToast(
        "⏳ در حال بررسی خرید..."
    );


    try {

        const response = await fetch(
            `${API_BASE_URL}/purchase`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",

                    "Authorization":
                        `Bearer ${token}`
                },

                body: JSON.stringify({
                    type,
                    name
                })
            }
        );

        let data;

        try {
            data = await response.json();
        } catch {
            data = {};
        }


        /*
         * Backend not connected yet
         */

        if (
            response.status === 501 ||
            data.error === "DELIVERY_NOT_CONNECTED"
        ) {

            showToast(
                "⚠️ سیستم تحویل Minecraft هنوز متصل نشده."
            );

            return;
        }


        if (!response.ok) {

            throw new Error(
                data.error ||
                "خرید انجام نشد."
            );
        }


        showToast(
            `✅ ${name} با موفقیت خریداری شد!`
        );


        /*
         * Refresh account info
         */

        await loadUser();


    } catch (error) {

        console.error(
            "Purchase Error:",
            error
        );

        showToast(
            `❌ ${error.message || "خرید انجام نشد."}`
        );
    }
}


/* =========================================================
   TELEGRAM
   ========================================================= */

function openTelegram() {

    window.open(
        TELEGRAM_URL,
        "_blank",
        "noopener"
    );
}


/* =========================================================
   NAVBAR SCROLL
   ========================================================= */

function updateNavbarScroll() {

    const navbar = $("navbar");

    if (!navbar) {
        return;
    }

    if (window.scrollY > 30) {

        navbar.classList.add("scrolled");

    } else {

        navbar.classList.remove("scrolled");

    }
}


window.addEventListener(
    "scroll",
    updateNavbarScroll,
    {
        passive: true
    }
);


/* =========================================================
   REVEAL ON SCROLL
   ========================================================= */

function setupRevealAnimation() {

    const elements =
        document.querySelectorAll(
            ".reveal"
        );

    if (!elements.length) {
        return;
    }

    /*
     * Fallback for old browsers
     */

    if (!("IntersectionObserver" in window)) {

        elements.forEach(element => {

            element.classList.add(
                "visible"
            );

        });

        return;
    }


    const observer =
        new IntersectionObserver(
            (entries, obs) => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "visible"
                        );

                        obs.unobserve(
                            entry.target
                        );
                    }

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );


    elements.forEach(element => {

        observer.observe(element);

    });
}


/* =========================================================
   PARTICLES
   ========================================================= */

function createParticles() {

    const container =
        document.querySelector(
            ".particles"
        );

    if (!container) {
        return;
    }

    /*
     * Don't create too many particles
     */

    const count =
        window.innerWidth < 768
            ? 15
            : 28;

    container.innerHTML = "";

    for (
        let i = 0;
        i < count;
        i++
    ) {

        const particle =
            document.createElement("span");

        particle.className =
            "particle";

        particle.style.left =
            `${Math.random() * 100}%`;

        particle.style.top =
            `${Math.random() * 100}%`;

        particle.style.animationDelay =
            `${Math.random() * 6}s`;

        particle.style.animationDuration =
            `${5 + Math.random() * 7}s`;

        const size =
            2 + Math.random() * 4;

        particle.style.width =
            `${size}px`;

        particle.style.height =
            `${size}px`;

        container.appendChild(
            particle
        );
    }
}


/* =========================================================
   CLOSE MODAL WITH ESC
   ========================================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key !== "Escape") {
            return;
        }

        const modal = $("authModal");

        if (
            modal &&
            modal.classList.contains("show")
        ) {

            closeAuthModal();

        }

    }
);


/* =========================================================
   TELEGRAM LINK FEEDBACK
   ========================================================= */

document.querySelectorAll(
    'a[href*="t.me/muffinsmp"]'
).forEach(link => {

    link.addEventListener(
        "click",
        function() {

            showToast(
                "✈️ در حال باز کردن Telegram MuffinSMP..."
            );

        }
    );

});


/* =========================================================
   INITIALIZATION
   ========================================================= */

async function initializeMuffinSMP() {

    updateNavbarScroll();

    setupRevealAnimation();

    createParticles();

    updateServerStatus();

    /*
     * Check whether the user is logged in.
     */

    if (isLoggedIn()) {

        await loadUser();

    } else {

        updateNavbarUser(null);

    }
}


/* =========================================================
   START
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeMuffinSMP
);


/* =========================================================
   SERVER STATUS AUTO REFRESH
========================================================= */

setInterval(
    updateServerStatus,
    30000
);


/* =========================================================
   GLOBAL FUNCTIONS
   ========================================================= */

window.copyIP = copyIP;

window.openAuthModal =
    openAuthModal;

window.closeAuthModal =
    closeAuthModal;

window.switchAuthTab =
    switchAuthTab;

window.logoutUser =
    logoutUser;

window.toggleAccountMenu =
    toggleAccountMenu;

window.buyRank =
    buyRank;

window.buyKey =
    buyKey;

window.openTelegram =
    openTelegram;
