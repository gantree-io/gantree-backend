module.exports = ({name, team}) => ({
	subject: `You're now the team owner for ${team}`,
	text: `
		${name} from team '${team}' has nominated you as the new team owner.
		You may have to logout and in again to receive your full prevledges.
	`,
	html: `
		<b>You're now the new team owner for ${team}.</b>
		<p>${name} from team '${team}' has nominated you as the new team owner.</p>
		<p>You may have to logout and in again to receive your full prevledges.</p>
		<p>Click here to visit your dashboard: <a href="${process.env.APP_URL}" target="_blank">${process.env.APP_URL}</a></p>
	`
})