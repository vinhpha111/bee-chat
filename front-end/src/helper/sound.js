module.exports = {
	notifySound: () => {
		const audio = new Audio(require('../assets/audio/iphone.mp3'))
		audio.play()
	}
}