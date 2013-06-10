        for(var i = 0; i < 10; i++){
            $("#table1").add(i);
        }
        function calculate(){
            var input = $("#input:first").val();
            $("#text1_out:first").text(input);
            console.log("click");
        }