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

const deleteProduct = (event) => {
  const indexElementToDelete = event.currentTarget.dataset.id;
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
          <input disabled type="number"  value="${count}" />
          <button data-id=${index} onclick="increment(event)">+</button>
        </div>

        <button data-id=${index} onclick="deleteProduct(event)"   class="article-trash">
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

  let shippingAmountToAdd = (shippingTax / 100) * subtotal;

  total = (subtotal + shippingAmountToAdd).toFixed(2);

  return { subtotal, total, shippingAmountToAdd };
};

//Funcion que evalua si los campos correspondientes al pago (dependiendo del tipo de pago) fueron completados
const verificationDataPayment = (dataPaymentType = null, formData = null) => {
  if (dataPaymentType !== null && formData !== null) {
    if (dataPaymentType === "card") {
      const cardNumber = formData.get("card-number");
      const cardCode = formData.get("card-code");
      const expiredDate = formData.get("expired-date");

      return cardNumber !== "" && cardCode !== "" && expiredDate !== "";
    } else if (dataPaymentType === "bank") {
      const bankAccount = formData.get("bank-account");
      return bankAccount !== "";
    }
  }
};

//Funcion que evalua si los campos correspondientes a datos de envio (direccion, calle y esquina) fueron completados.
const verificationDataShipping = (formData = null) => {
  if (formData !== null) {
    const street = formData.get("street");
    const streetNumber = formData.get("street-number");
    const streetCorner = formData.get("street-corner");
    return street !== "" && streetNumber !== "" && streetCorner !== "";
  }
};

const getAndShowSummary = (products, shippingTax, currencyAtSumary) => {
  const { subtotal, total, shippingAmountToAdd } = getSummary(
    products,
    shippingTax,
    currencyAtSumary
  );
  const containerSubtotal = document.getElementById("subtotal");
  const recargoEnvio = document.getElementById("shipping-tax");
  const containerTotal = document.getElementById("total");

  containerSubtotal.textContent = subtotal;
  //en este caso el taxes que pasamos como parametro sera el shippingTax, el impuesto por el envio.
  recargoEnvio.textContent = `${shippingAmountToAdd}`;
  containerTotal.textContent = `${currencyAtSumary} ${total}`;
};

const handleRadioInputsPayment = () => {
  const card = `<div class="card-number-and-code">
  <div class="input-control">
    <label for="card-number">Número de tarjeta</label>
    <input form="cart-form" name="card-number" id="card-number" type="number" />
  </div>
  <div class="input-control">
    <label for="card-code">Código de seg.</label>
    <input  form="cart-form" name="card-code" id="card-code" type="number" />
  </div>
</div>
<div class="input-control">
  <label for="expired-date">Vencimiento (MM/AA)</label>
  <input form="cart-form" name="expired-date" id="expired-date" type="text" />
</div>`;
  const bank = `<div class="input-control">
  <label for="bank-account">Número de cuenta</label>
  <input form="cart-form" name="bank-account" id="bank-account" type="number" />
</div>`;

  const paymentContainer = document.getElementById("payment-form-container");
  //Elemento p en la pagina que nos mostrara el metodo de pago seleccionado
  const paymentText = document.getElementById("payment-method-text");
  document.querySelectorAll('input[name="payment"]').forEach((element) => {
    element.addEventListener("click", (e) => {
      const inputValue = e.target.value;
      if (inputValue === "card") {
        paymentContainer.innerHTML = card;
        paymentText.textContent = "Tarjeta de credito";
      } else {
        paymentContainer.innerHTML = bank;
        paymentText.textContent = "Transferencia bancaria";
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

  document
    .getElementById("modal-close-button")
    .addEventListener("click", (e) => {
      let modalContainer = document.getElementById("payment-method-modal");
      modalContainer.classList.remove("modal-visible");
      modalContainer.classList.add("modal-hidden");
    });

  document
    .getElementById("payment-method-button")
    .addEventListener("click", (e) => {
      let modalContainer = document.getElementById("payment-method-modal");
      modalContainer.classList.remove("modal-hidden");
      modalContainer.classList.add("modal-visible");
    });

  document.getElementById("cart-form").addEventListener("submit", (event) => {
    //event.preventDefault();
    let formData = new FormData(event.target);

    const payment = formData.get("payment");

    if (
      currentArrayCartProducts.length > 0 &&
      verificationDataPayment(payment, formData) &&
      verificationDataShipping(formData)
    ) {
      return true;
    } else {
      document.getElementById("error-message-text").textContent =
        "Por favor verifique que completo los datos correctamente";
      event.preventDefault();
    }
  });
});
