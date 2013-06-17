var questions = [{
                      question_text:"what is the air speed of an unladen swallow?", 
                      answers:["32 mph", "42 kph","16 m/s","african or european?"], 
                      hints:['think about the type of swallow...', 'think about the type of swallow...', 'think about the type of swallow...', ''],
                      solutionIndex:3
                    }, 
                    {
                      question_text:"on 1969, what is the most important thing that happened??", 
                      answers:["woodstock, duh", "ummm goldwater was stupid?","Moon landing!","end of civil war?"], 
                      hints:['maybe for music but not the world...', 'could be more important', '', 'wrong century, and wrong year'],
                      solutionIndex:2
                    }];

var sys = require("sys"),  
my_http = require("http");  
my_http.createServer(function(request,response){  
    sys.puts("I got kicked");  
    sys.puts(request.userIndex);
    response.writeHeader(200, 
    	{
    		"Content-Type": "text/plain",
    		"Access-Control-Allow-Origin":'*'
    	});  
    response.write("Hello World");  
    response.end();  
}).listen(8080);  
sys.puts("Server Running on 8080");   