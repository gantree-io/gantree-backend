module.exports = `
	type Team {
		_id: String
		name: String
		owner: User
		users: [User]
	}
`;