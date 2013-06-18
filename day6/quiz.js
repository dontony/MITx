var quiz = (function(){
   var exports = {};
   
  var questionsLength=0;
   
   
   var answers = [];
   //holds the answers of the student for comparison
   
   var score=0;
   var useLocalStorage=false;
   var currentQuestionIndex=0;
   var currentWrapperDiv=null;
   var userName='';
   var quizInstance; //Parse Quiz instance
   var currentQuestionObj;// JSON current question obj
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

            
            getCurrentQuestion();

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
            getCurrentQuestion();
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
    var req=$.ajax({
                url:'http://localhost:8080/getNumber', 
                //data:{'username':username}
            });
            req.done(function(msg){
              console.log(msg+' from server');
              questionsLength=parseInt(msg);
            });
       
   }
   function getCurrentQuestion(){
       //return questions[currentQuestionIndex];
      var req=$.ajax({
                async:false,
                url:'http://localhost:8080/getQuestion', 
                data:{'username':username, 'questionIndex':currentQuestionIndex}
            });
      req.done(function(msg){
        console.log(msg + 'from server');
        currentQuestionObj=JSON.parse(msg)
        displayQuestion(currentQuestionObj);
        return JSON.parse(msg);
      });

   }
   function displayQuestion(questionObj){
        while(!questionsLength){
          console.log('waiting on server');
        }
       if(currentQuestionIndex<questionsLength){
       var wrapperDiv=$('<div></div>', {class:'questionWrapper'});
       console.log(currentQuestionIndex);
           var questionDiv=$('<div></div>', {class:'questionDiv'});
           
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
      currentWrapperDiv.find('.nextQuestionButton').attr('disabled', 'disabled');
      currentWrapperDiv.find('.nextQuestionButton').css('visibility', 'hidden');
      if(currentQuestionIndex<questionsLength){
       getCurrentQuestion();
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
           var req=$.ajax({
                url:'http://localhost:8080/checkAnswer', 
                data:{id:10,'userAnswer':userIndex, 'username':username, 'questionIndex':currentQuestionIndex}
            });
            req.done(function(msg){
              console.log(msg);
            
           //var correct=checkCorrect(currentQuestionIndex, userIndex);
           var correct=parseBoolean(msg);
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
            feedback.text(' incorrect, ' + currentQuestionObj.hints[userIndex]);
            feedback.addClass('incorrectAnswer');
            decrementScore();
           }
         });
       
  }  
  function parseBoolean(s){
    return s==='true';
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