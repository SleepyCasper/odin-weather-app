import { Render } from "./render";
import { Elements } from "./elements";
import { weatherStore } from "./store";
import { parseWeatherData } from "./parser";
import { debounce, t  } from "./utils";

export const EventHandler = {
    isHourly: true,
    lastResults: [],

    init() {
        this._HandleGlobalUI();
        this._HandleSearch();
        this._HandleChoosingLocation();
    },

    // Get results when searching for city
    _HandleSearch() {
        const spinner = document.getElementById("search-spinner");
        let spinnerTimeout; 

        Elements.searchBar.addEventListener("input", async (e) => {
            // Start spin animation
            clearTimeout(spinnerTimeout);                      // cancel previous
            spinnerTimeout = setTimeout(() => {                // delay to match debounce
                spinner.classList.add("active");
            }, 1000);

            const results = await _getLocations(e);

            // Finish spin animation
            clearTimeout(spinnerTimeout);                      // cancel if results came fast
            spinner.classList.remove("active");

            this.lastResults = results || [];
            console.log(this.lastResults);
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

            const lat = localStorage.getItem("lat") || 50.450001; // default Kyiv
            const lon = localStorage.getItem("lon") || 30.523333;
            const bias = `proximity:${lon},${lat}|countrycode:ua`;

            const response = await fetch(
              `https://api.geoapify.com/v1/geocode/autocomplete?text=${inputValue}&type=locality&bias=${encodeURIComponent(bias)}&limit=20&lang=${weatherStore.lang}&format=json&apiKey=2e4afcb0e2314c85a3e5dbd086fda082`
            );
            const data = await response.json();
            console.log(data)
            const ALLOWED_TYPES = ["city", "suburb", "district"];

            return data.results
                .filter(p => ALLOWED_TYPES.includes(p.result_type))
                .filter(p => p.country_code !== "ru")
                .slice(0, 10)
                .map(p => {
                    let name = p.city;
                    if(p.hamlet || p.village || p.name) {
                        name = p.hamlet || p.village || p.name;
                    }

                    let parts = [name, p.district, p.state, p.country];

                    return {
                        id: crypto.randomUUID(),
                        name,
                        coordinates: {
                            lat: p.lat,
                            lon: p.lon,
                        },
                        string: parts.filter(Boolean).join(", "),
                    };
                });
        }
    },

    _HandleChoosingLocation () {
        Elements.dropdown.addEventListener("click", (e) => {
            const selected = e.target.closest("li");
            if (selected) {
                this.lastResults = [];
                console.log(this.lastResults)
                Elements.searchBar.placeholder = selected.textContent;
                Elements.searchBar.value = "";
                Elements.dropdown.style.display = "none";

                const lat = selected.dataset.lat;
                const lon = selected.dataset.lon;
                const city = selected.dataset.city;
                this._GetData(lat, lon).then(() => {
                    weatherStore.city = city;
                    localStorage.setItem("city", city);
                    localStorage.setItem("lat", lat);
                    localStorage.setItem("lon", lon);
                    Render.renderToday(city);
                    Render.renderDetails();
                    Render.renderHourly();
                });
            }
        })
    },

    // Get data from VisualCrossing
    async _GetData (lat, lon) {
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}/next24hours/next15days?unitGroup=metric&elements=add%3AresolvedAddress%2Cremove%3AdatetimeEpoch%2Cremove%3Adew%2Cremove%3Amoonphase%2Cremove%3Aprecipcover%2Cremove%3Asevererisk%2Cremove%3Asnow%2Cremove%3Asnowdepth%2Cremove%3Asolarenergy%2Cremove%3Asolarradiation%2Cremove%3Asource%2Cremove%3Astations%2Cremove%3Avisibility%2Cremove%3Awindgust&key=7GBX57KDVY7Q9UARZPZP5DCHY&contentType=json`);
        const data = await response.json();
        parseWeatherData(data);
    },

    _HandleGlobalUI () {
        // Toggle degrees
        Elements.globalBtns.btnToggleDeg.addEventListener("click", (e) => {
            e.target.querySelectorAll("div").forEach( div => 
                div.classList.toggle("active"))

            if (e.target.classList.contains("c")) {
                e.target.classList.replace("c", "f");
                weatherStore.isCelsius = false;
                localStorage.setItem("isCelsius", false);
            } else if (e.target.classList.contains("f")) {
                e.target.classList.replace("f", "c");
                weatherStore.isCelsius = true;
                localStorage.setItem("isCelsius", true);
            }

            Render.renderToday(weatherStore.city);
            if (this.isHourly) {
                Render.renderHourly();
            } else { Render.renderWeek()}
            Render.renderDetails();
        })

        //Hide/show search dropdown
        Elements.searchBar.addEventListener("focus", () => {
            if (this.lastResults.length > 0) {
                Render.renderDropdown(this.lastResults);
            }
        });

        Elements.searchBar.addEventListener("blur", () => {
            setTimeout(() => {
                Elements.dropdown.style.display = "none";
            }, 150);
        });
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

        // Toggle details
        Elements.globalBtns.btnMore.addEventListener("click", (e) => {
            Elements.cardDetails.card.classList.toggle("expanded");
            Elements.cardHourly.card.classList.toggle("shrank");
            e.target.textContent = Elements.cardDetails.card.classList.contains("expanded")
                    ? t("showLess")
                    : t("showMore");
        })

        //Switch theme 
        Elements.globalBtns.btnTheme.addEventListener("click", (e) => {
            Render.toggleTheme(e.target);
        })

        // Toggle language
        Elements.globalBtns.btnToggleLang.addEventListener("click", () => {
            const newLang = weatherStore.lang === "en" ? "uk" : "en";
            weatherStore.lang = newLang;
            localStorage.setItem("lang", newLang);

            // Update button label
            Elements.globalBtns.btnToggleLang.textContent = newLang === "en" ? "UA" : "EN";

            // Re-render everything
            Render.renderStaticUI();
            Render.renderToday(weatherStore.city);
            Render.renderDetails();
            if (this.isHourly) {
                Render.renderHourly();
            } else {
                Render.renderWeek();
            }
        });
    }
}