//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
  const userData = getUserData();

  document
    .getElementById("profile-picture")
    .setAttribute("src", userData.profilePicture);

  document.getElementById("username").textContent =
    userData.username === undefined ? "" : userData.username;

  document.getElementById("email").textContent =
    userData.email === undefined ? "" : userData.email;

  document.getElementById("birthday").textContent =
    userData.birthday === undefined ? "" : userData.birthday;

  document.getElementById("address").textContent =
    userData.address === undefined ? "" : userData.address;

  document.getElementById("phone").textContent =
    userData.phone === undefined ? "" : userData.phone;
});
