var data = [
    {label:'Apple', value:100},
    {label:'Banana', value:200},
    {label:'Cookie', value:50},
    {label:'Doughnut', value:120},
    {label:'Egg', value:80}
    ];

const xscale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)])
    .range([0, inner_width]);

const yscale = d3.scaleBand()
    .domain(data.map(d => d.label))
    .range([0, inner_height])
    .paddingInner(0.1);

var chart = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

chart.selectAll("rect").data(data).enter()
    .append("rect")
    .append("x", 0)
    .attr("y", d => yscale(d.label))
    .attr("width", d => xscale(d.value))
    .attr("height", yscale.bandwidth());