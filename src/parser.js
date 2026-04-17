import { weatherStore } from "./store";

export function parseWeatherData(data) {
    const today = data.days[0];
    const current = data.currentConditions;

    weatherStore.current = {
        address:    data.resolvedAddress,
        conditions: current.conditions,
        datetime:   today.datetime,
        temp:       current.temp,
        tempmin:    today.tempmin,
        tempmax:    today.tempmax,
    };

    weatherStore.details = {
        feelslike:   today.feelslike,
        winddir:     today.winddir,
        windspeed:   today.windspeed,
        precipprob:  today.precipprob,
        preciptype:  today.preciptype,
        humidity:    today.humidity,
        uvindex:     today.uvindex,
        pressure:    today.pressure,
        sunrise:     today.sunrise,
        sunset:      today.sunset,
    };

    weatherStore.hourly = today.hours.map(h => ({
        datetime:   h.datetime,
        conditions: h.conditions,
        temp:       h.temp,
        precipprob: h.precipprob,
        winddir:    h.winddir,
        windspeed:  h.windspeed,
    }));

    weatherStore.week = data.days.map(d => ({
        datetime:   d.datetime,
        conditions: d.conditions,
        tempmin:    d.tempmin,
        tempmax:    d.tempmax,
        precipprob: d.precipprob,
        winddir:    d.winddir,
        windspeed:  d.windspeed,
    }));
}