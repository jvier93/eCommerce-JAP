let currentArrayCartProducts = [];
let shippingTax = 5;
let currency = "USD";

const decrement = (event) => {
  const articleIndex = parseInt(event.target.dataset.id);
  const productTarget = currentArrayCartProducts[articleIndex];

  if (productTarget.count > 1) {
    productTarget.count -= 1;
  }

  showCartProducts();
  getAndShowSummary(currentArrayCartProducts, shippingTax, currency);
};

const increment = (event) => {
  const articleIndex = parseInt(event.target.dataset.id);

  const productTarget = currentArrayCartProducts[articleIndex];

  productTarget.count += 1;

  showCartProducts();
  getAndShowSummary(currentArrayCartProducts, shippingTax, currency);
};

const deleteProduct = (event, indexElementToDelete) => {
  currentArrayCartProducts.splice(indexElementToDelete, 1);
  showCartProducts();
  getAndShowSummary(currentArrayCartProducts, shippingTax, currency);
};

const showCartProducts = (arrayCartProducts = null) => {
  if (arrayCartProducts !== null) {
    currentArrayCartProducts = arrayCartProducts;
  }

  document.getElementById("cart-products").innerHTML = "";
  //Variable externa de la función que contiene los productos actuales.
  currentArrayCartProducts.forEach(
    ({ src, name, count, unitCost, currency }, index) => {
      let wrapperProduct = createElement({
        type: "div",
        className: "article",
        appendToId: "cart-products",
      });

      let subtotalPerArticle = count * unitCost;
      wrapperProduct.innerHTML = ` 
    <div class="article-img-container"><img src="${src}" alt="" /> </div>
    
    <div class="article-body">
      <div class="article-data">
        <p>${name}</p>
        <p class="article-price"> c/u ${currency} ${unitCost}</p>
      </div>
      <div class="article-controls">
        <div class="article-count">
          <button data-id=${index} onclick="decrement(event)">-</button>
          <input type="number" value="${count}" />
          <button data-id=${index} onclick="increment(event)">+</button>
        </div>

        <button onclick="deleteProduct(event,${index})" data-id=${index}  class="article-trash">
          <i class="fas fa-trash"></i>
        </button>
        <p class="article-price">Subtotal ${currency} ${subtotalPerArticle}</p>

      </div>
    </div>
  `;
    }
  );
};

const getSummary = (products, shippingTax, currencyAtSumary) => {
  let subtotal = 0;
  let total = 0;

  const convertToCurrency = (value, currency) => {
    if (currency === "USD") {
      return Number((value / 40).toFixed(2));
    } else {
      return Number((value * 40).toFixed(2));
    }
  };

  products.map(({ count, unitCost, currency }) => {
    if (currency === currencyAtSumary) {
      subtotal += count * unitCost;
    } else {
      subtotal += count * convertToCurrency(unitCost, currencyAtSumary);
    }
  });

  let percentToAdd = (shippingTax / 100) * subtotal;
  total = (subtotal + percentToAdd).toFixed(2);

  return { subtotal, total };
};

const getAndShowSummary = (products, shippingTax, currencyAtSumary) => {
  const { subtotal, total } = getSummary(
    products,
    shippingTax,
    currencyAtSumary
  );
  const containerSubtotal = document.getElementById("subtotal");
  const recargoEnvio = document.getElementById("shipping-tax");
  const containerTotal = document.getElementById("total");

  containerSubtotal.textContent = subtotal;
  //en este caso el taxes que pasamos como parametro sera el shippingTax, el impuesto por el envio.
  recargoEnvio.textContent = `${shippingTax}%`;
  containerTotal.textContent = `${currencyAtSumary} ${total}`;
};

const handleRadioInputsPayment = () => {
  const card = `<div class="card-number-and-code">
  <div class="input-control">
    <label for="card-number">Número de tarjeta</label>
    <input id="card-number" type="number" />
  </div>
  <div class="input-control">
    <label for="card-code">Código de seg.</label>
    <input id="card-code" type="number" />
  </div>
</div>
<div class="input-control">
  <label for="expired-date">Vencimiento (MM/AA)</label>
  <input id="expired-date" type="text" />
</div>`;
  const bank = `<div class="input-control">
  <label for="bank-account">Número de cuenta</label>
  <input id="bank-account" type="number" />
</div>`;

  const paymentContainer = document.getElementById("payment-form-container");

  document.querySelectorAll('input[name="payment"]').forEach((element) => {
    element.addEventListener("click", (e) => {
      const inputValue = e.target.value;
      if (inputValue === "card") {
        paymentContainer.innerHTML = card;
      } else {
        paymentContainer.innerHTML = bank;
      }
    });
  });
};
//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
  getJSONData(CART_INFO_URL).then((response) => {
    if (response.status === "ok") {
      showCartProducts(response.data.articles);
      getAndShowSummary(currentArrayCartProducts, shippingTax, currency);
    }
  });

  handleRadioInputsPayment();

  document.getElementById("currency").addEventListener("change", (e) => {
    currency = e.target.value;
    getAndShowSummary(currentArrayCartProducts, shippingTax, currency);
  });

  document.getElementById("cart-shipping").addEventListener("change", (e) => {
    shippingTax = e.target.value;
    getAndShowSummary(currentArrayCartProducts, shippingTax, currency);
  });
});
