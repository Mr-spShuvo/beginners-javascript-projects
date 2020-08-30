window.addEventListener('load', () => {

    const locationElem = document.querySelector('.info__location');
    const descriptionElem = document.querySelector('.info__description');
    const iconElem = document.querySelector('.info__icon i');
    const tempElem = document.querySelector('.temperature__degree span');
    const humidityElem = document.querySelector('.temperature__humidity span');
    const loader = document.querySelector('.loader');

    const appID = "YOUR_API_KEY_HERE" //"5cc0a173514e71f7691548449d1bfbbd";

    if (navigator.geolocation) {

        let lon, lat, iconName;

        navigator.geolocation.getCurrentPosition((position) => {
            lon = position.coords.longitude;
            lat = position.coords.latitude;

            const api = `//api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${appID}`;

            fetch(api)
                .then(res => res.json())
                .then((data) => {
                    const {
                        id,
                        description
                    } = data.weather[0];
                    const {
                        temp,
                        humidity
                    } = data.main;
                    const {
                        country,
                        sunrise,
                        sunset
                    } = data.sys;
                    const city = data.name;

                    console.log(city, country, temp);

                    domInject(locationElem, (city + ", " + country));
                    domInject(tempElem, temp);
                    domInject(humidityElem, humidity);
                    domInject(descriptionElem, description);

                    
                    const date = new Date();
                    const sunriseTime = new Date(sunrise * 1000);
                    const sunsetTime = new Date(sunset * 1000);

                    if (date.getHours() >= sunriseTime.getHours() && date.getHours() < sunsetTime.getHours()) {
                        iconName = id + '-d';
                    } else if (date.getHours() >= sunsetTime.getHours() || date.getHours() < sunriseTime.getHours()) {
                        iconName = id + '-n';
                    }
                    iconElem.classList.add('owf-' + iconName);
                    iconElem.setAttribute('title', description.toUpperCase());
                })
                .then(() => loader.style.display = 'none')
                .catch(reason => console.log("Failed to Connect!", reason));

        })

        function domInject(elem, text) {
            elem.innerText = text;
        }
    } else {
        console.log('Something went wrong! Please  allow Geolocation access.')
    }
});