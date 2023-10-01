const moment = require('moment');
const axios = require('axios')
const timeStamp = new Date();


const dates = {
    sinceYear:2023,
    sinceMount:8,
    sinceDate:27,
    sinceHour:0,
    sinceMinute:0,
    untilYear:2023,
    untilMount:9,
    untilDate:5,
    untilHour:0,
    untilMinute:0
}

const initialSinceDate =  moment(`${dates.sinceYear}-${(Number(dates.sinceMount)).toString().padStart(2,0)}-${(Number(dates.sinceDate)).toString().padStart(2,0)} ${(Number(dates.sinceHour)).toString().padStart(2,0)}:${(Number(dates.sinceMinute)).toString().padStart(2,0)}:00`).format( "YYYY-MM-DD HH:mm");
const initialUntilDate = moment(`${dates.untilYear}-${(Number(dates.untilMount)).toString().padStart(2,0)}-${(Number(dates.untilDate)).toString().padStart(2,0)} ${(Number(dates.untilHour)).toString().padStart(2,0)}:${(Number(dates.untilMinute)).toString().padStart(2,0)}:00`).format( "YYYY-MM-DD HH:mm");


const apiKey = `SSWS 007jqNreyFLfm76qRcUaO2b3tfZYudeDs06DvVfL4F`


let records = 0

const getData = (discardHeaders = false,url) => {
    console.log({ url });
    return new Promise((resolve, reject) => {
        axios
            .get(url, { headers: { Authorization: apiKey } })
            .then((resp) => {
                const lines = resp.data.split("\n");
                //console.log('length',lines.length);
                if (discardHeaders) {
                    console.log(lines.length -1,' records') 
                    const linesWithoutHeaders = lines.slice(1).join("\n");
                    resolve(linesWithoutHeaders);
                } else {
                    console.log(lines.length,' records') 
                    resolve(resp.data);
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
};




module.exports = {
    url : "https://hpe-gl-dev2-hub.oktapreview.com/sage/api/v1/logs/csv?",
    path: `${timeStamp.getFullYear()}-${(timeStamp.getMonth() + 1).toString().padStart(2, 0)}-${timeStamp.getDate()}T${timeStamp.getHours()}-${timeStamp.getMinutes()}-logs.csv`,
    dates,
    initialSinceDate,
    initialUntilDate,
    getData,
    records

}

const urlComplete = "https://hpe-gl-dev2-hub.oktapreview.com/sage/api/v1/logs/csv?since=2023-09-22T06%3A00%3A00Z&until=2023-09-23T05%3A59%3A59Z&q="