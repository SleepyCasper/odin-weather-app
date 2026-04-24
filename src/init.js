import { EventHandler } from "./eventHandler";
import { Render } from "./render";
import { weatherStore } from "./store";

export const Init = (function() {
    // Default location
    const city = "Kyiv";
    EventHandler._GetData(50.450001, 30.523333).then(() => {
        Render.renderToday(city);
        Render.renderDetails();
        Render.renderHourly();
    })
})();