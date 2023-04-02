const downloadLink = document.getElementById("downloadLink");
const wrongPassword = document.getElementById("wrongPassword");
const passwordVerification = document.getElementById("passwordVerification");
// downloadLink.style.display = "none";
// wrongPassword.style.display = "none";
const host = "http://localhost:3000/";

// const uploadURL = `${process.env.APP_BASE_URL}api/files`;
// const emailURL = `${process.env.APP_BASE_URL}api/files/send`;

// const uploadURL =
const verifyPasswordURL = `${host}files/verifyPassword`;
const btnSubmit = document.getElementById("btnSubmit");
// btnSubmit.onclick = () => {
//   btnSubmit.style.transform = "translateY(10px)";
//   btnSubmit.style.transform = "translateY(0)";
// };

// console.log();
const fileName = document.getElementById("fileName").value;

const verifyPassword = document.getElementById("verifyPassword");

verifyPassword.addEventListener("submit", (e) => {
  const password = document.getElementById("verify").value;
  console.log("hiii");
  e.preventDefault();
  const formData = {
    fileName,
    password,
  };

  fetch(verifyPasswordURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((res) => res.json())
    .then(({ result }) => {
      console.log(result);
      if (result) {
        downloadLink.style.display = "block";
        passwordVerification.style.display = "none";
        wrongPassword.style.display = "none";
      } else {
        downloadLink.style.display = "none";
        passwordVerification.style.display = "block";
        wrongPassword.style.display = "block";
      }
    });
});
