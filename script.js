var cityselection = document.querySelector("#citypush");
var searching = document.querySelector("#searchingfor");
var clearingbutton = document.querySelector("#clear-history-button");
var priorcities = document.querySelector("#findhistory");
var todaysweather = document.querySelector("#todaysweatherforc");
var forecastofdays = document.querySelector("#firstfive");
var previoussearches = [];

//function for weather dashboard display

function dashboard(event) {
    event.preventDefault();
    var cities = cityselection.value;
    weatherforc(cities);
}
//acquiring api of openweathermap for the cities and forecast data
function weatherforc(cityName) {
    var url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=cf52bda9505d69567000a24e4d4a1ffb&units=imperial`;
    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (nowData) {
            console.log(nowData);
            var moreforecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${nowData.coord.lat}&lon=${nowData.coord.lon}&appid=cf52bda9505d69567000a24e4d4a1ffb&units=imperial`;
            fetch(moreforecast)
                .then(function (response) {
                    return response.json();
                })
                .then(function (allfive) {
                    if (previoussearches.includes(nowData.name) === false) {
                        previoussearches.push(nowData.name);
                        //storing city searches
                        localStorage.setItem("city", JSON.stringify(previoussearches));
                    }
                    displayCity();
                    console.log(allfive);
                    //making list of temperature, speed, and humitdity and dates accordingly
                    todaysweather.innerHTML = 
                    `<ul>
        <li class="title">${nowData.name}: <span> ${moment(nowData.dt,"X").format(" MM/DD/YYYY")} </span></li>
        <li><img src ="http://openweathermap.org/img/wn/${nowData.weather[0].icon}@2x.png" /></li>
        <li>Temp: ${Math.floor(nowData.main.temp) + "&#176F"}</li>
        <li>Wind: ${nowData.wind.speed}</li>
        <li>Humidity: ${nowData.main.humidity}</li>
                     </ul>`;
    
    
    
                    var columns = "";
            
                    for (var i = 1; i < allfive.list.length; i=i+8 ) {
                       
                        columns = columns +  `<ul class="col-12 col-xl-2 day">
            
        <li>${moment(allfive.list[i].dt, "X").format("MM/DD/YYYY")}</li>
        <li><img src ="http://openweathermap.org/img/wn/${allfive.list[i].weather[0].icon}@2x.png" /></li>
        <li>Temp: ${Math.floor(allfive.list[i].main.temp) + "&#176F"}</li>
        <li>Wind: ${allfive.list[i].wind.speed}</li>
        <li>Humidity: ${allfive.list[i].main.humidity}</li>
    </ul>`;
                    }
                    forecastofdays.innerHTML = columns;
                });
        });
}
//creating access of deployment from previous searches of cities 
function displayCity() {
    if (localStorage.getItem("city")) {
        previoussearches = JSON.parse(localStorage.getItem("city"));
    }
    var cityList = "";
    for (var i = 0; i < previoussearches.length; i++) {
        cityList =
            cityList +
            `<button class="btn btn-secondary my-1" type="submit">${previoussearches[i]}</button>`;
    }
    priorcities.innerHTML = cityList;
    var searching = document.querySelectorAll(".my-1");
    for (var i = 0; i < searching.length; i++) {
        searching[i].addEventListener("click", function () {
            weatherforc(this.textContent);
        });
    }
}
displayCity();

searching.addEventListener("submit", dashboard); 

//making function and button to clear the history of previous searches
function clearingthehist() {
    localStorage.clear();
    priorcities.innerHTML = "";
    previoussearches = [];
}
clearingbutton.addEventListener("click", function () {
    clearingthehist();
});
