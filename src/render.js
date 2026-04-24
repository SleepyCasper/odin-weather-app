import { Elements } from "./elements";
import { parseConditions } from "./parser";
import { weatherStore } from "./store";
import { formatDate, formatDay, convertWindSp, isDaytime } from "./utils";
import { getWeatherIcon } from "./condition-icons";

export const Render = (function() {
    function renderDropdown(results) {
        Elements.dropdown.replaceChildren();
        if (!results) return;
    
        results.forEach(result => {
            const li = document.createElement("li");
            li.id = result.id;
            li.dataset.lat = result.coordinates.lat;
            li.dataset.lon = result.coordinates.lon;
            li.dataset.city = result.name;
            li.textContent = result.string;
            Elements.dropdown.appendChild(li);
        })
    }

    function renderToday(city) {
        const card = Elements.cardToday;
        const current = weatherStore.current;

        const isDay = isDaytime(
            weatherStore.current.datetime,   
            weatherStore.details.sunrise,    
            weatherStore.details.sunset      
        );
        const icon = getWeatherIcon(weatherStore.current.conditions, isDay);
        card.city.innerHTML = `
            <span class="icon"></span>
            ${city}
        `
        card.day.textContent = formatDay(current.date);
        card.date.textContent = formatDate(current.date);
        card.temp.textContent = `${current.temp}°`;
        card.minMax.textContent = `Min: ${current.tempmin}° Max: ${current.tempmax}°`;
        card.condition.textContent = current.conditions;
        card.icon.src = icon;
        card.icon.title = current.conditions;
    }

    function renderHourly() {
        const wrapper = Elements.cardHourly.wrapperHourly;
        const hourly = weatherStore.hourly;

        wrapper.innerHTML = "";

        hourly.forEach(h => {
            const isDay = isDaytime(h.datetime, weatherStore.details.sunrise, weatherStore.details.sunset);
            const icon = getWeatherIcon(h.conditions, isDay);
            const cardHour = document.createElement("div");
            cardHour.classList.add("card-hour");
            cardHour.innerHTML = `
                <p class="hour" data-field="hour">${h.datetime}</p>
                <img src="${icon}" alt="${h.conditions}" title="${h.conditions}" data-field="condition">
                <p class="temp" data-field="temp">${h.temp}°</p>
                <p class="feels" data-field="feels">${h.feelslike}°</p>
                <p class="precip" data-field="precip">${h.precipprob}%</p>
                <p class="wind" data-field="wind"><span class="icon wind-dir"></span>${convertWindSp(h.windspeed)}m/s</p>
            `

            wrapper.appendChild(cardHour);
        })
    }

    function renderWeek() {
        const wrapper = Elements.cardHourly.wrapperWeek;
        const week = weatherStore.week;

        wrapper.innerHTML = "";

        week.forEach(d => {
            const icon = getWeatherIcon(d.conditions);
            const cardWeek = document.createElement("div");
            cardWeek.classList.add("card-day");
            cardWeek.innerHTML = `
            <p class="day" data-field="day">${formatDay(d.datetime)}</p>
            <img src="${icon}" data-field="condition">
            <p class="temp" data-field="min-max">↓${d.tempmin}° ↑${d.tempmax}°</p>
            <p class="precip" data-field="precip">${d.precipprob}%</p>
            <p class="wind" data-field="wind"><span class="icon wind-dir"></span>${convertWindSp(d.windspeed)}m/s</p>
            `

            wrapper.appendChild(cardWeek);
        })
    }

    function renderDetails() {
        const cards = document.querySelectorAll(".card-detail");
        console.log(cards);
        const details = weatherStore.details;
        cards.forEach(card => {
            const div = card.querySelector("[data-field]");
            const field = div.dataset.field; 
            const value = details[field];

            div.textContent = value;
            const unit = document.createElement("span");
            unit.classList.add("unit");
            switch (field) {
                case "feels": 
                    unit.textContent = "°";
                    break;
                case "windspeed":
                    unit.textContent = "m/s";
                    break;
                case "precipprob":
                    unit.textContent = "%";
                    break;
                case "humidity":
                unit.textContent = "%";
                    break;
                default: unit.textContent = "";
            }
            div.appendChild(unit);
        }) 

    }

    return {
        renderDropdown,
        renderToday,
        renderHourly,
        renderWeek,
        renderDetails,
    }
})();


