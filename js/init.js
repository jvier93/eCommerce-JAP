const CATEGORIES_URL =
  "https://japdevdep.github.io/ecommerce-api/category/all.json";
const PUBLISH_PRODUCT_URL =
  "https://japdevdep.github.io/ecommerce-api/product/publish.json";
const CATEGORY_INFO_URL =
  "https://japdevdep.github.io/ecommerce-api/category/1234.json";
const PRODUCTS_URL =
  "https://japdevdep.github.io/ecommerce-api/product/all.json";
const PRODUCT_INFO_URL =
  "https://japdevdep.github.io/ecommerce-api/product/5678.json";
const PRODUCT_INFO_COMMENTS_URL =
  "https://japdevdep.github.io/ecommerce-api/product/5678-comments.json";
const CART_INFO_URL = "https://japdevdep.github.io/ecommerce-api/cart/654.json";
const CART_BUY_URL = "https://japdevdep.github.io/ecommerce-api/cart/buy.json";

function showImagesGallery(array, showInContainer) {
  let htmlContentToAppend = "";

  for (let i = 0; i < array.length; i++) {
    let imageSrc = array[i];

    htmlContentToAppend +=
      `
        <div class="col-lg-3 col-md-4 col-6">
            <div class="d-block mb-4 h-100">
                <img class="img-fluid img-thumbnail" src="` +
      imageSrc +
      `" alt="">
            </div>
        </div>
        `;

    document.getElementById(showInContainer).innerHTML = htmlContentToAppend;
  }
}

function createElement({
  type,
  appendTo = null,
  appendToId = "",
  className = "",
  textContent = "",
  imageSrc = "",
  redirectTo = "",
}) {
  const element = document.createElement(type);
  if (textContent !== "") {
    element.textContent = textContent;
  }
  if (className !== "") {
    element.classList.add(className);
  }

  if (imageSrc !== "") {
    element.setAttribute("src", imageSrc);
  }

  if (redirectTo !== "") {
    element.setAttribute("href", redirectTo);
  }

  if (appendTo !== null) {
    appendTo.appendChild(element);
  } else if (appendToId !== "") {
    document.getElementById(appendToId).appendChild(element);
  }
  return element;
}

var showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
};

var hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
};

var getJSONData = function (url) {
  var result = {};
  showSpinner();
  return fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = "ok";
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = "error";
      result.data = error;
      hideSpinner();
      return result;
    });
};

function isLogged() {
  const logged = sessionStorage.getItem("logged");
  return logged !== null && logged === "true";
}

function setLogged(value) {
  sessionStorage.setItem("logged", value);
}

function redirectTo(url) {
  location.replace(url);
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.

document.addEventListener("DOMContentLoaded", function (e) {
  //Si el usuario no esta logueado y no estamos ya posicionados en login html.
  if (!isLogged() && !location.pathname.endsWith("login.html")) {
    redirectTo("login.html");
  } else {
    //Recuperamos el nombre de usuario y lo seteamos en el dropdown de usuario
    const username = sessionStorage.getItem("username");
    document.getElementById("my-dropmenu").textContent = username;

    //Evento de log out en el boton cerrar sesion del dropdown
    document.getElementById("signOut").addEventListener("click", () => {
      setLogged(false);
      redirectTo("login.html");
    });
  }
});
