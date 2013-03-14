window.onload = function(){

	var soundRequest = new XMLHttpRequest();
	    soundRequest.responseType = 'arraybuffer';
	    soundRequest.open("GET", "/audio/8bitPartyMix__compiledBy_meneo___.ogg", true);

	var setup = function() {
		soundRequest.onload = function () {
			try {
				var context = new webkitAudioContext();

				var mainNode = context.createGainNode(0);
				mainNode.connect(context.destination);

				var clip = context.createBufferSource();

				context.decodeAudioData(soundRequest.response, function (buffer) {
					clip.buffer = buffer;
					clip.gain.value = 1.0;
					clip.connect(mainNode);
					clip.loop = true;
					clip.noteOn(0);
				}, function (data) {});
			}
			catch(e) {
				console.warn('Web Audio API is not supported in this browser');
			}
		};

		soundRequest.send();
	};
};

onload();