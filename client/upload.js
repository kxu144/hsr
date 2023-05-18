var reader = new FileReader();
reader.onload = function(event) {
  // Get the array buffer containing the file data
  var arrayBuffer = event.target.result;

  // Create a Uint8Array from the array buffer
  var uint8Array = new Uint8Array(arrayBuffer);

  // Create a Blob from the Uint8Array
  var blob = new Blob([uint8Array]);

  // Create a FormData object to send the file as multipart/form-data
  var formData = new FormData();
  formData.append("file", blob, file.name);

  // Make the HTTP request
  fetch("https://hsr.onrender.com/upload", {
    method: "POST",
    body: formData
  })
    .then(response => response.text())
    .then(data => {
      console.log("Response:", data);
    })
    .catch(error => {
      console.error("Error:", error);
    });
};

$(document).ready(function() {
    // Handle the form submission
    $("#upload-form").submit(function(event) {
      event.preventDefault();

      // Get the selected image file
      var file = $("#image-input")[0].files[0];
      
      
    });
});
  