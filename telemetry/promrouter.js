const got = require('got')
const { scope_metrics } = require('./query_modifier')

const PROM_IP = 'http://64.225.2.22' // TODO: FIXME: do not leave this static
const PROM_PORT = 9090
const apiWhitelist = [
    "/api/v1/query_range",
    // "/api/v1/metadata",
    // "/api/v1/label/__name__/values",
    // "/api/v1/series"
]

function log_promql_query(req) {
    if (!req) { console.log("req arg missing") }
    if (req.query && req.query.query) { console.log(`\n--PromQL Query: ${req.query.query}\n`) }
    else { console.log("no req.query.query found") }
}

async function get_metric_names(req) {
    const metadata = await got(`${PROM_IP}:${PROM_PORT}/api/v1/metadata`, { method: 'GET', searchParams: { ...req.query } })
    const raw_metric_list = JSON.parse(metadata.body)
    let metric_names = []
    for (key in raw_metric_list.data) { metric_names.push(key) }
    return metric_names
}

/**
 * Route the request to/from prometheus
 * @param {Object} req
 * @param {Object} res
 */
const handleReq = async (req, res) => {
    // TODO: is below handled with any weird JS-ness? Is this secure?
    console.log("params:" + JSON.stringify(req.params))
    console.log("original url:" + req.originalUrl)

    // unique network name to scope to in query
    const job_name = "team1network1"

    // Get list of metric names
    const metric_names = await get_metric_names(req)

    // log the promql query if it exists
    log_promql_query(req)

    // ---NO WHITELIST BELOW, COMMENT OUT UNLESS TESTING
    // const result = await got(`${PROM_IP}:${PROM_PORT}${req.originalUrl}`, { method: 'GET', searchParams: { ...req.query } })
    // // console.log(result)
    // console.log(result.requestUrl)
    // return result.body
    // ---NO WHITELIST ABOVE, COMMENT OUT UNLESS TESTING

    if (apiWhitelist.includes(req.params[0])) {
        switch (req.params[0]) {
            case "/api/v1/query_range":
                req.query.query = scope_metrics(req.query.query, metric_names, job_name)
                console.log("scoped query: " + req.query.query)
                break
        }
        const result = await got(`${PROM_IP}:${PROM_PORT}${req.originalUrl}`, { method: 'GET', searchParams: { ...req.query } })
        // console.log(result)
        console.log(result.requestUrl)
        return result.body
    } else {
        res.status(403).send("Forbidden: path not in authorized whitelist")
    }
}

module.exports = {
    handleReq
}
