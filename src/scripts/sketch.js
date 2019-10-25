let capture;

//My variables for weather and newsfeed (Bao)
var Bweather;
var img0;
var Bnews;
var Btime;

function setup() {
    let canvas = createCanvas(1400, 750);
    canvas.parent('mirrorimage');
    capture = createCapture(VIDEO);
    capture.size(1400, 750);
    capture.hide();

    // My setup for weather (Bao)
    loadJSON('https://api.openweathermap.org/data/2.5/forecast?q=Lubbock,us&APPID=3f2b39ee96bea5d53296ae364ac222de&units=metric',getweather);
    loadJSON('https://api.nytimes.com/svc/news/v3/content/all/all.json?api-key=w81Gz2Upt9zcVNAmxxcxruEUpkkK8REN',getnews);
    loadJSON('http://worldtimeapi.org/api/timezone/America/Eirunepe',gettime);


}

// weather function (Bao)
function getweather(data0) {
    Bweather = data0;
    console.log(Bweather);
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
    console.log(Btime);
}

function draw() {
    background(100);
    image(capture, 0, 0, 1400, 1050);

    // Bao's trial draw
    if(Bweather){
        fill(0);
        text(Bweather.list[0].main.temp,10,10);
        image(img0,20,10);
    }
    if(Bnews){
        fill(0);
        var numberfeed = 5; // number of news feed is ran over time
        var timefeed = 60;  // time for displaying each news feed in frames
        var bln = (round((frameCount/timefeed))%numberfeed);
        text(Bnews.results[bln].source,30,50);  //NY times
        var ntime = ceil((Date.parse(Btime.datetime) - Date.parse(Bnews.results[bln].published_date))/(60*60*1000));
        text(ntime+' hours ago',50,80);  // date
        text(Bnews.results[bln].title,30,100);   // title
    }
    if(Btime){
        fill(0);
        text(Btime.datetime.substring(11,19),80,150);
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