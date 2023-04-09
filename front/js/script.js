    // Api pour recuperation de données avec node server
let URL_API_PRODUITS = "http://localhost:3000/api/products";
// console.log(URL_API_PRODUITS);
document.addEventListener("DOMContentLoaded", () => {
  const produitsListe = document.getElementById("items");
  if (produitsListe) {
    fetch(URL_API_PRODUITS)
      .then((res) => res.json())
      .then((response) => {        
        response.forEach((product, index) => {
        produitsListe.innerHTML += afficherProduits(product, index);
        // console.log(product._id);

        });
        
        function afficherProduits(product, index) {
            // Structure du product demandé
            return `
               <a href="./product.html?id=${product._id}">
                <article> 
                    <img src="${product.imageUrl}" alt="${product.altTxt}">         
                    <h3 class="productName">${product.name}</h3> 
                    <p class="productPrice">${product.price} €</p>              
                    <p class="productDescription">${product.description}</p>              
                  </article>
                </a>            
                `;
            }
        })
        .catch((erreur) => console.log(erreur));
        
    }
    // console.log(produitsListe);
});            