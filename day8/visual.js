// var chart = $('<div></div>').addClass('chart');
// $('.chart-container').append(chart);
var data=[20,15,50,80,70,150,90,040,60,10,30];

//data.forEach(function(d){chart.append(d)});
// data.forEach(function(d){chart.append($('<div></div>').css('width', d*10+'px').text(d))})

//d3 two big ideas, live listening in on changing data, manipulating data that
//doesn't exist yet.
// var x_scale=d3.scale.linear().domain([0, d3.max(data)]).range(['0%', '80%']);
// // var y_scale=d3.scale.ordinal().domain(d3.keys(data)).rangeBands([0, chart_height]);
// var y_scale = d3.scale.ordinal().domain(d3.keys(data)).rangeBands([0, chart_height]);
// console.log(d3.keys(data));
// console.log(y_scale(3));
var outer_height=300;

var outer_width=500;
// var bar_height=chart_height/data.length;
// var chart=d3.select('.chart-container').append('svg').attr('class', 'chart');

// chart.selectAll('rect').data(data).enter().append('rect')
// 	.attr('width', x_scale)
// 	.attr('height', bar_height)
// 	.attr('y', function(d, i){return y_scale(i);});
// 	// .text(function(d){return String(d)});

// chart.selectAll('text').data(data).enter().append('text')
// 	.text(function(d){return d;})
// 	.attr('y', function(d,i){return 1+y_scale(i)+y_scale.rangeBand()/2;})
// 	.attr('dx', -3)
// 	.attr('dy', '0.25em')
// 	.attr('text-anchor', 'end')
// 	.attr('height', bar_height)
// 	.attr('x', x_scale)
// 	;
//enter for new divs, update for all divs
//select all of something, enter it, then append it again. you're building up the thing that doesn't exist yet. 

var margin={top:20, right:20, bottom:20, left:30};


var chart_width=outer_width-margin.left-margin.right;
var chart_height=outer_height-margin.top-margin.bottom;

var x_scale = d3.scale.ordinal().domain(d3.keys(data))
	.rangeBands([0, chart_width]);
var y_scale = d3.scale.linear().domain([0, d3.max(data)])
	.range([chart_height,0]);


var chart = d3.select(".chart-container")
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


chart.selectAll("rect")
	.data(data).enter().append("rect")
	.attr("x", function(d, i){return x_scale(i);}) //
	.attr("y",y_scale) //
	.attr("width", x_scale.rangeBand())
	.attr("height", function(d, i){return chart_height-y_scale(d);})
	;

chart.selectAll(".bar_label").data(data)
	.enter().append("text").attr('class', 'bar_label')
	.attr("x", function(d, i) {return x_scale(i) + x_scale.rangeBand()/2; })
	.attr("y",  function(d, i){return y_scale(d)+3;})
	.attr("dx", 0)
	.attr("dy", "1em")		
	.attr("text-anchor", "middle")
	.text(String)
	;

