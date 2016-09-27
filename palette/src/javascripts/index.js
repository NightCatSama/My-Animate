import Canvas from './canvas';
import { setRange, RangeComponent } from './range-component';

let colors = document.getElementById('colors');
let colorIcon = document.querySelector('.icon-palette');
colorIcon.style.color = colors.value;
let size = document.getElementById('size');
let default_size = 5;
size.textContent = default_size;

/*
 * init Canvas
 */
let option = {
	color: colors.value,
	size: default_size
}
let canvas = new Canvas('app', option);
window.a = canvas;

/*
 * control size
 */
let range = setRange(document.querySelector('.range-component'), {
	min: 1,
	max: 50,
	interval: 1,
	width: 200,
	default: default_size,
	callback: function(val) {
		size.textContent = val;
		canvas.size = val;
	}
});
/*
 * bind event
 */
colors.addEventListener('change', (e) => {
	canvas.color = e.target.value;
	colorIcon.style.color = e.target.value;
});
document.getElementById('img').addEventListener('change', (e) => {
	let file = e.target.files[0]

	var reader = new FileReader();
	reader.onload = (e) => {
		canvas.loadImg(e.target.result);
	}
	reader.readAsDataURL(file)
});
document.getElementById('saveImg').addEventListener('click', () => canvas.saveImg());
document.getElementById('repeal').addEventListener('click', () => canvas.repeal());
document.getElementById('trash').addEventListener('click', () => canvas.clear());

