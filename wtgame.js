const canvas = document.getElementById('wiretap');
const context = canvas.getContext('2d');

function draw() {
  context.fillStyle = "#001";
  context.fillRect(0,0, canvas.width, canvas.height);
}


draw();