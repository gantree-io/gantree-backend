const got = require('got')
const promIp = 'http://64.225.2.22' // TODO: FIXME: do not leave this static
const promPort = 9090
const apiWhitelist = [
    "/api/v1/query_range",
    // "/api/v1/metadata",
    // "/api/v1/label/__name__/values",
    // "/api/v1/series"
]

// This is terrible, terrible code, but I'm totally out of my depth here
const addJobScope = (req, job) => {
    // if the query contains an opening curly
    if (req.query.query.includes("{")) {
        // split after first {
        // 'polkadot_block_height{instance="157.245.8.4:80",}'
        let separate_filters = req.query.query.split("{")
        console.log("filters separated:" + separate_filters)
        // [ 'polkadot_block_height' , instance="157.245.8.4:80",}

        let filters = separate_filters[1].split(",")
        console.log("filters:" + filters)
    }
    // no opening curly
    else {
        // add {job="JOB_NAME"} to query
        req.query.query = `${req.query.query}{job="${job}"}` // w/o double quotes you're given everything
    }
    console.log("modified query:" + req.query.query)
    return req
}

const queryModifiers = {
    "/api/v1/query_range": addJobScope
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
    const job = "team1network1"
    // modify requests originalUrl such that the "query" query has a job scope added to the end of it (i.e. query{job=jobname})
    // req.originalUrl = req.originalUrl.replace(req.query.query, `${req.query.query}%7Bjob%3D"${job}"%7D`)

    if (apiWhitelist.includes(req.params[0])) {
        switch (req.params[0]) {
            case "/api/v1/query_range":
                req = addJobScope(req, "team1network1")
                break
        }
        const result = await got(`${promIp}:${promPort}${req.originalUrl}`, { method: 'GET', searchParams: { ...req.query } })
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
