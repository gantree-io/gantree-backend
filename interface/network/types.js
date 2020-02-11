module.exports = `
	type Node {
		_id: String
		name: String
		ip: String
		provider: String
		status: String
		type: String
	}

	type Network {
		_id: String
		name: String
		config: Config
		nodes: [Node]
	}
`;