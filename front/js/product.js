const url = new URL(document.location.href);
const idPRoduct = url.searchParams.get("id");
let URL_API_PRODUITS = "http://localhost:3000/api/products/" + idPRoduct;
//  console.log('idProduct',idPRoduct) ;
fetch(URL_API_PRODUITS)
  .then((res) => res.json())
  .then((product) => {
    //Création d'un objet représentant le produit sélectionné
    /* 
        ne sup pas ce console ci-dessous
        */
    //  console.log('product',product);
    //! Partie image du produit
    const image_product = document.querySelector(".item__img");
    image_product.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;

    // Le titre de notre produit
    const title = document.getElementById("title");
    title.innerHTML = product.name;
    title.style.textAlign = "center";

    //! Message de Description
    const description = document.getElementById("description");
    description.innerHTML = product.description;

    // La partie pour d'options couleurs pour HTML
    const choix_couleur = document.getElementById("colors");
    // console.log(choix_couleur);
    choix_couleur.innerHTML = product.colors
      .map((color) => `<option>${color}</option>`)
      .join(", ");

    /**   DEBUT PROGRAMMATION DU PRIX D'ARTICLE */
    const prix = document.getElementById("price");
    prix.innerHTML = product.price;
    prix.style.font = "white bold 1.3em";
    prix.style.marginLeft = "1em";
    /**     FIN PROGRAMMATION DU PRIX A AFFICHER   */

    /**     RIEN A MODIFIER VERS LE HAUT     */

    let addToCart = document.querySelector("#addToCart");
    addToCart.addEventListener("click", (event) => {
      event.preventDefault();

      // DEBUT PROGRAMMATION QUANTITE vers le bas
      const qte = document.querySelector("#quantity");
      const valQte = qte.value;
      
      //!CONDITION AUTOUR DE LA VALEUR QUANTITE RECUPEREE: valQte

      //cas où le champ quantité est: vide ou zero
      if (valQte === NaN || valQte == 0) {
        alert(`${parseInt(valQte)} quantité choisie. Oups ! Choisissez autre quantité que: le vide ou 0`);
      }
      //cas où la quantité est un nombre négatif
      else if (valQte < 0) {
        alert(`La quantité ${parseInt(valQte)} n'est pas accptée, faites votre choix de 1 à 100`);
      }
      //Cas où la quantité dépasse 100
      else if (valQte > 100) {
        alert(`${parseInt(valQte)} ? Oups c'est au dessus de 100. Choisissez plutôt la quantité de 1 à 100`);
      }
          /**   ENVOI AU LOCALSTORAGE si QUANTITE est égale de: 1 à 100  */
       else {
        //! suite en haut ICI CHOIX COULEUR
        const colorOption = choix_couleur.value;
        // console.log(colorOption);
        //! Structure produit envoyé au localStorage
        const productAdded = {
          id: product._id,
          color: colorOption,
          quantity: parseInt(valQte),
        };
        // console.log("mon productAdded");
        // console.log(productAdded);
        alert(`${parseInt(valQte)}  ${product.name} de couleur: ${colorOption} ajouté au panier`);
        let monStockage = JSON.parse(localStorage.getItem("product"));

        if (monStockage) {
          // console.log('monstckage',monStockage)
          // console.log('prodId',idPRoduct) ;
          // console.log('coloroption',colorOption)
          const result = monStockage.find(
            (productOk) =>
              productOk.id === idPRoduct && productOk.color === colorOption
          );
          // console.log('resutlt',result) ;
          //si le produit est déja dans le panier : augumenter la quantity
          if (result) {
            let qtyBasket =
              parseInt(productAdded.quantity) + parseInt(result.quantity);
            result.quantity = qtyBasket;

            localStorage.setItem("product", JSON.stringify(monStockage));

            //si le produit n'est pas dans le panier
          } else {
            monStockage.push(productAdded);
            localStorage.setItem("product", JSON.stringify(monStockage));
          }
          //si le panier est vide on crée le tableau produit
        } else {
          monStockage = [];
          monStockage.push(productAdded);
          localStorage.setItem("product", JSON.stringify(monStockage));
        }
      }
    });
  });
