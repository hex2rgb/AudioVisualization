function randomColor() {
    function _color() {
        return parseInt(Math.random().toFixed(2) * 255);
    }

    return `rgb(${_color()},${_color()},${_color()})`;
}

function gradient(ctx, x0, x1, y1) {

    var gradient = ctx.createLinearGradient(x0, 0, x1, y1);
    var rColor = [
        '#799936',
        '#CEB426',
        '#9E4267',
        '#514560',
        '#2A81A4',
    ]
    //添加两种颜色
    gradient.addColorStop(0, rColor[4]);
    gradient.addColorStop(0.25, rColor[3]);
    gradient.addColorStop(0.5, rColor[2]);
    gradient.addColorStop(0.75, rColor[1]);
    gradient.addColorStop(1, rColor[0]);
    return gradient;
}

function curry(fn) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function () {
        var innerArgs = Array.prototype.slice.call(arguments);
        var finalArgs = args.concat(innerArgs);
        return fn.call(null, ...finalArgs);
    }
}

function main() {
    var audio = document.getElementById('audio');
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var source = audioCtx.createMediaElementSource(audio);
    var gainNode = audioCtx.createGain();
    gainNode.gain.value = 1;
    var analyser = audioCtx.createAnalyser();

    source.connect(analyser);
    source.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    analyser.fftSize = 2048;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);

    // 画布
    var canvas = document.getElementById("canvas");
    var canvasCtx = canvas.getContext("2d", { alpha: false });

    var _gradient = curry(gradient, canvasCtx);
    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;


    // 绘制音频源
    function Draw() {
        let globalID;
        this.init = function () {
            globalID = requestAnimationFrame(this.init.bind(this));

            analyser.getByteFrequencyData(dataArray);

            canvasCtx.fillStyle = 'rgb(0,0,0)';
            canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

            // var barWidth = (WIDTH / bufferLength) * 2.5;
            var barWidth = 2;
            var x = 0;

            for (var i = 0; i < bufferLength; i += barWidth) {
                var barHeight = dataArray[i];
                const x0 = x;
                const y0 = 0;
                const x1 = barWidth;
                const y1 = barHeight / 1.7;
                canvasCtx.fillStyle = _gradient(x0, x0, y1);
                canvasCtx.fillRect(x0, y0, x1, y1);

                x += barWidth + 1;
            }
        }
        this.pause = function () {
            cancelAnimationFrame(globalID);
        }
    };

    var draw = new Draw();

    audio.addEventListener('canplay', function () {
        console.log('canplay');
        draw.init();
    })

    audio.addEventListener('play', function () {
        console.log('play');
        draw.init();
    })
    audio.addEventListener('pause', function () {
        console.log('pause');
        draw.pause();
    })

    audio.addEventListener('ended', function () {
        console.log('ended');
        draw.pause();
    })
    document.onmousemove = null;
}

window.onload = function () {
    document.onmousemove = main

};
