//var data=data[3].map(function(d){return d.y});

var stack=d3.layout.stack();
var stacked_data=stack(data);
console.log(stacked_data)
var outer_height=300;
var outer_width=500;
//enter for new divs, update for all divs
//select all of something, enter it, then append it again. you're building up the thing that doesn't exist yet. 

var margin={top:20, right:20, bottom:20, left:50};


var chart_width=outer_width-margin.left-margin.right;
var chart_height=outer_height-margin.top-margin.bottom;

var y_stack_max=d3.max(stacked_data, function(layer){return d3.max(layer, function(point){return point.y+point.y0});});

var x_scale = d3.scale.ordinal().domain(d3.range(data[0].length))
	.rangeBands([0, chart_width]);
var y_scale = d3.scale.linear().domain([0, y_stack_max])
	.range([chart_height,0]);


var chart = d3.select(".chart")
		.append("svg")
			.attr("class", "chart")
			.attr("height", outer_height)
			.attr("width", outer_width)
		.append("g")//group
			.attr('transform', 'translate('+margin.left+','+margin.top+')');//stupid


chart.selectAll('line')
	.data(y_scale.ticks(10))
	.enter().append('line')
	.attr('x1', 0)
	.attr('x2', chart_width)
	.attr('y1', y_scale) 
	.attr('y2', y_scale)
	;

chart.selectAll('.y_label')
	.data(y_scale.ticks(10))
	.enter().append('text').attr('class', 'y_label')
	.attr('x', 0)
	.attr('y', y_scale)
	.attr('text-anchor', 'end')
	.attr('dy', '.3em')
	.attr('dx', -margin.left/8)
	.text(String)
	;

var layer_groups=chart.selectAll('.layer').data(stacked_data)
	.enter().append('g')
	.attr('class',  'layer');

chart.selectAll("rect")
	.data(data).enter().append("rect")
	.attr("x", function(d, i){return x_scale(i);}) //
	.attr("y",y_scale) //
	.attr("width", x_scale.rangeBand())
	.attr("height", function(d, i){return chart_height-y_scale(d);})
	;

// chart.selectAll(".bar_label").data(data)
// 	.enter().append("text").attr('class', 'bar_label')
// 	.attr("x", function(d, i) {return x_scale(i) + x_scale.rangeBand()/2; })
// 	.attr("y",  function(d, i){return y_scale(d)+3;})
// 	.attr("dx", 0)
// 	.attr("dy", "1em")		
// 	.attr("text-anchor", "middle")
// 	.text(String)
// 	;

