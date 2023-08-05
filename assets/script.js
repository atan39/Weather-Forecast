const apiKey = "bc93c8c21c3f53980eab1fad1d379249";

// Build a URL with your api key
const cityName = 'Chicago';
const stateCode = 'IL';
const countryCode = 'US';
const apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${stateCode},${countryCode}&limit=20&appid=${apiKey}`;

// Call the URL using fetch()
fetch(apiUrl)
    .then(function (response){
        return response.json();
    })
    .then(function (data){
        console.log(data)
        const city = data[0];
        // city.lat
        const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&appid=${apiKey}`;

        // here
        fetch(weatherUrl)
        .then(function (response){
            return response.json();
        })
        .then(function (data){
            console.log(data)
        })
    });
