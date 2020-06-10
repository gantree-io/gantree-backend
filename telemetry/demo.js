const { scope_metrics } = require("./query_modifier")

const original_query = "rate(Bill_had[5m]) + rate(Bill[5m])"
const metric_list = [
    "Bill",
    "Bill_had",
    "Bill_had_a_hat"
]

const new_query = scope_metrics(original_query, metric_list, "team1network1")

console.log("original: " + original_query)
console.log("modified: " + new_query)
