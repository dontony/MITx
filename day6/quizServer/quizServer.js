var questions = [
                    {
                      question_text:"what is the air speed of an unladen swallow?", 
                      answers:["32 mph", "42 kph","16 m/s","african or european?"], 
                      hints:['think about the type of swallow...', 'think about the type of swallow...', 'think about the type of swallow...', ''],
                    }, 
                    {
                      question_text:"on 1969, what is the most important thing that happened??", 
                      answers:["woodstock, duh", "ummm goldwater was stupid?","Moon landing!","end of civil war?"], 
                      hints:['maybe for music but not the world...', 'could be more important', '', 'wrong century, and wrong year'],
                    }
                  ];
var answers=[3,2];
    //Holds a DOM object  with the question text, 
   //ex. question.question_text="what is the air speed of an unladen swallow?" 
   //    question.answers=["32 mph", "42 kph","16 m/s","african or european?"]
   //    question.solutionIndex=4;

var sys = require("sys");
var url=require('url');
var qs = require('querystring');

my_http = require("http");
my_http.createServer(function(request,response){  
    sys.puts("I got kicked"); 

    response.writeHeader(200, 
        {
          "Content-Type": "text/plain",
          "Access-Control-Allow-Origin":'*'
        });
    var pathname = url.parse(request.url).pathname;
    var questionIndex=parseInt(qs.parse(request.url)['questionIndex']);
    sys.puts(pathname);
    sys.puts(pathname==='/getNumber');
    if(pathname==='/checkAnswer'){
      
      var userAnswer=parseInt(qs.parse(request.url)['userAnswer']);
      var solution=parseInt(answers[questionIndex])
      sys.puts(solution);
      var checkAnswer=(solution==userAnswer);
      sys.puts(qs.parse(request.url)['username']);

        
      response.write(String(checkAnswer));  
    }
    else if(pathname==='/getQuestion'){
      
      if(questionIndex<questions.length){
        response.write(JSON.stringify(questions[questionIndex]));
      }
      else{
        response.write('no string here');
      }

    }else if(pathname==='/getNumber'){
      console.log(String(questions.length));
      response.write(String(questions.length));
    }
    response.end();  
}).listen(8080);  
sys.puts("Server Running on 8080");   