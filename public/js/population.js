(function() {
  var margin = { top: 15, left: 30, right: 10, bottom: 25 };

  function pick(key) {
    return function(obj) {
      return obj[key];
    };
  }
  function ident(x) {
    return x;
  }

  var renderBars = (
    svg,
    distribution,
    name,
    i,
    width = 250,
    height,
    totalPopulation,
    props
  ) => {
    var withoutSkips = props.withoutSkips;
    var showRatioGrades = props.showRatioGrades;
    var showTrendLines = props.showTrendLines;
    var totalMale = d3.sum(distribution, pick("male"));
    var totalFemale = d3.sum(distribution, pick("female"));
    var total = totalMale + totalFemale;

    var maxPercentage = 0.02;

    var data = distribution.sort((a, b) => a.age - b.age);

    var domain = data.map(pick("age"));
    var x = d3
      .scaleBand()
      .domain(domain)
      .rangeRound([0, width - margin.right])
      .align(0);
    var y = d3
      .scaleLinear()
      .domain([0, maxPercentage])
      .range([height, 0]);

    var bisect = d3.bisector((d, val) => margin.left + x(d) - val).left;

    var percPopulation = (total * 100) / totalPopulation;
    var percTxt = props.showPerc ? ` - ${percPopulation.toFixed(2)}%` : "";

    if (props.showLabel) {
      var xAxis = d3
        .axisBottom()
        .scale(x)
        .tickFormat(function(i) {
          return i;
        })
        .tickSize(-height)
        .tickValues(x.domain().filter(d => !(d % 10)));
      svg
        .append("g")
        .attr("class", "x axis")
        .attr(
          "transform",
          `translate(${margin.left}, ${margin.top + 2 * height})`
        )
        .call(xAxis);
    }

    var c = "#616161";

    var calcExtra = (pop1, pop2) =>
      withoutSkips ? 0 : d3.max([pop1 - pop2, 0]);

    var mColor = d3.rgb(props.maleColor || c);
    var mbColor = d3.rgb(mColor);
    mColor.opacity = 0.15;

    var fColor = d3.rgb(props.femaleColor || c);
    var fbColor = d3.rgb(fColor);
    fColor.opacity = 0.15;

    var brushed = function(...args) {
      /* console.log(args);
       * console.log(brushSelection(this));*/
    };

    var brushEnd = function(...args) {
      if (!d3.event.sourceEvent) return; // Only transition after input.
      if (!d3.event.selection) return; // Ignore empty selections.
      /* console.log(args, event);*/
      var d0 = d3.event.selection.map(p => d3.bisect(domain, p));
      console.log(d0);
    };

    var brush = d3
      .brushX()
      .extent([
        [margin.left, margin.top],
        [margin.left + width, margin.top + 2 * height]
      ])
      .on("brush", brushed)
      .on("end", brushEnd);

    svg
      .append("g")
      .attr("class", "male")
      .attr("transform", `translate(${margin.left}, ${margin.top + height})`)
      .selectAll(".bars")
      .data(data)
      .enter()
      .append("rect")
      .style("fill", (d, i) => (i % 5 ? mColor : mColor.darker()))
      .attr("stroke", mbColor)
      .style("stroke-width", 1)
      .style("stroke-dasharray", d => {
        var h = height - y(d.male / total);
        var w = x.bandwidth();
        return [w, h].join(",");
      })
      .attr("x", d => x(d.age))
      .attr("y", d => height - y(calcExtra(d.male, d.female) / total))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.male / total));

    if (showRatioGrades) {
      var brightRed = d3.rgb("#E94E77");
      brightRed.opacity = 0.7;
      var colorG = d3
        .scaleLinear()
        .domain([0.9, 0.93])
        .range([brightRed, brightRed.brighter(3)])
        .clamp(true);

      svg
        .append("g")
        .attr("class", "male-extra")
        .attr("transform", `translate(${margin.left}, ${margin.top + height})`)
        .selectAll(".bars")
        .data(data)
        .enter()
        .append("rect")
        .style(
          "fill",
          d =>
            d.age > 15 || d.female / d.male > 0.93
              ? "white"
              : colorG(d.female / d.male)
        )
        .attr("x", d => x(d.age))
        .attr("y", d => 0)
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(calcExtra(d.male, d.female) / total));
    }

    var softness = 0.25;

    if (showTrendLines) {
      var mPoints = l1tf(data.map(d => d.male / total), softness).points;

      svg
        .append("path")
        .attr("class", "male-curve")
        .attr("transform", `translate(${margin.left}, ${margin.top + height})`)
        .datum(mPoints)
        .attr("class", "m-curve")
        .style("stroke", "black")
        .style("stroke-width", 1)
        .style("fill", "none")
        .attr(
          "d",
          d3
            .line()
            .curve(d3.curveBasis)
            .x(d => x(d[0]))
            .y(d => height - y(d[1]))
        );
    }

    svg
      .append("g")
      .attr("class", "brush")
      .call(brush);

    svg
      .append("g")
      .attr("class", "female")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .selectAll(".bars")
      .data(data)
      .enter()
      .append("rect")
      .style("fill", (d, i) => (i % 5 ? fColor : fColor.darker()))
      .style("stroke", fbColor)
      .style("stroke-width", 1)
      .style("stroke-dasharray", d => {
        var h = height - y((d.female - calcExtra(d.female, d.male)) / total);
        var w = x.bandwidth();
        return [w, h].join(",");
      })
      .attr("x", (d, i) => x(d.age))
      .attr("y", d => y(d.female / total))
      .attr("width", x.bandwidth())
      .attr(
        "height",
        d => height - y((d.female - calcExtra(d.female, d.male)) / total)
      );

    if (showTrendLines) {
      var fPoints = l1tf(data.map(d => d.female / total), softness).points;

      svg
        .append("path")
        .attr("class", "female-curve")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .datum(fPoints)
        .attr("class", "f-curve")
        .style("stroke", "black")
        .style("stroke-width", 1)
        .style("fill", "none")
        .attr(
          "d",
          d3
            .line()
            .curve(d3.curveBasis)
            .x(d => x(d[0]))
            .y(d => y(d[1]))
        );

      var f5Points = l1tf(
        data.filter(d => d.age % 10 === 0).map(d => d.female / total),
        0.2
      ).points;
      svg
        .append("path")
        .attr("class", "female-5-curve")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .datum(f5Points)
        .style("stroke", "black")
        .style("stroke-width", 1)
        .style("fill", "none")
        .attr(
          "d",
          d3
            .line()
            .curve(d3.curveBasis)
            .x(d => x(d[0] * 10))
            .y(d => y(d[1]))
        );
    }

    var tickValues = [0.0, 0.01];
    var formatY = x => x * 100 + "%";
    if (props.showLabel) {
      var yAxis = d3
        .axisLeft()
        .scale(y)
        .tickValues(tickValues)
        .tickFormat(formatY)
        .tickSize(5);
      svg
        .append("g")
        .attr("class", "axis")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .call(yAxis);

      var yGridAxis = d3
        .axisLeft()
        .scale(y)
        .tickValues(tickValues)
        .tickSize(-width);
      svg
        .append("g")
        .attr("class", "grid axis")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .call(yGridAxis);

      var y1Axis = d3
        .axisLeft()
        .scale(y.copy().range([0, height]))
        .tickValues([tickValues[1]])
        .tickFormat(formatY)
        .tickSize(5);
      svg
        .append("g")
        .attr("class", "y1 axis")
        .attr("transform", `translate(${margin.left}, ${margin.top + height})`)
        .call(y1Axis);

      var y1GridAxis = d3
        .axisLeft()
        .scale(y.copy().range([0, height]))
        .tickValues([tickValues[1]])
        .tickSize(-width);
      svg
        .append("g")
        .attr("class", "grid axis")
        .attr("transform", `translate(${margin.left}, ${margin.top + height})`)
        .call(y1GridAxis);

      svg
        .append("text")
        .attr("transform", `translate(${margin.left - 20}, ${margin.top + 4})`)
        .attr("class", "state-name")
        .attr("fill", d3.rgb(c).brighter())
        .text(`${name}${percTxt}`);

      svg
        .append("text")
        .attr(
          "transform",
          `translate(${margin.left + width - 40}, ${margin.top + 25})`
        )
        .attr("class", "gender")
        .attr("text-anchor", "end")
        .text("Female");

      svg
        .append("text")
        .attr(
          "transform",
          `translate(${margin.left + width - 40}, ${margin.top +
            2 * height -
            25})`
        )
        .attr("class", "gender")
        .attr("text-anchor", "end")
        .text("Male");
    }
  };
});
