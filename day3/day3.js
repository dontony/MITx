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
    context.strokeStyle='red';
    context.lineCap='round';
    context.beginPath();
    context.moveTo(50,50);
    context.lineTo(150,150);
    context.arcTo(50,50);
    context.stroke();
}