function main() {
    const canvas2 = document.getElementById('canvas2');
    const WIDTH = canvas2.width
    const HEIGHT = canvas2.height
    const ctx = canvas2.getContext('2d');
    var gra = ctx.createLinearGradient(0, 0, 0, 70);
    gra.addColorStop(0, '#cc00cc')
    gra.addColorStop(1, '#00cc00')

    var gra2 = ctx.createLinearGradient(51, 0, 50, 30);
    gra2.addColorStop(0, '#cc00cc')
    gra2.addColorStop(1, '#00cc00')

    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = gra
    ctx.fillRect(0, 0, 50, 70);

    ctx.fillStyle = gra2
    ctx.fillRect(51, 0, 50, 30);
}

window.onload = main;
