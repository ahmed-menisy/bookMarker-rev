"use strict";
// ----------------- Start Global
var documentHtml = document,
   siteName = documentHtml.getElementById("siteName"),
   siteUrl = documentHtml.getElementById("siteUrl"),
   btnAdd = documentHtml.getElementById("btnAdd"),
   btnUpdate = documentHtml.getElementById("btnUpdate"),
   searchInput = documentHtml.getElementById("searchBook"),
   alertName = documentHtml.getElementById("alertName"),
   alertUrl = documentHtml.getElementById("alertUrl"),
   alertExite = documentHtml.getElementById("alertExite"),
   booksContainer = [],
   indexUpdate = 0,
   validSucess = false;

// ----------------- When  Start

if (getLocal() !== null) {
   booksContainer = getLocal();
   displayData();
}

// ----------------- Start Events
btnAdd.onclick = function () {
   addBookMark();
};

btnUpdate.onclick = function () {
   updateBook();
};

documentHtml.forms[0].addEventListener("submit", (e) => e.preventDefault());

documentHtml.getElementById("deleteAll").addEventListener("click", function () {
   Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete All!",
   }).then((result) => {
      if (result.isConfirmed) {
         booksContainer.splice(0);
         displayData();
         setLocal();
         Swal.fire("Deleted!", "Your files has been deleted.", "success");
      }
   });
});

searchInput.oninput = function () {
   searchBook(this.value);
};

// ----------------- Start Function
function addBookMark() {
   if (validSucess) {
      var book = {
         name: siteName.value,
         url: siteUrl.value,
      };
      booksContainer.push(book);
      setLocal();
      displayData();
      resetForm();

      Swal.fire({
         position: "top-end",
         icon: "success",
         title: "successfully added bookmark ",
         showConfirmButton: false,
         timer: 1500,
      });
   }
}

function deleteBookMark(index) {
   Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
   }).then((result) => {
      if (result.isConfirmed) {
         booksContainer.splice(index, 1);
         displayData();
         setLocal();
         Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
   });
}

function setUpdateInfo(index) {
   indexUpdate = index;
   siteName.value = booksContainer[index].name;
   siteUrl.value = booksContainer[index].url;
   btnAdd.classList.add("d-none");
   btnUpdate.classList.remove("d-none");
}

function updateBook() {
   if (validSucess) {
      var book = {
         name: siteName.value,
         url: siteUrl.value,
      };
      booksContainer.splice(indexUpdate, 1, book);
      displayData();
      setLocal();
      resetForm();
      btnAdd.classList.remove("d-none");
      btnUpdate.classList.add("d-none");
      Swal.fire({
         position: "top-end",
         icon: "success",
         title: "successfully Updated bookmark ",
         showConfirmButton: false,
         timer: 1500,
      });
   }
}

function searchBook() {
   displayData();
}

function displayData() {
   var tableBody = "";
   var term = searchInput.value.toLowerCase();

   for (var i = 0; i < booksContainer.length; i++) {
      if (booksContainer[i].name.toLowerCase().includes(term)) {
         tableBody += `
         <tr>
         <td scope="row">${booksContainer[i].name.toLowerCase().replaceAll(term, `<span class="text-bg-info">${term}</span>`)}</td>
         <td>
            <p class="small text-truncate" style="max-width: 300px">
              ${booksContainer[i].url}
            </p>
         </td>
         <td>
            <div class="hstack justify-content-center gap-2">
               <a href="${booksContainer[i].url}" target="_blank" class="btn btn-outline-dark">
                  <i class="fa-regular fa-eye"></i>
               </a>
   
               <button class="btn btn-outline-warning" onclick="setUpdateInfo(${i})">
                  <i class="fa-regular fa-pen-to-square"></i>
               </button>
   
               <button class="btn btn-outline-danger" onclick="deleteBookMark(${i})">
                  <i class="fa-solid fa-trash"></i>
               </button>
            </div>
         </td>
      </tr>
         `;
      }
   }

   documentHtml.getElementById("tableBody").innerHTML = tableBody;
}

function resetForm() {
   siteName.value = "";
   siteUrl.value = "";
}

function setLocal() {
   localStorage.setItem("booksData", JSON.stringify(booksContainer));
}

function getLocal() {
   return JSON.parse(localStorage.getItem("booksData"));
}

// ----------------- Start Validation

var validation = {
   nameStyle:
      /^(?:[a-zA-Z0-9\s@,=%$#&_\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDCF\uFDF0-\uFDFF\uFE70-\uFEFF]|(?:\uD802[\uDE60-\uDE9F]|\uD83B[\uDE00-\uDEFF])){2,20}$/,
   urlStyle: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
   validationTest: function (styleValidation, input, msg) {
      if (styleValidation.test(input.value)) {
         input.nextElementSibling.classList.add("d-none");
         return true;
      } else {
         input.nextElementSibling.classList.remove("d-none");
         input.nextElementSibling.innerHTML = msg;
         return false;
      }
   },
};

["input", "mousedown"].forEach((item) => {
   documentHtml.forms[0].addEventListener(item, function (e) {
      const validationName = validation.validationTest(
         validation.nameStyle,
         siteName,
         "invalid pattern you should  insert 2 to 20 characters "
      );
      const validationUrl = validation.validationTest(validation.urlStyle, siteUrl, "invalid pattern you should  insert valid url");

      validationName && validationUrl ? (validSucess = true) : (validSucess = false);
   });
});
