class BarChart {
    constructor(config) {
        this.config = {
            parentElement: config.parentElement,
            width: config.width || 256,
            height: config.height || 128,
            margin: config.margin || {top: 10, right: 10, bottom: 20, left: 60}
        };
        this.init();
    }

    init() {
        const {width, height, margin} = this.config;

        this.svg = d3.select(this.config.parentElement)
            .attr('width', width)
            .attr('height', height);

        this.chart = this.svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        this.inner_width = width - margin.left - margin.right;
        this.inner_height = height - margin.top - margin.bottom;

        this.xscale = d3.scaleLinear().range([0, this.inner_width]);
        this.yscale = d3.scaleBand().range([0, this.inner_height]).paddingInner(0.1);

        this.xaxis_group = this.chart.append('g')
            .attr('transform', `translate(0, ${this.inner_height})`);
        this.yaxis_group = this.chart.append('g');
    }

    update(data) {
        this.data = data;

        this.xscale.domain([0, d3.max(data, d => d.width)]);
        this.yscale.domain(data.map(d => d.label));

        this.render();
    }

    render() {
        // Bind data to bars
        const bars = this.chart.selectAll('rect').data(this.data);

        bars.enter()
            .append('rect')
            .merge(bars)
            .attr('x', 0)
            .attr('y', d => this.yscale(d.label))
            .attr('width', d => this.xscale(d.width))
            .attr('height', this.yscale.bandwidth())
            .attr('fill', d => d.color);

        bars.exit().remove();

        // Update axes
        const xaxis = d3.axisBottom(this.xscale).ticks(5).tickSizeOuter(0);
        const yaxis = d3.axisLeft(this.yscale).tickSizeOuter(0);

        this.xaxis_group.call(xaxis);
        this.yaxis_group.call(yaxis);
    }
}




const barChart = new BarChart({
    parentElement: '#drawing_region',
    width: 400,
    height: 200
});

// CSVデータをロード
d3.csv('https://miyaketomoya.github.io/InfoVis2024/W04/w04_task2.csv').then(data => {
    const formattedData = data.map(d => ({
        label: d.label,
        width: +d.width,
        color: d.color
    }));

    // 初期データで更新
    barChart.update(formattedData);
});
