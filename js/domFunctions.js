export const addSpinner = (element) => {
    animateButton(element);
    setTimeout(animateButton, 1000, element);
}

const animateButton = (element) => {
    element.classList.toggle("none");
    element.nextElementSibling.classList.toggle("block");
    element.nextElementSibling.classList.toggle("none");
}

export const displayError = (headerMsg, screenMsg) => {
    updateWeatherLocationHeader(headerMsg);
    updateScreenReaderConfirmation(screenMsg);
}

export const displayApiError = (statuscode) => {
    const properMsg = toProperCase(statuscode.message);
    updateWeatherLocationHeader(properMsg);
}

const toProperCase = (text) => {
    const words = text.split(" ");
    const properWords = words.map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    });
    return properWords.join(" ");
};

const updateWeatherLocationHeader = (message) => {
    const h1 = document.getElementById("currentForecast__location");
    h1.textContent = message;
}

const updateScreenReaderConfirmation = (message) => {
    document.getElementById("confirmation").textContent = message;
}

export const updateDisplay = (weatherJson, locationObj) => {
    fadeDisplay();
    clearDisplay();
    const weatherClass = getWeatherClass(weatherJson.list[0].weather[0].icon);
    setBGImage(weatherClass);
    updateWeatherLocationHeader(locationObj.getName());
    // current conditions
    const ccArray = createCurrentConditionsDivs(weatherJson, locationObj.getUnit());

    displayCurrentConditions(ccArray);
    displayCommentByTemp(weatherJson.list[0].main.temp);

    // daily forecast
    displaySixDayForecast(weatherJson);



    setFocusOnSearch();
    fadeDisplay();
}

// additional func
const displayCommentByTemp = (temp) => {
    const comment = document.querySelector(".comment");
    if (temp < 0) {
        comment.textContent = "Пипец дубак котин жыла уста!";
    }
    else if (temp > 0) {
        comment.textContent = "Ля тут тепло, щас бы на море((";
    }
}

const fadeDisplay = () => {
    const cc = document.getElementById("currentForecast");
    cc.classList.toggle("zero-vis");
    cc.classList.toggle("fade-in");
    const fiveDay = document.getElementById("dailyForecast");
    fiveDay.classList.toggle("zero-vis");
    fiveDay.classList.toggle("fade-in");
}

const clearDisplay = () => {
    const currentConditions = document.getElementById("currentForecast__conditions");
    deleteContents(currentConditions);
    const fiveDayForecast = document.getElementById("dailyForecast__contents");
    deleteContents(fiveDayForecast);
}

const deleteContents = (parentElement) => {
    let child = parentElement.lastElementChild;
    while (child) {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }
}

const getWeatherClass = (icon) => {
    const firstTwoChars = icon.slice(0, 2);
    const lastChar = icon.slice(2);
    const weatherLookup = {
      "09": "snow",
      10: "rain",
      11: "rain",
      13: "snow",
      50: "fog"
    };
    let weatherClass;
    if (weatherLookup[firstTwoChars]) {
      weatherClass = weatherLookup[firstTwoChars];
    } else if (lastChar === "d") {
      weatherClass = "clouds";
    }
     else {
      weatherClass = "night";
    }
    return weatherClass;
  };

const setBGImage = (weatherClass) => {
    document.documentElement.classList.add(weatherClass);
    document.documentElement.classList.forEach((img) => {
        if (img !== weatherClass) document.documentElement.classList.remove(img);
    });
}

const setFocusOnSearch = () => {
    document.getElementById("searchBar__text").focus();
}

const createCurrentConditionsDivs = (weatherObj, unit) => {
    const tempUnit = unit === "imperial" ? "F" : "C";
    const windUnit = unit === "imperial" ? "mph" : "m/s";
    const icon = createMainImgDiv(weatherObj.list[0].weather[0].icon,
        weatherObj.list[0].weather[0].description);

    const temp = createELem("div", "temp", `${Math.round(Number(weatherObj.list[0].main.temp))}°`);
    const properDesc = toProperCase(weatherObj.list[0].weather[0].description);
    const desc = createELem("div", "desc", properDesc);
    const feels = createELem("div", "feels", `Feels like: ${Math.round(Number(
        weatherObj.list[0].main.feels_like))}°`);
    const maxTemp = createELem("div", "maxTemp", `High ${Math.round(Number(
        weatherObj.list[0].main.temp_max))}°`);
    const minTemp = createELem("div", "minTemp", `Low ${Math.round(Number(
        weatherObj.list[0].main.temp_min))}°`);
    const humidity = createELem("div", "humidity", `Humidity ${weatherObj.list[0].main.humidity}%`);
    const wind = createELem("div", "wind", `Wind ${Math.round(Number(
        weatherObj.list[0].wind.speed))} ${windUnit}`);

    return [icon, temp, desc, feels, maxTemp, minTemp, humidity, wind];
}

const createMainImgDiv = (icon, altText) => {
    const iconDiv = createELem("div", "icon");
    iconDiv.id = "icon";
    const faIcon = translateIconToFontAwesome(icon);
    faIcon.ariaHidden = true;
    faIcon.title = altText;
    iconDiv.appendChild(faIcon);
    return iconDiv;
}

const createELem = (elementName, divClassName, divText, unit) => {
    const div = document.createElement(elementName);
    div.className = divClassName;
    if (divText) {
        div.textContent = divText;
    }
    if (divClassName === "temp") {
        const unitDiv = document.createElement("div");
        unitDiv.className = "unit";
        unitDiv.textContent = unit;
        div.appendChild(unitDiv);
    }
    return div;
}

const translateIconToFontAwesome = (icon) => {
    const i = document.createElement("i");
    const firstTwoChars = icon.slice(0, 2);
    const lastChar = icon.slice(2);
    switch (firstTwoChars) {
        case "01":
            if (lastChar === "d") {
                i.classList.add("far", "fa-sun");
            } else {
                i.classList.add("far", "fa-moon");
            }
            break;
        case "02":
            if (lastChar === "d") {
                i.classList.add("fas", "fa-cloud-sun");
            } else {
                i.classList.add("fas", "fa-cloud-moon");
            }
            break;
        case "03":
            i.classList.add("fas", "fa-cloud");
            break;
        case "04":
            i.classList.add("fas", "fa-cloud-meatball");
            break;
        case "09":
            i.classList.add("fas", "fa-cloud-rain");
            break;
        case "10":
            if (lastChar === "d") {
                i.classList.add("fas", "fa-cloud-sun-rain");
            } else {
                i.classList.add("fas", "fa-cloud-moon-rain");
            }
            break;
        case "11":
            i.classList.add("fas", "fa-poo-storm");
            break;
        case "13":
            i.classList.add("far", "fa-snowflake");
            break;
        case "50":
            i.classList.add("fas", "fa-smog");
            break;
        default:
            i.classList.add("far", "fa-question-circle");
    }
    return i;
}

const displayCurrentConditions = (currentConditionsArray) => {
    const ccContainer = document.getElementById("currentForecast__conditions");
    currentConditionsArray.forEach(cc => {
        ccContainer.appendChild(cc);
    })
}

const displaySixDayForecast = (weatherJson) => {
    for (let i = 0; i < 40; i += 8) {
        const dfArray = createDailyForecastDivs(weatherJson.list[i]);
        displayDailyForecast(dfArray);
    }
}

const createDailyForecastDivs = (dayWeather) => {
    const dayAbbreviationText = getDayAbbreviation(dayWeather.dt_txt);
    const dayAbbreviation = createELem("p", "dayAbbreviation", dayAbbreviationText);
    const dayIcon = createDailyForecastIcon(dayWeather.weather[0].icon, dayWeather.weather[0].description);
    const dayHigh = createELem("p", "dayHigh", `${Math.round(Number(dayWeather.main.temp_max))}°`);
    const dayLow = createELem(
        "p",
        "dayLow",
        `${Math.round(Number(dayWeather.main.temp_min))}°`
      );
      return [dayAbbreviation, dayIcon, dayHigh, dayLow];
}

const getDayAbbreviation = (data) => {
    const dateObj = new Date(data);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dateObj.getDay()].slice(0,3);
  }

const createDailyForecastIcon = (icon, altText) => {
    const img = document.createElement("img");
    if (window.innerWidth < 768 || window.innerHeight < 1025) {
        img.src = `https://openweathermap.org/img/wn/${icon}.png`;
      } else {
        img.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
      }
      img.alt = altText;
      return img;
} 

const displayDailyForecast = (dfArray) => {
    const dayDiv = createELem("div", "forecastDay");
    dfArray.forEach(el => {
        dayDiv.appendChild(el);
    });
    const dailyForecastContainer = document.getElementById("dailyForecast__contents");
    dailyForecastContainer.appendChild(dayDiv);
}