module.exports = ({name, team}) => ({
	subject: 'Gantree Invitation',
	text: "Gantree Invitation: http://localhost:5000",
	html: `
		<b>You've been invited to Gantree</b>
		<p>${name} from team '${team}' has invited you to use gantree.</p>
		<p>Click this link to create your account: <a href="http://localhost:5000" target="_blank">http://localhost:5000</a></p>
	`
})