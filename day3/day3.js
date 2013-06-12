function test_clear(){
    var canvasJQ=$("#test_canvas");
    var canvasDOM=canvasJQ[0];
    var context=canvasDOM.getContext('2d');
    //(x,y,dx, dy)
    context.clearRect(0,0,canvasJQ.width(), canvasJQ.height());
}
function test_line(){
    var canvasJQ=$("#test_canvas");
    var canvasDOM=canvasJQ[0];
    var context=canvasDOM.getContext('2d');
    context.lineWidth=(10);
    context.strokeStyle='blue';
    context.lineCap='round';
    context.lineJoin=("round");
    context.beginPath();
    context.moveTo(50,50);
    context.lineTo(150,130);
    context.stroke();
}
function test_rect(){
    var canvasJQ=$("#test_canvas");
    var canvasDOM=canvasJQ[0];
    var context=canvasDOM.getContext('2d');
    context.lineWidth=(10);
    context.strokeStyle='red';
    context.fillStyle='brown'
    context.lineCap='round';
    context.lineJoin=("round");
    context.beginPath();
    context.moveTo(50,50);
    context.lineTo(50,130);
    context.arcTo(50,150, 70, 150, 20);
    context.lineTo(130,150);
    context.arcTo(150,150, 150, 130, 20);
    context.lineTo(150,70);
    context.arcTo(150,50, 130, 50, 20);
    context.closePath();
    context.fill();
    context.stroke();
    
    context.beginPath();
    context.fillRect(75,75,100,100);
}
function test_star(){
    var canvasJQ=$("#test_canvas");
    var canvasDOM=canvasJQ[0];
    var context=canvasDOM.getContext('2d');
    context.lineWidth=(10);
    context.strokeStyle='green';
    context.lineCap='round';
    context.lineJoin=("round");
    context.beginPath();
    context.moveTo(100, 50);
}
function test_smile(){
    var canvasJQ=$("#test_canvas");
    var canvasDOM=canvasJQ[0];
    var context=canvasDOM.getContext('2d');
    context.lineWidth=(10);
    context.strokeStyle='black';
    context.fillStyle='yellow';
    context.lineCap='round';
    context.lineJoin=("round");
    context.beginPath();
    context.arc(100, 100, 75, 0, 2*Math.PI);
    context.fill();
    context.stroke();
    context.beginPath();
    context.fillStyle='black';
    context.arc(100, 80, 55, Math.PI/4, 3*Math.PI/4);
    context.stroke();
    context.beginPath();
    context.arc(70,70,10, 0, 2*Math.PI);
    context.fill();
    context.arc(130,70,10, 0, 2*Math.PI);
    context.fill();
    
}