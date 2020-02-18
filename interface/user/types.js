module.exports = `
	type Tokens {
		auth: String
		refresh: String
	}

	type User {
		_id: String
		name: String
		email: String
		uid: String
		team: Team
		tokens: Tokens
		status: String
	}
`;