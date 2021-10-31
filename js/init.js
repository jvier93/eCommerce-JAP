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
  const logged = localStorage.getItem("logged");
  return logged !== null && logged === "true";
}

function setLogged(value) {
  localStorage.setItem("logged", value);
}

function redirectTo(url) {
  location.replace(url);
}

function getUserData() {
  if (JSON.parse(localStorage.getItem("userdata")) === null) {
    return {
      address: "",
      birthday: "",
      email: "",
      phone: "",
      profilePicture: "",
      username: "",
    };
  } else {
    return JSON.parse(localStorage.getItem("userdata"));
  }
}

//Guarda la informacion del usuario pasada en parametro como un objeto
function setUserData({
  address = null,
  birthday = null,
  email = null,
  phone = null,
  profilePicture = null,
  username = null,
}) {
  const userData = getUserData();

  address === null ? null : (userData.address = address);
  birthday === null ? null : (userData.birthday = birthday);
  email === null ? null : (userData.email = email);
  phone === null ? null : (userData.phone = phone);
  profilePicture === null ? null : (userData.profilePicture = profilePicture);
  username === null ? null : (userData.username = username);

  localStorage.setItem("userdata", JSON.stringify(userData));
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.

document.addEventListener("DOMContentLoaded", function (e) {
  //Si el usuario no esta logueado y no estamos ya posicionados en login html.
  if (!isLogged() && !location.pathname.endsWith("login.html")) {
    redirectTo("login.html");
  } else {
    //Si no estamos posicionados en login podremos hacer las siguientes cosas en el navbar.
    if (!location.pathname.endsWith("login.html")) {
      //Recuperamos el email del usuario y lo seteamos en el dropdown de usuario
      const userData = getUserData();
      document.getElementById("my-dropmenu").textContent = userData.email;

      //Evento de log out en el boton cerrar sesion del dropdown
      document.getElementById("signOut").addEventListener("click", () => {
        setLogged(false);
        redirectTo("login.html");
      });
    }
  }
});
