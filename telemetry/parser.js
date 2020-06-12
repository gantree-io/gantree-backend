/**
 * @module parser parses PromQL queries
 */

function promql_object(metric, params = {}) {
    return {
        metric: metric,
        params: params
    }
}

/**
 * 
 * @param {String} string - PromQL string to get params from
 * @returns {Match} object in shape of .match result
 */
function extract_params(string) {
    const matches = string.match(/\{(.*)\}/)
    if (matches) {

    } else {
        return
    }
    return matches
}

const PromQL = {
    toObject(string) {
        // search for curly brackets
        const matches = string.match(/\{(.*)\}/)

        // has curly brackets
        if (matches) {
            // console.log(matches)
            const metric = matches.input.replace(matches[0], "")
            // get params without curlies, split by commas, remove whitespace
            const params = matches[1].split(",").map((item) => {
                return item.trim()
            }).forEach((param) => {
                return ["a"]
            })
            // for (param of params) {
            //     console.log("param: " + param)
            //     // split by =
            //     const [name, key] = params.split("=")

            // }
            console.log(metric)
            console.log(params)
            return (promql_object(metric, params))
        }
        // no curly brackets
        else {

        }

        // if ("{" in string) {
        //     console.log("has params")
        // }
        // else {
        //     console.log("has no params")
        // }
        // console.log("to object")
    },
    toString(object) {
        console.log("to string")
    }
}

console.log("----no params")
PromQL.toObject('hello')
console.log("----one param")
PromQL.toObject('hello{job="jobname"}')
console.log("----two params")
PromQL.toObject('hello{job="jobname", instance="101.243.12.34"}')
console.log("----something complex")
PromQL.toObject('rate(polkadot_sub_libp2p_connections_opened_total[5m]) + 10')

// PromQL.toString("")

module.exports = {
    PromQL
}