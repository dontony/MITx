var graphcalc = (function () {
    var exports = {};  // functions,vars accessible from outside
   var xvals=[]
   var yvals=[];
   var yGraph=[];
   var height;
   var width;
   //returns the canvas of where you draw the graph and coordinates
    function graph(canvasDOM,expression,x1,x2) {
        /*… your code to plot the value of expression as x varies from x1 to x2 …*/
		xvals=[];
		yvals=[];
		yGraph=[];
        var expr_tree;
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
        var minY = yvals[120];//randomized in case of holes in graphs... 1/sin(x) at 0 is NaN, so it messes everything up. 
        var maxY = yvals[329];
        for(var index = 0; index<= yvals.length; index+=1){
            if(yvals[index]<minY){
                minY=yvals[index];
            }
            if(yvals[index]>maxY){
                maxY=yvals[index];
            }
        }
        var yStep= 1.25*(maxY-minY)/height; //1.20 is to ensure the edges will be well-buffered
        yGraph=[];
        temp = 0;
        console.log(yStep);
        //TODO: CHANGE TO FOR LOOP
        while(temp<yvals.length){
            yGraph[temp]=height/2-Math.floor(yvals[temp]/yStep); //magic number.... canvas height/2?
            temp++;
        }
        //console.log(yGraph);
        ctx.strokeStyle='red';
        ctx.lineWidth=3;
        ctx.lineCap='round';
        ctx.lineJoin=("round");	
        ctx.beginPath();
        
        ctx.moveTo(0, yGraph[0]);
        for(var i = 0; i<yGraph.length; i++){
            ctx.lineTo(i, yGraph[i]);
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
		ctx.lineWidth=3;
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
                ctx.fillText("x="+String(xStep*i+minX).substring(0,4), i, height/2+10);
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
        var wrapper=$("<div id=\"graph_wrapper\"></div>");
        var canvasJQ = $("<canvas id=\"graph_canvas\"></canvas>");
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
        
        var inputFunction=$("<input></input>",{id:"function_input",type:"text",size:80});
        inputHolder.append(inputFunction);
        var inputMin=$("<input></input>",{id:"minX_input",type:"text"});
        minMaxHolder.append(inputMin);
        minMaxHolder.append("    max x:");
        var inputMax = $("<input></input>",{id:"maxX_input",type:"text"});
        minMaxHolder.append(inputMax);
        
        var buttonDiv=$("<div></div>");
        var plotButton=$("<button>Plot FunctionM</button>", {id:"plot_button"});
        var clearButton=$("<button>Clear Graph</button>", {id:"clear_button"});
        buttonDiv.append(plotButton);
        buttonDiv.append(clearButton);
        
        
        var graphDOM;
        plotButton.bind("click", function(){
            ctx.clearRect(0,0,canvasJQ.width(), canvasJQ.height());
            graphDOM=graph(canvasDOM, inputFunction.val(), inputMin.val(), inputMax.val());
            
        });
        clearButton.bind("click", function(){
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
        $(div).append(wrapper);
    }
    exports.setup = setup;
   
    return exports;
}());
// setup all the graphcalc divs in the document
$(document).ready(function() {
    $('.graphcalc').each(function() {
        graphcalc.setup(this, 600, 600);  
    });
});