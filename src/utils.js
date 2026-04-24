import { parseISO, format } from 'date-fns';

export function formatTemp(celsius, isCelsius) {
    if (isCelsius) return `${Math.round(celsius)}°`;
    return `${Math.round(celsius * 9/5 + 32)}°`;
}

export function debounce(func, delay) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        return new Promise((resolve) => {
            timer = setTimeout(() => {
                resolve(func.apply(this, args));
            }, delay);
        });
    };
}

export function formatDate(iso) {
    const dateObj = parseISO(iso);

    const result = format(dateObj, 'MMMM do, yyyy'); 
    return result;
}

export function formatDay(iso) {
    const dateObj = parseISO(iso);

    const result = format(dateObj, 'EEEE');
    return result;
}

export function convertWindSp(speed) {
    const converted = (speed / 3.6).toFixed(1);
    return converted;
}

export function isDaytime(currentTime, sunrise, sunset) {
    return currentTime >= sunrise && currentTime <= sunset;
}