let capture;

//My variables for weather and newsfeed (Bao)
var Bweather;
var img0={};
var Bnews;
var Btime;
let speechRec;


function setup() {
    let canvas = createCanvas(1400, 750);
    canvas.parent('mirrorimage');
    capture = createCapture(VIDEO);
    capture.size(1400, 750);
    capture.hide();

    // My setup for weather, news feed (Bao)
    loadJSON('https://api.openweathermap.org/data/2.5/forecast?q=Lubbock,us&APPID=3f2b39ee96bea5d53296ae364ac222de&units=metric',getweather);
    loadJSON('https://api.nytimes.com/svc/news/v3/content/all/all.json?api-key=w81Gz2Upt9zcVNAmxxcxruEUpkkK8REN',getnews);
    askData();
    setInterval(askData,60000);

    // My setup for speech
    let lang = navigator.language || 'en-US';
    speechRec = new p5.SpeechRec(lang,mygetSpeech);
    let cont = true;
    let interim = false;
    speechRec.start(cont,interim);


}
// timer (Ngan)
function askData(){
    loadJSON('http://worldtimeapi.org/api/timezone/America/Eirunepe',gettime);
    // loadJSON('http://api.openweathermap.org/data/2.5/weather?zip=79415,us&APPID=3f2b39ee96bea5d53296ae364ac222de',getcurrentweather);
}

// weather function (Bao)
function getweather(data0) {
    Bweather = data0;
    console.log(Bweather);
    Bweather.list.forEach(list=>{
        const icon = list.weather[0].icon;
        if (!img0[icon])
            img0[icon] = loadImage('https://openweathermap.org/img/wn/'+Bweather.list[0].weather[0].icon+'.png');
    });
}

// weather function (Bao)
function getcurrentweather(data0) {
    Bweather = data0;
    console.log(Bweather);
    // Bweather.list.forEach(w=>w.weather[0].icon);
    img0 = loadImage('https://openweathermap.org/img/wn/'+Bweather.list[0].weather[0].icon+'.png');
}

// news feed function (Bao)
function getnews(data1){
    Bnews = data1;
    console.log(Bnews);
}

// time function (Bao)
function gettime(data2){
    Btime = data2;
    console.log(Btime)
    // Ngan's time update
    currentDate.textContent = d3.timeFormat('%a, %b %d, %Y')(new Date(Btime.utc_datetime));
    currentTime.textContent = d3.timeFormat('%H:%M')(new Date(Btime.utc_datetime));
}

//speech function (Bao)
function mygetSpeech() {
    if (speechRec.resultValue){
        createP(speechRec.resultString);
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
    if(Bweather){
        fill(255);
        text(Bweather.list[0].main.temp,300,10);
        image(img0[Bweather.list[0].weather[0].icon],150,10);
    }
    if(Bnews){
        fill(255);
        var numberfeed = 5; // number of news feed is ran over time
        var timefeed = 300;  // time for displaying each news feed in frames
        var bln = (round((frameCount/timefeed))%numberfeed);
        text(Bnews.results[bln].source,300,50);  //NY times
        var ntime = ceil((Date.parse(Btime.datetime) - Date.parse(Bnews.results[bln].published_date))/(60*60*1000));
        text(ntime+' hours ago',350,80);  // date
        text(Bnews.results[bln].title,300,100);   // title
    }
    if(Btime){
        fill(255);
        text(Btime.datetime.substring(11,19),400,150);
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
