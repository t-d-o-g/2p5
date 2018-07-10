/*
Functionality that still needs to be implemented:

- Need to implement game logic 
- Need to implement messaging
*/

// init Firebase db
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
var score = 0;
var settings = {timestampsInSnapshots: true};
fs.settings(settings);

window.onload = function() {
    firebase.auth().signInAnonymously().catch(function(error) {
        console.error(error.code + ': ' + error.message);
    });

    firebase.auth().onAuthStateChanged(function(user) {
        user = firebase.auth().currentUser;

        if (user) {
            // User is signed in.
            uid = user.uid;
            var userRef = fs.collection('users').doc(uid);
            userRef.get().then(function(doc) {
                if (doc.exists) {
                    console.log('existing user');
                    // Continue game on refresh
                    login();

                } else {
                    console.log('new user');
                }
            });
        } else {
            // User is signed out.
            console.log('User is signed out');
        }

    });

    // Update opponent list in real time with user collection snapshot
    fs.collection('users')
        .onSnapshot(function(snapshot) {
            listOpponents();
    }, function(err) {
        console.log('Encountered error ', err);
    });

    // Challenge/Accept interaction preceding Game (Needs Refactoring) 
    fs.collection('users').onSnapshot(function(snapshot) {
        snapshot.docChanges().forEach(function(change) {
            var userRef = fs.collection('users').doc(change.doc.id);
            if (change.type === "modified" && change.doc.id === uid) {
                // Need to hide opponent/user name in opponent list when challenge initiated
                userRef.get().then(function(usr) {
                    var oppRef = fs.collection('users').doc(usr.data().opponent);
                    oppRef.get().then(function(opp) {
                        // if (opp.data().opponent !== null) {
                        if (opp.data().opponent !== null) {
                            oppRef.update({
                                available: false, 
                            }).then(function() {
                                console.log(opp.id + ' successfully updated');
                            }).catch(function (error) {
                                console.error('Error updating document: ', error);
                            });
                            playGame(uid, opp.id);
                        } else {
                            $('#game-heading').text('You have been challenged by ' + opp.data().name);
                            var playBtn = '<div><button class="btn btn-primary" id="play-btn">Play</button></div>';
                            $('#game-heading').append(playBtn);

                            // Need to implement decline button

                            $('.game').on('click', '#play-btn', function(e) {

                                oppRef.update({
                                    // opponent: opp.id, 
                                    opponent: usr.id, 
                                }).then(function() {
                                    console.log(opp.id + ' successfully updated');
                                }).catch(function (error) {
                                    console.error('Error updating document: ', error);
                                });

                                userRef.update({
                                    available: false, 
                                }).then(function() {
                                    console.log(opp.id + ' successfully updated');
                                }).catch(function (error) {
                                    console.error('Error updating document: ', error);
                                });
                                $('#play-btn').hide();
                                $('#opponents').hide();
                            });
                        }
                    });
                });
            }
        });
    });

    function addUser(user) {
        fs.collection('users').doc(uid).set({
            available: true,
            connected: true,
            losses: 0,
            message: "Play Game!",
            name: user,
            opponent: null,
            wins: 0
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


    function login() {
        $('#game-heading').text('Select your opponent');
        $('#uname').hide();
        $('#opponents').show();
        $('#score').show();
        $('#submit-btn').text('Logout');
    }

    function logout() {
        $('#game-heading').text('Enter Name to Play');
        $('#uname').show();
        $('#opponents').hide();
        $('#submit-btn').text('Login');
    }

    function playGame(userId, oppId) {
        $('#opponents').hide();
        // Heading should display user message
        var userRef = fs.collection('users').doc(userId);
        var oppRef = fs.collection('users').doc(oppId);

        // opponent gets to go first
        // Implement game logic
        $('#img-rock').on('click')

        userRef.get().then(function(usr) {
            oppRef.get().then(function(opp) {
                // $('#game-heading').text(opp.data().name + "'s Turn");
                $('#game-heading').text("Play Game!");
                console.log('User ', usr.data());
                console.log('Opponent ', opp.data());
            });
        });
    }

    function listOpponents() {
        $('#opponents').empty();
        var opponentBtn = '';
        fs.collection('users').get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                if (doc.id !== uid && doc.data().available) {
                    opponentBtn = '<button class="btn btn-dark" id="opponent-id-' + doc.id + '">' + doc.data().name + '</button>';
                    $('#opponents').append(opponentBtn);
                }
            });
        });
    }

    function challengeOpponent(opponentId) {
        var userRef = fs.collection('users').doc(opponentId);
        userRef.update({
            opponent: uid
        }).then(function() {
            console.log('Document Successfully Updated');
        }).catch(function(error) {
            console.error('Error updating document: ', error);
        }); 
    }

    // Need to implement function to hide user when not connnected
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

    // Feture to translate user messages to leet font. Will be added after messaging is implemented
    $('#leet-btn').on('click', function(e) {
        if ($('body').css('font-family') === 'LeetSpeak') {
            $('body').css('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif');
            $('#leet-btn').text('LEET');
        } else {
            $('body').css('font-family', 'LeetSpeak');
            $('#leet-btn').text('Deleet');
        }
    });

    $('#submit-btn').on('click', function(e) {
        var userName = $('#uname input').val();
        var $this = $(this);

        if ($this.text() === 'Login') {
            if (userName) {
                addUser(userName);
                login();
            } else {
                $('.invalid-feedback').text('Name required');
            }
        } else {
            deleteUser(uid);
            logout();
        }
    });
    
    $('#opponents').on('click', '[id^="opponent-id-"]', function(e) {
        $this = $(this);
        $('#game-heading').text('Waiting for ' + $this.text() + ' to accept...');
        var id = $this.attr('id').split('opponent-id-')[1];
        challengeOpponent(id);
        // Add 30 second timer here
    })
 };