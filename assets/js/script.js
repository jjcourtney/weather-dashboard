const apiKey = "31b1715eea27e8546c5192709d456eb7";
let mainEl = $("#main")
let lon = "-94.04";
let lat = "33.44";

let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;

let kevlinToCelsius = tempKel => tempKel - 273.15; // -273.15 kelvin = 0 deg cel



fetch(url)
.then(reponse => reponse.json())
.then(data => {
    for(let i = 0; i < data.daily.length; i++){
   // console.log(data.daily);
   createCard(i, data.daily[i]); 
    console.log(data.daily[i]);
    }
})



let createCard = (day, daily) =>  {

    const dateObject = new Date(daily.dt * 1000)
    let day1 = dateObject.toLocaleString("en-US", {weekday: "long"})
    let tempMax = Math.round(kevlinToCelsius(daily.temp.max));
    let tempMin = Math.round(kevlinToCelsius(daily.temp.min));
    let icon = daily.weather[0].icon;
    let description = daily.weather[0].description;
    let newEl = $("<div></div>")
    .attr("id", `day-${day}`)
    .html(`<h1>${day1}</h1><img src="http://openweathermap.org/img/wn/${icon}@2x.png" title="${description}"> Max: ${tempMax} Min: ${tempMin}`);
    mainEl.append(newEl);
}

/*
weather:
Thunderstorm
Drizzle
	Rain
    	Snow
*/