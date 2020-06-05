const colors = require('./colors')

const metric_list = [
    "Bill",
    "Bill_had",
    "Bill_had_a_hat"
]

// const real_query = "rate(Bill_had_a_hat[5m])"
// const real_query = "rate(Bill_had[5m])"
const real_query = "rate(Bill_had[5m]) + rate(Bill[5m])"
// const real_query = "rate(Bill_had_a_hat[5m])"

let valid_matches = []

for (metric of metric_list) {

    console.log("Query we're analysing: " + colors.BgWhite + colors.FgBlack + real_query + colors.Reset)

    console.log("Seaching for metric: " + colors.BgBlue + metric + colors.Reset)

    const regex_string = `(${metric}\\w*)`

    console.log("Regex string generated: " + colors.BgGreen + regex_string + colors.Reset)

    const name_regex = new RegExp(regex_string, "g")

    const regex_matches = real_query.match(name_regex)

    if (regex_matches) {
        console.log("    Regex match/es found! ---- " + colors.BgGreen + colors.FgBlack + JSON.stringify(regex_matches) + colors.Reset)

        for (const [regex_match_index, regex_match] of regex_matches.entries()) {
            console.log("    Checking match '" + colors.BgGreen + colors.FgBlack + regex_match + colors.Reset + "' is exactly '" + colors.BgBlue + metric + colors.Reset + "'...")

            if (regex_match === metric) { // probably can't be just the first in practice
                console.log(colors.FgGreen + "        ACTUAL REAL MATCH FOUND! YAY!" + colors.Reset)
                valid_matches.push({
                    regex_obj: name_regex,
                    regex_string: regex_string,
                    match: regex_match,
                    match_index: regex_match_index
                })
            } else {
                console.log(colors.FgRed + "        match is not exact" + colors.Reset)
            }

        }

    }

    console.log(" ")

}

console.log("----VALID MATCHES---- ")
for (valid_match of valid_matches) {
    console.log(JSON.stringify(valid_match))
}
console.log(" ")

let modified_query = real_query

for (valid_match of valid_matches) {
    console.log(`----[${valid_match.match_index}]`)
    console.log("valid match: " + JSON.stringify(valid_match))
    console.log("expected match: " + valid_match.match)

    const valid_regexp = valid_match.regex_obj
    modified_query = modified_query.replace(valid_regexp, (match_candidate) => {
        // if (metric_list.includes(match_candidate)) { //gives false positives
        console.log("--")
        console.log("candidate: " + match_candidate)
        if (match_candidate === valid_match.match) {
            console.log("real match: " + match_candidate)
            const changed = `${match_candidate}{job="some_name"}`
            console.log("replaced with: " + changed)
            return changed
        } else {
            console.log("bad match: " + match_candidate)
            return match_candidate
        }
        // console.log("match candidate: " + match_candidate)
        // console.log("match we got earlier: " + valid_match.match)
        // console.log(match_candidate + " === " + valid_match.match)
        // if (match_candidate === valid_match.match) {
        //     return `${match_candidate}{job="some_name"}`
        // } else {
        //     return match_candidate
        // }
    })
    console.log("replace for " + valid_match.match + ": " + modified_query)
}

// use this regex, run a function for each match you find
// function
// for each regex match, check it is an exact metric name


console.log(modified_query)
