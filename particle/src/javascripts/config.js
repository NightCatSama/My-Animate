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
<<<<<<< HEAD
})
=======
})
>>>>>>> abbc8e7ca35e6f591a16bf0a4c1bd265b36c93ca
