/**
 * Create a regex pair for each item of input list
 * @param {Array} metric_names
 * @returns Array of regex pair objects
 */
const _gen_regex_pairs = (metric_names) => {
    let metrics = []
    for (name of metric_names) {
        metrics.push({ name: name, regex_string: `(${name}\\w*)` })
    }
    return metrics
}

/**
 * Scope all metrics in a PromQL query to a specific job
 * @param {String} query - query to scope metrics of
 * @param {Array} metric_names - names of metrics to scope
 * @param {String} job_name - name of job to append
 * @returns scoped version of query
 */
const scope_metrics = (query, metric_names, job_name) => {
    const metrics = _gen_regex_pairs(metric_names)
    for (metric of metrics) {
        query = query.replace(new RegExp(metric.regex_string, "g"), (match_candidate) => {
            if (match_candidate === metric.name) {
                return `${match_candidate}{job="${job_name}"}`
            } else { return match_candidate }
        })
    }
    return query
}

module.exports = {
    scope_metrics
}
