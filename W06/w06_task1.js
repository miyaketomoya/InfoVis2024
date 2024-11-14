d3.csv("https://miyaketomoya.github.io/InfoVis2024/W04/w04_task1.csv")
    .then(data => {
        data.forEach(d => { d.x = +d.x; d.y = +d.y; d.r = +d.r; });

        var config = {
            parent: '#drawing_region',
            width: 512,
            height: 512,
            margin: {top:30, right:10, bottom:40, left:40}  // マージンを広げる
        };

        const scatter_plot = new ScatterPlot(config, data);
        scatter_plot.update();
    })
    .catch(error => {
        console.log(error);
    });

class ScatterPlot {

    constructor(config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:30, right:10, bottom:40, left:40}  // マージンを広げる
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select(self.config.parent)
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear()
            .range([0, self.inner_width]);

        self.yscale = d3.scaleLinear()
            .range([self.inner_height, 0]);  // y軸を反転

        self.xaxis = d3.axisBottom(self.xscale)
            .ticks(6);

        self.yaxis = d3.axisLeft(self.yscale)
            .ticks(6);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis_group = self.chart.append('g');
    }

    update() {
        let self = this;

        const marginFactor = 20;

        const xmin = d3.min(self.data, d => d.x) - marginFactor;
        const xmax = d3.max(self.data, d => d.x) + marginFactor;
        self.xscale.domain([xmin, xmax]);

        const ymin = d3.min(self.data, d => d.y) - marginFactor;
        const ymax = d3.max(self.data, d => d.y) + marginFactor;
        self.yscale.domain([ymin, ymax]);

        self.render();
    }

    render() {
        let self = this;
        console.log(self.data);
        self.chart.selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle")
            .attr("cx", d => self.xscale(d.x))
            .attr("cy", d => self.yscale(d.y))
            .attr("r", d => d.r)  // 半径を変更
            .attr("fill", d => d.color);  // 色を変更

        self.xaxis_group
            .call(self.xaxis);

        self.yaxis_group
            .call(self.yaxis);
    }
}