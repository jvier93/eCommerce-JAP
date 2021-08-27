let ORDER_ASC_BY_PRICE = "ASC";
let ORDER_DES_BY_PRICE = "DES";
let ORDER_BY_PROD_REL = "Rel.";
let currentSortCriteria = null;
let currentProductsArray = [];
let minPrice = null;
let maxPrice = null;
let searchedText = "";

function sortProducts(criteria, array) {
  let result = [];
  if (criteria === ORDER_ASC_BY_PRICE) {
    result = array.sort((a, b) => {
      return a.cost - b.cost;
    });
  } else if (criteria === ORDER_DES_BY_PRICE) {
    result = array.sort((a, b) => {
      return b.cost - a.cost;
    });
  } else if (criteria === ORDER_BY_PROD_REL) {
    result = array.sort((a, b) => {
      return b.soldCount - a.soldCount;
    });
  }

  return result;
}

function sortAndShowProducts(sortCriteria, productsArray) {
  currentSortCriteria = sortCriteria;

  productsArray !== undefined ? (currentProductsArray = productsArray) : null;
  currentProductsArray = sortProducts(
    currentSortCriteria,
    currentProductsArray
  );

  showProductsList();
}

function createElement({
  type,
  appendTo = null,
  appendToId = "",
  className = "",
  textContent = "",
}) {
  const element = document.createElement(type);
  if (textContent !== "") {
    element.textContent = textContent;
  }
  if (className !== "") {
    element.classList.add(className);
  }

  if (appendTo !== null) {
    appendTo.appendChild(element);
  } else if (appendToId !== "") {
    document.getElementById(appendToId).appendChild(element);
  }
  return element;
}

function showProductsList() {
  const productList = document.getElementById("product-list");
  productList.hasChildNodes() ? (productList.innerHTML = "") : null;

  currentProductsArray.map(
    ({ name, description, cost, currency, soldCount }) => {
      if (
        name.toLowerCase().includes(searchedText.toLowerCase()) ||
        description.toLowerCase().includes(searchedText.toLowerCase())
      ) {
        if (
          ((minPrice === null ||
            (minPrice !== null && parseInt(cost) >= minPrice)) &&
            maxPrice === null) ||
          (maxPrice !== null && parseInt(cost) <= maxPrice)
        ) {
          const card = createElement({
            type: "div",
            appendTo: productList,
            className: "card",
          });
          createElement({ type: "h1", textContent: name, appendTo: card });
          createElement({
            type: "small",
            textContent: `${soldCount} vendidos`,
            appendTo: card,
          });
          createElement({ type: "br", appendTo: card });
          createElement({
            type: "p",
            textContent: description,
            appendTo: card,
          });
          createElement({
            type: "span",
            textContent: `${currency} ${cost}`,
            appendTo: card,
          });
        }
      }
    }
  );
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
  getJSONData(PRODUCTS_URL).then((result) => {
    if (result.status === "ok") {
      sortAndShowProducts(ORDER_DES_BY_PRICE, result.data);
    }
  });

  document.getElementById("clearRangeFilter").addEventListener("click", () => {
    document.getElementById("rangeFilterPriceMin").value = "";
    document.getElementById("rangeFilterPriceMax").value = "";

    minPrice = null;
    maxPrice = null;

    showProductsList();
  });

  document.getElementById("searchedText").addEventListener("keyup", (e) => {
    searchedText = e.target.value;
    showProductsList();
  });

  document.getElementById("rangeFilterPrice").addEventListener("click", () => {
    minPriceInput = document.getElementById("rangeFilterPriceMin").value;
    maxPriceInput = document.getElementById("rangeFilterPriceMax").value;

    parseInt(minPriceInput) >= 0 && minPriceInput !== ""
      ? (minPrice = minPriceInput)
      : (minPrice = null);

    parseInt(maxPriceInput) >= 0 && maxPriceInput !== ""
      ? (maxPrice = maxPriceInput)
      : (maxPrice = null);

    showProductsList();
  });

  document.getElementById("sortAsc").addEventListener("click", () => {
    sortAndShowProducts(ORDER_ASC_BY_PRICE);
  });

  document.getElementById("sortDesc").addEventListener("click", () => {
    sortAndShowProducts(ORDER_DES_BY_PRICE);
  });

  document.getElementById("sortByRelevance").addEventListener("click", () => {
    sortAndShowProducts(ORDER_BY_PROD_REL);
  });
});
