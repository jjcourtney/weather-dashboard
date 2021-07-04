const apiKey = "31b1715eea27e8546c5192709d456eb7";
let mainEl = $("#main")
let lon = "-94.04";
let lat = "33.44";

let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;

let kevlinToCelsius = tempKel => tempKel - 273.15; // -273.15 kelvin = 0 deg cel



fetch(url)
.then(reponse => reponse.json())
.then(data => {

    createFiveDay(data.daily);
    console.log(data.daily)
    
})

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

const createFiveDay = (daysData) => {
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
 
/*
weather:
Thunderstorm
Drizzle
	Rain
    	Snow
*/