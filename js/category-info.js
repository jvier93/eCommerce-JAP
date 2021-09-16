var category = {};

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
  getJSONData(CATEGORY_INFO_URL).then(function (resultObj) {
    if (resultObj.status === "ok") {
      category = resultObj.data;

      let categoryNameHTML = document.getElementById("categoryName");
      let categoryDescriptionHTML = document.getElementById(
        "categoryDescription"
      );
      let productCountHTML = document.getElementById("productCount");
      let productCriteriaHTML = document.getElementById("productCriteria");

      categoryNameHTML.innerHTML = category.name;
      categoryDescriptionHTML.innerHTML = category.description;
      productCountHTML.innerHTML = category.productCount;
      productCriteriaHTML.innerHTML = category.productCriteria;

      //Muestro las imagenes en forma de galería
      showImagesGallery(category.images, "productImagesGallery");
    }
  });
});
