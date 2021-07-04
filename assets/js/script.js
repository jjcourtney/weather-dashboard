const apiKey = "31b1715eea27e8546c5192709d456eb7";
let mainEl = $("#main")
let lat = "52.5";
let lon = "-1.95";

let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&exclude=hourly`;

let kevlinToCelsius = tempKel => tempKel - 273.15; // -273.15 kelvin = 0 deg cel

const searchCity = (city) => {
    $.getJSON("./assets/js/citylist.json", json => {
        let arrCity = json.filter(city => city.name.toLowerCase() == city.toLowerCase())
            if (arrCity)
            for (i in arrCity){
                console.log(arrCity[i].coord.lon, arrCity[i].coord.lat)

            }else{
                console.log("Enter a valid city")
            }
        })

}

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

// updates 5 day forcast cards with data
const updateFiveDay = (daysData) => {
    for (let i = 0; i < 5; i++){
      
        let currentDiv = $(`div[data-fiveday="${i}"]`)[0];

        let currentMax = Math.round(kevlinToCelsius(daysData[i].temp.max));
        let currentMin = Math.round(kevlinToCelsius(daysData[i].temp.min));
        let currentWind = daysData[i].wind_speed;
        let currentHumidity = daysData[i].humidity;
        let currentIcon = daysData[i].weather[0].icon;
        let currentIconSrc = `http://openweathermap.org/img/wn/${currentIcon}@2x.png`;
        let date = new Date(daysData[i].dt * 1000);
        let day = intToDay(date.getDay())

        $(currentDiv).children(".max")[0].textContent = `Max: ${currentMax}°C`
        $(currentDiv).children(".min")[0].textContent = `Min: ${currentMin}°C`
        $(currentDiv).children(".wind")[0].textContent = `Wind: ${currentWind}mph`
        $(currentDiv).children(".humidity")[0].textContent = `Humidity: ${currentHumidity}%`
        $(currentDiv).children(".weather-img")[0].src = currentIconSrc;
        $(currentDiv).children(".day")[0].textContent = day;

        
    }
}

const updateToday = (todayData) => {
    
    let max = Math.round(kevlinToCelsius(todayData.temp.max));
    let min = Math.round(kevlinToCelsius(todayData.temp.min));
    let wind = todayData.wind_speed;
    let humidity = todayData.humidity;
    let iconSrc = todayData.weather[0].icon;
    let date = new Date(todayData.dt * 1000);

    let uv = todayData.uvi 
    let day = intToDay(date.getDay())
    let dayMonth = date.getDate();
    let month = intToMonth(date.getMonth())

    $("#today-max")[0].textContent = `Max: ${max}°C`
    $("#today-min")[0].textContent = `Min: ${min}°C`
    $("#today-wind")[0].textContent = `Wind: ${wind}mph`
    $("#today-humidity")[0].textContent = `Humidity: ${humidity}%`;
    $("#today-img")[0].src = `http://openweathermap.org/img/wn/${iconSrc}@2x.png`;
    console.log($("#today-humidity"))
    $("#today-uv")[0].textContent = `UV: ${uv}`;
    $("#todays-date")[0].textContent = `${day}, ${dayMonth} ${month}`;
  
    if (uv < 3){
        $("#today-uv").removeClass("moderate-uv severe-uv").addClass("favorable-uv");
    }else if (uv < 6){
        $("#today-uv").removeClass("favorable-uv severe-uv").addClass("moderate-uv");
    }else{
        $("#today-uv").removeClass("favorable-uv moderate-uv").addClass("severe-uv");
    }

    
}

const getDataThenPopulatePage = () => {

    fetch(url)
    .then(reponse => reponse.json())
    .then(data => {

        updateFiveDay(data.daily);
        updateToday(data.daily[0]);
        console.log(data.daily[0])

        // createToday(data.daily[0]);
        
    })
}





getDataThenPopulatePage();

$("#search-btn").click(event => { 
    event.preventDefault();
    let city = $("#search-btn").siblings("input")[0].value;
    searchCity(city)

});
/*
weather:
Thunderstorm
Drizzle
	Rain
    	Snow
*/