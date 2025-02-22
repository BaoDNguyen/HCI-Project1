let capture;

//My variables for weather and newsfeed (Bao)
var Bweather;
var img0={};
var Bnews;
var Btime;
let speechRec;
let speech;
let first;
// timer for news
let newsfeed_opt = {
    numberfeed : 10, // number of news feed is ran over time
    timefeed : 10000,  // time for displaying each news feed in frames
    num:0
};
let timer_NewsFeed;

//Variables for speech controls - Bao
let hello = false;
let bot;
let user_input;
let output;
let speechdic = {music_on:["Let me play some songs",
    "I will play some songs on the internet",
    "Let me choose a song from your favorite list"],
    music_change:["Well, I thought you love this song, what's about this one?"
    ,"Okay, let try this song."],
    music_off: ["Got it."],
    news_on: ["Of course. Take your time."],
    light_off: ["Okay, human."],
    health_on: ["You walk a lot this week.",
    "You slept well last night."],
    video_on: ["Okay, let search on Youtube."],
    twitter_on: ["Let read some tweets."],
    time_query: ["It is around "],
    weather_on: ["Today is "],
    light_color: ["This might make you warm",
        "This color is cool",
        "I feel creative today",
        "I know you love this color"],
};

function setup() {
    let canvas = createCanvas(1400, 750);
    canvas.parent('mirrorimage');
    capture = createCapture(VIDEO);
    capture.size(1400, 750);
    capture.hide();

    // Update data every 1 minute - Ngan
    askData();
    setInterval(askData,60000);

    // Update news every 1sec
    timer_NewsFeed = setTimer_NewsFeed();

    // My setup for speech - Bao
    let lang = 'en-US';
    speechRec = new p5.SpeechRec(lang,mygetSpeech);
    let cont = true;
    let interim = false;
    speechRec.start(cont,interim);
    speech = new p5.Speech();
    speechRec.rec.onaudioend=function(d){
        speech.speak(random(['I am here','I am waiting for your request',"Don't let me wait too long"]));
        setTimeout(function(){speechRec.start()},500);
    };
    // speech bot
    bot = new RiveScript();
    var files = ["src/scripts/brain.rive"];
    bot.loadFile(files).then(brainReady).catch(brainError);
    // The bot is ready
    function brainReady() {
        console.log("Bot loaded");
        bot.sortReplies();
    }
    // There was a problem
    function brainError(error) {
        console.log("Error when loading rivescript files: " + error);
    }

    user_input = select('#user_input');
    output = select('#output');


}
// timer (Ngan)
function askData(){
    loadJSON('http://worldtimeapi.org/api/timezone/America/Eirunepe',gettime);
    loadJSON('http://api.openweathermap.org/data/2.5/weather?zip=79415,us&APPID=3f2b39ee96bea5d53296ae364ac222de&units=metric',getcurrentweather);
    loadJSON('https://api.nytimes.com/svc/news/v3/content/all/all.json?api-key=w81Gz2Upt9zcVNAmxxcxruEUpkkK8REN',getnews);
    loadJSON('https://api.openweathermap.org/data/2.5/forecast?q=Lubbock,us&APPID=3f2b39ee96bea5d53296ae364ac222de&units=metric',getweather);
}

function setTimer_NewsFeed(){
    if (timer_NewsFeed)
        clearInterval(timer_NewsFeed);
    updateNewsFeed();
    return setInterval(updateNewsFeed,newsfeed_opt.timefeed)
}
function updateNewsFeed(){
    // only display 10 top news
    if(Bnews){
        const bln = newsfeed_opt.num;
        const current_item = Bnews.results[bln];
        newsSource.textContent = current_item.source;  //NY times
        newsTime.textContent = moment(new Date(current_item.published_date)).fromNow();  // date
        newsTitle.textContent = current_item.title;   // title
        newsfeed_opt.num = (newsfeed_opt.num+1)%newsfeed_opt.numberfeed;
        newsthumb.setAttribute('src',current_item.thumbnail_standard||""); // thumbnail
    }
}
// weather function (Bao)
function getweather(data0) {
    Bweather = data0;
    console.log(Bweather);
    Bweather.list.forEach(list=>{
        const icon = list.weather[0].icon;
        if (!img0[icon])
            img0[icon] = loadImage('https://openweathermap.org/img/wn/'+icon+'.png');
    });
    console.log(Bweather);
}

// weather function (Bao)
function getcurrentweather(data) {
    // const icon = data.weather[0].icon;
    // if (!img0[icon])
    //     img0[icon] = loadImage('https://openweathermap.org/img/wn/'+icon+'.png');
    // wi-owm-night-${data.weather[0].id}
    // weatherIcon.setAttribute('src','https://openweathermap.org/img/wn/'+icon+'.png');
    //----- Nice weather icon https://erikflowers.github.io/weather-icons/
    weatherIcon.setAttribute('class',`wi wi-owm-night-${data.weather[0].id}`);
    weatherTemperature.textContent = Math.round(data.main.temp);
}

// news feed function (Bao)
function getnews(data1){
    Bnews = data1;
    updateNewsFeed()
}

// time function (Bao)
function gettime(data2){
    Btime = data2;
    // Ngan's time update
    currentDate.textContent = d3.timeFormat('%a, %b %d, %Y')(new Date(Btime.utc_datetime));
    currentTime.textContent = d3.timeFormat('%H:%M')(new Date(Btime.utc_datetime));
}

//speech function (Bao)
function mygetSpeech() {
    if (speechRec.resultValue){
        // M.toast({html:speechRec.resultString});
        bot.reply("local-user",speechRec.resultString).then(r=>{
            console.log(r);
            if (speechdic[r]){
                switch (r){
                    case "time_query" :
                        r = speechdic[r]+moment(Btime.utc_datetime).format('h:mm:ss a');
                        console.log(r);
                        break;
                    case "weather_on" :
                        r = speechdic[r] + Bweather.list[0].weather[0].description;
                        console.log(Bweather.list[0].weather[0].description);
                        console.log(r);
                        break;
                    case "music_on" :
                        r = speechdic[r][Math.floor(random(0, speechdic[r].length - 1))];
                        if (d3.select('#musicBtn').classed('disable'))
                            d3.select("#musicBtn").dispatch('click');
                        break;
                    case "music_off" :
                        r = speechdic[r][Math.floor(random(0, speechdic[r].length - 1))];
                        if (!d3.select('#musicBtn').classed('disable'))
                            d3.select("#musicBtn").dispatch('click');
                        break;
                    case "music_change" :
                        r = speechdic[r][Math.floor(random(0, speechdic[r].length - 1))];
                        musicPanel.contentWindow.postMessage('change', '*');
                        break;
                    case "twitter_on" :
                        r = speechdic[r][Math.floor(random(0, speechdic[r].length - 1))];
                        d3.select("#twitterBtn").dispatch('click');
                        break;
                    case "light_color":
                        var color_Array = ['red','blue','green','pink'];
                        var index = Math.floor(random(0,speechdic[r].length-1));
                        r = speechdic[r][index];
                        mainContent.style.setProperty('--light-color', color_Array[index]);
                        document.documentElement.style.setProperty('--color-menu', color_Array[index]); // change color of menu
                        break;
                    default:
                        r = speechdic[r][Math.floor(random(0,speechdic[r].length-1))];
                        break;
                }
            }
            if (!r.match('ERR')) {
                speech.speak(r);
                M.toast({html: r});
            }
        });
        let keywords = speechRec.resultString.toLowerCase().split(" ");
        // if (keywords.includes("open") && keywords.includes("news")) {
        //     controlnews = true;
        // }
        // if (keywords.includes("close") && keywords.includes("news")) {
        //     controlnews = false;
        // }
        // if (keywords.includes("open") && keywords.includes("calendar")) {
        //     controlcalendar = true;
        // }
        // if (keywords.includes("close") && keywords.includes("calendar")) {
        //     controlcalendar = false;
        // }
        // if (keywords.includes("open") && keywords.includes("music")) {
        //     controlmusics = true;
        // }
        // if (keywords.includes("close") && keywords.includes("music")) {
        //     controlmusics = false;
        // }
        // if (keywords.includes("open") && keywords.includes("health")) {
        //     controlhealth = true;
        // }
        // if (keywords.includes("close") && keywords.includes("health")) {
        //     controlhealth = false;
        // }


    }
    console.log(speechRec);
}


function draw() {
    background(100);
    //Bao adds OCt25-16:00
    translate(1400,0);
    scale(-1.0,1.0);
    image(capture, 0, 0, 1400, 1050);

    translate(1400,0);
    scale(-1.0,1.0);
    // normal content go here
    if(first){
        first = false;
        speech.speak('I am Magical mirror. Nice to meet you');
    }

}


/* Weather data structure
source: https://openweathermap.org/forecast5

code Internal parameter
message Internal parameter
city
city.id City ID
city.name City name
city.coord
city.coord.lat City geo location, latitude
city.coord.lon City geo location, longitude
city.country Country code (GB, JP etc.)
city.timezone Shift in seconds from UTC
cnt Number of lines returned by this API call
list
list.dt Time of data forecasted, unix, UTC
list.main
list.main.temp Temperature. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit.
list.main.temp_min Minimum temperature at the moment of calculation. This is deviation from 'temp' that is possible for large cities and megalopolises geographically expanded (use these parameter optionally). Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit.
list.main.temp_max Maximum temperature at the moment of calculation. This is deviation from 'temp' that is possible for large cities and megalopolises geographically expanded (use these parameter optionally). Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit.
list.main.pressure Atmospheric pressure on the sea level by default, hPa
list.main.sea_level Atmospheric pressure on the sea level, hPa
list.main.grnd_level Atmospheric pressure on the ground level, hPa
list.main.humidity Humidity, %
list.main.temp_kf Internal parameter
list.weather (more info Weather condition codes)
list.weather.id Weather condition id
list.weather.main Group of weather parameters (Rain, Snow, Extreme etc.)
list.weather.description Weather condition within the group
list.weather.icon Weather icon id
list.clouds
list.clouds.all Cloudiness, %
list.wind
list.wind.speed Wind speed. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour.
list.wind.deg Wind direction, degrees (meteorological)
list.rain
list.rain.3h Rain volume for last 3 hours, mm
list.snow
list.snow.3h Snow volume for last 3 hours
list.dt_txt Data/time of calculation, UTC
*/

/* News feed data structure
source: https://api.nytimes.com/svc/news/v3/content/all/all.json?api-key=pasteyourkeyhere
 */

/* Time zone data structure
source: http://worldtimeapi.org/api/timezone/America/Eirunepe
*/
