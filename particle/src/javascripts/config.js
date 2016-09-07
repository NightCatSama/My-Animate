requirejs.config({
    baseUrl: 'dist/javascripts'
});

import Particle from 'index';

let particle = new Particle('demo', {
	src: 'dist/images/demo.png',
	imgSize: [1024, 512],
	backgroundColor: '#000',
	cols: 166,
	rows: 125,
	recovery: .95,
	filter: function(r, g, b, a) {
		if (r === 255 && b === 255 && g === 255) {
			return false
		}
		else {
			return true
		}
	},
})
