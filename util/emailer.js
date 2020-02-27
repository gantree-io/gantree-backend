const nodemailer = require("nodemailer");

// TODO: this needs to bo hooked up to a delivery service
// currently in test mode

const send = async (template, {sender, to, vars}) => {
	try {
		let testAccount = await nodemailer.createTestAccount();

		let transporter = nodemailer.createTransport({
			host: "smtp.ethereal.email",
			port: 587,
			secure: false,
			auth: {
				user: testAccount.user,
				pass: testAccount.pass 
			}
		});

		let _template = template(vars)

		let info = await transporter.sendMail({
			from: `"${sender.name}" <${sender.email}>`,
			to: to,
			..._template
		});

		console.log(nodemailer.getTestMessageUrl(info))
	} catch(e) {
		console.log(e);
		return false
	}

	return true
}


module.exports = {
	send: send
}