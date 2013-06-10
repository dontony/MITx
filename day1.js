
        function calculate(string){
            console.log("click");
            var tokens = tokenize(string);
            var result;
            try{
                result=evaluate(tokens);
                if(tokens.length>0)
                    throw "unrecognized operator";
                return String(result);
            }catch(err)
            {
                return"err0r: "+err;
            }
            
            return JSON.stringify(tokens);
        }
function tokenize(string){
    var regex = /\d+|[\+\/\*\-\(\)]/g;
    var tokens = string.match(regex);
    return (tokens);
    //g is a flag, means global match
}
function read_operand(tokens){
    var readFirstToken=tokens.shift();
    if(isOpenParen(readFirstToken)){
        var operand=evaluate(tokens);
    }
    else{ 
        var operand=parseInt(readFirstToken);
        if(isNaN(operand))
            throw "number expected";
        return operand;
    }
}
function isValidOp(operator){
    return (operator=="+" || operator=="-"|| operator=="*"|| operator=="/"||operator==")")
}
function isOpenParen(operand){
    return operand=="(";
}
//evaluates a list of tokens as a linear calculator (does not take FOIL into mind)

function evaluate(tokens){
    if(tokens.length<1)
        throw "missing operand";
    var token1=tokens[0];
    
   // console.log(operand1);
   // console.log(tokens.length);
      
    var operand1 = read_operand(tokens);
    
    while(tokens.length>0){
        var operator = tokens.shift();
        
        if (!isValidOp(operator))
            throw "unrecognized operator"
        if(operator==")")
            return operand1;
        if(tokens.length<=0)
            throw "missing operand";
        
        var operand2 = read_operand(tokens);
        
        if(operator =="+" )
            operand1 =operand1+operand2;
        else if(operator =="-" )
            operand1 =operand1-operand2;
        else if(operator =="*" )
            operand1 =operand1*operand2;
        else if(operator =="/" )
            operand1 =operand1/operand2;
        else
            throw "unrecognized operator"; //redundant step
        console.log(operand1);
    }
    return operand1
}
function setup_calc(calc){
    var input=$("<input></input>", {type:"text", size:"50"});
    var output=$("<div></div>");
    var button=$("<button> Calculate </button>");
    
    button.bind("click", function(){
        output.text(String(calculate(input.val())));
    });
    $(calc).append(input, button, output);
}
function test_jig(){
    var tokens = ['123','42','hi','5'];
    var answers = [123, 42, NaN, 5]
    for(var i = 0; i<tokens.length; i++)
        console.log(read_operand(tokens)==answers[i]);
    var tokens2 = ['123','+','32'];
    console.log(evaluate(tokens2))
    
        
}

$(document).ready(function(){
   $(".calculator").each(function(){
      setup_calc(this);
   });
   test_jig();
});