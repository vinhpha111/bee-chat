const stc = require('string-to-color');
module.exports = (name) => {
	var initials = ""
	const splitNames = name.split(' ').slice(0, 3)
	for (let i = 0; i < splitNames.length; i++) {
		initials += splitNames[i].substring(0, 1).toUpperCase()
	}
	var randomColor = stc(name)
	var canvas = document.createElement("canvas")
	var context = canvas.getContext("2d")
	canvas.width = canvas.height = 100
	context.fillStyle = randomColor
	context.beginPath()
	context.fillRect(
		0, 0,
		canvas.width, canvas.height
	)
	context.fill()
	context.font = (canvas.height / 3) + "px serif"
	context.fillStyle = "#000"
	context.textAlign = "center"
	context.textBaseline = "middle"
	context.fillText(initials, canvas.width / 2, canvas.height / 2)
	const src = canvas.toDataURL()
	return src
}