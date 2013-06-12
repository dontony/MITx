var calculator = function(){
    var exports={};
    
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
            return"error: "+err;
        }
        
    }
    exports.calculate=calculate;
    
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
    return exports;
}();
