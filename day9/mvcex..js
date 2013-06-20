var counter =function(){
	exports={};

	var parentDiv;
	var root;

	var Model=function(){
		var exports={}
	};

	function Controller(model){
		var exports={}

	};

	function View(div, model, controller){
		var exports={};
	};

	function setup(div){
		
		console.log(div);
		parentDiv=div;
		var model=Model();
		var controller=Controller(model);
		var view=View(div, model, controller)


	}

	exports.setup=setup;
	return exports
}();

$(document).ready(function(){
	$('.counter').each(function(){
		counter.setup(this);
	});
});