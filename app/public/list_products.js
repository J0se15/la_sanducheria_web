window.addEventListener("load", async () => {
    const res = await fetch("http://localhost:4000/api/products");
    const resJson = await res.json();
    const products = resJson.data;
    const tableBody = document.getElementById("product-list");
    products.forEach((product) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td>${product.quantity}</td>
            <td>${product.isactive ? 'Activo' : 'Inactivo'}</td>
            <td><a href='editar'>editar</a> <a href='eliminar'>eliminar</a></td>
        `;
        tableBody.appendChild(tr);
    });
    
})