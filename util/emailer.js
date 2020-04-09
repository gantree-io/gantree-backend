const nodemailer = require("nodemailer");
const sgMail = require('@sendgrid/mail');

const EMAILER_ENV = process.env.EMAILER_ENV
let EMAILER_ACC_USER = process.env.EMAILER_ACC_USER
let EMAILER_ACC_PASS = process.env.EMAILER_ACC_PASS
sgMail.setApiKey(EMAILER_ACC_PASS);

const send = async (template, {sender, to, vars, onSuccess=()=>{}, onFailure=()=>{}}) => {
	try {

		// testing
		if(EMAILER_ENV === 'ethereal' || EMAILER_ENV !== 'prod'){
			let acc = await nodemailer.createTestAccount();
			EMAILER_ACC_USER = acc.user
			EMAILER_ACC_PASS = acc.pass
		}

		let _template = template(vars)

		let info

		if (EMAILER_ENV === 'prod') {
			console.log({
				to,
				from: sender,
				..._template
			})
			try {
				info = await sgMail.send({
					to,
					from: sender,
					..._template
				});
			} catch (error) {
				console.error('Error sending verification email', error);
				if (error.response) {
					console.error(error.response.body)
				}
			}
		}

		if(EMAILER_ENV === 'ethereal' || EMAILER_ENV !== 'prod'){
			info = await transporter.sendMail({
				from: `"${sender.name}" <${sender.email}>`,
				to: to,
				..._template
			});
			console.log(nodemailer.getTestMessageUrl(info))
		}

		onSuccess(info)
	} catch(e) {
		onFailure(e.message)
		return false
	}

	return true
}


module.exports = {
	send: send
}