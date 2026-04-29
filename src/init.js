import { Elements } from "./elements";
import { EventHandler } from "./eventHandler";
import { Render } from "./render";
import { weatherStore } from "./store";

export const Init = (function() {
    // Theme
    const theme = localStorage.getItem("theme");
    if(theme === "light") {
        document.documentElement.classList.toggle("light");
        Elements.globalBtns.btnTheme.classList.replace("dark", "light");
        document.querySelector("#theme-checkbox").checked = true;
    }

    // Language
    const lang = localStorage.getItem("lang") || "en";
    weatherStore.lang = lang;
    Elements.globalBtns.btnToggleLang.textContent = lang === "en" ? "UA" : "EN";

    // Default or stored location
    const city = localStorage.getItem("city") || "Kyiv";
    const lat = localStorage.getItem("lat") || 50.450001;
    const lon = localStorage.getItem("lon") || 30.523333;
    const degree = localStorage.getItem("isCelsius");
    weatherStore.isCelsius = degree !== null ? degree === "true" : true;

    // Degree switch 
    const btnToggle = Elements.globalBtns.btnToggleDeg;
    const divC = btnToggle.querySelector("#cel");
    const divF = btnToggle.querySelector("#far");
    if (weatherStore.isCelsius == true) {
        btnToggle.classList.replace("f", "c");
        divC.className = "active";
        divF.className = "";
    } else { 
        Elements.globalBtns.btnToggleDeg.classList.replace("c", "f");
        divF.className = "active";
        divC.className = "";
    }

    //Send API request
    EventHandler._GetData(lat, lon).then(() => {
        weatherStore.city = city;
        Render.renderStaticUI();
        Render.renderToday(city);
        Render.renderDetails();
        Render.renderHourly();
    })
})();