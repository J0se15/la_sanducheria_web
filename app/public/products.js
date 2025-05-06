const mensajeError = document.getElementsByClassName("error")[0];


document.getElementById("create-product-form").addEventListener("submit", async(e)=>{
    e.preventDefault();
    const name = e.target.children.name.value;
    const price = e.target.children.price.value;
    const quantity = e.target.children.quantity.value;
    const isActive = !!e.target.children.isActive.value;

    if (!name || !price || !quantity || !isActive) {
        return window.alert("Los campos están incompletos");
    }

    const res = await fetch("http://localhost:4000/api/products",{
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            price,
            quantity,
            isActive,
            createdAt: new Date(),
            updatedAt: new Date()
        })
    });
    if(!res.ok) return mensajeError.classList.toggle("escondido",false);
    const resJson = await res.json();
    window.alert(resJson.message);
    console.table(resJson);
    if(resJson.redirect){
        window.location.href = resJson.redirect;
    }
        
})
