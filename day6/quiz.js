var quiz = (function(){
   var exports = {};
   
   var questions = [{
                      question_text:"what is the air speed of an unladen swallow?", 
                      answers:["32 mph", "42 kph","16 m/s","african or european?"], 
                      hints:['think about the type of swallow...', 'think about the type of swallow...', 'think about the type of swallow...', ''],
                    }, 
                    {
                      question_text:"on 1969, what is the most important thing that happened??", 
                      answers:["woodstock, duh", "ummm goldwater was stupid?","Moon landing!","end of civil war?"], 
                      hints:['maybe for music but not the world...', 'could be more important', '', 'wrong century, and wrong year'],
                    }];
   //Holds a DOM object  with the question text, 
   //ex. question.question_text="what is the air speed of an unladen swallow?" 
   //    question.answers=["32 mph", "42 kph","16 m/s","african or european?"]
   //    question.solutionIndex=4;
   
   var answers = [];
   //holds the answers of the student for comparison
   
   var score=0;
   var useLocalStorage=false;
   var currentQuestionIndex=0;
   var currentWrapperDiv=null;
   var userName='';
   var quizInstance;
   // function to check answer, takes in 
   //q, question index
   //a, student answe index
   //returns boolean, true if answer is correct, false otherwise. 
   function checkCorrect(q, a){
       return getCurrentQuestion().solutionIndex==a;
   };
    
   function incrementScore(){
    score++;
      localStorage.setItem('score', score);
      quizInstance.increment("score");
      quizInstance.save();
     return score;  
   };function decrementScore(){
    score--;
      localStorage.setItem('score', score);
      quizInstance.increment("score", -1);
      quizInstance.save();
     return score;  
   };
   function incrementQuestionIndex(){
    currentQuestionIndex++;
      localStorage.setItem('currentQuestionIndex', currentQuestionIndex);
      quizInstance.increment("currentQuestionIndex");
      quizInstance.save();
     return currentQuestionIndex;  
   };
   
   function setup(){
    
    if(useLocalStorage){
      username=prompt('username:', name);
      var tempUN=localStorage.getItem("username");
      console.log(tempUN);
      if(tempUN&&username===tempUN){
        currentQuestionIndex=parseInt(localStorage.getItem('currentQuestionIndex'));
        score=parseInt(localStorage.getItem('score'));
      }else{
        localStorage.setItem('currentQuestionIndex', currentQuestionIndex)
        localStorage.setItem('score', score);
        localStorage.setItem('username', username);
      }
    }
    else{
      parseID=localStorage.getItem('ParseID');
      if(parseID){
        var Quiz = Parse.Object.extend("Quiz");
        var query = new Parse.Query(Quiz);
        query.get(parseID, {
          success: function(object) {
            console.log('The object was retrieved successfully.'); 
            quizInstance=object;
            console.log(quizInstance);
            score = quizInstance.get("score");
            username = quizInstance.get("username");
            currentQuestionIndex = quizInstance.get("currentQuestionIndex");
            console.log(currentQuestionIndex);
            displayQuestion();
          },
          error: function(object, error) {
            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and description.
          }
        });
        
      }
      else{
        var Quiz = Parse.Object.extend("Quiz");
        quizInstance = new Quiz();
         username=prompt('username:', name);
        quizInstance.set("score", score);
        quizInstance.set("username",username);
        quizInstance.set("currentQuestionIndex", currentQuestionIndex);
         
        quizInstance.save(null, {
          success: function(quizInstance) {
            // Execute any logic that should take place after the object is saved.
            alert('New object created with objectId: ' + quizInstance.id);
            console.log(quizInstance);
            displayQuestion();
        localStorage.setItem('ParseID', quizInstance.id);
          },
          error: function(quizInstance, error) {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and description.
            alert('Failed to create new object, with error code: ' + error.description);
          }
        });
        
      } 

    }
       
   }
   function getCurrentQuestion(){
       return questions[currentQuestionIndex];
   }
   function displayQuestion(){
       if(currentQuestionIndex<questions.length){
       var wrapperDiv=$('<div></div>', {class:'questionWrapper'});
       console.log(currentQuestionIndex);
           var questionDiv=$('<div></div>', {class:'questionDiv'});
           var questionObj=getCurrentQuestion();
           var questionIndex=currentQuestionIndex+1;
           questionDiv.append(questionIndex+'. '+questionObj.question_text);
           var questionName = 'question'+String(questionIndex);
           questionDiv.append('<br>');
           for (var y = 0; y<questionObj.answers.length;y++ ){
              var answerDiv=$('<div></div>', {class:'answerDiv'});
               var answerInp=$('<input></input>', {class:'answerInput', type:'radio', name:questionName, value:questionObj.answers[y], data_index:y});
               answerDiv.append(answerInp, " "+answerInp.attr('value'),'<span class=feedback > <\span>');

               questionDiv.append(answerDiv);
                
                console.log(answerInp.attr('value'));
           }
           wrapperDiv.append(questionDiv);
           
      
       
       var checkButton=$('<button/>', {class:'checkAnswer'});
       checkButton.append('check answer');
       checkButton.on('click', checkAnswer);
       
      
       
       wrapperDiv.append(checkButton);
        $('.quizDiv').append(wrapperDiv);
       console.log('questions have been displayed');
       currentWrapperDiv=wrapperDiv;
       localStorage.setItem("currentQuestionIndex", currentQuestionIndex);
     }
     else{
      alert('you are done, score: ' + String(score));
     }
   }
    function nextQuestion(event){
      incrementQuestionIndex();
      if(currentQuestionIndex<questions.length){
        currentWrapperDiv.find('.nextQuestionButton').attr('disabled', 'disabled');
        currentWrapperDiv.find('.nextQuestionButton').css('visibility', 'hidden');

       displayQuestion();
       console.log(currentQuestionIndex);
    }
    else{
      currentWrapperDiv.append("You're done with the quiz! your score is: " + score);
    }
    console.log('done');
   }
   function checkAnswer(event){
    console.log('checkAnswer');
      var questionName = 'question'+String(currentQuestionIndex+1);
           var userSelect=currentWrapperDiv.find('input[name='+questionName+']:checked');
           var userIndex=userSelect.attr('data_index');
           var questionObj=getCurrentQuestion();
           var req=$.ajax({
                url:'http://localhost:8080/', 
                data:{id:10,'userIndex':userIndex, 'username':username}
            });
            req.done(function(msg){
              console.log(msg);
            
           var correct=checkCorrect(currentQuestionIndex, userIndex);

           var feedback=userSelect.parent().children('.feedback');
           if(correct){
            console.log('correct');
            
            feedback.text(' Correct!');
            feedback.addClass('correctAnswer');
            currentWrapperDiv.find('.checkAnswer').attr('disabled','disabled');
            incrementScore();
            var nextButton=$('<button>Next Question</button>');
            nextButton.addClass('nextQuestionButton');
            nextButton.on('click', nextQuestion);
            currentWrapperDiv.append(nextButton);
            
          }else
           {
            console.log('incorrect');
            feedback.text(' incorrect, ' + questionObj.hints[userIndex]);
            feedback.addClass('incorrectAnswer');
            decrementScore();
           }
         });
       
  }  
   exports.setup=setup;
   
   return exports;
  
   
})();

$(document).ready(
    function (){
     Parse.initialize("5CtlDWYSsteex2D8DWQwzaIQgfaRbpsY1vn05UQX", "odUDbz4mxduSnQuPHge5tZlE5pwHhtOd3CoXayiG");
        quiz.setup();
        // var TestObject = Parse.Object.extend("TestObject");
        // var testObject = new TestObject();
        // testObject.save({foo: "bar"}, {
        //   success: function(object) {
        //     alert("yay! it worked");
        //   }
        // });
        /*var req=$.ajax({
            url:'http://localhost:8080/', 
            data:{id:10,  }
        });
        req.done(function(msg){
          console.log(msg);
        }); */
    }
);