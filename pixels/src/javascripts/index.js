import Canvas from 'canvas'
import generateClass from 'generate'
import nyanCat from 'nyan-cat'

let options = {
	x: 35,
	y: 20,
	size: 20,
	library: nyanCat,
	parent: $('#app')[0]
}
$('#cols').val(options.x)
$('#rows').val(options.y)
$('#size').val(options.size)
$('#name').val('miao')
var canvas = new Canvas(options)
$('.preview').width(options.x * options.size).height(options.y * options.size)
let $colors = $('[name="colors"]')
$colors.val(canvas.color)
window.a = canvas

let create_btn = document.getElementById('createBtn')
let preview

$('#createBtn').on('click', function() {
	let css = generateClass(canvas, $('#name').val() || 'pixel_map')
	$('#code').val(css)
})

$('#emptyBtn').on('click', function() {
	canvas.empty()
})

$('#previewBtn').on('click', function() {
	let css = generateClass(canvas, 'miao')
	if (preview) {
		preview.innerHTML = css
	}
	else {
		preview = document.createElement('style')
		preview.innerHTML = css
		document.body.appendChild(preview)
	}
	$('.preview').toggle()
})

$('.preview').on('click', function() {
	$(this).hide()
})

$('.color-block').on('click', function() {
	let $item = $(this).parent('.preset-item')
	if ($item.hasClass('active'))
		return false;
	$('.active').removeClass('active')
	$item.addClass('active')
	if ($item.hasClass('eraser')) {
		canvas.mode = 'eraser'
	}
	else {
		let color = $(this).data('color')
		$colors.val(color)
		canvas.mode = 'draw'
		canvas.color = color
	}
})

$('.palette').on('click', function() {
	let $item = $(this).parent('.preset-item')
	if (!$item.hasClass('active')) {
		$('.active').removeClass('active')
		$item.addClass('active')

		if ($item.hasClass('eraser')) {
			canvas.mode = 'eraser'
		}
		else {
			let color = $(this).prev().data('color')
			$colors.val(color)
			canvas.mode = 'draw'
			canvas.color = color
		}
	}
})

$colors.on('change', function() {
	let $item = $(this).parent('.preset-item')
	let $block = $item.find('.color-block')
	$block.css('background-color', this.value)
	$block.data('color', this.value)
	canvas.color = this.value
})

$('#file').on('change', function(e) {
	let file = e.target.files[0]

	var reader = new FileReader();
	reader.onload = (e) => {
		canvas.setImage(e.target.result)
	}
	reader.readAsDataURL(file)
})

$('#resetBtn').on('click', function() {
	canvas.x = +$('#cols').val()
	canvas.y = +$('#rows').val()
	canvas.size = +$('#size').val()
	canvas.reset()
	$('.preview').width(canvas.x * canvas.size).height(canvas.y * canvas.size)
})