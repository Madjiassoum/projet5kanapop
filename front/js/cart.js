//------Récupération du local storage-----------------

let productLocalStorage = JSON.parse(localStorage.getItem("product"));
const cart = document.querySelector(".cart");
const cartItems = document.getElementById("cart__items");
let produitsFiltres = [];

// recuperer tt les produits avec fetch
// Filtrer la liste des produits pour garder juste les produits qu'on a sur le localstorage
function getProducts() {
  fetch(`http://localhost:3000/api/products/`)
    .then((response) => response.json())
    .then((data) => {
      list = data;
      //  console.log(data);
	  
      if (productLocalStorage === null || productLocalStorage.length == 0) {
        console.log("vide vide vide");

        cart.innerHTML = `<p class="panierVide">Oups votre panier est encore vide !`;
        cart.style.fontSize = "1.5em";
        cart.style.textAlign = "center";
        cart.style.fontFamily = "bold";
        cart.style.color = "red";
      } else {
        console.log("le panier a déjà au moins un article");
        // on recupère dans les variables: couleur, id et quantité du localStorage
        for (let i = 0; i < productLocalStorage.length; i++) {
          let colorPdtLocalStorage = productLocalStorage[i].color;
          let idPdtLocalStorage = productLocalStorage[i].id;
          let qtyPdtLocalStorage = productLocalStorage[i].quantity;
          // console.log(idPdtLocalStorage);

          // console.log(colorPdtLocalStorage);
          // console.log(qtyPdtLocalStorage);
          // console.log(idPdtLocalStorage);
          const produitsFiltres = data.find(
            (element) => element._id === idPdtLocalStorage
          );

          //! Création structure des produits filtrés
          //!@@@@@@@@@@@@@@ DEBUT CREATION ARTICLE @@@@@@@@@@@@@@@@@@@@@@
          let article = document.createElement("article");
          article.setAttribute("class", "cart__item");
          article.setAttribute("data-id", `${idPdtLocalStorage}`);
          article.setAttribute("data-color", `${colorPdtLocalStorage}`);
          cartItems.appendChild(article);

          // creation div class cart__item__img
          let cartItemImg = document.createElement("div");
          article.appendChild(cartItemImg);
          cartItemImg.setAttribute("class", "cart__item__img");

          //creation de img
          let imgBalise = document.createElement("img");
          cartItemImg.appendChild(imgBalise);
          imgBalise.setAttribute("src", produitsFiltres.imageUrl);
          imgBalise.setAttribute("alt", produitsFiltres.altTxt);

          // creation div fille de article de class cart__item__content
          let cartItemContent = document.createElement("div");
          cartItemContent.setAttribute("class", "cart__item__content");
          article.appendChild(cartItemContent);

          //creation div fille de cartItemContent de class cart__item__content__titlePrice
          let itemContentTitlePrice = document.createElement("div");
          cartItemContent.appendChild(itemContentTitlePrice);
          itemContentTitlePrice.setAttribute(
            "class",
            "cart__item__content__titlePrice"
          );

          //Création d'une balise h2
          let h2Balise = document.createElement("h2");
          itemContentTitlePrice.appendChild(h2Balise);
          h2Balise.innerText = produitsFiltres.name;

          //Création d'un paragraphe p
          let para1 = document.createElement("p");
          itemContentTitlePrice.appendChild(para1);
          para1.innerText = colorPdtLocalStorage;

          let para2 = document.createElement("p");
          para2.setAttribute("class", "para2");
          itemContentTitlePrice.appendChild(para2);
          para2.innerHTML = `${produitsFiltres.price}`;

          // div fille cartItemContent de class cart__item__content__settings
          let contentSettings = document.createElement("div");
          contentSettings.setAttribute(
            "class",
            "cart__item__content__settings"
          );
          cartItemContent.appendChild(contentSettings);

          // div container quantité de classe: cart__item__content__settings__quantity
          let contentSettingsQuantity = document.createElement("div");
          contentSettings.appendChild(contentSettingsQuantity);
          contentSettingsQuantity.setAttribute(
            "class",
            "cart__item__content__settings__quantity"
          );

          //Création de la balise p
          let para3 = document.createElement("p");
          contentSettingsQuantity.appendChild(para3);
          para3.innerText = `Qté:`;

          //Création d'un input
          let inputQuantite = document.createElement("input");
          contentSettingsQuantity.appendChild(inputQuantite);
          inputQuantite.setAttribute("min", "1");
          inputQuantite.setAttribute("max", "100");
          inputQuantite.setAttribute("class", "itemQuantity");
          inputQuantite.setAttribute("type", "number");
          inputQuantite.setAttribute("name", "itemQuantity");
          inputQuantite.setAttribute("value", `${qtyPdtLocalStorage}`);

          //div fille de cartItemContent de class "cart__item__content__settings__delete"
          let contentSettingsDelete = document.createElement("div");
          contentSettings.appendChild(contentSettingsDelete);
          contentSettingsDelete.setAttribute(
            "class",
            "cart__item__content__settings__delete"
          );

          //Creation de p de class deleteItem
          let btnSupp = document.createElement("p");
          contentSettingsDelete.appendChild(btnSupp);
          btnSupp.setAttribute("class", "deleteItem");
          btnSupp.innerText = `Supprimer`;

          // FIN CREATION ARTICLE  
        } //fin boucle for

        // les fonctions se trouvant en dessous
        totalQtyEtPrix();
        suppArticle();
        modifyQuantity();
      } // Fin else
    }) // fin du deuxieme then

    .catch(function (err) {
      console.log("api error", err);
    });
}
getProducts();

// Fonction pour le calcul de la SOMME DES QUANTITES
function totalQtyEtPrix() {
  totalQuantity = 0;
  let insertTotalQuantity = document.getElementById("totalQuantity");
  let lesQty = document.querySelectorAll(".itemQuantity");
  for (let i = 0; i < lesQty.length; i++) {
    const elements = lesQty[i].valueAsNumber;
    // console.log(elements);
    totalQuantity += elements;
    insertTotalQuantity.innerText = totalQuantity;
    // console.log(totalQuantity);
    localStorage.setItem("product", JSON.stringify(productLocalStorage));
    // location.reload();
  }

  //! DEBUT La somme ou total des PRIX
  total = 0;
  let para2Price = document.querySelectorAll(".para2");
  for (let i = 0; i < para2Price.length; i++) {
    const prixParArticle = para2Price[i];
    const prixParArticleTextContent = parseInt(prixParArticle.textContent);
    total += prixParArticleTextContent * lesQty[i].valueAsNumber;
    // Point d'insertion de la somme totale des prix
    let totalPricePanier = document.getElementById("totalPrice");
    totalPricePanier.innerText = total;
    localStorage.setItem("product", JSON.stringify(productLocalStorage));
    // modifyQuantity();
    // location.reload();
  }
}
//  DEBUT pour supprimer le produit du panier
suppArticle();
function suppArticle() {
  let selectSupp = document.querySelectorAll(".deleteItem");
  for (let i = 0; i < selectSupp.length; i++) {
    selectSupp[i].addEventListener("click", (event) => {
      event.preventDefault();
      //Element selectionne selon son id et sa couleur
      let colorPdtLocalStorage = productLocalStorage[i].color;
      let idPdtLocalStorage = productLocalStorage[i].idProduct;

      productLocalStorage = productLocalStorage.filter(
        (element) =>
          element.idProduct !== idPdtLocalStorage ||
          element.color !== colorPdtLocalStorage
      );
      // Ici mis à jour du localStorage
      localStorage.setItem("product", JSON.stringify(productLocalStorage));
      location.reload();
      alert("Ce produit va être supprimé du panier");
    }); //fin addEventListener
  }
}

// Modification de la quantité du produit
modifyQuantity();
messageErrorQuantity = false;
function modifyQuantity() {
  let qtites = document.querySelectorAll(".itemQuantity");
  for (let i = 0; i < qtites.length; i++) {
    // console.log(qtites);
    qtites[i].addEventListener("change", (event) => {
      event.preventDefault();

      let itemNew = qtites[i].valueAsNumber;
      let itemModifValue = productLocalStorage[i].quantity;
      // console.log("itemModifValue",itemModifValue);

      //Je selectionne l'élément à modifier selon son Id et sa couleur
      let colorPdtLocalStorage = productLocalStorage[i].color;
      let idPdtLocalStorage = productLocalStorage[i].idProduct;
      let qtyPdtLocalStorage = productLocalStorage[i].quantity;

      const listQtyModif = productLocalStorage.find(
        (element) =>
          element.idProduct === idPdtLocalStorage &&
          element.color === colorPdtLocalStorage &&
          element.qtyPdtLocalStorage !== qtites[i].valueAsNumber
      );
      //undefined ne donne rien =>  qtites[i].quantity)
      // terme à eviter ne donne rien => qtites[i].quantity)
      listQtyModif.quantity = itemModifValue;
      productLocalStorage[i].quantity = listQtyModif.quantity;

      if (itemNew > 0 && itemNew <= 100 && qtites[i].valueAsNumber) {
        listQtyModif.quantity = itemNew;
        localStorage.setItem("product", JSON.stringify(productLocalStorage));

        totalQtyEtPrix();
        location.reload();
        let messageErrorQuantity = false;
      } else {
        let messageErrorQuantity = true;
      }
      if (messageErrorQuantity) {
        alert("La quantité doit être comprise entre 1 et 100.");
      }
      // location.reload();
    }); //fin addEventListener
  }
}

// FORMULAIRE DE CONTACT
let cartOrderForm = document.querySelector(".cart__order__form");

// Création des expressions régulières pour contrôler les infos entrées par l'utilisateur
let cityFirstLastRegExp = new RegExp(
  "^[a-zA-ZÀ-ÿ]+[ '-]?[[a-zA-ZÀ-ÿ]+[ '-]?]*[a-zA-ZÀ-ÿ]+$"
);
// "^[^.?!:;,/\\/_-]([. '-]?[a-zA-Zàâäéèêëïîôöùûüç])+[^.?!:;,/\\/_-]$"
let addressRegExp = new RegExp("^[0-9]{1,4}[ ,-][ A-Za-zÀ-ÿ0-9-]+$");
let emailRegExp = new RegExp(
  "^[^. ?!:;,/\\/_-]([._-]?[a-z0-9])+[^.?!: ;,/\\/_-][@][a-z0-9]+[.][a-z][a-z]+$"
  // "^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$"
  // "^[a-zA-Z0-9.-_]+[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-zA-Z]{2,10}$"
);

/*========= RECUPERATION DES DONNEES DU FORMULAIRE =========*/

// input firstName et son message d'erreur firstNameErrorMsg
// let errorFormFirstName = true;
let checkValueFirstName;
let errorFormFirstName = true;
let firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
let inputFirstName = document.getElementById("firstName");
// Ecoute d'input id firstName
inputFirstName.addEventListener("change", function () {
  firstNameErrorMsg = inputFirstName.nextElementSibling;
  checkValueFirstName = cityFirstLastRegExp.test(inputFirstName.value);
  if (checkValueFirstName) {
    firstNameErrorMsg.innerText = "";
    inputFirstName.style.border = ".2em solid green";
    errorFormFirstName = false;
  } else {
    firstNameErrorMsg.innerText =
      "Prénom n'accepte ni apostrophe ni caractères spéciaux";
    firstNameErrorMsg.style.color = "red";
    errorFormFirstName = true;
  }
});

// input lastname et son message d'erreur lastNameErrorMsg
let errorFormLastName = true;
let lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
let checkValueLastName;
let inputLastName = document.getElementById("lastName");
// Ecoute d'input id lastName
inputLastName.addEventListener("change", function () {
  lastNameErrorMsg = inputLastName.nextElementSibling;
  checkValueLastName = cityFirstLastRegExp.test(inputLastName.value);
  if (checkValueLastName) {
    lastNameErrorMsg.innerHTML = "";
    inputLastName.style.border = ".2em solid green";
    errorFormLastName = false;
  } else {
    lastNameErrorMsg.innerHTML =
      "Nom n'accepte ni apostrophe ni caractères spéciaux";
    inputLastName.style.border = ".2em solid red";
    lastNameErrorMsg.style.color = "red";
    errorFormLastName = true;
  }
});

// input city et son message d'erreur cityErrorMsg
//input city et  son message d'erreur
let cityErrorMsg = document.getElementById("cityErrorMsg");
let checkValueCity;
let errorFormCity = true;
let inputCity = document.getElementById("city");
// Ecoute de city
inputCity.addEventListener("change", function () {
  cityErrorMsg = inputCity.nextElementSibling;
  checkValueCity = cityFirstLastRegExp.test(inputCity.value);
  if (checkValueCity) {
    cityErrorMsg.innerHTML = "";
    inputCity.style.border = ".2em solid green";
    errorFormCity = false;
  } else {
    cityErrorMsg.innerHTML =
      "Nom de ville n'accepte ni apostrophe ni caractères spéciaux";
    inputCity.style.border = ".2em solid red";
    cityErrorMsg.style.color = "red";
    errorFormCity = true;
  }
});

// input id address et son message d'erreur addressErrorMsg
// input address et son message d'erreur
let addressErrorMsg = document.getElementById("addressErrorMsg");
let checkValueAddress;
let errorFormAddress = true;
let inputAddress = document.getElementById("address");
// Ecoute de address
inputAddress.addEventListener("change", function () {
  addressErrorMsg = inputAddress.nextElementSibling;
  checkValueAddress = addressRegExp.test(inputAddress.value);
  if (checkValueAddress) {
    addressErrorMsg.innerHTML = "";
    inputAddress.style.border = ".2em solid green";
    errorFormAddress = false;
  } else {
    addressErrorMsg.innerHTML = "Veuillez indiquer une adresse valide !";
    inputAddress.style.border = ".2em solid red";
    addressErrorMsg.style.color = "red";
    errorFormAddress = true;
  }
});

// input id email et son message d'erreur emailErrorMsg
//input Email et son message d'erreur
let emailErrorMsg = document.getElementById("emailErrorMsg");
let checkValueEmail;
let errorFormEmail = true;
let inputEmail = document.getElementById("email");
// Ecoute de email
inputEmail.addEventListener("change", function () {
  emailErrorMsg = inputEmail.nextElementSibling;
  checkValueEmail = emailRegExp.test(inputEmail.value);
  if (checkValueEmail) {
    emailErrorMsg.innerHTML = "";
    inputEmail.style.border = ".2em solid green";
    errorFormEmail = false;
  } else {
    emailErrorMsg.innerHTML = "Veuillez indiquer un email valide !";
    inputEmail.style.border = ".2em solid red";
    emailErrorMsg.style.color = "red";
    errorFormEmail = true;
  }
});



//-------- ECOUTE DU BOUTON COMMANDER -----------
const btnCommander = document.getElementById("order");
btnCommander.addEventListener("click", (event) => {
  event.preventDefault(); // Empêche le rechargement de la page

  let firstName = document.getElementById("firstName").value;
  let lastName = document.getElementById("lastName").value;
  let address = document.getElementById("address").value;
  let city = document.getElementById("city").value;
  let email = document.getElementById("email").value;
  const contact = { firstName, lastName, address, city, email };

  if (productLocalStorage === null || productLocalStorage.length === 0) {
    alert("Votre panier est vide !");
  } else {
    //____Gestion du formulaire de contact et validation de la commande___
    // On vérifie que tous les champs sont bien renseignés, 
    //sinon on indique un message à l'utilisateur
    // On vérifie qu'aucun champ n'est vide
    if (
      !inputFirstName.value ||
      !inputLastName.value ||
      !inputAddress.value ||
      !inputCity.value ||
      !inputEmail.value
    ) {
      alert("Vous devez renseigner tous les champs !");      
      event.preventDefault();
    }
    // On vérifie que les champs sont correctement remplis suivant les RegExp mises en place
    else if (
      errorFormFirstName === true ||
      errorFormLastName === true ||
      errorFormAddress === true ||
      errorFormCity === true ||
      errorFormEmail === true
    ) {
      alert(
        "Veuillez vérifier les champs du formulaire et les remplir correctement !"
      );
      event.preventDefault();
    } else {
      //Récupération des id des produits du panier, dans le localStorage
      let idProducts = [];
      for (let i = 0; i < productLocalStorage.length; i++) {
        idProducts.push(productLocalStorage[i].id);
      }
      //console.log(idProducts);
      // On cré un objet dans lequel on met les infos "Contact" et les infos "Produits du panier" (l'id)
      const order = {
        contact: {
          firstName: inputFirstName.value,
          lastName: inputLastName.value,
          address: inputAddress.value,
          city: inputCity.value,
          email: inputEmail.value,
        },
        products: idProducts,
      };
      // console.log(order);
      // console.log(contact);
      // console.log(idProducts);
      // On indique la méthode d'envoi des données
      const options = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      };
      //console.log(options);
      // on envoie les données Contact et l'id des produits à l'API
      fetch("http://localhost:3000/api/products/order", options)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          localStorage.setItem("orderId", data.orderId);
          console.log("orderId", data.orderId);
          // on redirige vers la page de confirmation de commande en passant l'orderId (numéro de commande) dans l'URL
          document.location.href = `confirmation.html?orderId=${data.orderId}`;
        })
        .catch((err) => {
          console.log("Erreur Fetch product.js", err);
          alert("Un problème a été rencontré lors de l'envoi du formulaire.");
        });
      //----------------------------------------------On vide le localStorage---------------------------------------------------------------
      localStorage.clear();
    } //fin else
  }
}); //fin écoute bouton Commander
