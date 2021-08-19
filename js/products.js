//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
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

  getJSONData(PRODUCTS_URL).then((result) => {
    result.data.map(({ name, description, cost, currency }) => {
      const card = createElement({
        type: "div",
        appendToId: "product-list",
        className: "card",
      });
      createElement({ type: "h1", textContent: name, appendTo: card });
      createElement({ type: "p", textContent: description, appendTo: card });
      createElement({
        type: "span",
        textContent: `${currency} ${cost}`,
        appendTo: card,
      });
    });
  });
});
