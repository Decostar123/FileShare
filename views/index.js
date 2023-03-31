const dropZone = document.querySelector(".drop-zone");
const fileInput = document.querySelector("#fileInput");
const browseBtn = document.querySelector(".browseBtn");
const bgProgress = document.querySelector(".bgProgress");
const percentDiv = document.querySelector("#percent");
const progressBar = document.querySelector(".progress-bar");
const progressContainer = document.querySelector(".progress-container");

const sharingContainer = document.querySelector(".sharing-container");
const fileURL = document.querySelector("#fileURL");
const copyBtn = document.querySelector("#copy-btn");
const btnSubmit = document.querySelector("#btnSubmit");
const toast = document.querySelector(".toast");
const checkbox = document.querySelector("#check");
const pswd = document.querySelector(".pswd");
// const pswd = document.querySelector(".pswd");
const pswdInput = document.querySelector("#passwordInput");
const password = document.querySelector("#password");
pswdInput.style.display = "none";
// const dotenv = require("dotenv");
// dotenv.config();

// checkbox.onchange = () => {
//   if (checkbox.checked) {
//     console.log(" got checked ");
//     pswd.style.visibility = "visible";
//   } else {
//     console.log(" not checked ");
//     pswd.style.visibility = "hidden";
//   }
// };

checkbox.onchange = () => {
  if (checkbox.checked) {
    pswdInput.style.display = "flex";
    console.log(" got checked ");
    pswd.style.display = "block";
  } else {
    pswdInput.style.display = "none";
    console.log(" not checked ");
    pswd.style.display = "none";
  }
};

const maxAllowedSize = 100 * 1024 * 1024; //100mb
console.log(btnSubmit);
console.log(copyBtn);
// btnSubmit.addEventListener("mouseover", () => {
//   console.log(btnSubmit.disabled);
//   console.log(" hi ");
//   if (btnSubmit.disabled === "true") {
//     btnSubmit.style.border = "";
//   } else {
//     btnSubmit.style.border = "4px solid rgb(162, 162, 245)";
//   }
// });
// if (btnSubmit.disabled === "true") {
//   btnSubmit.style.border = "";
// } else {
//   btnSubmit.style.border = "4px solid rgb(162, 162, 245)";
// }
const emailForm = document.querySelector("#emailForm");
const passwordForm = document.querySelector("#passwordForm");

copyBtn.addEventListener("click", () => {
  console.log("clipboard", fileURL.innerText);
  fileURL.select();
  document.execCommand("copy");
  showToast("Link Copied");
});
dropZone.addEventListener("dragover", (event) => {
  event.preventDefault();
  console.log("dragging");
  if (!dropZone.classList.contains("dragged")) {
    dropZone.classList.add("dragged");
  }
});
const host = "http://localhost:3000/";

// const uploadURL = `${process.env.APP_BASE_URL}api/files`;
// const emailURL = `${process.env.APP_BASE_URL}api/files/send`;

const uploadURL = `${host}api/files`;
const emailURL = `${host}api/files/send`;
const passwordURL = `${host}api/files/setPassword`;
//  upload url mein badlav aayega

dropZone.addEventListener("dragleave", (event) => {
  dropZone.classList.remove("dragged");
});
dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragged");
  const files = e.dataTransfer.files;
  //  this `e` contains the file object which I have left
  console.log("zzzzzzzzzzzzzzzzzz", files);
  if (files.length) {
    fileInput.files = files;
    uploaadFiles();
  }
});

fileInput.addEventListener("change", () => {
  console.log("ch");
  uploaadFiles();
});

browseBtn.addEventListener("click", (event) => {
  console.log("got clicked ");
  fileInput.click();
});

const uploaadFiles = () => {
  // it is simply I am sending data via post method

  console.log("--------||||||", fileInput);
  console.log(Array.isArray(fileInput.files));
  if (fileInput.files.length > 1) {
    fileInput.value = "";
    showToast("Only upload 1 file");
    return;
  }
  const file = fileInput.files[0];
  //  fileInput.files = e.dataTransfer.files

  if (file.size > maxAllowedSize) {
    fileInput.value = "";
    //  it is simply an input field
    showToast("Can't upload more than 100mb");
    return;
  }

  progressContainer.style.display = "block";
  console.log("ffff", file);
  const formData = new FormData();
  // it makes a form object and I will upload via post method
  formData.append("myFile", file);
  console.log("FD", formData);
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    console.log(xhr.readyState);
    //  the state not just simply changes, it changes depeding on the value of readyState
    if (xhr.readyState === XMLHttpRequest.DONE) {
      // console.log(xhr.readyState);
      //  showLink is called when the file is completely loaded

      console.log("uploaded", xhr.response);
      showLink(xhr.response);
    }
  };
  console.log("formDaat", file);
  console.log("fo-----", formData);
  // xhr.upload.onprogress = updateProgress;
  // xhr.upload.onprogress = (e) => {
  //   console.log("eeee----", e);
  //   updateProgress(e);
  // };
  // xhr.addEventListener("progress", updateProgress);
  xhr.upload.addEventListener("progress", (e) => {
    console.log("up ch");
    updateProgress(e);
  });

  xhr.upload.onerror = () => {
    fileInput.value = "";
    showToast(`Error in upload ${xhr.statusText}`);
  };
  xhr.open("POST", uploadURL);
  //  the url is open and I will send the data there
  console.log(uploadURL);
  xhr.send(formData);
};
const updateProgress = (e) => {
  // console.log(e);
  const percent = Math.round((e.loaded / e.total) * 100);
  if (percent < 100) {
    console.log("hi");
  }
  // window.alert(percent);
  console.log(percent + "----------------------------" + e);
  // console.log(e);
  bgProgress.style.width = `${percent}%`;
  percentDiv.innerText = percent;
  progressBar.style.transform = `scaleX(${percent / 100})`;

  console.log(progressBar);
};

// showLink -> onUploadSuccess
const showLink = (data) => {
  console.log("LLIINNK", data);
  const content = JSON.parse(data);
  fileInput.value = "";

  emailForm[2].removeAttribute("disabled");
  btnSubmit.style.border = "2px solid green";
  console.log("--", data);
  console.log(content.file);
  fileURL.value = content.file;
  sharingContainer.style.display = "block";
  // progressContainer.style.display = "none";
};

passwordForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("client", password.value);
  const data = {
    password: password.value,
  };
  fetch(passwordURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then(({ msg }) => showToast(msg));
});

emailForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(e);
  console.log(fileURL.value);
  const url = fileURL.value;
  console.log(emailForm.elements["to-email"]);
  const formData = {
    uuid: url.split("/").splice(-1, 1)[0],
    // uuid : url,
    emailTo: emailForm.elements["to-email"].value,
    emailFrom: emailForm.elements["from-email"].value,
    emailPassword: emailForm.elements["set-password"].value,
  };
  console.log("aaaaaa  ", url.split("/").splice(-1, 1)[0]);
  // alert(formData);

  emailForm[2].setAttribute("disabled", "true");
  btnSubmit.style.border = "2px solid #ffcccb";
  console.log("---0", emailForm[2]);
  //  only disable will also do
  // adds an attribute disabled which was set to true
  console.table(formData);
  fetch(emailURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((res) => res.json())
    .then(({ success }) => {
      if (success) {
        showToast("Email Sent");
      }
    });
});
let toastTimer;

const showToast = (msg) => {
  toast.innerText = msg;
  toast.style.transform = "translateY(0)";
  // clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.style.transform = "translateY(60px)";
  }, 2000);
};
