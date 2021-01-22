var svgH = d3.select(".chart_H"),
  margin = { top: 20, right: 20, bottom: 30, left: 40 },
  width = +svgH.attr("width") - margin.left - margin.right,
  height = +svgH.attr("height") - margin.top - margin.bottom,
  g = svgH
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var yH = d3
  .scaleBand() // x = d3.scaleBand()
  .rangeRound([0, height]) // .rangeRound([0, width])
  .paddingInner(0.05)
  .align(0.1);

var xH = d3
  .scaleLinear() // y = d3.scaleLinear()
  .rangeRound([0, width]); // .rangeRound([height, 0]);

var zH = d3.scaleOrdinal().range(["indianred", "darkgray", "Gold"]);

d3.csv(
  "top_ten_countries.csv",
  function (d, i, columns) {
    for (i = 1, t = 0; i < columns.length; ++i)
      t += d[columns[i]] = +d[columns[i]];
    d.total = t;
    return d;
  },
  function (error, data) {
    if (error) throw error;

    var keys = data.columns.slice(1);

    data.sort(function (a, b) {
      return b.total - a.total;
    });
    yH.domain(
      data.map(function (d) {
        return d.Country;
      })
    ); // x.domain...
    xH.domain([
      0,
      d3.max(data, function (d) {
        return d.total;
      }),
    ]).nice(); // y.domain...
    zH.domain(keys);

    g.append("g")
      .selectAll("g")
      .data(d3.stack().keys(keys)(data))
      .enter()
      .append("g")
      .attr("fill", function (d) {
        return zH(d.key);
      })
      .selectAll("rect")
      .data(function (d) {
        return d;
      })
      .enter()
      .append("rect")
      .attr("y", function (d) {
        return yH(d.data.Country);
      }) //.attr("x", function(d) { return x(d.data.Country); })
      .attr("x", function (d) {
        return xH(d[0]);
      }) //.attr("y", function(d) { return y(d[1]); })
      .attr("width", function (d) {
        return xH(d[1]) - xH(d[0]);
      }) //.attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .attr("height", yH.bandwidth()); //.attr("width", x.bandwidth());

    g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0,0)") //  .attr("transform", "translate(0," + height + ")")
      .call(d3.axisLeft(yH)); //   .call(d3.axisBottom(x));

    g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")") // New line
      .call(d3.axisBottom(xH).ticks(null, "s")) //  .call(d3.axisLeft(y).ticks(null, "s"))
      .append("text")
      .attr("y", 2) //     .attr("y", 2)
      .attr("x", xH(xH.ticks().pop()) + 0.5) //     .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em") //     .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("Total Medals")
      .attr("transform", "translate(" + -width + ",-10)"); // Newline

    var legend = g
      .append("g")
      .attr("font-family", "sans-serif")
      .attr("class", "legend")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
      .selectAll("g")
      .data(keys.slice().reverse())
      .enter()
      .append("g")
      //.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
      .attr("transform", function (d, i) {
        return "translate(-50," + (300 + i * 20) + ")";
      });

    legend
      .append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", zH);

    legend
      .append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function (d) {
        return d;
      });
  }
);

