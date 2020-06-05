const colors = require('./colors')

const metric_list = [
    "Bill",
    "Bill_had",
    "Bill_had_a_hat"
]

// const real_query = "rate(Bill_had_a_hat[5m])"
// const real_query = "rate(Bill_had[5m])"
const real_query = "rate(Bill_had[5m]) + rate(Bill[5m])"

for (metric of metric_list) {

    console.log("Query we're analysing: " + colors.BgWhite + colors.FgBlack + real_query + colors.Reset)

    console.log("Seaching for metric: " + colors.BgBlue + metric + colors.Reset)

    const regex_string = `(${metric}\\w*)`

    console.log("Regex string generated: " + colors.BgGreen + regex_string + colors.Reset)

    const name_regex = new RegExp(regex_string, "g")

    const regex_matches = real_query.match(name_regex)

    if (regex_matches) {
        console.log("    Regex match/es found! ---- " + colors.BgGreen + colors.FgBlack + JSON.stringify(regex_matches) + colors.Reset)

        for (regex_match of regex_matches) {
            console.log("    Checking match '" + colors.BgGreen + colors.FgBlack + regex_match + colors.Reset + "' is exactly '" + colors.BgBlue + metric + colors.Reset + "'...")

            if (regex_match === metric) { // probably can't be just the first in practice
                console.log(colors.FgGreen + "        ACTUAL REAL MATCH FOUND! YAY!" + colors.Reset)
            } else {
                console.log(colors.FgRed + "        match is not exact" + colors.Reset)
            }

        }

    }

    console.log(" ")

}



