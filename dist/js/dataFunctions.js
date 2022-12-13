export const setLocationObj = (locationObj, coordsObj) => {
    const { lat, lon, name, unit } = coordsObj;
    locationObj.setLat(lat);
    locationObj.setlon(lon);
    locationObj.setName(name);
    if (unit) {
        locationObj.setUnit(unit);
    }
}

export const getHomeLocation = () => {
    return localStorage.getItem("defaultWeatherLocation");
}

export const cleanText = (text) => {
    const regex = / {2,}/g;
    const entryText = text.replaceAll(regex, "").trim();
    return entryText;
}

export const getWeatherFromCoords = async (locationObj) => {
    // const lat = locationObj.getLat();
    // const lon = locationObj.getLon();
    // const units = locationObj.getUnit();
    // const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=${units}`;
    // try {
    //     const weatherStream = await fetch(url);
    //     const weatherJson = await weatherStream.json();
    //     return weatherJson;
    // }
    // catch (err) {
    //     console.error(err);
    // }

    const urlDataObj = {
         lat: locationObj.getLat(),
         lon: locationObj.getLon(),
         units: locationObj.getUnit()
    };

    try {
        const weatherStream = await fetch("./.netlify/functions/get_weather", {
            method: "POST",
            body: JSON.stringify(urlDataObj)
        });
        const weatherJson = weatherStream.json();
        return weatherJson;
    }
    catch(err) {
        console.log(err);
    }
}

export const getCoordsFromApi = async (entryText, units) => {
    // const regex = /^\d+$/g;
    // const flag = regex.test(entryText) ? "zip" : "q";
    // const url = `https://api.openweathermap.org/data/2.5/weather?${flag}=${entryText}&units=${units}&appid=${WEATHER_API_KEY}`;
    // const encodedUrl = encodeURI(url);
    // try {
    //     const dataStream = await fetch(encodedUrl);
    //     const jsonData = await dataStream.json();
    //     return jsonData;
    // }
    // catch (err) {
    //     console.log(err.stack);
    // }


    const urlDataObj = {
        text: entryText,
        unit: units
    };

    try {
        const dataStream = fetch("./.netlify/functions/get_coords", {
            method: "POST",
            body: JSON.stringify(urlDataObj)
        });
        const jsonData = await dataStream.json();
        return jsonData;
    }
    catch(err) {
        console.log(err);
    }
}
