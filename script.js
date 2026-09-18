/* =====================================================
   MUFFINSMP WEBSITE
   ===================================================== */


/* ================= SERVER SETTINGS ================= */

const SERVER_IP = "play.muffinsmp.ir";

const TELEGRAM_USERNAME = "@muffinsmp";


/* ================= IP COPY ================= */

function copyIP() {

    const ip =
        document.getElementById("serverIP").innerText;

    navigator.clipboard.writeText(ip)
        .then(() => {

            const message =
                document.getElementById("copyMessage");

            message.classList.add("show");

            setTimeout(() => {

                message.classList.remove("show");

            }, 2000);

        })
        .catch(() => {

            showToast("کپی کردن IP انجام نشد.");

        });

}


/* ================= TOAST ================= */

function showToast(message) {

    const toast =
        document.getElementById("toast");

    toast.innerText = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}


/* ================= SERVER STATUS ================= */

async function updateServerStatus() {

    const status =
        document.getElementById("serverStatus");

    const players =
        document.getElementById("playerCount");

    const dot =
        document.getElementById("statusDot");


    try {

        const response = await fetch(
            `https://api.mcsrvstat.us/3/${SERVER_IP}`,
            {
                cache: "no-store"
            }
        );


        if (!response.ok) {

            throw new Error(
                "Server status API error"
            );

        }


        const data =
            await response.json();


        /* ================= ONLINE ================= */

        if (data.online) {

            const online =
                data.players?.online ?? 0;

            const max =
                data.players?.max ?? 0;


            status.innerText =
                "🟢 سرور آنلاین است";


            players.innerText =
                `${online} / ${max} Players Online`;


            dot.style.background =
                "#2ecc71";


            dot.style.boxShadow =
                "0 0 15px rgba(46,204,113,.8)";

        }


        /* ================= OFFLINE ================= */

        else {

            status.innerText =
                "🔴 سرور آفلاین است";


            players.innerText =
                "Server Offline";


            dot.style.background =
                "#e74c3c";


            dot.style.boxShadow =
                "0 0 15px rgba(231,76,60,.8)";

        }


    }

    catch (error) {

        console.error(
            "Server Status Error:",
            error
        );


        status.innerText =
            "⚠️ وضعیت نامشخص";


        players.innerText =
            "Unable to check server";


        dot.style.background =
            "#f1c40f";


        dot.style.boxShadow =
            "0 0 15px rgba(241,196,15,.7)";

    }

}


/* ================= INITIAL SERVER CHECK ================= */

updateServerStatus();


/* ================= AUTO UPDATE ================= */

setInterval(
    updateServerStatus,
    30000
);


/* ================= TELEGRAM PURCHASE MESSAGE ================= */

function purchaseMessage(type, name) {

    showToast(
        `برای خرید ${type} ${name} به تلگرام ما پیام دهید: ${TELEGRAM_USERNAME}`
    );

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


        if (window.scrollY > 30) {

            navbar.style.background =
                "rgba(5, 4, 8, .94)";

        }

        else {

            navbar.style.background =
                "rgba(7, 5, 11, .78)";

        }

    }
);
