
function calculate(string){
    //console.log("click");
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
    
}

function tokenize(string){
    var regex = /\d*[\.]\d+|\d+|[\+\/\*\-\(\)]|sin|cos|tan|ln|sqrt/g;
    var tokens = string.match(regex);
    return tokens;
    //g is a flag, means global match
}
function read_operand(tokens){
    var firstToken=tokens.shift();
    if(isOpenParen(firstToken)){
        var evaluatedOperand=evaluate(tokens);
        if(tokens.shift()!=")")
            throw "expected )";
        return evaluatedOperand;
    }else if(isFunc(firstToken)){
        var secondToken=tokens.shift();
        if(!isOpenParen(secondToken))
            throw "need paren after a function i.e. sin(30)";
        var functionOperand=evaluate(tokens);
        if(tokens.shift()!=")")
            throw "expected )";
        return funcEval(firstToken, functionOperand);
    }
    else if(isNeg(firstToken)){
        return returnNum(tokens.shift())*-1;
    }
    else{ 
        return returnNum(firstToken);
    }
}
function isValidEvalOp(operator){
    return operator=="+" || operator=="-"|| operator==")"; /*"|| operator=="/"||operator=="*")*/
}
function isValidTermOp(operator){
    return operator=="*" || operator=="/"|| operator==")"||operator=="+" || operator=="-"; 
}
function isOpenParen(operand){
    return operand=="(";
}
function isNeg(operand){
    return operand=="-";
}
function isFunc(operand){
    return operand=="sin"||operand=="cos"||operand=="tan"||operand=="ln"||operand=="sqrt";
}
function funcEval(func, eval){
    if(func=='sin')
        return Math.sin(eval);
    else if (func=='cos')
        return Math.cos(eval);
    else if (func=='tan')
        return Math.tan(eval);
    else if (func=='sqrt')
        return Math.sqrt(eval);
    else if (func=='ln')
        return Math.log(eval);
    else if (func=='cos')
        return Math.cos(eval);
    
    
}
function returnNum(token){
    var operand
    if(token.indexOf('.')<0)
        operand=parseInt(token);
    else
        operand=parseFloat(token);
    //console.log(operand);
    if(isNaN(operand))
        throw "number expected";
    return operand;
}
//evaluates a list of tokens as a linear calculator (does not take PEMDAS into mind yet)

function evaluate(tokens){
    if(tokens.length<1)
        throw "missing operand";
        
    var operand1 = read_term(tokens);
    
    while(tokens.length>0){
        var operator = tokens[0];
        
        if (!isValidEvalOp(operator))
            throw "unrecognized operator";
        if(operator==")")
            return operand1;
        tokens.shift();
        if(tokens.length<=0)
            throw "missing operand";
        
        var operand2 = read_term(tokens);
        if(operator =="+" )
            operand1 =operand1+operand2;
        else if(operator =="-" )
            operand1 =operand1-operand2;
        else
            throw "unrecognized operator"; //redundant step
        //console.log(operand1);
    }
    return operand1;
}
function read_term(tokens){
    var operand1=read_operand(tokens);
    while(tokens.length>0){
        var operator=tokens[0];
        
        if (!isValidTermOp(operator))
            throw "unrecognized operator";
        if(operator==")"||operator=="+" ||operator=="-")
            return operand1;
        tokens.shift();
        if(tokens.length<=0)
            throw "missing operand";
        
        var operand2 = read_operand(tokens);
        
        if(operator =="*" )
            operand1 =operand1*operand2;
        else if(operator =="/" )
            operand1 =operand1/operand2;
        else
            throw "unrecognized operator";
    }
    return operand1;
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
    
    var tokens2 = ['123','+','32'];
    //console.log(tokenize(tokens2))
    console.log(evaluate(tokens2))//=155
    //test basic
    console.log(calculate("132- 32+ 181-31*4"));//=157
    //test parser
    console.log(calculate("132- 32+ 181-31*1/5 aerd"));//=274.8
    console.log(calculate("132- s32+s 181-s31*1/5"));//=274.8
    //test paren
    console.log(calculate("132- 32+ 181-(31*1)/5 aerd"));//=274.8
    console.log(calculate("((132- 32)+ 181-31)*4/10 aerd"));//=100
    //test negative
    console.log(calculate("((132- -32)-64+ 181-31)*4/10 aerd"));//=100
    console.log(calculate("((-132- -32)+ -181--31)*4/-10 aerd"));//=100

    
    //floats
    console.log(calculate("31.5*2.0-62+.75-0.25"))//=1.5
    //floats and parens
    console.log(calculate("(31.25+(.25))*2-62+(.75-0.25)"))//=1.5
    //floats and parens and neg
    console.log(calculate("(31.75+(-.25))*2+-62.0+(.75-0.25)"))//=1.5
    //order of operations
    console.log(calculate("4.5+2*2"));//=8.5
    console.log(calculate("(4.5+2)*2"));//13
    //sin cos etc...
    console.log(evaluate(["sin", "(", "1.25",")"]));
    console.log(tokenize("sin(1.25)"));
    
    console.log(calculate("sin(1.25)*sin(1.25)+cos(1.25)*cos(1.25)")); //=1
}

$(document).ready(function(){
   $(".calculator").each(function(){
      setup_calc(this);
   });
   test_jig();
});