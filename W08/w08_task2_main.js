class LineChart {
    constructor(config) {
        this.config = {
            parentElement: config.parentElement,
            width: config.width || 256,
            height: config.height || 128,
            margin: config.margin || {top: 10, right: 10, bottom: 20, left: 30}
        };
        this.data = []; // データを初期化
        this.init();
    }

    init() {
        const {width, height, margin} = this.config;

        // SVG要素の初期設定
        this.svg = d3.select(this.config.parentElement)
            .attr('width', width)
            .attr('height', height);

        this.chart = this.svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        this.inner_width = width - margin.left - margin.right;
        this.inner_height = height - margin.top - margin.bottom;

        // 軸スケールの初期化
        this.xscale = d3.scaleLinear().range([0, this.inner_width]);
        this.yscale = d3.scaleLinear().range([this.inner_height, 0]);

        // 軸グループの作成
        this.xaxis_group = this.chart.append('g')
            .attr('transform', `translate(0, ${this.inner_height})`);
        this.yaxis_group = this.chart.append('g');

        // 線のグループ
        this.lineGroup = this.chart.append('path')
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr('stroke-width', 1.5);

        // ドットグループ
        this.dotGroup = this.chart.append('g');
    }

    update(data) {
        // データの設定
        this.data = data;

        // スケールのドメインを設定
        this.xscale.domain([0, d3.max(this.data, d => d.x)]);
        this.yscale.domain([0, d3.max(this.data, d => d.y)]);

        this.render();
    }

    render() {
        // 軸の更新
        const xaxis = d3.axisBottom(this.xscale).ticks(0).tickSizeOuter(0);
        const yaxis = d3.axisLeft(this.yscale).ticks(0).tickSizeOuter(0);

        this.xaxis_group.call(xaxis);
        this.yaxis_group.call(yaxis);

        // 線の生成
        const line = d3.line()
            .x(d => this.xscale(d.x))
            .y(d => this.yscale(d.y));

        this.lineGroup.attr('d', line(this.data));

        // ドットの生成
        const dots = this.dotGroup.selectAll('circle').data(this.data);

        dots.enter()
            .append('circle')
            .merge(dots)
            .attr('cx', d => this.xscale(d.x))
            .attr('cy', d => this.yscale(d.y))
            .attr('r', 5)
            .attr('fill', 'black');

        dots.exit().remove();
    }
}

// データの読み込みとグラフの描画
const data = [
    {x: 0, y: 10},
    {x: 40, y: 50},
    {x: 80, y: 20},
    {x: 120, y: 60},
    {x: 160, y: 40}
];

const lineChart = new LineChart({
    parentElement: '#drawing_region',
    width: 400,
    height: 200
});

lineChart.update(data);
