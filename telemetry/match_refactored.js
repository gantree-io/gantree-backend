const colors = require('./colors')

// mock function
function get_metric_name_list() {
    return [
        "Bill",
        "Bill_had",
        "Bill_had_a_hat"
    ]
}

// GENERAL PROCESS:
//
// for each metric name, generate a regex
//     if the regex returns any matches
//         for each match
//             if the match is exact
//                 replace the match with a scoped version

// mock an original query
const original_query = "rate(Bill_had[5m]) + rate(Bill[5m])"

// create place for regex list thing
const metrics = []

// get metric names
const metric_name_list = get_metric_name_list()

// for each metric name
for (metric_name of metric_name_list) {
    // create a regex string
    const regex_string = `(${metric_name}\\w*)`
    // store regex string alongside metric name
    metrics.push({
        name: metric_name,
        regex_string: regex_string
    })
}

// job name to append to metrics
const job_name = "team1network1"

// create a version of the query we can modify
let modified_query = original_query

// for each metric
for (metric of metrics) {
    console.log(`replacing metric '${metric.name}' with regex '${metric.regex_string}'`)
    // replace regex matches
    modified_query = modified_query.replace(new RegExp(metric.regex_string, "g"), (match_candidate) => {
        console.log("verifying query match is exact (" + match_candidate + " == " + metric.name + ")")
        // only if match is exact to metric name
        if (match_candidate === metric.name) {
            console.log(colors.FgGreen + "valid" + colors.Reset)
            // return scoped version of match
            return `${match_candidate}{job="${job_name}"}`
        } else {
            console.log(colors.FgRed + "skipped replace: match not exact" + colors.Reset)
            // return original match
            return match_candidate
        }
    })
}

console.log("ORIGINAL: " + original_query)
console.log("MODIFIED: " + modified_query)
