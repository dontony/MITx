var counter =function(){
	exports={};

	var parentDiv;
	var root;

/**** Event Handler that will update the counter
	* on(event_string, callback) register handler for an event
	*
	* trigger (event string, data) call all callbacks for event_string
	*
	*/

	function EventHandler(){

		var handlers={};
		function on(event_string, callback){
			cblist=handlers[event_string];
			if(cblist===undefined){
				cblist=[];
				handlers[event_string]=cblist;
			}

			cblist.push(callback);
		}
		function trigger(event_string, data){
			var callback_list=handlers[event_string];
			if(callback_list!== undefined){
				callback_list.forEach(function(obj){obj(data);});
			}
		}

		return {on:on, trigger:trigger};
	}

	/**** Model class for counter, keeps track of a count
		*
		* function add_one will increment counter
		* funciton reset will reset the counter to 0
		* funciton getCount will return the integetr value of our count
		* on(event, callback) update the data will be new calue of counter
		*/
	var Model=function(){
		var modelCount=0;
		var exports={};
		var event_handler=EventHandler();
		function add_one(){
			modelCount++;
			event_handler.trigger('update', modelCount);
			//update view
		};


		function reset(){
			modelCount=0;
			event_handler.trigger('update', modelCount);
			//update view
		};

		function getCount(){
			return modelCount;
		};


		exports.add_one=add_one;
		exports.reset=reset;
		exports.getCount=getCount;
		exports.on=event_handler.on;
		return exports;
	};

	function Controller(model){
		var exports={};

		function increment(e){
			console.log(e);
			model.add_one();
		};

		exports.increment=increment;
		
		return exports;

	};

	function View(div, model, controller){
		var exports={};

		var display=$('<div class= "view"> The current value of the counter is <span> 0 </span>. </div>');

		var counterValue=display.find('span');
		$(div).append(display);

		function update(count){
			counterValue.text(count);
		}

		//whenever the model triggers an event, whenever it is on, call the following funciton
		model.on('update', update);

		return exports;
	};

	function setup(div){

		console.log(div);
		parentDiv=div;
		var model=Model();
		var controller=Controller(model);
		var view=View(div, model, controller);
		var view2=View(div, model, controller);

		var button=$('<button class=btn>Increment</div>');

		button.on('click', controller.increment);

		$(div).append(button);


	}

	exports.setup=setup;
	return exports
}();

$(document).ready(function(){
	$('.counter').each(function(){
		counter.setup(this);
	});
});