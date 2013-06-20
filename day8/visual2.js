var outer_width = 500,
    outer_height = 250;
var margin={top:20, right:20, bottom:20, left:50};


var chart_width=outer_width-margin.left-margin.right;
var chart_height=outer_height-margin.top-margin.bottom;

var svg = d3.select("body").append("svg")
    .attr("width", outer_width)
    .attr("height", outer_height)
    .on("mousemove", function() { move(d3.mouse(this)); })
    .append("g")//group
    .attr('transform', 'translate('+margin.left+','+margin.top+')')//stupid;
    ;

var p0 = [chart_width * .2,chart_height * .8],
    p1 = [chart_width * .8,chart_height * .2];

var line=[ { "x": 1,   "y": 5},  { "x": 20,  "y": 20},
                 { "x": 40,  "y": 10}, { "x": 60,  "y": 40},
                 { "x": 80,  "y": 5},  { "x": 100, "y": 60}];

var p0f={'x':p0[0], 'y':p0[1]};
var p1f={'x':p1[0], 'y':p1[1]};
var arcLine=[p0f,/*{'x':p0[0], 'y':p1[1]},*/ p1f];

var lineFunction = d3.svg.line()
  .x(function(d) { return d.x; })
  .y(function(d) { return d.y; })
  .interpolate("bundle");

var radius=Math.sqrt((p1[0]-p0[0])*(p1[0]-p0[0])+(p1[1]-p0[1])*(p1[1]-p0[1]))/2;  
console.log(radius);


var arc = d3.svg.arc()
    .innerRadius(radius-1)
    .outerRadius(radius)
    .startAngle(Math.tan((Math.abs(p0[1]-p1[1]))/(Math.abs(p0[0]-p1[0])))+Math.PI/4) //converting from degs to radians
    .endAngle(Math.tan(-(Math.abs(p0[1]-p1[1]))/(Math.abs(p0[0]-p1[0])))-Math.PI/2) 
    ;

var mid=[(p1[0]+p0[0])/2, (p1[1]+p0[1])/2];
console.log(arc())

svg.append("path")
    .attr("d", arc)
    .attr("transform", "translate("+mid+")")

svg.append("path")
    .attr("class", "dashes")
    .attr("d", "M" + [0,chart_height] + "L" + [chart_width, 0])
    .attr('fill', 'none');

svg.append("path")
    .attr("class", "center")
    .attr("d", lineFunction(arcLine))
    .attr('fill', 'none');

svg.selectAll(".endpoint")
    .data([p0, p1])
  .enter().append("circle")
    .attr("class", "endpoint")
    .attr("transform", function(d) { return "translate(" + d + ")"; })
    .attr("r", 4.5);

svg.selectAll(".tick")
    .data(d3.range(-.25, 1.75, .05))
  .enter().append("circle")
    .attr("class", "tick")
    .attr("transform", function(d) { return "translate(" + d3.interpolate(p0, p1)(d) + ")"; }) //SHOW OFF INTERPOLATE
    .attr("r", 2.5);

var projection = svg.append("path")
    .attr("class", "line");

var closest = svg.append("circle")
    .attr("class", "circle intersects")
    .attr("r", 4.5);

var label = svg.append("text")
    .attr("y", -6);

move([Math.random() *chart_width, Math.random() *chart_height]);

function move(p2) {
 // console.log(p2);
  p2[0]-=margin.left;
  p2[1]-=margin.top;
  var t = pointLineSegmentParameter(p2, p0, p1),
      x10 = p1[0] - p0[0],
      y10 = p1[1] - p0[1],
      p3 = [p0[0] + t * x10, p0[1] + t * y10];
    
  label.attr("transform", "translate(" + p3 + ")rotate(" + Math.atan2(y10, x10) / Math.PI * 180 + ")").text(t.toFixed(3));
  closest.attr("transform", "translate(" + p3 + ")").classed("intersects", Math.abs(t - .5) < .5);
  projection.attr("d", "M" + p2 + "L" + p3);
}

function pointLineSegmentParameter(p2, p0, p1) {
  var x10 = p1[0] - p0[0], y10 = p1[1] - p0[1],
      x20 = p2[0] - p0[0], y20 = p2[1] - p0[1];
  return (x20 * x10 + y20 * y10) / (x10 * x10 + y10 * y10);
}

function arcLineSegment(){


}