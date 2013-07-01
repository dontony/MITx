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
		
		if(item){ //if item exists
			if(!item.inKS){ //and item is not in knapsack already
				if(item.size+ks_size<=max_size&&1+knapsack.length<=max_length){
					//and we can put it in the knapsack, then add it to the knapsack
					knapsack.push(item);
					ks_size+=item.size;
					ks_value+=item.value;
					item.inKS=true; //TODO doublecheck if inKS is maintained
					
					console.log(ks_size);
					//and tell the view that we just added an item to the knapsack
					event_handler.trigger('added', {item:item, size:ks_size, value:ks_value, isFull:ks_size>=max_size});

					return true;
				}
				else{//we can't put item in knapsack it is too big to fit
					if(ks_size==max_size)
						event_handler.trigger('alert',{img: item.img,message:'knapsack is full, you can\'t put any more items in'});
					else
						event_handler.trigger('alert',{img: item.img,message:name+' is too big to fit in knapsack'});
					return false;
				}
			}
			else{ //item is in knapsack, so it can't be added again
				event_handler.trigger('alert', {img: item.img,message:name+' is already in the knapsack'});
			}
		}
		else{ //item does not exist
			event_handler.trigger('alert',{message:name + " does not exist"});
		}		
		return false;
	}

	function removeFromKS(name){
		var index;
		var item=knapsack.filter(function(e, i){if(e.name==name){index=i;}return e.name==name})[0];
		console.log(index)
		
		if(item){
			if(item.inKS){
				console.log(knapsack[index].name);
				knapsack.splice(index, 1);
				console.log('removed ' + item.name + '    from');
				console.log(knapsack);
				ks_size-=item.size;
				ks_value-=item.value;
				item.inKS=false; //TODO doublecheck if inKS is maintained
				console.log(ks_size);	
				event_handler.trigger('removed', {img: item.img,item:item, size:ks_size, value:ks_value, isFull:ks_size>=max_size});

				return true;
			}
			else{
				event_handler.trigger('alert',{img: item.img,message:name + ' is not in the knapsack, so we cannot take it out'});
			}
			
		}
		else{
			event_handler.trigger('alert',{message:name + ' is does not exist'});
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
	function getMaxLength(){
		return max_length;
	}
	function solve(i, size_left){

		if(i<0||size_left<0){
			return 0;
		}
		return Math.max(solve(i-1, size_left-objects[i].size)+objects[i].value, solve(i-1, size_left));
	}
	function getSolution(){
		return solve(max_length-1, max_size);
	}

	function tryHeaviest(){
		list = objects.sort(function(item){return item.size;});
		console.log(list);
		
	}
	function tryRatio(){
		list = objects.sort(function(item){return item.value/item.size;});
		console.log(list);
		
	}
	function tryCostliest(){
		list = objects.sort(function(item){return item.value;})
		console.log(list);
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
	exports.getMaxLength=getMaxLength;
	exports.getSolution=getSolution;
	exports.tryHeaviest=tryHeaviest;
	exports.tryCostliest=tryCostliest;
	exports.tryRatio=tryRatio;
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

