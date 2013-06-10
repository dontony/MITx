
        function calculate(string){
            console.log("click");
            return tokenize(string);
        }
function tokenize(string){
    var regex = /\d+|[\+\/\*\-\(\)]/g;
    var tokens = string.match(regex);
    return JSON.stringify(tokens);
    //g is a flag, means global match
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
$(document).ready(function(){
   $(".calculator").each(function(){
      setup_calc(this);
   });
});