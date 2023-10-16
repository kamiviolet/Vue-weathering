<script setup>
import * as d3 from "d3";
import { ref, onMounted, watch, computed } from "vue";
import { formatTemp } from "../../assets/utils";

const props = defineProps({
  forecast: {
    type: [Object],
    required: true
  },
  displayTemp: String
})

const chartdata = ref(computed(() => props.forecast.map(e => ({
  datetime: e.datetime,
  humidity: e.humidity,
  temp_format: parseInt(formatTemp(e.temp, props.displayTemp))
}))))

watch(chartdata, createChart)

onMounted(
  () => {
    createChart(chartdata.value)
  }
)

function createChart(dataset) {
  const width = 600;
  const height = 300;
  const paddingInline = 60;
  const paddingBlock = 20;

  d3.select("#x-axis").remove()
  d3.select("#y-axis").remove()
  d3.select("#humidity-axis").remove()
  d3.selectAll("path").remove()

  const svg = d3
    .select("svg")
    .attr("id", "tempchart")
    .attr("viewBox", `0 0 ${width + paddingInline * 2} ${height + paddingBlock * 2} `)

  const g = svg.append("g");

  const parseTime = d3.timeParse("%a, %d/%m/%Y, %H");

  const xScale = d3
    .scaleTime()
    .domain(
      d3.extent(dataset, (d) => parseTime(d.datetime))
    )
    .range([0, width])

  const yScale = d3
    .scaleLinear()
    .domain(
      [d3.min(dataset, d => parseInt(d.temp_format) - 1), d3.max(dataset, d => parseInt(d.temp_format) + 1)]
    )
    .range([height, 0]);

  const humidityYScale = d3
    .scaleLinear()
    .domain([0, 100])
    .range([height, 0])
    .nice()

  const line = d3
    .line()
    .x((d) => xScale(parseTime(d.datetime)))
    .y((d) => yScale(parseInt(d.temp_format)))

  const humidityLine = d3
    .line()
    .x((d) => xScale(parseTime(d.datetime)))
    .y((d) => humidityYScale(d.humidity))

  const XAxisGenerator = d3
    .axisBottom(xScale)

  const YAxisGenerator = d3
    .axisLeft(yScale)

  const humidityAxisGenerator = d3
    .axisRight(humidityYScale)

  g.append("g")
    .attr(":transform", `translate(${paddingInline}, ${height + paddingBlock})`)
    .attr("id", "x-axis")
    .attr("class", "x-axis")
    .call(XAxisGenerator)

  g.append("g")
    .attr(":transform", `translate(${width + paddingInline},${paddingBlock})`)
    .attr("id", "humidity-axis")
    .attr("class", "humidity-axis")
    .call(humidityAxisGenerator)
    .append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("y", 55)
    .attr("x", -90)
    .attr("text-anchor", "end")
    .text("Atmospheric humidity (%)");

  g.append("path")
    .datum(dataset)
    .attr(":transform", `translate(${paddingInline},${paddingBlock})`)
    .attr("fill", "none")
    .attr("stroke", "darkgreen")
    .attr("stroke-width", 4)
    .attr(":d", humidityLine);

  g.append("g")
    .attr(":transform", `translate(${paddingInline},${paddingBlock})`)
    .attr("id", "y-axis")
    .attr("class", "y-axis")
    .call(YAxisGenerator)
    .append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("y", -40)
    .attr("x", -120)
    .attr("text-anchor", "end")
    .text("Temperature");

  g.append("path")
    .datum(dataset)
    .attr(":transform", `translate(${paddingInline},${paddingBlock})`)
    .attr("fill", "none")
    .attr("stroke", "purple")
    .attr("stroke-width", 4)
    .attr(":d", line);
}

</script>

<template>
  <h3>Daily temperature/humidity change</h3>
  <div class="tempChart">
    <div class="legends">
      <span class="box temp_label"></span>
      <span>Temperature</span>
      <span class="box humidity_label"></span>
      <span>Humidity</span>
    </div>
    <svg></svg>
  </div>
</template>

<style>
.tempChart {
  padding: 1em;
  background: #cacacab0;
  max-width: 700px;
  margin: 0 auto;
  margin-block: 3em;
}

.legends span {
  font-weight: 700;
  color: black;
}

.box {
  width: 10px;
  height: 10px;
  display: inline-block;
  margin-inline: 1em;
}

.temp_label {
  background-color: darkgreen;
}

.humidity_label {
  background-color: purple;
}

.x-axis,
.y-axis,
.humidity-axis {
  color: black;
}</style>
