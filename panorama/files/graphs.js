var graphComponent = function () {
    var config = {
        el: null,
		width: 500,
		height: 350,
        marginLeft: 0,
		marginTop: 20,
		radius: 140,
		arcpie:0,
		seq:0,
		textOffset:0,
		zoomFactor:1,
		useTooltip: true,
		tooltipFormatter: function(d) {
            return d;
        }
	};

var arcback;
var arcfront;
	
var events = d3.dispatch('panelEnter', 'panelLeave', 'dotEnter', 'dotLeave');

		var pie = d3.layout.pie()
			.sort(null)
			.value(function(d) { return d.partition; });
		
		var path = d3.svg.arc()
			.outerRadius(config.radius)
			.innerRadius(0);
		
		var label = d3.svg.arc()
			.outerRadius(config.radius - 30)
			.innerRadius(config.radius - 30);
			
		function tweenPie(b) {
		  b.innerRadius = 0;
		  var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
		  return function(t) { return path(i(t)); };
		}
		
		function arc2Tween(b) {
		  var i = d3.interpolate(this._current, b);
		  this._current = i(0);
		  return function(t) { return path(i(t)); };
		}
		
		function endall(transition, callback) {  												//Function to wait all animations to end
				if (typeof callback !== "function") throw new Error("Wrong callback in endall");
				if (transition.size() === 0) { callback() }
				var n = 0; 
				transition 
					.each(function() { ++n; }) 
					.each("end", function() { if (!--n) callback.apply(this, arguments); }); 
			  } 

			
			
			
			
			function avoidingOverlap(tClass){
			var avoidOverlap = d3.select('#graph'+config.seq).selectAll(tClass);
			var prev;
			avoidOverlap.each(function(d, i) {
				if(i > 0) {
					var thisbb = this.getBoundingClientRect(),
						prevbb = prev.getBoundingClientRect();
		
					var collideHoriz = thisbb.left < prevbb.right && thisbb.right > prevbb.left;
					var collideVert = thisbb.top < prevbb.bottom && thisbb.bottom > prevbb.top || thisbb.top > prevbb.bottom && thisbb.bottom < prevbb.top;		
							
							
						if (collideHoriz && collideVert){
						var ctx = thisbb.left + (thisbb.right - thisbb.left)/2,
							cty = prevbb.top + (thisbb.bottom - thisbb.top)/2,
							cpx = prevbb.left + (prevbb.right - prevbb.left)/2,
							cpy = prevbb.top + (prevbb.bottom - prevbb.top)/2,
							off = Math.sqrt(Math.pow(ctx - cpx, 2) + Math.pow(cty - cpy, 2))/2;
							
						var addY = Math.sin((d.startAngle + d.endAngle - Math.PI) / 2) > 0 ? 1:-1;
					 	d3.select(this).attr("transform",
							"translate(" + Math.cos(((d.startAngle + d.endAngle - Math.PI) / 2)) * (config.radius) + "," + addY * (Math.sqrt(Math.pow(266-cty,2))+prevbb.height/2+1) + ")");
					}
				}
				prev = this;
			});
			}
		
		var R = [51,220,255,16,153,0,221,102,184,49,153,34,170,102,230,139,101,50,85,59];
		var G = [102,57,153,150,0,153,68,170,46,99,68,170,170,51,115,7,16,146,116,62];
		var B = [204,18,0,24,153,198,119,0,46,149,153,153,17,204,0,7,103,98,166,172];
	
var render = function(data, titulo, firstrun, seq){
	config.seq = seq;
		if (firstrun){	
			var svg = d3.select(config.el)
				.append('svg')
				.attr({
					width: config.width,
					height: config.height+200
				})
				.attr("id","graph"+seq)
				.attr("transform", "scale("+config.zoomFactor+")");
		}
		else
			svg = d3.selectAll("svg#graph"+seq);
		
		config.firstrun = false;
			
		var root = svg.append('g')
            .attr({
                transform: 'translate(' + [config.marginLeft+config.width/2, config.marginTop+config.height/2] + ')'
            });
		
		var gtitle = root.selectAll('.title')
			.data('Vazio')
			.enter().append('text')
			.classed('inf', true)
			.attr('x', 0)
			.attr('y', -300)
			.attr('font-size', 22)
			.attr('text-anchor','middle')
			.style('fill','rgb(120,125,126)')
			.style("font-weight", 'bold')
			.transition()
			.delay(seq*200)
			.ease("elastic")
			.duration(2000)
			.attr("transform","translate(0,140)")
			.text(titulo);
			
			

		arcback = root.selectAll(".arc")
			.data(pie(data))
			.enter().append("g")
			.attr("class", "arc");

		arcback .append("path")
			.attr("d", path)
			.each(function(d) { this._current = d; })
			.attr('fill-opacity',0)
			.transition()
			.duration(200)
			.attr('fill-opacity',1)
			.attr("fill", function(d,iB) { return 'rgb('+R[iB]+','+G[iB]+','+B[iB]+')'; })
			.transition()
			.delay(200+seq*200)
			.ease("linear")
			.duration(2000)
			.attrTween("d", tweenPie);
		
		arcfront = root.selectAll(".arc2")
			.data(pie(data))
			.enter().append("g")
			.attr("class", "arc2");

		
		arcfront.append("text")
			.attr('font-size', 18)
			.classed('tex1',true)
			.transition()
			.delay(600+seq*200)
			.ease("elastic")
			.duration(2000)
			.attr("transform", function(d) { 					// changing the position (near the center)
				var centro = label.centroid(d);
				centro[0] *= 0.9; centro[1] *= 0.9;
				return "translate(" + centro + ")"; })
			.attr("dy", "0.35em")
			.style("font-weight", 'bold')
			.attr('text-anchor','middle')
			//.style('fill','white')
			.text(function(d) { return d.data.partition+'%'; })
			.call(endall, function() {avoidingOverlap(".tex1")});
			
		arcfront.append("text")
			.attr('font-size', 10)
			.classed('tex2',true)
			.transition()
			.delay(1200+seq*200)
			//.delay(500*Math.random())
			.ease("elastic")
			.duration(2000)
			.attr("transform", function(d) { 					// changing the position (near the center)
				var centro = label.centroid(d);
				centro[0] *= 1.55; centro[1] *= 1.3;
				return "translate(" + centro + ")"; })
			.attr("dy", "0.35em")
			.style("font-weight", 'bold')
			.attr('text-anchor','middle')
			//.style('fill','white')
			.text(function(d) { return d.data.label; })
			.call(endall, function() {avoidingOverlap(".tex2")});
			

		var tooltipContainer = d3.select(config.el)
            .append('div')
            .attr({
                id: 'radviz-tooltip'
            });
        var tooltip = tooltipComponent(tooltipContainer.node());
			
		return this;
	};
	
	var setConfig = function(_config) {
        config = utils.mergeAll(config, _config);
        return this;
    };
	
	function deleteALL(){
			var svg = d3.select("svg#graph");
			svg.selectAll("*").remove();
	};
	
	function updatePartitions(newdata){
				
		// Updating the pie with new values
		arcback = d3.select('#graph'+config.seq).selectAll("path").data(pie(newdata))
		.transition()
		.ease("elastic")
		.duration(500)
		.attrTween("d", arc2Tween);
		// Updating the proportions
		arcfront = d3.select('#graph'+config.seq).selectAll(".tex1").data(pie(newdata))
			.transition()
			
			.duration(1000)
			.attr("transform", function(d) { 					// changing the position (near the center)
				var centro = label.centroid(d);
				centro[0] *= 0.9; centro[1] *= 0.9;
				return "translate(" + centro + ")"; })
			.text(function(d) { return d.data.partition+'%'; })
			.call(endall, function() {avoidingOverlap(".tex1")});
			
		//Updating labels positions	
		arcfront = d3.select('#graph'+config.seq).selectAll(".tex2").data(pie(newdata))
			.transition()
			.ease("elastic")
			.duration(2000)
			.attr("transform", function(d) { 
				var centro = label.centroid(d);
				centro[0] *= 1.55; centro[1] *= 1.3;
				return "translate(" + centro + ")"; })
			.text(function(d) { return d.data.label; })
			.call(endall, function() {avoidingOverlap(".tex2")});
		
		
	};
	
	function updatePartitionsSoftly(newdata){
				
		// Updating the pie with new values
		arcback = d3.select('#graph'+config.seq).selectAll("path").data(pie(newdata))
		.transition()
	//	.ease("elastic")
		.duration(800)
		.attrTween("d", arc2Tween);
		// Updating the proportions
		arcfront = d3.select('#graph'+config.seq).selectAll(".tex1").data(pie(newdata))
			.transition()
			
			.duration(1000)
			.attr("transform", function(d) { 					// changing the position (near the center)
				var centro = label.centroid(d);
				centro[0] *= 0.9; centro[1] *= 0.9;
				return "translate(" + centro + ")"; })
			.text(function(d) { return d.data.partition+'%'; })
			.call(endall, function() {avoidingOverlap(".tex1")});
			
		//Updating labels positions	
		arcfront = d3.select('#graph'+config.seq).selectAll(".tex2").data(pie(newdata))
			.transition()
		//	.ease("elastic")
			.duration(1200)
			.attr("transform", function(d) { 
				var centro = label.centroid(d);
				centro[0] *= 1.55; centro[1] *= 1.3;
				return "translate(" + centro + ")"; })
			.text(function(d) { return d.data.label; })
			.call(endall, function() {avoidingOverlap(".tex2")});
		
		
	};
	
	function updatePartitionsSeq(newdata,idx){
				
		// Updating the pie with new values
		if (idx==0){
			arcback = d3.select('#graph'+config.seq).selectAll("path").data(pie(newdata))
			.transition()
			.ease("elastic")
			.duration(800)
			.attrTween("d", arc2Tween);
		}
		else{
			arcback = d3.select('#graph'+config.seq).selectAll("path").data(pie(newdata))
			.transition()
		//	.ease("elastic")
			.duration(800)
			.attrTween("d", arc2Tween);				
		}
		// Updating the proportions
		arcfront = d3.select('#graph'+config.seq).selectAll(".tex1").data(pie(newdata))
			.transition()
			
			.duration(1000)
			.attr("transform", function(d) { 					// changing the position (near the center)
				var centro = label.centroid(d);
				centro[0] *= 0.9; centro[1] *= 0.9;
				return "translate(" + centro + ")"; })
			.text(function(d) { return d.data.partition+'%'; })
			.call(endall, function() {avoidingOverlap(".tex1")});
			
		//Updating labels positions	
		arcfront = d3.select('#graph'+config.seq).selectAll(".tex2").data(pie(newdata))
			.transition()
		//	.ease("elastic")
			.duration(1200)
			.attr("transform", function(d) { 
				var centro = label.centroid(d);
				centro[0] *= 1.55; centro[1] *= 1.3;
				return "translate(" + centro + ")"; })
			.text(function(d) { return d.data.label; })
			.call(endall, function() {avoidingOverlap(".tex2");
										playAnim(idx+1);});
		
		
	};
	
	 var exports = {
        config: setConfig,
        render: render,
		deleteALL: deleteALL,
		updatePartitions: updatePartitions,
		updatePartitionsSoftly: updatePartitionsSoftly,
		updatePartitionsSeq : updatePartitionsSeq,
    };

    d3.rebind(exports, events, 'on');
	return exports;

};