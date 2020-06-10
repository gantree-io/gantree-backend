const { get_mock_metric_list, get_mock_query } = require('./mocked')

const gen_regex_pairs = (metric_names) => {
    let metrics = []
    for (name of metric_names) {
        metrics.push({ name: name, regex_string: `(${name}\\w*)` })
    }
    return metrics
}

const scope_metrics = (query, metric_names, job_name) => {
    const metrics = gen_regex_pairs(metric_names)
    for (metric of metrics) {
        query = query.replace(new RegExp(metric.regex_string, "g"), (match_candidate) => {
            if (match_candidate === metric.name) {
                return `${match_candidate}{job="${job_name}"}`
            } else { return match_candidate }
        })
    }
    return query
}

// run the function
const new_query = scope_metrics(get_mock_query(), get_mock_metric_list(), "team1network1")

console.log("ORIGINAL: " + get_mock_query())
console.log("MODIFIED: " + new_query)
