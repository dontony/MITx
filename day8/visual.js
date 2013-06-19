// var chart = $('<div></div>').addClass('chart');
// $('.chart-container').append(chart);
var data=[0,2,5,8,7,15,9,4,6,1,3];

//data.forEach(function(d){chart.append(d)});
// data.forEach(function(d){chart.append($('<div></div>').css('width', d*10+'px').text(d))})

//d3 two big ideas, live listening in on changing data, manipulating data that
//doesn't exist yet.
var x_scale=d3.scale.linear().domain([0, d3.max(data)]).range(['0%', '80%']);
var y_scale=d3.scale.ordinal().domain(d3.keys(data)).rangeBands([0, chart_height]);
console.log(d3.keys(data));
var chart_height=220;

var bar_height=chart_height/data.length;
var chart=d3.select('.chart-container').append('svg').attr('class', 'chart');

chart.selectAll('rect').data(data).enter().append('rect')
	.attr('width', x_scale)
	.attr('height', bar_height)
	.attr('y', function(d, i){return y_scale(i);	});
	// .text(function(d){return String(d)});

chart.selectAll('text').data(data).enter().append('text')
	.text(function(d){return d;})
	.attr('y', function(d,i){return 1+y_scale(i)+y_scale.rangeBand()/2;})
	.attr('dx', -3)
	.attr('dy', '0.25em')
	.attr('text-anchor', 'end')
	.attr('height', bar_height)
	.attr('x', x_scale)
	;
//enter for new divs, update for all divs
//select all of something, enter it, then append it again. you're building up the thing that doesn't exist yet. 



