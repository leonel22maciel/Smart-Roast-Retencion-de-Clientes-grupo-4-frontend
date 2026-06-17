const btnArriba = document.getElementById("btn-arriba");

window.addEventListener("scroll", () => {
    if (window.scrollY > 250) {
        btnArriba.classList.add("mostrar");
    } else {
        btnArriba.classList.remove("mostrar");
    }
});

btnArriba.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});