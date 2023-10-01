const axios = require("axios");
const fs = require("fs");
const moment = require("moment");
const {
    path,
    url,
    initialSinceDate,
    initialUntilDate,
    getData
} = require("./config");


const diffDays = moment(initialUntilDate).diff(initialSinceDate, "days");
const firstcall = 0;
console.log({diffDays});




let sinceDate = moment(initialSinceDate);
let untilDate = moment(initialSinceDate).add(1, "day");

const getLogsCSV = async () => {

    let i = 0;
    const interval = setInterval(() => {
        //making queries

        const sinceQuery = `${sinceDate.get("year")}-${Number(
            sinceDate.get("months") + 1
        )
            .toString()
            .padStart(2, 0)}-${sinceDate
                .get("dates")
                .toString()
                .padStart(2, 0)}T${sinceDate
                    .get("hours")
                    .toString()
                    .padStart(2, 0)}%3A${sinceDate
                        .get("minutes")
                        .toString()
                        .padStart(2, 0)}%3A00`;
        
        const untilQuery = `${untilDate.get("year")}-${Number(
            untilDate.get("months") + 1
        )
            .toString()
            .padStart(2, 0)}-${untilDate
                .get("dates")
                .toString()
                .padStart(2, 0)}T${untilDate
                    .get("hours")
                    .toString()
                    .padStart(2, 0)}%3A${untilDate
                        .get("minutes")
                        .toString()
                        .padStart(2, 0)}%3A00`;

        const URLCompleted = `${url}since=${sinceQuery}&until=${untilQuery}&q=`;
        console.log(63,{ sinceDate });
        console.log(64,{ untilDate });

        if (i >= firstcall) {
            console.log('primera llamada')
            getData(false,URLCompleted)
            .then((data) => {
                fs.writeFileSync(path, data, 'utf-8')
            })
            .catch(error => { clearInterval(interval); console.log(error) });
        } else {
            console.log('segunda llamada')
            getData(true,URLCompleted)
            .then((data) => {
                fs.appendFileSync(path, data, 'utf-8')
            })
            .catch(error => { clearInterval(interval); console.log(error) });
        }
        i++;
        untilDate.add(1, "day");
        sinceDate.add(1, "day");
        if (i >= diffDays) {
            clearInterval(interval);
        }
    }, 1000);
};

getLogsCSV();
