const moment = require('moment');
const axios = require('axios')
const timeStamp = new Date();


const dates = {
    sinceYear:2023,
    sinceMount:9,
    sinceDate:21,
    untilYear:2023,
    untilMount:9,
    untilDate:30,
}

const initialSinceDate = moment(`${dates.sinceYear}-${(Number(dates.sinceMount)).toString().padStart(2,0)}-${(Number(dates.sinceDate)).toString().padStart(2,0)} 06:00:00`).format( "YYYY-MM-DD HH:mm");
const initialUntilDate = moment(`${dates.untilYear}-${(Number(dates.untilMount)).toString().padStart(2,0)}-${(Number(dates.untilDate)).toString().padStart(2,0)} 06:00:00`).format( "YYYY-MM-DD HH:mm");

const apiKey = `SSWS 007jqNreyFLfm76qRcUaO2b3tfZYudeDs06DvVfL4F`

const getData = (discardHeaders = false,url) => {
    //console.log({ url });
    return new Promise((resolve, reject) => {
        axios
            .get(url, { headers: { Authorization: apiKey } })
            .then((resp) => {
                const lines = resp.data.split("\n");
                console.log('lines',lines)
                if (discardHeaders) {
                    console.log('length without',lines.length -2 );
                    const linesWithoutHeaders = lines.slice(1).join("\n");
                    //console.log(linesWithoutHeaders);
                    resolve({data:linesWithoutHeaders,records:(lines.length - 2)});
                } else {
                    console.log('length with headers',lines.length-3);
                    //console.log(resp.data)
                    resolve({data:resp.data,records:lines.length - 3});
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
};

module.exports = {
    url : "https://hpe-gl-dev2-hub-admin.oktapreview.com/sage/api/v1/logs/csv?",
    path: `${timeStamp.getFullYear()}-${(timeStamp.getMonth() + 1).toString().padStart(2, 0)}-${timeStamp.getDate()}T${timeStamp.getHours()}-${timeStamp.getMinutes()}-logs.csv`,
    dates,
    initialSinceDate,
    initialUntilDate,
    getData,
}

const urlComplete = "https://hpe-gl-dev2-hub.oktapreview.com/sage/api/v1/logs/csv?since=2023-09-22T06%3A00%3A00Z&until=2023-09-23T05%3A59%3A59Z&q="