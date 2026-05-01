import { Elements } from "./elements";
import { weatherStore } from "./store";
import { formatDate, formatDay, formatDateWeek, convertWindSp, degToCardinal, isDaytime, formatTemp, t, translateCondition} from "./utils";
import { getWeatherIcon } from "./condition-icons";

export const Render = (function() {
    function renderDropdown(results) {
        Elements.dropdown.replaceChildren();
        if (!results || results.length === 0) {
            Elements.dropdown.style.display = "none";
            return;
        }
        results.forEach(result => {
            const li = document.createElement("li");
            li.id = result.id;
            li.dataset.lat = result.coordinates.lat;
            li.dataset.lon = result.coordinates.lon;
            li.dataset.city = result.name;
            li.textContent = result.string;
            Elements.dropdown.appendChild(li);
        })

        Elements.dropdown.style.display = "block";
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
        card.temp.textContent = `${formatTemp(current.temp)}°`;
        card.minMax.textContent = `Min: ${formatTemp(current.tempmin)}° Max: ${formatTemp(current.tempmax)}°`;
        card.condition.textContent = translateCondition(current.conditions);
        card.icon.style = `background-image: url(${icon})`;
        card.icon.title = translateCondition(current.conditions);
    }

    function renderHourly() {
        const wrapper = Elements.cardHourly.wrapperHourly;
        const hourly = weatherStore.hourly;

        wrapper.innerHTML = "";

        Elements.cardHourly.containerDetails.innerHTML = `
            <p>${t("temperature")}</p>
            <p>${t("feelsLike")}</p>
            <p>${t("precipitation")}</p>
            <p>${t("wind")}</p>
        `;

        hourly.forEach(h => {
            const isDay = isDaytime(h.datetime, weatherStore.details.sunrise, weatherStore.details.sunset);
            const icon = getWeatherIcon(h.conditions, isDay);
            const cardHour = document.createElement("div");
            cardHour.classList.add("card-hour");
            cardHour.innerHTML = `
                <p class="hour" data-field="hour">${h.datetime}</p>
                <img src="${icon}" alt="${translateCondition(h.conditions)}" title="${translateCondition(h.conditions)}" data-field="condition">
                <p class="temp" data-field="temp">${formatTemp(h.temp)}°</p>
                <p class="feels" data-field="feels">${formatTemp(h.feelslike)}°</p>
                <p class="precip" data-field="precip">${h.precipprob}%</p>
                <p class="wind" data-field="wind">
                    <span class="icon wind-dir" style="background-image:url(./media/icons/wind-${degToCardinal(h.winddir)}.svg);"></span>
                    ${convertWindSp(h.windspeed)}${t("windSpeed")}
                </p>
            `;
            wrapper.appendChild(cardHour);
        })
    }

    function renderWeek() {
        const wrapper = Elements.cardHourly.wrapperWeek;
        const week = weatherStore.week;

        wrapper.innerHTML = "";

        Elements.cardHourly.containerDetails.innerHTML = `
            <p>${t("temperature")}</p>
            <p>${t("precipitation")}</p>
            <p>${t("wind")}</p>
        `;

        week.forEach(d => {
            const icon = getWeatherIcon(d.conditions);
            const cardWeek = document.createElement("div");
            cardWeek.classList.add("card-day");
            cardWeek.innerHTML = `
            <p class="day" data-field="day">${formatDay(d.datetime)}</p>
            <p class="date">${formatDateWeek(d.datetime)}</p>
            <img src="${icon}" data-field="condition" title="${translateCondition(d.conditions)}" alt="${translateCondition(d.conditions)}">
            <p class="temp" data-field="min-max">↓${formatTemp(d.tempmin)}° ↑${formatTemp(d.tempmax)}°</p>
            <p class="precip" data-field="precip">${d.precipprob}%</p>
            <p class="wind" data-field="wind">
                <span class="icon wind-dir" style="background-image:url(./media/icons/wind-${degToCardinal(d.winddir)}.svg);"></span>
                ${convertWindSp(d.windspeed)}${t("windSpeed")}
            </p>`

            wrapper.appendChild(cardWeek);
        })
    }

    function renderDetails() {
        const cards = document.querySelectorAll(".card-detail");
        const details = weatherStore.details;

        const labelKeys = {
            feels:      "feelsLike",
            windspeed:  "wind",
            precipprob: "precipProb",
            humidity:   "humidity",
            uvindex:    "uvIndex",
            pressure:   "pressure",
            sunrise:    "sunrise",
            sunset:     "sunset",
        };

        const heading = document.querySelector("#card-details h4");
        if (heading) heading.textContent = t("todayDetails");

        cards.forEach(card => {
            const div = card.querySelector("[data-field]");
            const field = div.dataset.field;

            const labelEl = card.querySelector("p.title");
            if (labelEl) {
                const iconSpan = labelEl.querySelector(".icon");
                labelEl.textContent = t(labelKeys[field] ?? field);
                if (iconSpan) labelEl.prepend(iconSpan); // restore icon span
            }

            let value;

            if (field === "feels") {
                value = formatTemp(details[field])
            } else {
                value = details[field];
            }

            div.textContent = value;

            if (field === "windspeed") {
                const icon = document.createElement("span");
                icon.classList.add("icon");
                icon.style = `background-image:url(./media/icons/wind-${degToCardinal(details.winddir)}.svg)`;
                div.prepend(icon);
            }
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

    function renderStaticUI() {
        // Search placeholder
        Elements.searchBar.placeholder = t("searchPlaceholder");

        // Hourly/week tab labels
        const tabToday = Elements.globalBtns.btnToggleHourly.querySelector("a.today");
        const tabWeek  = Elements.globalBtns.btnToggleHourly.querySelector("a.week");
        if (tabToday) tabToday.textContent = t("hoursTab");
        if (tabWeek)  tabWeek.textContent  = t("weekTab");

        // Show more/less button
        const btnMore = Elements.globalBtns.btnMore;
        if (btnMore) {
            btnMore.textContent = Elements.cardDetails.card.classList.contains("expanded")
                ? t("showLess")
                : t("showMore");
        }
    }

    function toggleTheme(btn) {
      if (btn.classList.contains("dark")) {
        document.documentElement.classList.toggle("light");
        btn.classList.add("light");
        btn.classList.remove("dark");

        localStorage.setItem("theme", "light");
      } else {
        document.documentElement.classList.toggle("light");
        btn.classList.add("dark");
        btn.classList.remove("light");

        localStorage.setItem("theme", "dark");
      }
    }

    return {
        renderDropdown,
        renderToday,
        renderHourly,
        renderWeek,
        renderDetails,
        renderStaticUI,
        toggleTheme,
    }
})();


