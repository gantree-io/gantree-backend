module.exports = ({team, name}) => ({
	subject: `You're now the team owner for ${team}`,
	text: "Gantree Team Owner...",
	html: `
		<b>You're now the new team owner for ${team}.</b>
		<p>${name} from team '${team}' has nominated you as the new team owner.</p>
		<p>You may have to logout and in again to receive your full prevledges.</p>
		<p>Click here to visit your dashboard: <a href="http://localhost:5000" target="_blank">http://localhost:5000</a></p>
	`
})