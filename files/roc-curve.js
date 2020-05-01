var rocCurveComponent = function () {
    var config = {
        el: null,
        size: 650,
        marginLeft: 30,
		marginTop: 110,
		resizeRatio: 1,
		toolTipTop:-300,
		toolTipWidth: 600,
		toolTipLeft: 20,
		useTooltip: true,
		tooltipFormatter: function(d) {
            return d;
        }
	};

	
var events = d3.dispatch('panelEnter', 'panelLeave', 'dotEnter', 'dotLeave');

var root;

var zoom = d3.zoom()
	.scaleExtent([1/5, 10])
	.on("zoom", zoomed);
	
var render = function(data, firstrun, auc, description){
	
		config.toolTipWidth *= config.resizeRatio; 
	
		var R = [51,220,255,16,153,0,221,102,184,49,153,34,170,102,230,139,101,50,85,59];
		var G = [102,57,153,150,0,153,68,170,46,99,68,170,170,51,115,7,16,146,116,62];
		var B = [204,18,0,24,153,198,119,0,46,149,153,153,17,204,0,7,103,98,166,172];
	
		if (firstrun){	
			var svg = d3.select(config.el)
				.append('svg')
				.attrs({
					width: config.size,
					height: config.size
				})
				.attr("id","roc")
				.call(zoom);
		}
		else
			svg = d3.selectAll("svg#roc");
		
		config.firstrun = false;
			
		root = svg.append('g')
            .attrs({
                transform: 'translate(' + [config.marginLeft, config.marginTop] + ')'
            });
			
		d3.xml("https://raw.githubusercontent.com/erasmoartur/scoremaker/master/interface/plane.svg").mimeType("image/svg+xml").get(function(error, xml) {
			if (error) throw error;
			//root.node().appendChild(xml.documentElement);	
			root.node().insertBefore(xml.documentElement,root.node().childNodes[0]);
		});
		
		var gtitle = root.selectAll('.title')
			.data(['Vazio'])
			.enter().append('text')
			.classed('inf', true)
			.attr('x', 350 - config.marginLeft/2)
			.attr('y', -15)
			.attr('font-size', 25)
			.attr('text-anchor','middle')
			.style('fill','rgb(180,190,192)')
			.text('ROC Curve');
			
		
		
		// transforming the plot coordenates
		 var xROC = d3.scaleLinear()
            .domain([0,1])
            .range([60+config.marginLeft,564+config.marginLeft]);
			
		 var yROC = d3.scaleLinear()
            .domain([0,1])
            .range([390+config.marginTop,17+config.marginTop]);
			
				
		var lineFunction = d3.line()
                .x(function(d) {
					return xROC(d.x); })
                .y(function(d) {
					return yROC(d.y); })
                .curve(d3.curveLinear);
	
		var lineGraph = [];
		for (var i=0;i<data.length;i++){		
			lineGraph[i] = root.append("path")
                 .attr("d", lineFunction(data[i]))
              //  .attr("d", lineFunction([{x:0,y:0},{x:1,y:1}])
                .attr("stroke", 'rgb('+R[i]+','+G[i]+','+B[i]+')')
                .attr("stroke-width", 2)
                .attr("fill", "none")
				.attr('pointer-events', 'none')
				.attr('transform', 'translate('+ -config.marginLeft +','+ -config.marginTop +')');
		}
		
		
		var totalLength = lineGraph[data.length-1].node().getTotalLength();							//Animating the lines
			lineGraph[data.length-1].attr("stroke-dasharray", totalLength + " " + totalLength)
			.attr("stroke-dashoffset", totalLength)
			.transition()
			.duration(1000+Math.random()*1000)
			.ease(d3.easeLinear)
			.attr("stroke-dashoffset", 0);

		
		var tooltipBG = root.selectAll('bg.tool')
			.data([0])
			.enter().append('rect')
			.classed('tool', true)
			.style('fill', 'white')
			//.style('fill', 'rgb(250,240,229)')
			.attr('fill-opacity',0)
			.attr('stroke-opacity',0)
			.attr("rx", 6)
			.attr("ry", 6)
			.attr("stroke", 'black')
            .attr("stroke-width", 2)
			.attr("x", -10+config.toolTipLeft)
			.attr("y", 30+config.marginTop+config.toolTipTop)
			.attr("width", config.toolTipWidth)
			.attr('pointer-events', 'none')	
			.attr("height", 55);
	
		var statictoolTex = root.selectAll('static.tool')
			.data([''])
			.enter().append('text')
			.classed('tool', true)
			.attr("x", config.toolTipLeft)
			.attr("y", 45+config.marginTop+config.toolTipTop)
			.attr('font-size', 10)
			.attr('text-anchor','left')
			.attr('fill-opacity',0)
			.attr('stroke-opacity',0)
			.style("font-weight", 'bold')
			.style('fill','rgb(50,50,50)')
			.attr('pointer-events', 'none')
			.text('Predicting: ');
			
		var tooltipTex2 = root.append("foreignObject")
			.data([{coeffs:[0.1,0.2,0.3,0.4],attribs:['attrib1','attrib2','attrib3']}])
			.attr("width",config.toolTipWidth)
			.attr("height",50)
			.classed('tool', true)
			.attr("x", config.toolTipLeft)
			//.attr("y", 305+config.marginTop+config.toolTipTop)
			.attr('font-size', 10)
			.attr('text-anchor','left')
			.attr('opacity',0)
			.attr('stroke-opacity',0)
			.style("font-weight", 'bold')
			.style('color','rgb(50,50,50)')
			.attr('pointer-events', 'none')
			.text(function (d,i){
					var returnSTR = ''+Math.round(d.coeffs[0]*10000)/10000 + '+';
					for (var i=0;i<d.attribs.length;i++)
						returnSTR += '(' +Math.round(d.coeffs[i+1]*10000)/10000 + ')' + '(' + d.attribs[i] + ')' + '+';
					returnSTR = returnSTR.slice(0, returnSTR.length-1) + ')';				
					
					var fullSTR = "$$ P = \\frac {1} {1+ e^{"+returnSTR.replace(/[&\/\\#$~%'":?]/g,'')+"}} $$"
					return fullSTR;});
			
		MathJax.Hub.Queue(["Typeset",MathJax.Hub]);


		var tooltipTex = root.selectAll('tex.tool')
			.data([{label:''}])
			.enter().append('text')
			.classed('tool', true)
			.attr("x", 60+config.toolTipLeft)
			.attr("y", 45+config.marginTop+config.toolTipTop)
			.attr('font-size', 10)
			.attr('text-anchor','left')
			.attr('fill-opacity',0)
			.attr('stroke-opacity',0)
			.style("font-weight", 'bold')
			.style('fill','rgb(50,50,50)')
			.attr('pointer-events', 'none')
			.text(function (d,i){
				return d.label;});
			
			
			var subLines = root.selectAll('lines.tool')
				.data(['','','','','','','','','','','','','','']).enter()
				.append("text")
				.classed('tool',true)
				.attr('fill-opacity',0)
				.attr('stroke-opacity',0)
				.attr('font-size', 10)
				.attr('text-anchor','left')
				.style("font-weight", 'bold')
				.style('fill','rgb(50,50,50)')
				.attr('pointer-events', 'none')				
				.text(function (d,i){
					return d;})
				.attrs({
				  x: function(d, i) {return config.marginLeft;},
				  y: function(d, i) {return 95+config.marginTop+i*15+config.toolTipTop},
				});
			
		
		
		var filteredPoints = [];				// filter points to show information when hovered
		function filterPoints(pts){
			var filtered = [];
			filtered.push(pts[0]);
			for (var i=1;i<pts.length;i++)
			{
					var condition1 = (Math.round(pts[i-1].x*100)/100 != Math.round(pts[i].x*100)/100);
					var condition2 = (Math.round(pts[i-1].y*100)/100 != Math.round(pts[i].y*100)/100);
					
					if (condition1 || condition2)
						filtered.push(pts[i]);
			}
			return filtered;
		};
		
		for (var i=0;i<data.length;i++){
			filteredPoints.push(0);
			filteredPoints[i] = filterPoints(data[i]);
		}
		
		var points = [];
		for (var i=0;i<data.length;i++){
			points.push(0);
			points[i] = root.selectAll('circle.point')
				.data(filteredPoints[i])
				.enter().append('circle')
				//.style("stroke", 'black')
				.classed('point'+i, true)
				.style('fill','blue')
				.attr('fill-opacity', 0)
				.attr("r", 5)
				.attr("cx", function(d){
					return xROC(d.x)-config.marginLeft;})
				.attr("cy", function(d){
					return yROC(d.y)-config.marginTop;})					
				.on('mouseenter', function(d,i) {
						if(config.useTooltip) {
							var mouse = d3.mouse(config.el);
							tooltip.setText('Cut off: '+Math.round(d.threshold*1000)/1000+NL+', TP rate:'+Math.round(d.y*100)+'%, TN rate:'+Math.round(100-d.x*100)+'%').setPosition(mouse[0]-122, mouse[1]-50).show();
						}
				})
				.on('mouseout', function(d) {
					if(config.useTooltip) {		//hide tooltip
						tooltip.hide();					
					}
				});
		}
		
		var legbackground = root.selectAll('bg.leg')
			.data([0])
			.enter().append('rect')
			.classed('leg', true)
			.style('fill', 'white')
			.attr('fill-opacity',0.7)
			.attr("rx", 6)
			.attr("ry", 6)
			.attr("x", 420+config.marginLeft)
			.attr("y", 260+config.marginTop-auc.length*20)
			.attr("width", 135)
			.attr("height", 20*auc.length+10)
			.attr("stroke", 'black')
            .attr("stroke-width", 2);
			
		var legbackground2 = root.selectAll('click.leg')
			.data(auc)
			.enter().append('rect')
			.classed('leg', true)
			.style('fill', 'black')
			.attr('fill-opacity',0)
			.attr("x", 420+config.marginLeft)
			.attr("y", function(d,i){return 265+config.marginTop-(auc.length-i)*20;})
			.attr("width", 135)
			.attr("height", 20)
			.on('mouseenter', function(d,i) {
				
				var mouse = d3.mouse(config.el);
				d3.selectAll('.tool').transition(300)
									 .attr('fill-opacity',0.9)
									 .attr('opacity',0.9)
									 .attr('stroke-opacity',0.9);
									
					
				tooltipTex.data([description[i]])
					.transition()
					.text(function (d,i){
						return d.label;});
				
				tooltipTex2.data([description[i]])
				//	.transition()
					.text(function (d,i){
						var returnSTR = ''+Math.round(d.coeffs[0]*10000)/10000 + '+';
						for (var i=0;i<d.attribs.length;i++)
							returnSTR += '(' +Math.round(d.coeffs[i+1]*10000)/10000 + ')' + '(' + d.attribs[i] + ')' + '+';
						returnSTR = returnSTR.slice(0, returnSTR.length-1) + ')';				
					
						var fullSTR = "$ P = \\frac {1} {1+e^{-("+returnSTR.replace(/[&\/\\#$~%'":?]/g,'')+"}} $"
						return fullSTR;});
						
				MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
				
				var fillLines = ['','','','','','','','','','','','','',''];
				for (var j=0;j<description[i].lines.length;j++)
					fillLines[j] = description[i].lines[j];
				
				subLines.data(fillLines)
					.transition()
					.text(function (d,i){
						return d;});						
				
				tooltipBG
					.attr("height", function(d){return 55 + description[i].lines.length*15;})
					.attr("y", config.toolTipTop+(mouse[1]/config.resizeRatio));
				
				statictoolTex.attr("y", 15+config.toolTipTop+(mouse[1]/config.resizeRatio));							
				tooltipTex.attr("y", 15+config.toolTipTop+(mouse[1]/config.resizeRatio));
				tooltipTex2.attr("y", 25+config.toolTipTop+(mouse[1]/config.resizeRatio));
				subLines
					.attrs({
						y: function(d, i) {return 65+i*15+config.toolTipTop+(mouse[1]/config.resizeRatio)},
					});
				

				for (var j=0;j<lineGraph.length;j++)					
					lineGraph[j].transition(100).attr('stroke-opacity',0.3);
			
				lineGraph[i].transition(100).attr('stroke-width', 3).attr('stroke-opacity',1);
				

			})
			.on('mouseout', function(d,i) {
				/*tooltipTex.attr('fill-opacity',0)
						  .attr('stroke-opacity',0);*/
				d3.selectAll('.tool').transition(300)
									 .attr('fill-opacity',0)
									 .attr('opacity',0)
									 .attr('stroke-opacity',0);	
									 
				/*lineGraph[i]
					.transition(100)
					.attr('stroke-width', 2);*/
				for (var j=0;j<lineGraph.length;j++){						
				    lineGraph[j]
						.transition(100)
						.attr('stroke-width', 2)
						.attr('stroke-opacity',1);					
				}
				
			});
			
		var legend = root.selectAll('sub.leg')
			.data(auc)
			.enter().append('text')
			.classed('leg', true)
			.attr('x', 453+config.marginLeft)
			.attr('y', function(d,i) { return 279+i*20+config.marginTop-auc.length*20;})
			.attr('font-size', 10)
			.attr('text-anchor','left')
			.style("font-weight", 'bold')
			.style('fill','rgb(50,50,50)')
			.attr('pointer-events', 'none')
			.text(function (d,i){
					return 'ROC_'+i+' (area '+Math.round(d*1000)/1000+')';});
					
		var legendlines = root.selectAll('lines.leg')
			.data(auc)
			.enter().append('line')
			.classed('leg', true)
			.attr("x1", config.marginLeft+428)
            .attr("y1", function(d,i) { return 276+i*20+config.marginTop-auc.length*20;})
            .attr("x2", config.marginLeft+448)
            .attr("y2", function(d,i) { return 276+i*20+config.marginTop-auc.length*20;})
			.attr("stroke", function(d,i){return 'rgb('+R[i]+','+G[i]+','+B[i]+')';})
			.attr("stroke-width", 2);		
		
		var tooltipContainer = d3.select(config.el)
            .append('div')
            .attrs({
                id: 'radviz-tooltip'
            });
        var tooltip = tooltipComponent(tooltipContainer.node());
		
		root.attr("transform", "translate("+config.marginLeft+","+ config.marginTop*config.resizeRatio +") scale(" + config.resizeRatio + ")");
			
		return this;
	};
	
	var setConfig = function(_config) {
        config = utils.mergeAll(config, _config);
        return this;
    };
	
	function deleteALL(){
			var svg = d3.select("svg#roc");
			svg.selectAll("*").remove();
	};
	
	/*function zoomed() {
		root.attr('transform', 'translate(' + d3.event.transform.x + ',' + d3.event.transform.y + ') scale(' + d3.event.transform.k + ')');
	};*/
	
	function zoomed() {
	 // root.attr("transform", "translate(" + d3.event.translate + ")scale(" + config.resizeRatio*d3.event.scale + ")");
	};
	
	 var exports = {
        config: setConfig,
        render: render,
		deleteALL: deleteALL,
    };

    //d3.rebind(exports, events, 'on');
	return exports;

};