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

const uploadURL = `${host}api/filters`;
const emailURL = `${host}api/files`;

dropZone.addEventListener("dragleave", (event) => {
  dropZone.classList.remove("dragged");
});
dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragged");
  const files = e.dataTransfer.files;
  console.log(files);
  if (files.length) {
    fileInput.files = files;
    uploaadFiles();
  }
});

fileInput.addEventListener("change", () => {
  uploaadFiles();
});

browseBtn.addEventListener("click", (event) => {
  console.log("got clicked ");
  fileInput.click();
});

const uploaadFiles = () => {
  // it is simply I am sending data via post method
  if (fileInput.files.length > 1) {
    fileInput.value = "";
    showToast("Only upload 1 file");
    return;
  }
  const file = fileInput.files[0];

  if (file.size > maxAllowedSize) {
    fileInput.value = "";
    showToast("Can't upload more than 100mb");
    return;
  }

  progressContainer.style.display = "block";

  console.log("ffff", fileInput.files);

  const formData = new FormData();
  formData.append("myfile", file);
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    console.log(xhr.readyState);
    if (xhr.readyState === XMLHttpRequest.DONE) {
      // console.log(xhr.readyState);
      //  showLink is called when the file is completely loaded

      console.log("uploaded", xhr.response);
      showLink(xhr.response);
    }
  };
  console.log("formDaat", file);
  xhr.upload.onprogress = updateProgress;
  xhr.upload.onerror = () => {
    fileInput.value = "";
    showToast(`Error in upload ${xhr.statusText}`);
  };
  xhr.open("POST", uploadURL);
  xhr.send(formData);
};
const updateProgress = (e) => {
  const percent = Math.round(e.loaded / e.total) * 100;
  console.log(percent);
  console.log(e);
  bgProgress.style.width = `${percent}%`;
  percentDiv.innerText = percent;
  progressBar.style.transform = `scaleX(${percent / 100})`;
  console.log(progressBar);
};

// showLink -> onUploadSuccess
const showLink = (data) => {
  const content = JSON.parse(data);
  fileInput.value = "";

  emailForm[2].removeAttribute("disabled");
  btnSubmit.style.border = "2px solid green";
  console.log("--", data);
  console.log(content.file);
  fileURL.value = content.file;
  sharingContainer.style.display = "block";
  progressContainer.style.display = "none";
};

emailForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(e);
  console.log(fileURL.value);
  const url = fileURL.value;
  console.log(emailForm.elements["to-email"]);
  const formData = {
    uuid: url.split("/").splice(-1, 1)[0],
    emailTo: emailForm.elements["to-email"].value,
    emailFrom: emailForm.elements["from-email"].value,
  };

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
      // if (success) {
      showToast("Email Sent");
      // }
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
