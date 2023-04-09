console.log("Ici page Confirmation");
alert("Merci pour votre commande. Gardez bien ce numéro de commande qui va s'afficher");
localStorage.clear();

// Sélection lieu d'insertion de mon numéro de commande
let orderId = document.getElementById("orderId");

const usp = new URLSearchParams(window.location.search);
const uspId = usp.get("orderId");
orderId.innerHTML= uspId;
orderId.style.fontSize="1.2em";
orderId.style.fontWeight="bold";


