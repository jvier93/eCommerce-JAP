let commentsArray = [];

//Funcion especifica para este caso de uso el cual es: a partir de una fecha 2020-02-21 15:05:22 obtener solo 2020-02-21
function formatDate(dateToFormat) {
  const formatedDate = dateToFormat.split(" ");
  return formatedDate[0];
}

//Funcion especifica para lograr representar el score con estrellas segun el score indicado.
function showScore(score) {
  if (score === 1) {
    return `<span class="fa fa-star checked"></span>
    <span class="fa fa-star "></span>
    <span class="fa fa-star "></span>
    <span class="fa fa-star "></span>
    <span class="fa fa-star "></span>`;
  } else if (score === 2) {
    return `<span class="fa fa-star checked"></span>
    <span class="fa fa-star checked "></span>
    <span class="fa fa-star "></span>
    <span class="fa fa-star "></span>
    <span class="fa fa-star "></span>`;
  } else if (score === 3) {
    return `<span class="fa fa-star checked"></span>
    <span class="fa fa-star checked "></span>
    <span class="fa fa-star checked "></span>
    <span class="fa fa-star "></span>
    <span class="fa fa-star "></span>`;
  } else if (score === 4) {
    return `<span class="fa fa-star checked"></span>
    <span class="fa fa-star checked"></span>
    <span class="fa fa-star checked "></span>
    <span class="fa fa-star checked "></span>
    <span class="fa fa-star "></span>`;
  } else if (score === 5) {
    return `<span class="fa fa-star checked"></span>
    <span class="fa fa-star checked "></span>
    <span class="fa fa-star checked "></span>
    <span class="fa fa-star checked "></span>
    <span class="fa fa-star checked"></span>`;
  }
}

function showComments() {
  let htmlContentToAppend = "";
  commentsArray.forEach(({ dateTime, user, description, score }) => {
    htmlContentToAppend += `
   <div class="comment">
    <div class="comment-header">
    <p class="text-muted comment-user">${user}</p>
    <p class="text-muted comment-date">${formatDate(dateTime)}</p>
    <div class="comment-score">
      ${showScore(score)}
    </div>
  </div>
  <p>
    ${description}
  </p>
 </div> 
 </div> 

    `;
  });
  document.getElementById("comments").innerHTML = htmlContentToAppend;
}

function showRelatedProducts(arrayRelatedProducts, fetchFrom, showInContainer) {
  getJSONData(fetchFrom).then((resultObj) => {
    if (resultObj.status === "ok") {
      const allProducts = resultObj.data;

      arrayRelatedProducts.map((indexOfRelatedProduct) => {
        const { name, imgSrc } = allProducts[indexOfRelatedProduct];
        const relatedProduct = createElement({
          type: "div",
          appendToId: showInContainer,
          className: "related-product",
        });
        createElement({
          type: "img",
          imageSrc: imgSrc,
          className: "related-product-img",
          appendTo: relatedProduct,
        });
        createElement({
          type: "p",
          textContent: name,
          appendTo: relatedProduct,
        });
      });
    }
  });
  //arrayRelatedProducts: cuales son los productos relacionados
  //fetchFrom : donde vamos a ir a buscar esos productos
  //showInContainer : donde vamos a mostrar esos productos
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
  getJSONData(PRODUCT_INFO_URL).then((resultObj) => {
    if (resultObj.status === "ok") {
      const {
        name,
        description,
        cost,
        currency,
        soldCount,
        category,
        images,
        relatedProducts,
      } = resultObj.data;
      document.getElementById("productName").textContent = name;
      document.getElementById("productDescription").textContent = description;
      document.getElementById(
        "productCurrencyAndCost"
      ).textContent = `${currency} ${cost}`;
      document.getElementById("productSoldCount").textContent = soldCount;
      document.getElementById("productCategory").textContent = category;
      showImagesGallery(images, "productImagesGallery");
      showRelatedProducts(relatedProducts, PRODUCTS_URL, "relatedProducts");
    }
  });

  getJSONData(PRODUCT_INFO_COMMENTS_URL).then((resultObj) => {
    if (resultObj.status === "ok") {
      commentsArray = [...resultObj.data];
      showComments();
    }
  });

  function getDate() {
    const date = new Date();
    let year = date.getFullYear();
    //¿Que sucede aca?, Primero le agregamos un 0 al mes obtenido de la variable date
    //Segundo nos quedamos con los ultimas 2 cifras del month, asi si el mes es menor a 10 de igual forma obtendremos un numero con un 0 adelante.
    let month = "0" + date.getMonth();
    month = month.slice(-2);
    ////////

    let day = "0" + date.getDay();
    day = day.slice(-2);
    return `${year}-${month}-${day}`;
  }

  document
    .getElementById("form-comment-description")
    .addEventListener("click", () => {
      document.getElementById("smallInvalidCommentForm").textContent = "";
    });

  document
    .getElementById("form-comments")
    .addEventListener("submit", (event) => {
      event.preventDefault();

      if (
        document.querySelector('input[name="estrellas"]:checked') !== null &&
        document.getElementById("form-comment-description").value !== ""
      ) {
        document.getElementById("smallInvalidCommentForm").textContent = "";
        const description = document.getElementById(
          "form-comment-description"
        ).value;
        const score = Number(
          document.querySelector('input[name="estrellas"]:checked').value
        );

        commentsArray.push({
          user: sessionStorage.getItem("username"),
          dateTime: getDate(),
          description,
          score,
        });
        showComments();
      } else {
        document.getElementById("smallInvalidCommentForm").textContent =
          "Califique este producto y haga un comentario";
      }
    });
});
