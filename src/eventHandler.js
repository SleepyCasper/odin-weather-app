import { Render } from "./render";
import { Elements } from "./elements";
import { weatherStore } from "./store";
import { parseWeatherData } from "./parser";
import { formatTemp } from "./utils";

export const EventHandler = {
    isCelsius: true,

    init() {
        /* this._GetData(); */
        this._HandleGlobalUI();
    },

    async _GetData (location) {
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/next24hours/next7days?unitGroup=metric&elements=add%3AresolvedAddress%2Cremove%3AdatetimeEpoch%2Cremove%3Adew%2Cremove%3Amoonphase%2Cremove%3Aprecipcover%2Cremove%3Asevererisk%2Cremove%3Asnow%2Cremove%3Asnowdepth%2Cremove%3Asolarenergy%2Cremove%3Asolarradiation%2Cremove%3Asource%2Cremove%3Astations%2Cremove%3Avisibility%2Cremove%3Awindgust&key=7GBX57KDVY7Q9UARZPZP5DCHY&contentType=json`);
        const data = await response.json();
        console.log(data);

        parseWeatherData(data);
        console.log(weatherStore);
    },

    _HandleGlobalUI () {
        // Toggle degrees
        Elements.globalBtns.btnToggleDeg.addEventListener("click", (e) => {
            e.target.querySelectorAll("div").forEach( div => 
                div.classList.toggle("active"))

            if (e.target.classList.contains("c")) {
                e.target.classList.replace("c", "f");
                this.isCelsius = false;
                return;
            }

            if (e.target.classList.contains("f")) {
                e.target.classList.replace("f", "c");
                this.isCelsius = true
            }

            // re-render cards here
        })

        //Toggle hourly/week
        Elements.globalBtns.btnToggleHourly.addEventListener("click", (e) => {
            e.preventDefault();
            const tabWeek = e.currentTarget.querySelector("a.week");
            const tabToday = e.currentTarget.querySelector("a.today");

            if (e.target.classList.contains("today")) {
                //! move this to Render
                tabToday.classList.add("active");
                tabWeek.classList.remove("active");
                Elements.cardHourly.wrapperHourly.classList.add("active");
                Elements.cardHourly.wrapperWeek.classList.remove("active");

                Elements.cardHourly.containerDetails.innerHTML = `
                    <p>Temperature</p>
                    <p>Feels like</p>
                    <p>Precipitation</p>
                    <p>Wind</p>
                `
                // Generate hours cards
                return;
            }

            if (e.target.classList.contains("week")) {
                tabWeek.classList.add("active");
                tabToday.classList.remove("active");
                Elements.cardHourly.wrapperWeek.classList.add("active");
                Elements.cardHourly.wrapperHourly.classList.remove("active");

                Elements.cardHourly.containerDetails.innerHTML = `
                    <p>Temperature</p>
                    <p>Precipitation</p>
                    <p>Wind</p>
                `
                // Generate days cards
            }
        })

        Elements.globalBtns.btnMore.addEventListener("click", (e) => {
            Elements.cardDetails.card.classList.toggle("expanded");
            Elements.cardHourly.card.classList.toggle("shrank");
            if (Elements.cardDetails.card.classList.contains("expanded")) {
                e.target.textContent = "Show less";
            } else {
                e.target.textContent = "Show more";
            }
        })
    }
}