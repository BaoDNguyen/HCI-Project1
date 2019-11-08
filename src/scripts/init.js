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
            $('#right_panel').data('gridstack').addWidget($("<div class=\"griditem\" offset-height =\"3\" id=\"heathHolder\">\n" +
                "                            <div class=\"grid-stack-item-content\">\n" +
                "                                <i class=\"material-icons tiny dragIcon\">pan_tool</i>\n" +
                "                                <div id=\"healthPanel\">\n" +
                "                                    <div id=\"healthGraph\" class=\"col s12\">\n" +
                "                                    </div>\n" +
                "                                    <div class=\"col s12\">\n" +
                "                                        <div class=\"col s3\">\n" +
                "                                            <div class=\"healthIcon valign-wrapper center-align\" id=\"activityH\">\n" +
                "                                                <i class=\"fa fa-bed\"></i>\n" +
                "                                                <div style=\"margin-left: 5px\">\n" +
                "                                                    <span class=\"row value\">8</span>\n" +
                "                                                    <span class=\"row unit\">hours</span>\n" +
                "                                                </div>\n" +
                "                                            </div>\n" +
                "                                        </div>\n" +
                "                                        <div class=\"col s3\">\n" +
                "                                            <div class=\"healthIcon valign-wrapper center-align\" id=\"weightH\">\n" +
                "                                                <i class=\"fas fa-weight\"></i>\n" +
                "                                                <div style=\"margin-left: 5px\">\n" +
                "                                                    <span class=\"row value\">8</span>\n" +
                "                                                    <span class=\"row unit\">hours</span>\n" +
                "                                                </div>\n" +
                "                                            </div>\n" +
                "                                        </div>\n" +
                "                                        <div class=\"col s3\">\n" +
                "                                            <div class=\"healthIcon valign-wrapper center-align\" id=\"distanceH\">\n" +
                "                                                <i class=\"material-icons\">directions_run</i>\n" +
                "                                                <div style=\"margin-left: 5px\">\n" +
                "                                                    <span class=\"row value\">8</span>\n" +
                "                                                    <span class=\"row unit\">hours</span>\n" +
                "                                                </div>\n" +
                "                                            </div>\n" +
                "                                        </div>\n" +
                "                                        <div class=\"col s3\">\n" +
                "                                            <div class=\"healthIcon valign-wrapper center-align\" id=\"heart_rateH\">\n" +
                "                                                <i class=\"fa fa-heartbeat\"></i>\n" +
                "                                                <div style=\"margin-left: 5px\">\n" +
                "                                                    <span class=\"row value\">8</span>\n" +
                "                                                    <span class=\"row unit\">hours</span>\n" +
                "                                                </div>\n" +
                "                                            </div>\n" +
                "                                        </div>\n" +
                "                                    </div>\n" +
                "                                </div>\n" +
                "                            </div>\n" +
                "                        </div>"), 0, 0, 3, 5, false);
            activemenu(d3.select('#healthHolder'));
            loadHealths(function(data){
                // bed
                let bed_data = data.activity;
                bed_data.forEach(d=>d.value= (new Date(d.endDate) - new Date(d.startDate))/3600000);
                let bed_data_last = bed_data[bed_data.length-1];
                d3.select('#activityH .value').text(((new Date(bed_data_last.endDate) - new Date(bed_data_last.startDate))/3600000).toFixed(1));
                // weight
                let weight_data = data.weight;
                let weight_data_last = weight_data[weight_data.length-1];
                d3.select('#weightH .value').text(weight_data_last.value.toFixed(1));
                d3.select('#weightH .unit').text(weight_data_last.unit);
                // weight
                let distance_data = data.distance;
                let distance_data_last = distance_data[weight_data.length-1];
                d3.select('#distanceH .value').text(Math.round(distance_data_last.value/1000));
                d3.select('#distanceH .unit').text('km');
                // weight
                let heart_rate_data = data.distance;
                let heart_rate_data_last = distance_data[heart_rate_data.length-1];
                d3.select('#heart_rateH .value').text(Math.round(heart_rate_data_last.value));
                d3.select('#heart_rateH .unit').text('bpm');
                // chart
                d3.selectAll('.healthIcon').each(function(){d3.select(this).datum(d3.select(this).attr('id').replace('H',''))})
                    .on('click',function(d){
                    update(d);
                });
                let svg = d3.select('#healthGraph').append('svg').attr('height','100px').attr('width','100%');
                let g = svg.append('g').attr('transform','translate(0,0)').style('fill','white');
                let key = 'distance';
                update(key);

                function update(key) {
                    d3.select(`#healthPanel`).select('.active').classed('active',false);
                    d3.select(`#${key}H`).classed('active',true);
                    let barwidth = 100 / data[key].length * 0.9;
                    let yscale = d3.scaleLinear().domain(d3.extent(data[key], d => d.value).map((d,i)=>i?d*1.1:d*0.9)).range([70, 10]);
                    let xscale = d3.scaleTime().domain(d3.extent(data[key], d => new Date(d.startDate)))
                        .range([barwidth / 2, 100 - barwidth / 2]);
                    let bars = g.selectAll('.bar').data(data[key]);
                    bars.exit().remove();
                    bars.enter().append('rect').attr('class', 'bar');
                    let line = g.select('line');
                    if(line.empty())
                        line = g.append('line').attr('class','line');
                    let meanv = d3.mean(data[key],d=>d.value);
                    line.datum({x1:new Date (data[key][0].startDate),y:meanv,x2:new Date (data[key][data[key].length-1].startDate)})
                        .attr('x1',d=>xscale(d.x1)+'%')
                        .attr('x2',d=>xscale(d.x2)+'%')
                        .attr('y1',d=>yscale(d.y))
                        .attr('y2',d=>yscale(d.y))
                        .style('stroke','white')
                        .style('stroke-width','1')
                        .style('stroke-dasharray','2')
                    ;
                    g.selectAll('.bar').attr('y', 70)
                        .attr('x', d => xscale(new Date(d.startDate)) + '%')
                        .attr('rx',5)
                        .attr('transform',`translate(${-barwidth/2},0)`)
                        .attr('width', barwidth)
                        .attr('height', 0).transition()
                        .attr('y', d => yscale(d.value))
                        .attr('height', d => 70 - yscale(d.value));
                    let label = g.selectAll(".label")
                        .data(data[key]);
                    label.exit().remove();
                    label
                        .enter()
                        .append("text")
                        .attr("class", "label");
                    g.selectAll(".label")
                        .style("display", d => {
                            return d.value === null ? "none" : null;
                        })
                        .style("text-anchor", 'middle')
                        .attr("x", (d => {
                            return xscale(new Date(d.startDate)) + '%';
                        }))
                        .attr("y", d => {
                            return 70;
                        })
                        .attr("height", 0)
                        .transition()
                        .text(d => d3.format('.1s')(d.value))
                        .attr("y", d => {
                            return yscale(d.value) + .1;
                        })
                        .attr("dy", "-.7em");
                    let ticks = g.selectAll(".ticks")
                        .data(data[key]);
                    ticks.exit().remove();
                    ticks.enter()
                        .append("text")
                        .attr("class", "ticks")
                        .style("text-anchor", 'middle');

                    g.selectAll(".ticks")
                        .attr("x", (d => {
                            return xscale(new Date(d.startDate)) + '% ';
                        }))
                        .attr("y", d => {
                            return 70;
                        })
                        .text(d=>d3.timeFormat('%a')(new Date(d.startDate)))
                        .attr("dy", "1.7em");
                }

            });
        }else{
            disablemenu(d3.select('#healthHolder'));
            $('.grid-stack').data('gridstack').removeWidget($('#heathHolder'));
        }
        d3.select(this).classed('disable',!isactive)
    });

    // youtube btn
    d3.select('#youtubeBtn').on('click', function () {
        let isactive = d3.select('#youtubeBtn').classed('disable');
        d3.select('#youtubeBtn').classed('disable', !isactive);
        if (isactive){
            activemenu(d3.select('#youtubeHolder'));
        }else{
            disablemenu(d3.select('#youtubeHolder'));
        }
    });

    youtubeiframe.src = "https://www.youtube.com/embed/AZlAoH8nqIk"

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
            musicPanel.contentWindow.postMessage('play', '*');
        }else{
            musicPanel.contentWindow.postMessage('pause', '*');
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
