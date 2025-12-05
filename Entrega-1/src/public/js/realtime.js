const socket = io();
const form = document.getElementById("productForm");
const list = document.getElementById("productList");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const newProduct = {
        title: form.title.value,
        description: form.description.value,
        price: form.price.value,
        thumbnail: form.thumbnail.value,
        code: form.code.value,
        stock: form.stock.value
    };

    socket.emit("newProduct", newProduct);

    form.reset();
});

socket.on("productsUpdated", (products) => {
    list.innerHTML = "";

    products.forEach((p) => {
        const item = document.createElement("li");
        item.textContent = `${p.title} - ${p.description} - $${p.price} - Código: ${p.code} - Stock: ${p.stock}`;
        list.appendChild(item);
    });
});
