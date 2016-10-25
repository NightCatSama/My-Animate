'use strict';

const generateClass = function(data, name) {
	let shadow = []
	for (let key in data.library) {
		let obj = data.library[key]
		shadow.push(`${obj.x * data.size}px ${obj.y * data.size}px 0 ${data.size/2}px ${obj.color}`)
	}
	let className = `.${name} {
	position: relative;
	width: ${data.x * data.size}px;
	height: ${data.y * data.size}px;
}
.${name}::after {
	content: '';
	width: 0;
	height: 0;
	position: absolute;
	left: ${data.size/2}px;
	top: ${data.size/2}px;
	box-shadow: ${shadow.length ? shadow.join(',') : 'none'};
}`
	return className
}

export default generateClass