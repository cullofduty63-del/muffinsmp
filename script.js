const SERVER_IP = "play.muffinsmp.ir";
const TELEGRAM_URL = "https://t.me/muffinsmp";

function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}

async function copyIP() {
    try {
        await navigator.clipboard.writeText(SERVER_IP);
        const msg = document.getElementById("copyMessage");
        if (msg) {
            msg.classList.add("show");
            setTimeout(() => msg.classList.remove("show"), 1800);
        }
        showToast("IP سرور کپی شد!");
    } catch {
        showToast("کپی خودکار انجام نشد؛ IP را دستی کپی کن.");
    }
}

function purchaseMessage(type, name) {
    showToast(`برای خرید ${type} ${name} به تلگرام ما پیام بدهید: @muffinsmp`);
    setTimeout(() => {
        window.open(TELEGRAM_URL, "_blank", "noopener");
    }, 700);
}

function buyRank(rank) {
    purchaseMessage("رنک", rank);
}

function buyKey(key) {
    purchaseMessage("Key", key);
}

function setStatus(state, statusText, countText) {
    const dot = document.getElementById("statusDot");
    const status = document.getElementById("serverStatus");
    const count = document.getElementById("playerCount");
    if (!dot || !status || !count) return;

    dot.className = `status-dot ${state}`;
    status.textContent = statusText;
    count.textContent = countText;
}

async function updateServerStatus() {
    const refresh = document.getElementById("statusRefresh");
    if (refresh) refresh.style.opacity = "1";

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 7000);

        const response = await fetch(
            `https://api.mcsrvstat.us/3/${encodeURIComponent(SERVER_IP)}`,
            { cache: "no-store", signal: controller.signal }
        );

        clearTimeout(timeout);

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();

        if (data.online === true) {
            const online = Number.isFinite(data.players?.online) ? data.players.online : 0;
            const max = Number.isFinite(data.players?.max) ? data.players.max : "؟";
            setStatus("online", "سرور آنلاین است", `${online} / ${max} بازیکن آنلاین`);
        } else {
            setStatus("offline", "سرور آفلاین است", "در حال حاضر بازیکنی آنلاین نیست");
        }
    } catch (error) {
        console.error("Server status error:", error);
        setStatus("offline", "وضعیت سرور قابل دریافت نیست", "چند لحظه بعد دوباره تلاش می‌کنیم");
    } finally {
        if (refresh) {
            refresh.style.opacity = ".35";
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    updateServerStatus();
    setInterval(updateServerStatus, 30000);

    const navbar = document.getElementById("navbar");
    window.addEventListener("scroll", () => {
        navbar?.classList.toggle("scrolled", window.scrollY > 30);
    }, { passive: true });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll(".reveal").forEach((el, i) => {
        el.style.transitionDelay = `${Math.min(i * 45, 300)}ms`;
        observer.observe(el);
    });

    const particles = document.querySelector(".particles");
    if (particles && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        for (let i = 0; i < 26; i++) {
            const p = document.createElement("span");
            p.style.cssText = `
                position:fixed;width:${2 + Math.random() * 3}px;height:${2 + Math.random() * 3}px;
                border-radius:50%;background:rgba(196,76,255,${.15 + Math.random() * .35});
                left:${Math.random() * 100}vw;top:${Math.random() * 100}vh;
                pointer-events:none;z-index:-1;filter:blur(.2px);
                animation:particleFloat ${7 + Math.random() * 10}s linear infinite;
                animation-delay:${-Math.random() * 10}s;
            `;
            particles.appendChild(p);
        }

        const style = document.createElement("style");
        style.textContent = `@keyframes particleFloat{50%{transform:translate(${Math.random()*80-40}px,-${30+Math.random()*80}px);opacity:.8}100%{transform:translate(0,0);opacity:.25}}`;
        document.head.appendChild(style);
    }
});
