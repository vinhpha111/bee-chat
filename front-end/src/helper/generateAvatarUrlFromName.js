// copy and customize from https://stackoverflow.com/questions/41691163/how-to-create-base64-profile-image-form-user-name-or-user-email
const stc = require('string-to-color');
module.exports = (name) => {
	var initials = "";
	//TODO: replace with initials extraction logic.
	const splitNames = name.split(' ').slice(0, 3)
	for (let i = 0; i < splitNames.length; i++) {
		initials += splitNames[i].substring(0, 1).toUpperCase()
	}

	var randomColor = stc(name)

	// Create a rectangular canvas which will become th image.
	var canvas = document.createElement("canvas");
	var context = canvas.getContext("2d");
	canvas.width = canvas.height = 100;

	// Draw the circle in the background using the randomColor.
	context.fillStyle = randomColor;
	context.beginPath();
	context.ellipse(
		canvas.width / 2, canvas.height / 2, // Center x and y.
		canvas.width / 2, canvas.height / 2, // Horizontal and vertical "radius".
		0, // Rotation, useless for perfect circle.
		0, Math.PI * 2 // from and to angle: Full circle in radians.
	);
	context.fill();

	context.font = (canvas.height / 3) + "px serif";
	context.fillStyle = "#000";
	// Make the text's center overlap the image's center.
	context.textAlign = "center";
	context.textBaseline = "middle";
	context.fillText(initials, canvas.width / 2, canvas.height / 2);

	const src = canvas.toDataURL();
	return src
}