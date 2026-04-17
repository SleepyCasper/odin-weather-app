export function formatTemp(celsius, isCelsius) {
    if (isCelsius) return `${Math.round(celsius)}°`;
    return `${Math.round(celsius * 9/5 + 32)}°`;
}