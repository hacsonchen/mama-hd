
module.exports = () => {
	let div = document.createElement('div');
	div.innerHTML = `<video></video>`;
	div.style.background = '#000';
	div.style.position = 'fixed';
	div.style.top = '0px';
	div.style.left = '0px';
	div.style.zIndex = '999999';

	let video = div.querySelector('video');
	video.autoplay = true;
	video.controls = true;
	video.style.position = 'absolute';
	video.style.display = 'none';

	let self = {video, div};

	let resize = () => {
		let windowRatio = window.innerHeight/window.innerWidth;
		let videoRatio = video.videoHeight/video.videoWidth;

		if (videoRatio > windowRatio) {
			let width = window.innerHeight/videoRatio;
			video.style.height = window.innerHeight+'px';
			video.style.width = width+'px';
			video.style.left = (window.innerWidth-width)/2+'px';
			video.style.top = '0px';
		} else {
			let height = window.innerWidth*videoRatio;
			video.style.width = window.innerWidth+'px';
			video.style.height = height+'px';
			video.style.top = (window.innerHeight-height)/2+'px';
			video.style.left = '0px';
		}

		div.style.height = window.innerHeight+'px';
		div.style.width = window.innerWidth+'px';
	}

	let onStarted = () => {
		video.style.display = 'block';
		video.removeEventListener('canplay', onStarted);
		resize();
		if (self.onStarted)
			self.onStarted();
	}
	video.addEventListener('canplay', onStarted);

	let toggleFullScreen = () => {
		if (!document.webkitFullscreenElement) {
			div.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
		} else {
			document.webkitCancelFullScreen();
		}
	}

	let togglePlayPause = () => {
		if (video.paused)
			video.play();
		else
			video.pause();
	}

	function doubleclick(el, onsingle, ondouble) {
		let dbl;
		return () => {
			if (!dbl) {
				dbl = true;
				setTimeout(function () {
					if (dbl) {
						onsingle();
					}
					dbl = false;
				}, 300);
			} else {
				dbl = false;
				ondouble();
			}
		}
	}

	video.addEventListener('mousedown', doubleclick(video, () => {
		togglePlayPause();
	}, () => {
		toggleFullScreen();
	}))

	let seekDelta = 5.0;
	let seekBack = () => {
		video.currentTime = self.streams.findNearestIndexTimeByTime(video.currentTime,-seekDelta);
	}
	let seekForward = () => {
		video.currentTime = self.streams.findNearestIndexTimeByTime(video.currentTime,+seekDelta);
	}

	let volumeDelta = 0.2;
	let volumeUp = () => {
		video.volume = Math.min(1.0, video.volume+volumeDelta);
	}
	let volumeDown = () => {
		video.volume = Math.max(0, video.volume-volumeDelta);
	}

	let toggleMute = () => {
		video.muted = !video.muted;
	}

	document.body.addEventListener('keydown', (e) => {
		switch (e.code) {
			case "Space": {
				togglePlayPause();
				e.preventDefault();
			} break;

			case "ArrowUp": {
				volumeUp();
				e.preventDefault();
			} break;

			case "KeyM": {
				toggleMute();
				e.preventDefault();
			} break;

			case "ArrowDown": {
				volumeDown();
				e.preventDefault();
			} break;

			case "ArrowLeft": {
				seekBack();
				e.preventDefault();
			} break;

			case "ArrowRight": {
				seekForward();
				e.preventDefault();
			} break;

			case "Enter": {
				if (e.metaKey || e.ctrlKey) {
					toggleFullScreen();
					e.preventDefault();
				}
			} break;
		}

	});

	document.body.style.margin = 0;
	document.body.appendChild(div);
	resize();
	window.addEventListener('resize', resize);

	return self;
}

