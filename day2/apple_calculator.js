/*collaborated with deannah*/


$(document).ready(function(){
	var actual_expression='';
	var last_click='';
	var root = null;
   $('.tallButton').bind('click', function() {
		var expression = $('#expression');
		var current=$('#current');
		if(last_click==='number'||last_click==='operation'){
           expression.append(current.text());
           actual_expression=actual_expression.concat(current.text());
		   console.log('last click is number');
		}else if (last_click=='equals'){
			return;
		}
       var input = actual_expression.trim();
       last_click='equals';
	   expression.text(expression.text()+'=');
       current.text(String(calculator.calculate(input)));
       actual_expression=current.text();
   });
   $('.numberButton').bind('click', function(){
       
       var expression = $('#expression');
       var current= $('#current');
       var input = $(this).text();
       
       if(last_click==='equals'){
           expression.text('');
           actual_expression='';
       }else if(last_click==='operation'){
           current.text('');
       }else if(last_click==='number'||last_click===''){
       }
	   current.append(input);
        //this being the button that was pressed
       last_click='number';
	   console.log('after numclick');
	   console.log(actual_expression);
	   
   });
   $('.expressionButton').bind('click', function(){
       var expression = $('#expression');
       var current= $('#current');
       var input = $(this).text(); //this being the button that was pressed
       var actual_input=input;
           switch(input.charCodeAt(0)){
                    case 247:
                        actual_input='/';
                        break;
                    case 215:
                        actual_input='*';
                        break;
                    case 8722:
                        actual_input='-';
                        break;
               }
    
       if(last_click==='number'||last_click==='equals'){
           
           expression.append(current.text()+input);
           actual_expression=actual_expression.concat(current.text()+actual_input);
       }else if(last_click==='operation'){
           var current_exp=expression.text();
           var current_actual_exp=actual_expression;
           expression.text(current_exp.substring(0,current_exp.length-1) + input);
           actual_expression=actual_expression.substring(0, actual_expression.length-1)+actual_input;
       
       }
       last_click='operation';
       console.log('after op click');
	   console.log(expression.text());
       console.log(actual_expression);
   });
   $('.mButton').bind('click', function(){
       last_click='m';
   });
   $('.plusMinusButton').bind('click', function(){
       
	   var expression = $('#expression');
       var current= $('#current');
	   
			current.text('-'+current.text());
	   
	   last_click='number';
   });
   $('.clearButton').bind('click', function(){
       $('#expression').text('');
       actual_expression='';
	   $('#current').text('');
       last_click='clear';
   });
});