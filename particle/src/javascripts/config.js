requirejs.config({
	baseUrl: 'dist/javascripts'
});

import Particle from 'index';

let particle = new Particle('demo', {
	src: 'dist/images/demo.png',
	imgSize: [1024, 512],
	backgroundColor: '#000',
	cols: 166,
	rows: 120,
	disperse: 10,
	mouseRange: 100,
	recovery: .95,
	filter: (r, g, b, a) => {
		if (r > 100 && b > 250) {
			return false
		} else {
			return true
		}
	},
})

window.particle = particle

/*
 * 上传图片
 */
let file = document.getElementById('file')
let img = document.getElementById('img')
file.addEventListener('change', (e) => {
	let file = e.target.files[0]

	var reader = new FileReader();
	reader.onload = (e) => {
		img.src = e.target.result
		particle.src = e.target.result
	}
	reader.readAsDataURL(file)
})

/*
 * 鼠标范围
 */
let mouseRange = document.getElementById('mouseRange')
let mouseRange_value = document.getElementById('mouseRange_value')
mouseRange.value = particle.mouseRange
mouseRange_value.innerHTML = particle.mouseRange

mouseRange.addEventListener('change', (e) => {
	let v = +e.target.value
	mouseRange_value.innerHTML = v
	particle.mouseRange = v
})

/*
 * 恢复
 */
let recovery = document.getElementById('recovery')
let recovery_value = document.getElementById('recovery_value')
recovery.value = (100 - particle.recovery * 100)
recovery_value.innerHTML = (100 - particle.recovery * 100)

recovery.addEventListener('change', (e) => {
	let v = +e.target.value
	recovery_value.innerHTML = v
	particle.recovery =  (100 - v) / 100
})

/*
 * 偏移范围
 */
let disperse = document.getElementById('disperse')
let disperse_value = document.getElementById('disperse_value')
disperse.value = particle.disperse
disperse_value.innerHTML = particle.disperse

disperse.addEventListener('change', (e) => {
	let v = +e.target.value
	disperse_value.innerHTML = v
	particle.disperse = v
})

/*
 * 偏移范围
 */
let r = document.getElementById('r')
let r_value = document.getElementById('r_value')
r.value = particle.r * 2
r_value.innerHTML = particle.r

r.addEventListener('change', (e) => {
	let v = +e.target.value
	r_value.innerHTML = v / 2
	particle.r = v / 2
})

/*
 * 过滤颜色
 */
let color = document.getElementById('color')
let width = document.getElementById('width')
let height = document.getElementById('height')

let checkBtn = document.getElementById('checkBtn')
checkBtn.addEventListener('click', () => {
	console.log(color.value)
	particle.filter = function(r, g, b, a) {
		if(r !== parseInt(color.value.substr(1, 2), 16) || g !== parseInt(color.value.substr(3, 2), 16) || b !== parseInt(color.value.substr(5, 2), 16)) {
			return true
		}
	}
	particle.cols = cols.value || 100
	particle.rows = rows.value || 100
	if (width.value && height.value) {
		particle.imgSize = [width.value, height.value]
	}
	else {
		particle.imgSize = undefined
	}
	particle.x = undefined
	particle.y = undefined
	particle.destory()
	particle.init()
})

/*
 * 隐藏控制台
 */
let hideBtn = document.getElementById('hideBtn')

hideBtn.addEventListener('click', () => document.querySelector('.control').classList.toggle('hidden'))

/*
 * resetBtn
 */

let resetBtn = document.getElementById('resetBtn')
resetBtn.addEventListener('click', () => {
	Object.assign(particle, {
		src: 'dist/images/demo.png',
		imgSize: [1024, 512],
		cols: 166,
		rows: 120,
		disperse: 10,
		mouseRange: 50,
		recovery: .95,
		r: .5,
		filter: (r, g, b, a) => {
			if (r > 100 && b > 250) {
				return false
			} else {
				return true
			}
		},
	})
	mouseRange.value = particle.mouseRange
	mouseRange_value.innerHTML = particle.mouseRange
	recovery.value = (100 - particle.recovery * 100)
	recovery_value.innerHTML = (100 - particle.recovery * 100)
	disperse.value = particle.disperse
	disperse_value.innerHTML = particle.disperse
	particle.x = undefined
	particle.y = undefined
	particle.destory()
	particle.init()
})