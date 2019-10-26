
function fadeOut(el, cb) {
	let opacity = 1;
	el.style.display = "block";
	let timer = setInterval(function() {
		if(opacity <= 0.1) {
			clearInterval(timer);
			if(cb) cb();
		}
		el.style.opacity = opacity;
		opacity -= opacity * 0.1;
	}, 10);
}

// styles are in the Layout scss file
// TO READ - https://www.robinwieruch.de/react-usestate-hook
const showAlert = (type = 'ok', message = 'message', timing = 3500) => {

	const notts = document.querySelector('.c-notifications');
	const newMessage = document.createElement('div');

	newMessage.innerHTML = message;
	let className = '';
	switch(type) {
		case 'warn': className = 'warn'; break;
		case 'error': className = 'error'; break;
		default: className = 'ok';
	}
	newMessage.classList.add(className);
	newMessage.addEventListener('click', () => {newMessage.remove()})

	notts.append(newMessage)

	if(timing>0) {
		setTimeout(() => {
			fadeOut(newMessage, () => {
				newMessage.remove();
			})

		},timing)
	}

}

/*

 USAGE:
	alert.ok('message', [timing]);
	alert.warn('message', [timing]);
	alert.error('message', [timing]);
 */
export const alert = {
	ok: (message, timing) => showAlert('ok', message, timing),
	warn: (message, timing) => showAlert('warn', message, timing),
	error: (message, timing) => showAlert('error', message, timing),
};


export const speak = (text) => window.responsiveVoice.speak(text)

export const stopSpeaking = () => window.responsiveVoice.cancel()
