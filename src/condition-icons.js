const BASE = "/media/weather/";

const CONDITION_MAP = {
    "Blowing Or Drifting Snow":             "drifting-snow.svg",       
    "Clear":                                [ "sun.svg", "night-sun.svg" ],
    "Diamond Dust":                         "diamond-dust.svg",
    "Drizzle":                              "drizzle.svg",
    "Dust storm":                           "dust-storm.svg",
    "Fog":                                  "fog.svg",
    "Freezing Drizzle/Freezing Rain":       "freezing-drizzle.svg",
    "Freezing Fog":                         "freezing-fog.svg",
    "Funnel Cloud/Tornado":                 "tornado.svg",
    "Hail":                                 "hail.svg",
    "Hail Showers":                         "hail-showers.svg",
    "Heavy Drizzle":                        "heavy-drizzle.svg",
    "Heavy Drizzle/Rain":                   "heavy-drizzle-rain.svg",
    "Heavy Freezing Drizzle/Freezing Rain": "heavy-freezing-drizzle.svg",
    "Heavy Freezing Rain":                  "heavy-rain-snow.svg",
    "Heavy Rain":                           "heavy-rain.svg",
    "Heavy Rain And Snow":                  "heavy-rain-snow.svg",
    "Heavy Snow":                           "heavy-snow.svg",
    "Ice":                                  "ice",
    "Light Drizzle":                        [ "light-drizzle.svg", "night-light-drizzle.svg" ],
    "Light Drizzle/Rain":                   "drizzle.svg",
    "Light Freezing Drizzle/Freezing Rain": "freezing-drizzle.svg",
    "Light Freezing Rain":                  "freezing-drizzle.svg",
    "Light Rain":                           [ "light-rain.svg", "night-light-rain.svg" ],
    "Light Rain And Snow":                  [ "light-rain-snow.svg", "night-light-rain-snow.svg" ],
    "Light Snow":                           "light-snow.svg",
    "Lightning Without Thunder":            "lightning-no-thunder.svg",
    "Mist":                                 "fog.svg",
    "Overcast":                             "overcast.svg",
    "Partially cloudy":                     [ "partly-cloudy.svg", "night-partly-cloudy.svg" ],
    "Precipitation In Vicinity":            "",
    "Rain":                                 "rain.svg",
    "Rain Showers":                         "heavy-rain.svg",
    "Sky Coverage Decreasing":              "",
    "Sky Coverage Increasing":              "",
    "Sky Unchanged":                        "",
    "Smoke Or Haze":                        "smog.svg",
    "Snow":                                 "snow.svg",
    "Snow And Rain Showers":                "heavy-rain-snow.svg",
    "Snow Showers":                         "heavy-snow.svg",
    "Squalls":                              "squalls.svg",
    "Thunderstorm":                         "thunderstorm.svg",
    "Thunderstorm Without Precipitation":   "thunderstorm-no-rain.svg"
};

const FALLBACK = "sun.svg";

export function getWeatherIcon(condition, isDay = true) {
    const entry = CONDITION_MAP[condition] ?? FALLBACK;

    if (Array.isArray(entry)) {
        return BASE + (isDay ? entry[0] : entry[1]);
    }
    return BASE + entry;
}
