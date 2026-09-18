/* ================= IP COPY ================= */

function copyIP() {

    const ip = document.getElementById("serverIP").innerText;

    navigator.clipboard.writeText(ip).then(() => {

        const message =
            document.getElementById("copyMessage");

        message.classList.add("show");

        setTimeout(() => {
            message.classList.remove("show");
        }, 2000);

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

    }, 2500);

}


/* ================= BUY RANK ================= */

function buyRank(rank) {

    showToast(
        "برای خرید " +
        rank +
        " با مدیریت MuffinSMP در ارتباط باشید."
    );

}


/* ================= BUY KEY ================= */

function buyKey(key) {

    showToast(
        "برای خرید " +
        key +
        " Key با مدیریت MuffinSMP در ارتباط باشید."
    );

}


/* ================= NAVBAR SCROLL ================= */

window.addEventListener("scroll", () => {

    const navbar =
        document.querySelector(".navbar");

    if (window.scrollY > 30) {

        navbar.style.background =
            "rgba(5, 4, 8, .94)";

    } else {

        navbar.style.background =
            "rgba(7, 5, 11, .78)";

    }

});
