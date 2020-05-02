var streamComponent = function () {
    var config = {
        el: null,
		left: 15,
		right: 15,
		top: 25,
		bottom:25,
		height: 200,
		useTooltip: true,
		tooltipFormatter: function(d) {
            return d;
        }
	};
	
var datearray = [];
var colorrange = [];

var events = d3.dispatch('panelEnter', 'panelLeave', 'dotEnter', 'dotLeave');

	var R = [51,220,255,16,153,0,221,102,184,49,153,34,170,102,230,139,101,50,85,59];
	var G = [102,57,153,150,0,153,68,170,46,99,68,170,170,51,115,7,16,146,116,62];
	var B = [204,18,0,24,153,198,119,0,46,149,153,153,17,204,0,7,103,98,166,172];

function chart(data1, color, id, titulo) {

	if (color == "blue") {
	  colorrange = ["#045A8D", "#2B8CBE", "#74A9CF", "#A6BDDB", "#D0D1E6", "#F1EEF6"];
	}
	else if (color == "pink") {
	  colorrange = ["#980043", "#DD1C77", "#DF65B0", "#C994C7", "#D4B9DA", "#F1EEF6"];
	}
	else if (color == "orange") {
	  colorrange = ["#B30000", "#E34A33", "#FC8D59", "#FDBB84", "#FDD49E", "#FEF0D9"];
	}
	strokecolor = colorrange[0];

	var format = d3.time.format("%m/%d/%y");

	var width = document.body.clientWidth - config.left - config.right;
	var height = document.body.clientWidth/10 - config.top - config.bottom;

	/*var tooltip = d3.select("body")
		.append("div")
		.attr("class", "remove")
		.style("position", "absolute")
		.style("z-index", "20")
		.style("visibility", "hidden")
		.style("top", "30px")
		.style("left", "55px");*/

	var x = d3.scale.linear()
		.range([0, width]);

	var y = d3.scale.linear()
		.range([height-10, 0]);

	var z = d3.scale.ordinal()
		.range(colorrange);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom")
		.ticks(10);

	var yAxis = d3.svg.axis()
		.scale(y);

	var yAxisr = d3.svg.axis()
		.scale(y);

	var stack = d3.layout.stack()
		.offset("silhouette")
		.values(function(d) { return d.values; })
		.x(function(d) { return d.date; })
		.y(function(d) { return d.value; });

	var nest = d3.nest()
		.key(function(d) { return d.key; });

	var area = d3.svg.area()
		.interpolate("cardinal")
		.x(function(d) { return x(d.date); })
		.y0(function(d) { return y(d.y0); })
		.y1(function(d) { return y(d.y0 + d.y); });

	if (d3.select("svg#stream"+id)[0][0])							// If SVG already exists then just select it
		d3.select("svg#stream"+id).remove();
		
	var svg = d3.select(config.el).append("svg")
		.attr("width", width + config.left + config.right)
		.attr("height", height + config.top + config.bottom)
		.attr("id","stream"+id)
		.append("g")
		.attr("transform", "translate(" + config.left + "," + config.top + ")");
	
		
	var layers = stack(nest.entries(data1));

	  x.domain(d3.extent(data1, function(d) { return d.date; }));
	  y.domain([0, d3.max(data1, function(d) { return d.y0 + d.y; })]);

	  svg.selectAll(".layer")
		  .data(layers)
		  .enter().append("path")
		  .attr("class", "layer")
		  .attr("d", function(d) { return area(d.values); })
		  .attr("fill", function(d,iB) { return 'rgb('+R[iB]+','+G[iB]+','+B[iB]+')'; });


	 svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + height + ")")
		  .attr("stroke-width", 0)
		 // .attr("fill",none)
		  .call(xAxis);

	/*  svg.append("g")
		  .attr("class", "y axis")
		  .attr("transform", "translate(" + width + ", 0)")
		  .call(yAxis.orient("right"));

	  svg.append("g")
		  .attr("class", "y axis")
		  .call(yAxis.orient("left"));*/
		  
	var gtitle = svg.selectAll('.title')
			.data('Vazio')
			.enter().append('text')
			.classed('inf', true)
			.attr('x', width/2)
			.attr('y', -145)
			.attr('font-size', 22)
			.attr('text-anchor','middle')
			.style('fill','rgb(120,125,126)')
			.style("font-weight", 'bold')
			.attr("transform","translate(0,140)")
			.text(titulo);

	  svg.selectAll(".layer")
		.attr("opacity", 1)
		.on("mouseover", function(d, i) {
		  svg.selectAll(".layer").transition()
		  .duration(250)
		  .attr("opacity", function(d, j) {
			return j != i ? 0.6 : 1;
		})})

		.on("mousemove", function(d, i) {
			var mouse = d3.mouse(config.el);
            tooltip.setText(d.key+': '/*+d.values[i].value*/).setPosition(mouse[0], mouse[1]).show();
		  
		  
		 /* var selected = (d.values);
		  for (var k = 0; k < selected.length; k++) {
			datearray[k] = selected[k].date
			//datearray[k] = datearray[k].getMonth() + datearray[k].getDate();
		  }*/

		  /*mousedate = datearray.indexOf(invertedx);
		  pro = d.values[mousedate].value;*/

		 /* d3.select(this)
		  .classed("hover", true)
		  .attr("stroke", strokecolor)
		  .attr("stroke-width", "0.5px"), 
		  tooltip.html( "<p>" + d.key + "<br>" + pro + "</p>" ).style("visibility", "visible");*/
		  
		})
		.on("mouseout", function(d, i) {
		 svg.selectAll(".layer")
		  .transition()
		  .duration(250)
		  .attr("opacity", "1");
		  tooltip.hide();
		  /*d3.select(this)
		  .classed("hover", false)
		  .attr("stroke-width", "0px"), tooltip.html( "<p>" + d.key + "<br>" + pro + "</p>" ).style("visibility", "hidden");*/
	  })
		
	  var vertical = d3.select(config.el)
			.append("div")
			.attr("class", "remove")
			.style("position", "absolute")
			//.style("z-index", "19")
			.style("width", "1px")
			.style("height", "80px")
			.style("top", "25px")
			.style("bottom", "10px")
			.style("left", "0px")
			.style("background", "#fff");

		/*d3.select(config.el)					//vertical lines following the mouse position
		  .on("mousemove", function(){  
			 mousex = d3.mouse(this);
			 mousex = mousex[0] + 5;
			 vertical.style("left", mousex + "px" )})
		  .on("mouseover", function(){  
			 mousex = d3.mouse(this);
			 mousex = mousex[0] + 5;
			 vertical.style("left", mousex + "px")});*/
			 
			 
		var tooltipContainer = d3.select(config.el)
            .append('div')
            .attr({
                id: 'radviz-tooltip'
            });
        var tooltip = tooltipComponent(tooltipContainer.node());
};

	var setConfig = function(_config) {
			config = utils.mergeAll(config, _config);
			return this;
		};
		
	function deleteALL(){
			d3.select("svg#stream"+id).remove();
			//svg.selectAll("*").remove();
	};

	var exports = {
			config: setConfig,
			chart: chart,
			deleteALL: deleteALL,
		};

    d3.rebind(exports, events, 'on');
	return exports;
};