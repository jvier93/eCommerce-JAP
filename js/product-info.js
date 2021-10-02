let commentsArray = [];
//Variable que indica la posicion del carousell
let imageActive = 0;

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

      arrayRelatedProducts.forEach((indexOfRelatedProduct) => {
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

function getDate() {
  const date = new Date();
  let year = date.getFullYear();
  //¿Que sucede aca?, Primero le agregamos un 0 al mes obtenido de la variable date y le sumamos 1 al mes ya que se encuentra en base 0
  //Segundo nos quedamos con los ultimas 2 cifras del month, asi si el mes es menor a 10 de igual forma obtendremos un numero con un 0 adelante.
  let month = "0" + (date.getMonth() + 1);
  month = month.slice(-2);

  let day = "0" + date.getDate();
  day = day.slice(-2);
  return `${year}-${month}-${day}`;
}

//Funcion para cargar las imagenes al carrousel
function putImages(images) {
  const qtyImages = images.length;
  //Creamos el div contenedor de las imagenes
  const imagesWrapper = createElement({
    type: "div",
    appendToId: "carrousel",
    className: "imagesWrapper",
  });
  //Añadimos un width de un 100% por cada imagen
  imagesWrapper.style.width = `${qtyImages * 100}%`;

  //Por cada imagen creamos un img y lo añadimos a nuestro contenedor de imagenes
  images.forEach((image) => {
    const img = createElement({
      type: "img",
      appendTo: imagesWrapper,
      imageSrc: image,
    });
    //Siendo el contenedor de las imagenes el 100% se divide ese porcentaje por cada imagen
    img.style.width = `${100 / qtyImages}%`;
  });
}

function translate(translateToImage) {
  const qtyImages = document.querySelectorAll("#carrousel img").length - 1;
  if (translateToImage > qtyImages) {
    imageActive = 0;
  }
  if (translateToImage < 0) {
    imageActive = qtyImages;
  }
  imagesWrapper = document.querySelector(".imagesWrapper");

  //Trasladamos el elemento en el eje x segun lo que se resuelva en la operacion
  //para imageActive = 1 y qtyImages + 1 = 3
  //1 * -(100/3)
  //1 * -(33,33)
  //-33,33% (eso quiere decir que desplazamos el elemento hacia la izquierda (-), un 33,33%)
  //
  //para imageActive = 2 y qtyImages + 1 = 3
  //2 * -(100/3)
  //2 * -(33,33)
  //66,66% (eso quiere decir que desplazamos el elemento hacia la izquierda (-), un 66,66% )

  imagesWrapper.style.transform = `translateX( ${
    imageActive * -(100 / (qtyImages + 1))
  }%)`;
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

      putImages(images);
      document.getElementById("back").addEventListener("click", (e) => {
        e.preventDefault();
        translate((imageActive += -1));
      });

      document.getElementById("forward").addEventListener("click", (e) => {
        e.preventDefault();
        translate((imageActive += 1));
      });

      showRelatedProducts(relatedProducts, PRODUCTS_URL, "relatedProducts");
    }
  });

  getJSONData(PRODUCT_INFO_COMMENTS_URL).then((resultObj) => {
    if (resultObj.status === "ok") {
      commentsArray = [...resultObj.data];
      showComments();
    }
  });

  document
    .getElementById("form-comment-description")
    .addEventListener("click", () => {
      document.getElementById("smallInvalidCommentForm").textContent = "";
    });

  document
    .getElementById("form-comments")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const scoreInput = document.querySelector(
        'input[name="estrellas"]:checked'
      );
      const descriptionInput = document.getElementById(
        "form-comment-description"
      );

      if (scoreInput !== null && descriptionInput.value !== "") {
        document.getElementById("smallInvalidCommentForm").textContent = "";
        const description = descriptionInput.value;
        const score = Number(scoreInput.value);

        commentsArray.push({
          user: sessionStorage.getItem("username"),
          dateTime: getDate(),
          description,
          score,
        });

        //Reseteamos el formulario
        scoreInput.checked = false;
        descriptionInput.value = "";

        showComments();
      } else {
        document.getElementById("smallInvalidCommentForm").textContent =
          "Califique este producto y haga un comentario";
      }
    });
});
