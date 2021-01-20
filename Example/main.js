// let data = [4, 8, 15, 16, 23, 42, 65, 100];
//
// let x = d3.scaleLinear()
//   .domain([0, d3.max(data)])
//   .range([0, 420]);
//
// d3.select(".chart")
//   .selectAll("div")
//   .data(data)
//   .enter().append("div")
//   .style("width", function (d) { return x(d) + "px"; })
//   .text(function (d) { return d; });


  /* Given a div with an empty SVG canvas:
  <div class="out output">
      <svg height="666" width="500"></svg>
  </div>
  */

  /* And a datafile data.csv:
        name,value
        Locke,4
        Reyes,8
        Ford,15
        Jarrah,16
        Shephard,23
        Kwon,42
  */

  let width = 450,
      height = 666;

  let x = d3.scaleLinear()
      .range([0, width]);


  let chart = d3.select("div.output svg");

  // d3.csv takes 3 arguments:
  // filename, accessor, callback

  // The accessor is a function which takes
  // each row of the data and returns a converted
  // version:
  function type(d) {
    d.value = +d.value; // coerce to number
    return d;
  }

  // This converted version is passed to the
  // third argument, the callback function
  // All processing happens inside this function

  d3.csv("data/data.csv")
    .then((data) => {
      let barHeight = height / data.length;

    x.domain([0, d3.max(data, (d) => +d.value)]);

    chart.attr("height", barHeight * data.length);

    let bar = chart.selectAll("g")
        .data(data)
      .enter().append("g")
        .attr("transform", (d, i) => `translate(0, ${i * barHeight})`);

    bar.append("rect")
        .attr("width", (d) => x(d.value))
        .attr("height", barHeight - 1);

    bar.append("text")
        .attr("x", (d) => x(d.value) - 25)
        .attr("y", barHeight / 2)
        .attr("dy", ".35em")
        .text((d) => d.value);
    })
    .catch((error) => console.log(error ));
