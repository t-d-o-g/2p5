 // Initialize Firebase
var config = {
    apiKey: "AIzaSyDmVphIEhlwnC3eNLjADizUs_-22rPhFRE",
    authDomain: "p5fb-286d4.firebaseapp.com",
    databaseURL: "https://p5fb-286d4.firebaseio.com",
    projectId: "p5fb-286d4",
    storageBucket: "p5fb-286d4.appspot.com",
    messagingSenderId: "47868642986"
};
firebase.initializeApp(config);

var fs = firebase.firestore();
var db = firebase.database();
var uid;
var userRef;
var settings = {timestampsInSnapshots: true};
fs.settings(settings);

window.onload = function() {
    firebase.auth().signInAnonymously().catch(function(error) {
        console.error(error.code + ': ' + error.message);
    });

    firebase.auth().onAuthStateChanged(function(user) {
        var user = firebase.auth().currentUser;

        if (user) {
            // User is signed in.
            uid = user.uid;
            userRef = fs.collection('users').doc(uid);
            console.log(uid);
            userRef.get().then(function(doc) {
                if (doc.exists) {
                    console.log('existing user');
                    $('.game').show();
                    playGame();
                } else {
                    $('.login').show();
                    console.log('new user');
                }
            });
        } else {
            // User is signed out.
            console.log('User is signed out');
        }
    });

    function addUser(user) {
        fs.collection('users').doc(uid).set({
            connected: true,
            available: true,
            name: user,
            score: 0,
        }).then(function() {
            console.log('Document Successfully Written');
        }).catch(function(error) {
            console.error('Error adding document: ', error);
        });
    }

    function deleteUser(user) {
        fs.collection('users').doc(user).delete().then(function() {
            console.log(user + ' successfully deleted');
        }).catch(function(error) {
            console.error('Error removing document: ', error);
        });
    }

    function updatePresence(user, isConnected) {
        var userRef = fs.collection("users").doc(user);
        
        return userRef.update({
            connected: isConnected
        }).then(function() {
            console.log(user + ' successfully updated');
        }).catch(function (error) {
            console.error('Error updating document: ', error);
        });
    }

    function playGame() {
        console.log('play game');
        $('.login').hide();
        $('.game').show();
        listOpponents();
    }

    function logout() {
        $('.login').show();
        $('.game').hide();
    }

    function listOpponents() {
        var opponentEl = '';
        var counter = 0;
        fs.collection('users').get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                opponentEl = '<li class="opponent-' + counter + '"><a href="#">' + doc.data().name + '</a></li>';
                if (doc.id !== uid && doc.data().available) {
                    $('#opponent').append(opponentEl);
                    counter++;
                }
            });
        });
    }

    $('#leet-btn').on('click', function(e) {
        if ($('body').css('font-family') === 'LeetSpeak') {
            $('body').css('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif');
            $('#leet-btn').text('Leet');
        } else {
            $('body').css('font-family', 'LeetSpeak');
            $('#leet-btn').text('Deleet');
        }
    });

    $('#login-btn').on('click', function(e) {
        var userName = $('#uname').val();
        if (userName) {
            addUser(userName);
            playGame();
        } else {
            $('.invalid-feedback').text('Name required');
        }
    })

    $('#logout-btn').on('click', function(e) {
        deleteUser(uid);
        logout();
    })
 };