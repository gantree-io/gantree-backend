const nodemailer = require("nodemailer");

const EMAILER_ENV = process.env.EMAILER_ENV
const EMAILER_HOST = process.env.EMAILER_HOST
const EMAILER_PORT = process.env.EMAILER_PORT
const EMAILER_SECURE = process.env.EMAILER_SECURE
let EMAILER_ACC_USER = process.env.EMAILER_ACC_USER
let EMAILER_ACC_PASS = process.env.EMAILER_ACC_PASS

const send = async (template, {sender, to, vars}, onSuccess=()=>{}, onFailure=()=>{}) => {
	try {
		
		// testing
		if(EMAILER_ENV === 'ethereal' || EMAILER_ENV !== 'prod'){
			let acc = await nodemailer.createTestAccount();
			EMAILER_ACC_USER = acc.user
			EMAILER_ACC_PASS = acc.pass 
		}

		let transporter = nodemailer.createTransport({
			host: EMAILER_HOST,
			port: EMAILER_PORT,
			secure: EMAILER_SECURE === 'true',
			auth: {
				user: EMAILER_ACC_USER,
				pass: EMAILER_ACC_PASS 
			}
		});

		let _template = template(vars)

		let info = await transporter.sendMail({
			from: `"${sender.name}" <${sender.email}>`,
			to: to,
			..._template
		});

		if(EMAILER_ENV === 'ethereal'){
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