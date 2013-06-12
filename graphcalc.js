var graphcalc = (function () {
    var exports = {};  // functions,vars accessible from outside
   
    function graph(canvas,expression,x1,x2) {
        /*… your code to plot the value of expression as x varies from x1 to x2 …*/
    }
    function clear(canvasJQ, func, minX, maxX){
        var context=canvasJQ[0].getContext('2d');
        //(x,y,dx, dy)
        context.clearRect(0,0,canvasJQ.width(), canvasJQ.height());
        func.text=('');
        minX.text=('');
        maxX.text=('');
    }
    function setup(div) {
        var wrapper=$("<div id=\"graph_wrapper\"></div>");
        var canvasJQ = $("<canvas id=\"graph_canvas\"></canvas>");
        var canvasDOM = canvasJQ[0];
        canvasDOM.height=400;
        canvasDOM.width=400;
        var ctx = canvasDOM.getContext('2d');
        ctx.fillStyle='black';
        ctx.font="20px Verdana";
        ctx.fillText("This is the graphing canvas", 10,20);
        wrapper.append(canvasJQ);

        var inputDiv = $("<div></div>");
        var inputHolder = $("<div>f(x):</div>");
        var minMaxHolder = $("<div>min x:</div>");
        
        var inputFunction=$("<input></input>",{id:"function_input",type:"text",size:60});
        inputHolder.append(inputFunction);
        var inputMin=$("<input></input>",{id:"minX_input",type:"text"});
        minMaxHolder.append(inputMin);
        minMaxHolder.append("max");
        var inputMax = $("<input></input>",{id:"maxX_input",type:"text"});
        minMaxHolder.append(inputMax);
        
        var buttonDiv=$("<div></div>");
        var plotButton=$("<button>Plot FunctionM</button>", {id:"plot_button"});
        var clearButton=$("<button>Clear Graph</button>", {id:"clear_button"});
        buttonDiv.append(plotButton);
        buttonDiv.append(clearButton);
        //
        plotButton.bind("click", function(){
            graph(canvasDOM, inputFunction.text(), inputMin.text(), inputMax.text());
            
        });
        clearButton.bind("click", function(){
            clear(canvasJQ, inputFunction, inputMin, inputMax);
        });
        // var inputF = $("<div>f(x):<input id=\"function_input\" type=\"text\"  width=400></input></div>");
        // var inputMin = $("<div>min x:<input id=\"minX_input\" type=\"text\"></input>max x:<input id=\"maxX_input\" type=\"text\"></input></div>");
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
        graphcalc.setup(this);  
    });
});