module.exports = ({code}) => ({
	subject: 'Gantree Verification',
	text: `Gantree Verification code: ${code}`,
	html: `
		<p><strong>Verify your Gantree account</strong></p>
		<p>This email has been sent to you because your Gantree account is not yet verified.</p>
		<p>Enter the following code into your Gantree verification page: <strong>${code}</strong> .</p>
	`
})