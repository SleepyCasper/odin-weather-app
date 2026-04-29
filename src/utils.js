import { parseISO, format } from 'date-fns';
import { weatherStore } from './store';
import { uk } from 'date-fns/locale';
import { translations, CONDITION_TRANSLATIONS } from './translation';

function getLocale() {
    return weatherStore.lang === 'uk' ? uk : undefined;
}

// Language

export function t(key) {
    return translations[weatherStore.lang]?.[key] ?? translations.en[key] ?? key;
}
 
export function translateCondition(condition) {
    if (weatherStore.lang === 'en') return condition;
    const parsed = parseCondition(condition);
    return CONDITION_TRANSLATIONS.uk[parsed] ?? condition;
}

// Date formatting 
export function formatDate(iso) {
    const dateObj = parseISO(iso);

    if(weatherStore.lang === "uk") {
        return format(dateObj, 'dd MMMM, yyyy', { locale: getLocale() });
    }

    return format(dateObj, 'MMMM do, yyyy', { locale: getLocale() });
}

export function formatDateWeek(iso) {
    const dateObj = parseISO(iso);
    if(weatherStore.lang === "uk") {
        return format(dateObj, 'dd MMMM', { locale: getLocale() });
    }
    return format(dateObj, 'MMMM, dd', { locale: getLocale() });
}

export function formatDay(iso) {
    const dateObj = parseISO(iso);

    const result = format(dateObj, 'EEEE', { locale: getLocale() });
    return result.charAt(0).toUpperCase() + result.slice(1);
}

export function formatTemp(celsius) {
    if (weatherStore.isCelsius) return `${Math.round(celsius)}`;
    return `${Math.round(celsius * 9/5 + 32)}`;
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

export function convertWindSp(speed) {
    const converted = (speed / 3.6).toFixed(1);
    return converted;
}

export function degToCardinal(deg) {
  const directions = ["n", "ne", "e", "se", "s", "sw", "w", "nw"];
  const index = Math.round((deg % 360) / 45) % 8;
  return directions[index];
}

export function isDaytime(currentTime, sunrise, sunset) {
    return currentTime >= sunrise && currentTime <= sunset;
}

export function parseCondition(string) {
    const raw = string;
    return raw.includes(",") ? raw.slice(0, raw.indexOf(",")).trim() : raw;
}