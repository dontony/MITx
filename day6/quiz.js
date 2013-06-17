var quiz = (function(){
   var exports = {};
   
   var questions = [{question_text:"what is the air speed of an unladen swallow?", answers:["32 mph", "42 kph","16 m/s","african or european?"], solutionIndex:3}];
   //Holds a DOM object  with the question text, 
   //ex. question.question_text="what is the air speed of an unladen swallow?" 
   //    question.answers=["32 mph", "42 kph","16 m/s","african or european?"]
   //    question.solutionIndex=4;
   
   var answers = [];
   //holds the answers of the student for comparison
   
   var score=0;
   
   var currentQuestionIndex=0;
   
   // function to check answer, takes in 
   //q, question index
   //a, student answe index
   //returns boolean, true if answer is correct, false otherwise. 
   function checkCorrect(q, a){
       return getCurrentQuestion().solutionIndex==a;
   };
   
   function incrementScore(){
     return score++;  
   };
   
   function setup(){
       displayQuestion();
   }
   function getCurrentQuestion(){
       return questions[currentQuestionIndex];
   }
   function displayQuestion(){
       
       var wrapperDiv=$('<form></form>', {class:'questionWrapper'});
       
       //for(var x = 0; x<questions.length; x++){
           var questionDiv=$('<div></div>', {class:'questionDiv'});
           var questionObj=getCurrentQuestion();
           var questionIndex=currentQuestionIndex+1;
           questionDiv.append(questionIndex+'. '+questionObj.question_text);
           var questionName = 'question'+String(questionIndex);
           questionDiv.append('<br>');
           for (var y = 0; y<questionObj.answers.length;y++ ){
               var answerInp=$('<input></input>', {class:'answerInput', type:'radio', name:questionName, value:questionObj.answers[y], data_index:y});
               questionDiv.append(answerInp, " "+answerInp.attr('value'),' <br>' );
               
                
                console.log(answerInp.attr('value'));
           }
           wrapperDiv.append(questionDiv);
           
       //}
       $('.quizDiv').append(wrapperDiv);
       
       var checkButton=$('<button/>', {class:'checkAnswer'});
       checkButton.append('check answer');
       checkButton.on('click', checkAnswer);
       function checkAnswer(event){
           var userSelect=$('input[name='+questionName+']:checked');
           
           var correct=checkCorrect(currentQuestionIndex, userSelect.attr('data_index'));
           console.log(correct);
           if(correct){
               userSelect.parent().append('<span class=\'correctAnswer>\'>Correct!<\span>');
               console.log(userSelect.html());
           }else
           {
               userSelect.parent().append('<span class=\'incorrectAnswer>\'>incorrect!<\span>');
               console.log(userSelect.html());
           }
       }
       
       $('.quizDiv').append(checkButton);
       
       console.log('questions have been displayed');
       
       
   }
   exports.setup=setup;
   
   return exports;
  
   
})();

$(document).ready(
    function (){
        quiz.setup();
    }
);