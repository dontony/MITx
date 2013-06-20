var knapsack=function(){

	
	function ViewController(div, model){
		var left, right;
		var blocks_on_left=0; //each item will fit in a block, 4 blocks on each row of the container
		var blocks_on_right=0; //each item will fit in a block, 4 blocks on each row of the container
		var block_size;
		var size;
		var value;
		setup(div, model);
		
		function setup(wrapper, model){
			var width=$(wrapper).width()/2-20;
			block_size=width/4;

			size=$('<div></div>').addClass('progress');
			size.progressbar({max:model.getMaxSize});
			size.progressbar('enable');

			left=$('<div></div>').addClass('left container pull-left');
			
			left.css('width',width);
			right=$('<div></div>').addClass('right container pull-right');
			
			right.css('width',width);
			model.getItems().forEach(function(item, i){
				console.log(item);
				var div=$('<div></div>');
				div.addClass('item animated shape');
				div.attr('alt', item.name)
				div.append($('<img ></img>').attr('src', 'img/sword.png'));//+item.img));
				div.append($('<div></div>').text('size: '+item.size+' value: '+item.value));
				div.height(block_size*1.5);
				div.width(block_size);
				draggable(div);
				if(item.inKS){
					right.append(div);
					//div.css('left', (blocks_on_right%4)*block_size);
					//div.css('top', (blocks_on_right/4)*block_size);
					blocks_on_right++;
				}else{
					left.append(div);
					
					//div.css('left', (blocks_on_left%4)*block_size);
					//div.css('top', Math.floor(blocks_on_left/4)*block_size);
					blocks_on_left++;
				}
			});

			left.droppable({
				accept:".item",
				hoverClass: "hover",
				tolerance: "touch",
				drop: function (event, ui){

				}

			});
			right.droppable({
				accept:".item",
				hoverClass: "hover",
				tolerance: "touch",
				drop: function (event, ui){
					var item_name=(ui.helper.attr('alt'));

					if(model.addToKS(item_name)){
						console.log('pass');
					}else{
						console.log(ui);
						ui.helper.animate({'left':0,'top':0}, 500);
					}
				}

			});
			model.on('added',addedToKnapsack);
			model.on('removed',removedFromKnapsack);
			$(wrapper).append(size,left, right);
			height=$(left).height();
			right.height(height);
			left.height(height);
			return height;
		}

		function addedToKnapsack(event)
		{
			//to be triggered by model

			console.log('added to right');
			var div=$('.item').filter(function(i, e){return $(e).attr('alt')==event.item.name})
			console.log(div);
			if(event.item.inKS){
				div.detach();
				div.css('left',0);
				div.css('top', 0);
				right.append(div)
			}
			size.progressbar('value',event.item.size);

		}

		function removedFromKnapsack(event)
		{	
			console.log('removed from right');
			//to be triggered by model
		}
		function draggable(div){
			$(div).draggable({
				zIndex:100,
				containment:'.knapsack',
				grid: [ block_size/4,block_size/4 ],
				start: function(e, ui) {
					var img = $('<img class=overlay>').attr('src', 'img/highlight.png');
					//end code
					$(div).append(img);
				},
				stop: function(e, ui) {
					$(div).find('img.overlay').remove();
					
				}
			});
		}
	}
	function setup(div, width, height){
		height=height||400;
		width=width||600;
		$(div).height(height);
		$(div).width(width);

		items=[];
		//TODO make this read from a JSON file/server
		items.push(
					{
						name:'sword',
						img:'sword.png',
						size:10,
						value:30,
					},{
						name:'shield',
						img:'shield.png',
						size:8,
						value:25,
					},{
						name:'bow and arrow',
						img:'bow.png',
						size:7,
						value:18,
					},{
						name:'boomerang',
						img:'boomerang.png',
						size:5,
						value:15,
					},{
						name:'hookshot',
						img:'hookshot.png',
						size:6,
						value:20,
					},{
						name:'fairy',
						img:'fairy.png',
						size:5,
						value:30,
					},{
						name:'bombs',
						img:'bombs.png',
						size:10,
						value:18,
					},{
						name:'potion',
						img:'potion.png',
						size:5,
						value:10,
					},{
						name:'mirror shield',
						img:'mirror_shield.png',
						size:12,
						value:30,
					},{
						name:'iron boots',
						img:'iron_boots.png',
						size:10,
						value:5,
					},{
						name:'hammer',
						img:'hammer.png',
						size:12,
						value:10,
					},{
						name:'biggoron sword',
						img:'biggoron_sword.png',
						size:20,
						value:35,
					},{
						name:'ocarina of time',
						img:'ocarina.png',
						size:1,
						value:30,
					},{
						name:'slingshot',
						img:'slingshot.png',
						size:2,
						value:-10,
					});
		
		var model=Model(items, 40);
		var view = ViewController(div, model);
	}

	return {setup:setup};

}();





$(document).ready(function(){
	$('.knapsack').each(function(i, dom){
		console.log(dom)
		knapsack.setup(dom, 400);
	});
});