module.exports = ({name, team}) => ({
	subject: 'Gantree Invitation',
	text: `Gantree Invitation: ${process.env.APP_URL}`,
	html: `
		<b>You've been invited to Gantree</b>
		<p>${name} from the team '${team}' has invited you to use gantree.</p>
		<p>Click here to log in and access your account: <a href="${process.env.APP_URL}" target="_blank">${process.env.APP_URL}</a>.</p>
		<b>(Ps: Use this email address to login)</b>
	`
})