// public/admin.js
document.getElementsByTagName("button")[0].addEventListener("click", async () => {
    document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.location.href = "/"; // Redirige a la página de inicio (login)
  });