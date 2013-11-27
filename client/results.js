Template.results.stalls = function() {
    return Stalls.find({}, {sort: {name: 1}} );
} 


var colors = d3.scale.category10()
Template.stallFlower.rendered = function(){

	var self = this
	if(!self.stallFlower){
		self.stallFlower = new CodeFlower("#stallFlower",
							$('#stallFlower').parent().width(),
							400);
		Deps.autorun(function(){
			var stall_no = 0
			var json = _.map(Stalls.find({}).fetch(), function(stall){
				stall_no += 1
				return {'name' : stall['name'],
						'display_name' : stall['name'],
						'color' : colors(stall_no),
						'children' : _.map(stall['votes'],
									function(vote){
										return {'name' : vote['user'] + vote['timestamp'],
												'display_name' : vote['user'],
												'color' : colors(stall_no),
												'comment' : vote['comment'],
												'size' : 1}
									})
				}
			})
			json = {'name' : 'Overall',
					'display_name' : 'Overall',
					'children' : json,
					'color': colors(0)}
			self.stallFlower.update(json);
		})
	}
}


Template.wordcloud.rendered = function(){
    var id = this.data._id
    var fill = d3.scale.category20();

    var comments = _.pluck(Stalls.findOne({'_id' : id})['votes'], 'comment')
    var tokens = tokenCounts(comments.join(' '))
    var words = _.map(_.pairs(tokens), function(t){
        return {'text' : t[0], 'size' : t[1]}
    })
    var _sum = 0
    _.each(words, function(x){_sum += x['size']})
    var words = _.map(words, function(x){
        return {'text' : x['text'], 'size' : (x['size'] * 100 / _sum)}
    })

    d3.layout.cloud().size([300, 300])
            .words(words)
            .padding(5)
            .rotate(function() { return Random.choice(_.range(-60, +60, 5)); })
            .font("Impact")
            .fontSize(function(d) { return d.size; })
            .on("end", draw)
            .start();

    function draw(words) {
        console.log(words)
        d3.select("#wordcloud_" + id).append("svg")
                .attr("width", 300)
                .attr("height", 300)
            .append("g")
                .attr("transform", "translate(150,150)")
            .selectAll("text")
                .data(words)
            .enter().append("text")
                .style("font-size", function(d) { return d.size + "px"; })
                .style("font-family", "Impact")
                .style("fill", function(d, i) { return fill(i); })
                .attr("text-anchor", "middle")
                .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function(d) { return d.text; });
    }
}

Template.barChart.rendered = function(){
    var self = this
    nv.addGraph(function() {
        self.chart = nv.models.discreteBarChart()
            .x(function(d) { return d.label })
            .y(function(d) { return d.value })
            .staggerLabels(true)
            .tooltips(false)
            .showValues(true)

        Deps.autorun(function(){
            var votes = _.map(Stalls.find({}).fetch(), function(x){
            return {'label' : x['name'],
                    'value' : x['votes'].length}
            })
            var data = [{'key' : 'HTS', 'values':votes}]
            d3.select('#barChart svg')
            .datum(data)
            .transition().duration(500)
            .call(self.chart);

            nv.utils.windowResize(self.chart.update);
        })
        return self.chart;
    });

}