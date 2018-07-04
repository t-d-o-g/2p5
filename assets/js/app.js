 // Initialize Firebase
var config = {
    apiKey: "AIzaSyDmVphIEhlwnC3eNLjADizUs_-22rPhFRE",
    authDomain: "p5fb-286d4.firebaseapp.com",
    projectId: "p5fb-286d4",
};
firebase.initializeApp(config);

var userId = null;
var db = firebase.firestore();
var settings = {timestampsInSnapshots: true};
db.settings(settings);


window.onload = function () {

    function addUser(user) {
        var docRefId = null;
        if ($('#uname').val()) {
            docRefId = db.collection('users').add({
                name: user,
                score: 0
            }).then(function(docRef) {
                return docRef.id;
            }).catch(function(error) {
                console.error('Error adding document: ', error);
            });
        } else {
            $('.invalid-feedback').text('Name required');
        }

        if (docRefId) {
            return docRefId;
        }
    }

    function deleteUser(user) {
        db.collection('users').doc(user).delete().then(function() {
            console.log(user + ' successfully deleted');
        }).catch(function(error) {
            console.error('Error removing document: ', error);
        });
    }

    $('#leet-btn').on('click', function () {
        if ($('body').css('font-family') === 'LeetSpeak') {
            $('body').css('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif');
            $('#leet-btn').text('Releet');
        } else {
            $('body').css('font-family', 'LeetSpeak');
            $('#leet-btn').text('Deleet');
        }
    });

    $('#submit-btn').on('click', function (evt) {
        var userName = $('#uname').val();
        userId = addUser(userName);
    })

    $('#delete-btn').on('click', function () {
        userId.then(function(id) {
            deleteUser(id);
        });
    });
 } 