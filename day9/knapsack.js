var knapsack=function(){

	
	function ViewController(div, model){
		var left, right;
		var blocks_on_left=0; //each item will fit in a block, 4 blocks on each row of the container
		var blocks_on_right=0; //each item will fit in a block, 4 blocks on each row of the container
		var block_size;
		var sizeBar;
		var valueBar;
		var root;
		setup(div, model);
		
		function setup(wrapper, model){
			root=$(wrapper);
			var width=root.width()/2-20;
			block_size=width/4-6;

			var size=$('<div><span class =progressNum>'+model.getMaxSize()+'</span>/'+model.getMaxSize()+' space is left in your bag</div>').addClass('progressText');
			sizeBar=$('<div></div>').addClass('progress').progressbar({max:model.getMaxSize()});
			size.append(sizeBar);
			sizeBar=sizeBar.progressbar('widget');
			sizeBar.progressbar('enable');
			var value=$('<div><span class =valueNum>'+0+'</span>/'+' is the total utility of your bag</div>').addClass('progressText');
			valueBar=$('<div></div>').addClass('value').progressbar({max:model.getSolution()});
			value.append(valueBar);
			valueBar=valueBar.progressbar('widget');
			valueBar.progressbar('enable');

			left=$('<div></div>').addClass('left container');
			
			left.css('width',width);
			console.log( String(block_size*1.5*6.0) + 'px ' + String(width) + 'px ');
			//left.append($('<img class=shelf></img>').attr('src', 'img/shelf.png').width(width).height(block_size*1.5*6.0));
			left.css('background-size',  String(width) + 'px ' +String(block_size*1.5*6.0) + 'px ' );
			console.log(left.css('background-size'));
			right=$('<div></div>').addClass('right container');
			
			right.css('width',width);
			model.getItems().forEach(function(item, i){
				console.log(item);
				var div=$('<div></div>');
				div.addClass('item animated shape');
				div.attr('alt', item.name)
				div.append($('<img ></img>').attr('src', 'img/'+item.img).width(block_size).height(block_size));
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
					var item_name=(ui.helper.attr('alt'));
					console.log('1. dropped '+item_name+' to right');
				
					if(model.removeFromKS(item_name)){
						console.log('3. escape to left succesful');
					}else{
						console.log('3. '+ item_name +' failed to escape');
						ui.helper.animate({'left':0,'top':0}, 500);
					}
				}

			});
			right.droppable({
				accept:".item",
				hoverClass: "hover",
				tolerance: "touch",
				drop: function (event, ui){
					var item_name=(ui.helper.attr('alt'));
					console.log('1. dropped '+item_name+' to right');
					if(model.addToKS(item_name)){
						console.log('3. pass to right successful');
					}else{
						console.log('3. '+ item_name + ' failed to pass');
						ui.helper.animate({'left':0,'top':0}, 500);
					}
				}

			});

			//controllers being added to the view from the model
			model.on('added',addedToKnapsack);
			model.on('removed',removedFromKnapsack);
			model.on('alert', alert);
			root.append(size,value,left, right);
			// value.css('left', root.width()-20);
			// value.css('top', '10em');
			//set height to max height after it being calculated by the divs that change. 
			height=$(left).height();
			right.height(height);
			left.height(height);
			return height;
		}

		function addedToKnapsack(event)
		{
			//to be triggered by model

			///console.log('added to right');
			var div=root.find('.item').filter(function(i, e){return $(e).attr('alt')==event.item.name})
			console.log('2. added to right:')
			console.log(div.attr('alt'));
			if(event.item.inKS){
				var oldLeft=div.offset().left;
				var oldTop=div.offset().top;

				div.detach();
				
				var actualLeft=oldLeft+parseInt(div.css('left'));
				var actualTop=oldTop+parseInt(div.css('top'));

				right.append(div);
				var newLeft=div.offset().left;
				var newTop=div.offset().top;
				//console.log(div.offset().left-right.offset().left)
				div.css('left', actualLeft-newLeft);
				div.css('top', actualTop-newTop);
					
				
				div.animate({'left':0,'top':0}, 500);

				sizeBar.progressbar({value:event.size});
				valueBar.progressbar({value:event.value});
				sizeBar.parent().find('.progressNum').text(model.getMaxSize()-event.size);
				valueBar.parent().find('.valueNum').text(event.value);
			}
			
			if(event.isFull){
				right.addClass('full');
			}else{
				right.removeClass('full');
			}

		}

		function removedFromKnapsack(event)
		{	
			console.log('2. removed from right:');
			//to be triggered by model
			var div=root.find('.item').filter(function(i, e){return $(e).attr('alt')==event.item.name})
			console.log(div.attr('alt'));
			if(!event.item.inKS){
				var oldLeft=div.offset().left;
				var oldTop=div.offset().top;

				div.detach();
				
				var actualLeft=oldLeft+parseInt(div.css('left'));
				var actualTop=oldTop+parseInt(div.css('top'));

				left.append(div);
				var newLeft=div.offset().left;
				var newTop=div.offset().top;
				//console.log(div.offset().left-right.offset().left)
				div.css('left', actualLeft-newLeft);
				div.css('top', actualTop-newTop);
					
				sizeBar.progressbar({value:event.size});
				valueBar.progressbar({value:event.value});
				sizeBar.parent().find('.progressNum').text(model.getMaxSize()-event.size);
				valueBar.parent().find('.valueNum').text(event.value);
				div.animate({'left':0,'top':0}, 500);
			}
			
			if(event.isFull){
				right.addClass('full');
			}else{
				right.removeClass('full');
			}
		}
		function alert(event){
			$('.modal-body').html('');
			console.log(event.img)

			$('.modal-body').text(event.message);
			if(event.img!=null){
				
				$('.modal-body').add($('<img></img>').attr('src', 'img/'+event.img).addClass('alert-img'));
			}
			$('#modal-from-dom').modal('show');

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
		knapsack.setup(dom);
	});
});

function hide(){
	console.log('hide');
	$('#modal-from-dom').modal('hide');
}