 // Initialize Firebase
 var config = {
    apiKey: "AIzaSyAdx3teMsjtztrd75depLQ7QbINfghqqO4",
    authDomain: "rock-paper-scissors-dd84c.firebaseapp.com",
    databaseURL: "https://rock-paper-scissors-dd84c.firebaseio.com",
    projectId: "rock-paper-scissors-dd84c",
    storageBucket: "rock-paper-scissors-dd84c.appspot.com",
    messagingSenderId: "479130740291"
  };
  firebase.initializeApp(config);

 window.onload = function () {

     $('#submit-btn').on('click', function (evt) {
         if ($('#uname').val()) {
            var username = $('#uname').val();
             console.log(username);
         } else {
             $('.invalid-feedback').text("Name required");
         }
     })
 } 