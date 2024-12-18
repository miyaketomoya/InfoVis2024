class PieChart {
    constructor(config) {
        this.config = {
            parentElement: config.parentElement,
            width: config.width || 256,
            height: config.height || 256,
            innerRadius: config.innerRadius || 50, 
            margin: config.margin || {top: 0, right: 0, bottom: 0, left: 0}
        };
        this.data = [];
        this.init();
    }

    init() {
        const {width, height, margin} = this.config;

        this.radius = Math.min(width - margin.left - margin.right, height - margin.top - margin.bottom) / 2;

        this.svg = d3.select(this.config.parentElement)
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);


        this.arc = d3.arc()
            .innerRadius(this.config.innerRadius)
            .outerRadius(this.radius);

        this.pie = d3.pie().value(d => d.value);
    }

    update(data) {
        this.data = data;
        this.render();
    }

    render() {
        const arcs = this.svg.selectAll('path')
            .data(this.pie(this.data));

        arcs.enter()
            .append('path')
            .merge(arcs)
            .attr('d', this.arc)
            .attr('fill', d => d.data.color)
            .attr('stroke', 'white')
            .style('stroke-width', '2px');

        const labels = this.svg.selectAll('text')
            .data(this.pie(this.data));

        labels.enter()
            .append('text')
            .merge(labels)
            .attr('transform', d => `translate(${this.arc.centroid(d)})`)
            .attr('text-anchor', 'middle')
            .attr('fill', 'black')
            .attr('font-size', '12px')
            .text(d => d.data.label);

        arcs.exit().remove();
        labels.exit().remove();
    }
}



const donutChart = new PieChart({
    parentElement: '#drawing_region',
    width: 300,
    height: 300,
    innerRadius: 70
});

d3.csv('https://miyaketomoya.github.io/InfoVis2024/W04/w04_task2.csv').then(data => {
    const formattedData = data.map(d => ({
        label: d.label,
        value: +d.width,
        color: d.color
    }));

    donutChart.update(formattedData);
});

