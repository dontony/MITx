var graphcalc = (function () {
    var exports = {};  // functions,vars accessible from outside
    var root=null;
   var yvals=[];
   var yGraph=[];
   var height;
   var width;
   //returns the canvas of where you draw the graph and coordinates
    function graph(canvasDOM,expression,x1,x2) {
        /*… your code to plot the value of expression as x varies from x1 to x2 …*/
        console.log(x1+' '+x2);
		xvals=[];
		yvals=[];
		yGraph=[];
        var expr_tree;//reset all variables to empty
        var graphCanvas=$("<canvas></canvas>")[0];

        graphCanvas.width=canvasDOM.width;
        graphCanvas.height=canvasDOM.height;
        var ctx = graphCanvas.getContext('2d');
        ctx.fillStyle="black";
        ctx.font = "12pt Verdana";
        ctx.textAlign="center";
        ctx.textBaseline="middle";
        var minX=0;
        var maxX=0;
        try {
            expr_tree = calculator.parse(expression);
            minX = calculator.evaluate(calculator.parse(x1));
            maxX = calculator.evaluate(calculator.parse(x2));
            console.log("got expression");
        }
        catch(err){
            /* display error on canvas as text */
            
            
            ctx.fillText(err,200,200);
            return;
        }

        if(minX>=maxX){
            var temp = minX;
            minX=maxX;
            maxX=temp;
        }
        var xStep = (maxX-minX)/width;
        
        //TODO: change to a for
        var temp = 0;
        while(temp<width){
            xvals.push(temp*xStep+minX);
            temp++;
        }
        console.log(xStep);
        for(var index = 0; index <= xvals.length; index+=1){
            yvals.push(calculator.evaluate(expr_tree,{x:xvals[index],
            e:Math.E,pi:Math.PI}));
        }
        var minY = Infinity;//randomized in case of holes in graphs... 1/sin(x) at 0 is NaN, so it messes everything up. 
        var maxY = -Infinity;
        for(var index = 0; index<= yvals.length; index+=1){
            if(yvals[index]<minY){
                minY=yvals[index];
            }
            if(yvals[index]>maxY){
                maxY=yvals[index];
            }
        }
        if(minY<-1000){
            minY=-10;
        }
        if(maxY>1000){
            maxY=10;
        }
        if(Math.abs(maxY-minY)<0.5){
            maxY=minY+0.5;
        }
        var yStep= 1.25*(maxY-minY)/height; //1.25 is to ensure the edges will be well-buffered
        yGraph=[];
        var interval=Math.abs(maxY-minY)/yStep;
        temp = 0;
        console.log(yStep);
        console.log(interval);
        //TODO: CHANGE TO FOR LOOP
        while(temp<yvals.length){
            yGraph[temp]=Math.floor(height/10+interval+minY/yStep-yvals[temp]/yStep); //magic number.... canvas height/2?
            temp++;
        }
        //console.log(yGraph);
        ctx.strokeStyle='red';
        ctx.lineWidth=2;
        ctx.lineCap='round';
        ctx.lineJoin='round';	
        ctx.beginPath();
        
        ctx.moveTo(0, yGraph[0]);
        for(var i = 0; i<yGraph.length; i++){
            if(yvals[i]<maxY&&yvals[i]>minY){
                ctx.lineTo(i, yGraph[i]);
                console.log(i+'     '+yGraph[i]);
            }else if (i<=yGraph.length){
                ctx.moveTo(i+1, yGraph[i+1]);
            }
        }
        ctx.stroke();
        
        ctx.beginPath();
        
        ctx.font="10px Verdana";
        ctx.textAlign='left';
        ctx.textBaseline='alphabetic';
        ctx.strokeStyle='blue';
        ctx.lineWidth=1;
        
        //TODO: do string.format on text
        for(var i=0; i<yGraph.length-1; i+=height/20){
            //only labels every other line
            if(i%(height/10)==0){
                ctx.fillText("y="+String(yStep*(.9*height-i)+minY).substring(0, 4), 5, i-7);
            }
            ctx.moveTo(0, i);
            ctx.lineTo(width,i);
        }
		ctx.stroke();
		ctx.lineWidth=2;
		ctx.beginPath();
		for(var i=0; i<yGraph.length-1; i+=height/10){
            //only labels every other line
            
            ctx.moveTo(0, i);
            ctx.lineTo(width,i);
        }
		ctx.stroke();
		ctx.lineWidth=1;
        for(var i=0; i<yGraph.length-1; i+=width/20){
            //only labels every other line
            if(i%((width/5))==0){
                ctx.fillText("x="+String(xStep*i+minX).substring(0,6), i, height/2+10);
            }
            ctx.moveTo(i, 0);
            ctx.lineTo(i,height);
        }
		ctx.stroke();
		ctx.lineWidth=3;
		ctx.beginPath();
		for(var i=0; i<yGraph.length-1; i+=width/10){
            //only labels every other line
            
            ctx.moveTo(i, 0);
            ctx.lineTo(i,height);
        }
        ctx.stroke();
        var context=canvasDOM.getContext('2d');
        context.drawImage(graphCanvas, 0, 0);
        
        return graphCanvas;
        
    }
    function clear(canvasJQ, func, minX, maxX){
        var context=canvasJQ[0].getContext('2d');
        //(x,y,dx, dy)
        context.clearRect(0,0,canvasJQ.width(), canvasJQ.height());
        //console.log(func);
        func.val('sin(x)');
        
        minX.val('0');
        maxX.val('6*pi');
    }
    //TODO: all
    function drawMouse(canvasDOM, graphDOM, mx, my){
        //test_clear();
        var gx=mx;
		var gy=yGraph[mx];
        var context=canvasDOM.getContext('2d');
		
		//cursor on graph
        context.clearRect(0,0,canvasDOM.width, canvasDOM.height);
        context.lineWidth=3;
        context.strokeStyle='gray';
		context.lineCap='round';
        context.drawImage(graphDOM, 0,0);
        context.beginPath();
        context.moveTo(gx-8, gy-8);
        context.lineTo(gx-3, gy-3);
        context.moveTo(gx-8, gy+8);
        context.lineTo(gx-3, gy+3);
        context.moveTo(gx+8, gy+8);
        context.lineTo(gx+3, gy+3);
        context.moveTo(gx+8, gy-8);
        context.lineTo(gx+3, gy-3);
		context.stroke();
		
		//coordinates
		context.font="30px Verdana";
        context.textAlign='right';
        context.textBaseline='top';
        context.strokeStyle='black';
        context.lineWidth=1;
		context.fillText('('+String(xvals[gx]).substring(0, 4)+','+String(yvals[gx]).substring(0, 4)+')', width, 0);
		
		//line cursor
		context.lineWidth=1;
		context.strokeStyle='black';
		context.beginPath();
		context.moveTo(mx, 0);
		context.lineTo(mx, height);
		context.stroke();
		
    }
    function setup(div, dheight, dwidth) {
        var root = div;
        var wrapper=$("<div class=\"graph_wrapper calcBody\"></div>");
        var canvasJQ = $("<canvas class=\"graph_canvas\"></canvas>");
        var canvasDOM = canvasJQ[0];
        canvasDOM.height=dheight;
        canvasDOM.width=dwidth;
		height=canvasDOM.height;
		width=canvasDOM.width;
        var ctx = canvasDOM.getContext('2d');
        ctx.fillStyle='black';
        ctx.font="20px Verdana";
        ctx.fillText("This is the graphing canvas", 10,20);
        wrapper.append(canvasJQ);

        var inputDiv = $("<div></div>");
        var inputHolder = $("<div>f(x):</div>");
        var minMaxHolder = $("<div>min x:</div>");
        
        var inputFunction=$("<input></input>",{class:"function_input",type:"text",size:80});
        inputHolder.append(inputFunction);
        var inputMin=$("<input></input>",{class:"minX_input",type:"text"});
        minMaxHolder.append(inputMin);
        minMaxHolder.append("    max x:");
        var inputMax = $("<input></input>",{class:"maxX_input",type:"text"});
        minMaxHolder.append(inputMax);
        
        var buttonDiv=$("<div></div>", {class:"button_div"});
        var plotButton=$("<button>Plot FunctionM</button>", {class:"plot_button"});
        var clearButton=$("<button>Clear Graph</button>", {class:"clear_button"});
        buttonDiv.append(plotButton);
        buttonDiv.append(clearButton);
        
        
        var graphDOM;
        plotButton.on("click", function(){
            ctx.clearRect(0,0,canvasJQ.width(), canvasJQ.height());
            var inputMinNum=inputMin.val();
            var inputMaxNum=inputMax.val();
            console.log(inputMinNum);
            if(inputMin.val().length<1){
                inputMiNum=0;
                inputMin.val(0);
            }
            if(inputMax.val().length<1){
                inputMaxNum=10;
                inputMax.val(10);
            }
            console.log(inputMinNum);
            console.log('button');
            graphDOM=graph(canvasDOM, inputFunction.val(), inputMinNum, inputMaxNum);
            
        });
        clearButton.on("click", function(){
            clear(canvasJQ, inputFunction, inputMin, inputMax);
        });
        canvasJQ.on("mousemove", function(event){
            if(graphDOM){
                console.log('cool');
                
            var mx = Math.round(event.pageX-canvasJQ.offset().left);
            var my = Math.round(event.pageY-canvasJQ.offset().top);
                drawMouse(canvasDOM, graphDOM, mx, my);
            }
        });
        
        inputDiv.append(inputHolder);
        inputDiv.append(minMaxHolder);
        inputDiv.append(buttonDiv);
        wrapper.append(inputDiv);

        calcDiv=$('<div></div>', {class:"calc_div"});
        var buttonsArr=['plot','clear', '<-','e','pi', 'sqrt', '^', 'sin', 'cos', 'tan', 'ln', 'x','neg','/','*','7','8','9', '-', '4', '5', '6','+', '1', '2', '3', '=', '0', '.'];
        var row = $('<div></div>', {class:'calcRow'});
        var regNum=/\d|\.'/;
        var regOp=/[\+\/\*\-\(\)\^]/;
        var regFunc=/sqrt|sin|cos|tan|ln|neg/;
        for(var i in buttonsArr){
            var s = buttonsArr[i];
            var button = $('<button>'+s+'</button>');
            if(s.match(regNum)){
                console.log('num: '+s);
                button.attr('class', 'numberButton');
                if(s=='0'){
                    button.attr('class', 'numberButton wideButton');
                }
            }else if (s.match(regOp)){
                console.log('op: '+s);
                button.attr('class', 'opButton');
            }else if (s.match(regFunc)){
                console.log('func: '+s);
                button.attr('class', 'funcButton');
            }else if (s=='='){
                button.attr('class', 'equalsButton tallButton');
            }else if(s==='<-'){
                button.attr('class', 'backspace wideButton');
            }
            button.on('click', function(e){
                console.log(e.target);
                if($(e.target).text().match(regOp)||$(e.target).text().match(regNum))
                inputFunction.val(inputFunction.val()+$(e.target).text());
            });
            row.append(button);
            if((i-2)%4==0){
                calcDiv.append(row);
                row=$('<div></div>', {class:'calcRow'});
            }
        }
        calcDiv.append(row);
        wrapper.append(calcDiv);
        $(root).append(wrapper);
    }
    exports.setup = setup;
   
    return exports;
}());
$(document).ready(function() {
    $('.graphcalc').each(function() {
        graphcalc.setup(this, 400, 400);  
    });
});