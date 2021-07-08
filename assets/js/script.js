const apiKey = "31b1715eea27e8546c5192709d456eb7";
let mainEl = $("#main")
let lat = "52.5";
let lon = "-1.95";

let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&exclude=hourly`;
let cityName = "Birmingham";
let kevlinToCelsius = tempKel => tempKel - 273.15; // -273.15 kelvin = 0 deg cel
const searchBtn = $("#search-btn");
const searchDiv = $("#search");
const selectorDiv = $("#selector");



const showFoundCities = () => {
    selectorDiv.removeClass("selector-hidden").addClass("selector-visible");
    }

const clearAndHideFoundCities = () => {
    selectorDiv.empty();
    selectorDiv.removeClass("selector-visible").addClass("selector-hidden");
}

const getEndPoint = (cityLat, cityLon) => {
    let endpoint = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&appid=${apiKey}&exclude=hourly`;
    return endpoint;
}

const loadNewData = event => {

    const cityLon = $(event.target).data("city-lon");
    const cityLat = $(event.target).data("city-lat");

    getDataThenPopulatePage(getEndPoint(cityLat, cityLon));
    
    clearAndHideFoundCities();

}

const showCitiesFound = currentCity => {

    const cityId = currentCity.id;
    const cityLon = currentCity.coord.lon;
    const cityLat = currentCity.coord.lat;
    const cityName = currentCity.name;
    const cityCountry = currentCity.country;

    showFoundCities();

    selectorDiv.append($(`<span>${cityName}, ${cityCountry}</span><br>`)
    .attr("data-city-lon", `${cityLon}`)
    .attr("data-city-lat", `${cityLat}`)
    .on("click", loadNewData));
}

// uses 
const searchCity = () => {
        selectorDiv.empty();
        const arrCity = cities.filter(city => city.name == cityName);
           
        if (arrCity.length > 0){
            for (i in arrCity){
                showCitiesFound(arrCity[i]);
            }
        }else{
            showFoundCities();

            selectorDiv.append($(`<p>City not found, Please search again</p>`));
            selectorDiv.on("click", clearAndHideFoundCities);
        }
}     

// returns string reprenting the month from interger
const intToMonth = monthAsInt => {
    let month = "";
    switch(monthAsInt){
        case 0:
            month  = "January";
            break;
        case 1:
            month  = "Febuary";
            break;
        case 2:
            month  = "March";
            break;
        case 3:
            month  = "April";
            break;
        case 4:
            month  = "May";
            break;
        case 5:
            month  = "June";
            break;
        case 6:
            month  = "July";
            break;
        case 7:
            month  = "August";
            break;
        case 8:
            month  = "September";
            break;
        case 9:
            month  = "October";
            break;
        case 10:
            month  = "Novemeber";
            break;
        case 11:
            month  = "December";
    }
    return month ;
}
// returns string reprenting the day from interger
const intToDay = dayAsInt => {
    let day = "Weather";
    switch(dayAsInt){
        case 0:
            day = "Sunday";
            break;
          case 1:
            day = "Monday";
            break;
          case 2:
            day = "Tuesday";
            break;
          case 3:
            day = "Wednesday";
            break;
          case 4:
            day = "Thursday";
            break;
          case 5:
            day = "Friday";
            break;
          case 6:
            day = "Saturday";
    }
    return day;
}

// updates 5 day forecast cards with data
const updateFiveDay = daysData => {
    for (let i = 0; i < 5; i++){
      
        const currentDiv = $(`div[data-fiveday="${i}"]`)[0];

        const currentMax = Math.round(kevlinToCelsius(daysData[i].temp.max));
        const currentMin = Math.round(kevlinToCelsius(daysData[i].temp.min));
        const currentWind = daysData[i].wind_speed;
        const currentHumidity = daysData[i].humidity;
        const currentIcon = daysData[i].weather[0].icon;
        const currentIconSrc = `http://openweathermap.org/img/wn/${currentIcon}@2x.png`;
        const date = new Date(daysData[i].dt * 1000);
        const day = intToDay(date.getDay())

        $(currentDiv).children(".max")[0].textContent = `Max: ${currentMax}°C`
        $(currentDiv).children(".min")[0].textContent = `Min: ${currentMin}°C`
        $(currentDiv).children(".wind")[0].textContent = `Wind: ${currentWind}mph`
        $(currentDiv).children(".humidity")[0].textContent = `Humidity: ${currentHumidity}%`
        $(currentDiv).children(".weather-img")[0].src = currentIconSrc;
        $(currentDiv).children(".day")[0].textContent = day;

        
    }
}

// updates todays forecast card
const updateToday = todayData => {
    
    // 
    const max = Math.round(kevlinToCelsius(todayData.temp.max));
    const min = Math.round(kevlinToCelsius(todayData.temp.min));
    const wind = todayData.wind_speed;
    const humidity = todayData.humidity;
    const iconSrc = todayData.weather[0].icon;
  
    
    const uv = todayData.uvi;

    // Getting today as a day, DoM and month
    const date = new Date(todayData.dt * 1000);
    
    const day = intToDay(date.getDay());
    const dayMonth = date.getDate();
    const month = intToMonth(date.getMonth());

    $("#today-max")[0].textContent = `Max: ${max}°C`;
    $("#today-min")[0].textContent = `Min: ${min}°C`;
    $("#today-wind")[0].textContent = `Wind: ${wind}mph`;
    $("#today-humidity")[0].textContent = `Humidity: ${humidity}%`;
    $("#today-img")[0].src = `http://openweathermap.org/img/wn/${iconSrc}@2x.png`;
    $("#city-name")[0].textContent = `${cityName}`;
    $("#today-uv")[0].textContent = `UV: ${uv}`;
    console.log(day, dayMonth, month)
    $("#todays-date")[0].textContent = `${day}, ${dayMonth} ${month}`;
 
  
    if (uv < 3){
        $("#today-uv").removeClass("moderate-uv severe-uv").addClass("favorable-uv");
    }else if (uv < 6){
        $("#today-uv").removeClass("favorable-uv severe-uv").addClass("moderate-uv");
    }else{
        $("#today-uv").removeClass("favorable-uv moderate-uv").addClass("severe-uv");
    }

    
}

// fetch json from API and calls functions to populate the DOM
const getDataThenPopulatePage = (givenUrl = url) => {

    fetch(givenUrl)
    .then(reponse => reponse.json())
    .then(data => {

        updateFiveDay(data.daily);
        updateToday(data.daily[0]);
        
    })
}

getDataThenPopulatePage(); // call function to populate on load

// create event listerner for the search button
searchBtn.click(event => { 
    event.preventDefault();
    
    cityName = $("#search-btn").siblings("input")[0].value;
    console.log($("#search-btn").siblings("input")[0].value)

    searchCity()

});
 