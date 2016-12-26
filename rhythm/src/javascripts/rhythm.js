export default class Rhythm {
    constructor(src) {
        this.isAnimate = false
        this.audio = document.createElement('audio')
        this.audio.src = src
        // this.audio.loop = true
        this.cxt = this.getAudioContext()
        this.analyser = this.cxt.createAnalyser()
        this.analyser.minDecibels = -90;
        this.analyser.maxDecibels = -10;
        this.analyser.fftSize = 256
        this.cxt.createMediaElementSource(this.audio).connect(this.analyser)
        this.analyser.connect(this.cxt.destination)

        this.canvas = document.getElementById('canvas')
        this.canvasCXT = this.canvas.getContext('2d')
        this.canvas.width = this.canvas.offsetWidth
        this.canvas.height = this.canvas.offsetHeight
    }
    getAudioContext() {
        let AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext
        return new AudioContext()
    }
    play() {
        this.audio.play()
    }
    pause() {
        this.audio.pause()
    }
    getArr() {
        var array = new Uint8Array(this.analyser.frequencyBinCount)
        this.analyser.getByteFrequencyData(array)
        return array
    }
}