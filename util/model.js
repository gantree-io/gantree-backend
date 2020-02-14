module.exports = {
	print: doc => doc.exec((err, json) => console.log(json))
}