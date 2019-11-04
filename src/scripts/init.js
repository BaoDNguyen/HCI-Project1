let height = window.innerHeight;
let mainheight;
let mainSetting = {
    calendar: {isSignin: false}
};
$(function () {
    mainheight = $('#overlay_panel').innerHeight();
    $(".draggable").draggable({snap: true, handle: '.dragIcon', stack: ".draggable"});
    // menu
    d3.select('.menu-open').on('change', function () {
        d3.select('.menu').classed('active', $(this).prop('checked'));
    });

    // healthBtn
    d3.select('#healthBtn').on('click', function () {
        let isactive = d3.select(this).classed('disable');
        if (isactive) {
            activemenu(d3.select('#healthHolder'));
            loadHealths();
        }else{
            disablemenu(d3.select('#healthHolder'));
        }
        d3.select(this).classed('disable',!isactive)
    });

    //twitterBtn
    d3.select('#twitterBtn').on('click', function () {
        let isactive = d3.select(this).classed('disable');
        if (isactive) {
            activemenu(d3.select('#twitterHolder'));
            let tweets = loadTweets();

            let tweetsUl = d3.select("#twitterPanel").select('ul');
            if (tweetsUl.empty())
                tweetsUl = d3.select("#twitterPanel").append("ul")
                    .attr("class", "collection");

            let tweetLi = tweetsUl
                .selectAll("li")
                .data(tweets.data,d=>d.created_at);
            tweetLi.exit().remove();
            let tweetLi_n = tweetLi
                .enter()
                .append("li")
                .attr("class", "collection-item avatar");

            tweetLi_n.append("img")
                .attr("class", "circle");

            tweetLi_n.append("span")
                .attr("class", "title");

            tweetLi_n.append("p")
                .attr("class", "timedisplay");

            tweetLi_n.append("p")
                .attr("class", "abstract truncate");
            tweetLi = tweetsUl
                .selectAll("li");
            tweetLi.select('img').attr("src", d => d.user.profile_image_url);
            tweetLi.select('span.title').text(d => d.user.name);
            tweetLi.select('p.timedisplay').text(d => moment(new Date(d.created_at)).fromNow());
            tweetLi.select('p.abstract').text(d => d.text);
        }else{
            disablemenu(d3.select('#twitterHolder'));
        }
        d3.select(this).classed('disable',!isactive);
    });

    // musicBtn
    d3.select('#musicBtn').on('click', function () {
        let isactive = d3.select('#musicBtn').classed('disable');
        d3.select('#musicBtn').classed('disable', !isactive);
        if (isactive){
            activemenu(d3.select('#musicHolder'));
        }else{
            disablemenu(d3.select('#musicHolder'));
        }
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
        height: Math.floor(mainheight / 35),
    };

    $('#left_panel').gridstack(options);
    var gridl = $('#left_panel').data('gridstack');
    $('#left_panel .griditem').each((i, g) => {
        gridl.addWidget(g, 0, 0, 3, g.getAttribute('offset-height') || 2, true);
    });


    $('#right_panel').gridstack(_.defaults({
        float: true
    }, options));
    var gridr = $('#right_panel').data('gridstack');
    $('#right_panel .griditem').each((i, g) => {
        gridr.addWidget(g, 0, 0, 3, g.getAttribute('offset-height') || 2, true);
    });

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
    mirror_light_color.on('change', function (color) {
        mainContent.style.setProperty('--light-color', color.hex);
        document.documentElement.style.setProperty('--color-menu', color.hex); // change color of menu
    });

    function activemenu(path){
        return path.style('left','50%')
            .style('top','100%')
            .classed('disable',false)
            .transition().ease(d3.easeQuad)
            .style('top','50%');
    }

    function disablemenu(path){
        return path.transition().ease(d3.easeQuad)
            .style('top','100%')
            .style('top','50%')
            .on('end',function () {
                d3.select(this).classed('disable',true);
            })

    }

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
