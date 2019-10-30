let height = window.innerHeight;
let mainheight;
$(function () {
    mainheight = $('#overlay_panel').innerHeight();

    // menu
    d3.select('.menu-open').on('change',function(){
        d3.select('.menu').classed('active',$(this).prop('checked'));
    });

    // grid - https://github.com/gridstack/gridstack.js
    var options = {
        width: 3,
        float: true,
        removable: '.trash',
        removeTimeout: 100,
        acceptWidgets: '.grid-stack-item',
        cellHeight: 30,
        verticalMargin: 5,
        height: Math.floor(mainheight/35),
    };

    $('#left_panel').gridstack(options);
    var grid = $('#left_panel').data('gridstack');
    $('#left_panel .griditem').each((i,g)=>{
        grid.addWidget(g, 0, 0, 3, g.getAttribute('offset-height')||2, true);
    });

    // $('.grid-stack').data('gridstack').remove_widget($('#itemId'));

    $('#right_panel').gridstack(_.defaults({
        float: true
    }, options));

    // color panel -- https://www.cssscript.com/color-picker-pro/
    var mirror_light_color = new ColorPicker.TabPalette('#lightControl', {
        color: document.documentElement.style.getPropertyValue('--color-menu'),
        placement: 'left',
        anchor: {
            cssProperty: 'none'
        },
        history: {
            hidden: false, //  shows or hides history block
            colors: [] // ['red', 'green', 'rgba(255, 1, 128, 1)']
        }
        });
    mirror_light_color.on('change', function(color) {
        mainContent.style.setProperty('--light-color',color.hex);
        document.documentElement.style.setProperty('--color-menu',color.hex); // change color of menu
    });

    // $('.colorpicker-theme').on('change', function () {
    //     var val = $(this).val();
    //     var style = '<link id="colorpicker-style" rel="stylesheet" href="' + val + '">';
    //     $('head').append(style);
    // });
});

// // tweet
// let tweets;
// // Your web app's Firebase configuration
// var firebaseConfig = {
//     apiKey: "AIzaSyBIBpnBIQM_QaH9Wl5zxy-iQLoO-I9jW-M",
//     authDomain: "hcidemo.firebaseapp.com",
//     databaseURL: "https://hcidemo.firebaseio.com",
//     projectId: "hcidemo",
//     storageBucket: "hcidemo.appspot.com",
//     messagingSenderId: "203234629216",
//     appId: "1:203234629216:web:26a28d4d1637eb3ba31505",
//     measurementId: "G-TWERPJFVJD"
// };
// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);
//
// // let baseUrl = 'http://localhost:3000/api/'; //Local
// let baseUrl = 'https://hcidemonodejs.herokuapp.com/api/';//Online
// let provider = new firebase.auth.TwitterAuthProvider();
//
// let accessToken = localStorage.getItem("accessToken");
// let secret = localStorage.getItem("secret");
// debugger
// if(!accessToken || !secret){
//     firebase.auth().signInWithPopup(provider).then(function (result) {
//         let accessToken = result.credential.accessToken;
//         let secret = result.credential.secret;
//
//         localStorage.setItem("accessToken", accessToken);
//         localStorage.setItem("secret", secret);
//
//         var user = result.user;
//         alert("Authenticated with twitter " + user.displayName);
//         debugger
//         authenticate(accessToken, secret);
//
//     }).catch(function (error) {
//         console.log(error);
//     });
// }else{
//     authenticate(accessToken, secret);
//
// }
//
//
// function httpGetLocal(url) {
//     let xmlHttp = new XMLHttpRequest();
//     xmlHttp.open("GET", url, false);
//     xmlHttp.send(null);
//     return xmlHttp.responseText;
// }
//
// function authenticate(accessToken, secret) {
//     let url = baseUrl + `authenticate?access_token=${accessToken}&access_token_secret=${secret}`;
//     let authRet = httpGetLocal(url);
//     if (authRet === "ok") {
//         alert("Logged in to node.js successfully!");
//     } else {
//         alert("Couldn't login!");
//     }
// }
//
// function loadTweets() {
//     let url = baseUrl + 'home';
//     tweets = httpGetLocal(url);
//     tweets = JSON.parse(tweets);
//     if(tweets && tweets.data && tweets.data.length>0){
//         //Load image now.
//         tweets.data.forEach(t=>{
//             t.user.profile_image = loadImage(t.user.profile_image_url);
//         });
//     }
// }