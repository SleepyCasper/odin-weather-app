// What data I need:
// FOR CURRENT:
// adress:
// conditions:
// days.0.datetime:
// temp:
// days.0.tempmin:
// days.0.tempmax:

// FOR TODAY DETAILS:
// feelslike:
// winddir: and windspeed:
// precipprob: and preciptype:
// humidity:
// uvindex:
// pressure:
// sunrise:
// sunset:


// FOR HOURLY:
// get from days.0.hours
// condition:
// temp:
// precipprob:
// winddir: and windspeed:

// FOR WEEK:
// get from days.
// datetime:
// condition:
// tempmin: and tempmax:
// precipprob:
// winddir: and windspeed:

export const weatherStore = {
    current: null,
    details: null,
    hourly: null,
    week: null,
};
