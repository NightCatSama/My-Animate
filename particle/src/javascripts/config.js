requirejs.config({
    baseUrl: 'dist/javascripts'
});

import Particle from 'index';

let particle = new Particle('demo', {
	src: 'dist/images/demo.jpg',
	filter: function(r, g, b, a) {
		if (r === 255) {
			return true
		}
	},
})
