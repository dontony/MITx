function Model(list, size, length){

	var objects=[];
	//objects will include JSON representations of objects, 
	// have attr name, img, size(cost), value, boolean inKS
	var max_size=size||25;
	//max size/weight limit of knapsack
	var max_length=length||list.length;
	//max number of items in knapsack, NO MULTIPLES
	//optional parameter

	var knapsack=[];
	//list of objects in knapsack
	var ks_size=0;
	//size/cost of all objects in knapsack
	var ks_value=0;
	//value/importance of all objects in sack
	console.log(setup(list));

	var event_handler=EventHandler();
	function setup(list){
		console.log(max_size);
		console.log(max_length);

		list.forEach(function(d){ d.inKS=false;objects.push(d)});

		return objects;
	}

	function addToKS(name){
		var toAdd=list.filter(function(e, i){return e.name==name})[0];
		if(toAdd){
			if(toAdd.size+ks_size<=max_size&&1+knapsack.length<=max_length){

				knapsack.push(toAdd);
				ks_size+=toAdd.size;
				ks_value+=toAdd.value;
				toAdd.inKS=true; //TODO doublecheck if inKS is maintained
				event_handler.trigger();
				console.log(ks_size);
				event_handler.trigger('added', {item:toAdd, size:ks_size, value:ks_value});

				return true;
			}			//update event handler 

		}
		return false;
	}

	function removeFromKS(name){

	}

	function getItems(){
		return items;
	}
	function getKnapsack(){
		return knapsack;
	}
	function getValue(){
		return ks_value;
	}
	function getSize(){
		return ks_size
	}
	var exports={};
	exports.list=list;
	exports.getItems=getItems;
	exports.getKS=getKnapsack;
	exports.addToKS=addToKS;
	exports.removeFromKS=removeFromKS;
	exports.getValue=getValue;
	exports.getSize=getSize;
	exports.on=event_handler.on;
	return exports;
};

function EventHandler(){

		var handlers={};
		function on(event_string, callback){
			var cblist=handlers[event_string];
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

