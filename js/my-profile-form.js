const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dixptvyr3/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "toaolbdk";

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.

document.addEventListener("DOMContentLoaded", function (e) {
  //Buscamos los datos del usuario y los randerizamos en sus respectivos inputs
  const userData = getUserData();

  document.getElementById("username").value =
    userData.username === undefined ? "" : userData.username;

  document.getElementById("email").value =
    userData.email === undefined ? "" : userData.email;

  document.getElementById("birthday").value =
    userData.birthday === undefined ? "" : userData.birthday;

  document.getElementById("address").value =
    userData.address === undefined ? "" : userData.address;

  document.getElementById("phone").value =
    userData.phone === undefined ? "" : userData.phone;

  document.getElementById("photoPreview").src = userData.profilePicture;

  //Para previsualizar la imagen que seleccionamos en el input de tipo file.
  document.getElementById("photo").addEventListener("change", (e) => {
    const file = e.target.files[0];
    const image = URL.createObjectURL(file);
    document.getElementById("photoPreview").setAttribute("src", image);
  });

  document
    .getElementById("user-data-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const formDataUser = new FormData(e.target);

      const username =
        formDataUser.get("username") === null
          ? ""
          : formDataUser.get("username");
      const birthday =
        formDataUser.get("birthday") === null
          ? ""
          : formDataUser.get("birthday");
      const email =
        formDataUser.get("email") === null ? "" : formDataUser.get("email");
      const address =
        formDataUser.get("address") === null ? "" : formDataUser.get("address");
      const phone =
        formDataUser.get("phone") === null ? "" : formDataUser.get("phone");
      const photo = formDataUser.get("photo");

      //Si photo.size es distinto de 0 quiere decir que efectivamente hay una foto en el input de tipo file
      if (photo.size !== 0) {
        const formDataImage = new FormData();
        formDataImage.append("file", photo);
        formDataImage.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        const response = await fetch(CLOUDINARY_URL, {
          method: "POST",
          body: formDataImage,
        });
        const responseJson = await response.json();

        const profilePicture = responseJson.url;

        const userData = {
          username,
          birthday,
          email,
          address,
          phone,
          profilePicture,
        };

        setUserData(userData);
        redirectTo("my-profile.html");
      } else {
        const userData = {
          username,
          birthday,
          email,
          address,
          phone,
          profilePicture: null,
        };
        setUserData(userData);
        redirectTo("my-profile.html");
      }
    });
});
