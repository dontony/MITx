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
		var item=objects.filter(function(e, i){return e.name==name})[0];
	
		if(item){
			if(item.size+ks_size<=max_size&&1+knapsack.length<=max_length){

				knapsack.push(item);
				ks_size+=item.size;
				ks_value+=item.value;
				item.inKS=true; //TODO doublecheck if inKS is maintained
				
				console.log(ks_size);
				event_handler.trigger('added', {item:item, size:ks_size, value:ks_value, isFull:ks_size>=max_size});

				return true;
			}			//update event handler 

		}
		return false;
	}

	function removeFromKS(name){
		var index;
		var item=knapsack.filter(function(e, i){index=i;return e.name==name})[0];
		console.log(index)
		if(item){
				knapsack.splice(index, 1);
				ks_size-=item.size;
				ks_value-=item.value;
				item.inKS=false; //TODO doublecheck if inKS is maintained
				event_handler.trigger();
				console.log(ks_size);
				event_handler.trigger('removed', {item:item, size:ks_size, value:ks_value, isFull:ks_size>=max_size});

				return true;
			
		}
		return false;
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
	function getMaxSize(){
		return max_size;
	}
	var exports={};
	exports.list=list;
	exports.getItems=getItems;
	exports.getKS=getKnapsack;
	exports.addToKS=addToKS;
	exports.removeFromKS=removeFromKS;
	exports.getValue=getValue;
	exports.getSize=getSize;
	exports.getMaxSize=getMaxSize;
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

