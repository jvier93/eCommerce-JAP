//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
  //Manejo del focus de los small que muestran los errores
  document.getElementById("userEmail").addEventListener("focus", (e) => {
    document.getElementById("userEmailError").textContent = "";
  });
  document.getElementById("userPassword").addEventListener("focus", (e) => {
    document.getElementById("userPasswordError").textContent = "";
  });

  //Validamos los inputs cuando se ejecuta el evento blur
  validateInput("userEmail", "userEmailError", "email", "blur");
  validateInput("userPassword", "userPasswordError", "password", "blur");

  //Validamos los inputs cuando se ejecuta el evento submit
  document
    .getElementById("login-form")
    .addEventListener("submit", function (e) {
      if (!this.checkValidity()) {
        validateInput("userEmail", "userEmailError", "email");
        validateInput("userPassword", "userPasswordError", "password");
      } else {
        setLogged(true);
        console.log("redirigimos a index");

        setUserData({ email: document.getElementById("userEmail").value });

        redirectTo("index.html");
      }

      e.preventDefault();
    });
});

//Valida un input cuando se ejecuta un evento en el mismo (parametro opcional)
function validateInput(inputId, spanErrorId, inputType, onEvent = null) {
  if (onEvent !== null) {
    document.getElementById(inputId).addEventListener(onEvent, function () {
      if (this.checkValidity()) {
        this.classList.remove("error-input");
        document.getElementById(spanErrorId).textContent = "";
      } else {
        this.classList.add("error-input");
        document.getElementById(
          spanErrorId
        ).textContent = `${inputType} inválido`;
      }
    });
  } else {
    const input = document.getElementById(inputId);
    if (input.checkValidity()) {
      input.classList.remove("error-input");
      document.getElementById(spanErrorId).textContent = "";
    } else {
      input.classList.add("error-input");
      document.getElementById(
        spanErrorId
      ).textContent = `inserte un ${inputType} válido`;
    }
  }
}

function onSignIn() {
  setLogged(true);
}
