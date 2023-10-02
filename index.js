const fs = require("fs");
const moment = require("moment");
const {
    path,
    url,
    initialSinceDate,
    initialUntilDate,
    getData,
} = require("./config");


if (!moment(initialSinceDate).isValid() || !moment(initialUntilDate).isValid()) {
    throw new Error('invalid dates')
}

const diffDays = moment(initialUntilDate).diff(initialSinceDate, "days");
const firstcall = 0;
let interval = undefined
let logs = 0;
let i = 0;
console.log({ diffDays });

if (diffDays < 0) {
    throw new Error('since dates must be lower then until dates')
}

let sinceDate = moment(initialSinceDate);
let untilDate = moment(initialSinceDate).add(1, "day");



const getLogs = async (discardHeaders, url) => {
    try {
        if (!discardHeaders) {
            console.log('trigger')
            const { data, records } = await getData(discardHeaders, url);
            console.log('sum');
            logs = logs + records
            fs.writeFileSync(path, data, 'utf-8')
        } else {
            console.log('trigger');
            const { data, records } = await getData(discardHeaders, url);
            console.log('sum');
            logs = logs + records
            fs.appendFileSync(path, data, 'utf-8')
        }
        if (i >= diffDays) {
            console.log(logs, ' records')
            clearInterval(interval);
        }

    } catch (error) {
        console.log(error)
        clearInterval(interval)
    }
}

const getLogsCSV = async () => {


    interval = setInterval(() => {
        console.log({ i })
        //making queries

        const sinceQuery = `${sinceDate.get("year")}-${Number(
            sinceDate.get("months") + 1
        )
            .toString()
            .padStart(2, 0)}-${sinceDate
                .get("dates")
                .toString()
                .padStart(2, 0)}T06%3A00%3A00Z`;
        const untilQuery = `${untilDate.get("year")}-${Number(
            untilDate.get("months") + 1
        )
            .toString()
            .padStart(2, 0)}-${untilDate
                .get("dates")
                .toString()
                .padStart(2, 0)}T06%3A00%3A00Z`;
        const URLCompleted = `${url}since=${sinceQuery}&until=${untilQuery}&filter=eventType+eq+%22user.session.start%22+and+outcome.result+eq+%22FAILURE%22`;
        if (i <= firstcall) {
            getLogs(false, URLCompleted);
        } else {
            getLogs(true, URLCompleted);
        }
        untilDate.add(1, "day");
        sinceDate.add(1, "day");
        i++;
    }, 10000);
};

getLogsCSV();
