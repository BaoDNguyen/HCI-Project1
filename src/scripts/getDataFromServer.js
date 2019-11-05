// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBIBpnBIQM_QaH9Wl5zxy-iQLoO-I9jW-M",
    authDomain: "hcidemo.firebaseapp.com",
    databaseURL: "https://hcidemo.firebaseio.com",
    projectId: "hcidemo",
    storageBucket: "hcidemo.appspot.com",
    messagingSenderId: "203234629216",
    appId: "1:203234629216:web:26a28d4d1637eb3ba31505",
    measurementId: "G-TWERPJFVJD"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// let baseUrl = 'http://localhost:3000/api/'; //Local
let baseUrl = 'https://hcidemonodejs.herokuapp.com/api/';//Online
let provider = new firebase.auth.TwitterAuthProvider();

let accessToken = localStorage.getItem("accessToken");
let secret = localStorage.getItem("secret");
if(!accessToken || !secret){
    firebase.auth().signInWithPopup(provider).then(function (result) {
        let accessToken = result.credential.accessToken;
        let secret = result.credential.secret;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("secret", secret);

        var user = result.user;
        alert("Authenticated with twitter " + user.displayName);
        debugger
        authenticate(accessToken, secret);

    }).catch(function (error) {
        console.log(error);
    });
}else{
    authenticate(accessToken, secret);

}

function httpGetLocal(url) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

function authenticate(accessToken, secret) {
    let url = baseUrl + `authenticate?access_token=${accessToken}&access_token_secret=${secret}`;
    let authRet = httpGetLocal(url);
    if (authRet === "ok") {
        alert("Logged in to node.js successfully!");
    } else {
        alert("Couldn't login!");
    }
}

function loadTweets() {
    let url = baseUrl + 'home';
    tweets = httpGetLocal(url);
    tweets = JSON.parse(tweets);
    if(tweets && tweets.data && tweets.data.length>0){
        //Load image now.
        tweets.data.forEach(t=>{
            t.user.profile_image = loadImage(t.user.profile_image_url);
        });
    }
    return tweets;
}
function loadHealths(callback) {
    var userId = firebase.auth().currentUser.uid;
    return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
        healths = JSON.parse(snapshot.val().data);
        console.log(healths);
        callback(healths);
    });
}