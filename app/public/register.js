const mensajeError = document.getElementsByClassName("error")[0];


document.getElementById("register-form").addEventListener("submit", async(e)=>{
    e.preventDefault();
    fetch("http://localhost:4000/api/register",{
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: e.target.children.username.value,
            email: e.target.children.email.value,
            password: e.target.children.password.value
        })
    });
    if(!res.ok) return mensajeError.classList.toggle("escondido",false);
    const resJson = await res.json();
    if(resJson.redirect){
        window.location.href = resJson.redirect;
    }
        
})
