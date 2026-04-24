import { weatherStore } from "./store";
import { convertWindSp } from "./utils";

export function parseWeatherData(data) {
    const today = data.days[0];
    const tomorrow = data.days[1];
    const current = data.currentConditions;

    const currentHour = new Date().toLocaleTimeString('en-GB', {
        hour: '2-digit'
    })
    
    const hoursToday = today.hours.slice(currentHour);         
    const hoursNeeded = 24 - hoursToday.length;                
    const hoursTomorrow = tomorrow
        ? tomorrow.hours.slice(0, hoursNeeded)
        : [];
        
    const next24Hours = [...hoursToday, ...hoursTomorrow];

    weatherStore.current = {
        address:    data.resolvedAddress,
        conditions: current.conditions,
        datetime:   current.datetime,
        date:       today.datetime,
        temp:       current.temp,
        tempmin:    today.tempmin,
        tempmax:    today.tempmax,
    };

    weatherStore.details = {
        feels:       current.feelslike,
        winddir:     today.winddir,
        windspeed:   convertWindSp(today.windspeed),
        precipprob:  today.precipprob,
        preciptype:  today.preciptype,
        humidity:    today.humidity,
        uvindex:     today.uvindex,
        pressure:    today.pressure,
        sunrise:     today.sunrise.slice(0, 5),
        sunset:      today.sunset.slice(0, 5),
    };

    weatherStore.hourly = next24Hours.map(h => ({
        datetime:   h.datetime.slice(0, 5),
        conditions: h.conditions,
        temp:       h.temp,
        feelslike:  h.feelslike,
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
