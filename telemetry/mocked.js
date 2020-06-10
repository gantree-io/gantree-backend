const get_mock_metric_list = () => {
    return [
        "Bill",
        "Bill_had",
        "Bill_had_a_hat"
    ]
}

const get_mock_query = () => {
    return "rate(Bill_had[5m]) + rate(Bill[5m])"
}

module.exports = {
    get_mock_metric_list,
    get_mock_query
}