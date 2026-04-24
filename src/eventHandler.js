import { Render } from "./render";
import { Elements } from "./elements";
import { weatherStore } from "./store";
import { parseWeatherData } from "./parser";
import { formatTemp, debounce } from "./utils";

export const EventHandler = {
    isCelsius: true,
    isHourly: true,

    init() {
        this._HandleGlobalUI();
        this._HandleSearch();
        this._HandleChoosingLocation();
    },

    // Get results when searching for city
    _HandleSearch() {
        Elements.searchBar.addEventListener("input", async (e) => {
            const results = await _getLocations(e);
            // console.log(results);
            Render.renderDropdown(results);
        })

        // Delay function
        const handleSearch = debounce((e) => {
            return e.target.value;
        }, 1000);

        // Send request to Photon
        async function _getLocations(e) {
            let inputValue = await handleSearch(e);
            if (inputValue === "") {
                return;
            }

            const response = await fetch(
              `https://photon.komoot.io/api/?q=${inputValue}&limit=8&osm_tag=place:city&osm_tag=place:village&osm_tag=place:hamlet&lang=en`
            );
            const data = await response.json();
            const results = data.features.map(f => {
                const p = f.properties;
                let parts;
                if(p.osm_value === "city") {
                    parts = [p.name, p.state, p.country].filter(Boolean);
                } else {
                    parts = [p.name, p.county, p.state, p.country].filter(Boolean);
                }

                return {
                    id: crypto.randomUUID(),
                    name: p.name,
                    coordinates: {
                        lon: f.geometry.coordinates[0],
                        lat: f.geometry.coordinates[1]
                    },
                    string: parts.join(", ")
                };
            });
            return results;
        }
    },

    _HandleChoosingLocation () {
        Elements.dropdown.addEventListener("click", (e) => {
            const selected = e.target.closest("li");
            if (selected) {
                const lat = selected.dataset.lat;
                const lon = selected.dataset.lon;
                const city = selected.dataset.city;
                this._GetData(lat, lon).then(() => {
                    Render.renderToday(city);
                    Render.renderDetails();
                    Render.renderHourly();
                });
            }
        })
    },

    // Get data from VisualCrossing
    async _GetData (lat, lon) {
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}/next24hours/next7days?unitGroup=metric&elements=add%3AresolvedAddress%2Cremove%3AdatetimeEpoch%2Cremove%3Adew%2Cremove%3Amoonphase%2Cremove%3Aprecipcover%2Cremove%3Asevererisk%2Cremove%3Asnow%2Cremove%3Asnowdepth%2Cremove%3Asolarenergy%2Cremove%3Asolarradiation%2Cremove%3Asource%2Cremove%3Astations%2Cremove%3Avisibility%2Cremove%3Awindgust&key=7GBX57KDVY7Q9UARZPZP5DCHY&contentType=json`);
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

        //Hide/show search dropdown
        document.addEventListener("click", (e) => {
            const clickedInsideBar = e.target.closest("#input-search");

            if (clickedInsideBar) {
                if (Elements.searchBar.value === "") return;

                console.log("Click on input")
                Elements.dropdown.style.display = "block";
                return;
            }

            console.log("Click outside");
            Elements.dropdown.style.display = "none";
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
                Render.renderHourly();
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
                Render.renderWeek();
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