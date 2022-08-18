firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();

firebase.auth.Auth.Persistence.LOCAL;

$("#btn-login").on('click', function () {
  var email = $("#inputEmail").val();
  var password = $("#inputPassword").val();

  if (email != "" && password != "") {

    firebase.auth().signInWithEmailAndPassword(email, password).then(function () {

    })
      .catch(function (error) {
        var errorMessage = error.message;

        console.log(errorMessage);

        $('#infoModal').modal('show');
        infoText.innerHTML = "Error : " + errorMessage;

      });
  } else {
    $('#infoModal').modal('show');
    infoText.innerHTML = "Form is incomplete. Please fill out all fields.";

  }
});

$("#btn-logout").on('click', function () {
  firebase.auth().signOut();
});