<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import * as d3 from "d3";

const props = defineProps({
  dailyRecord: [Object],
  displayTemp: String
})

const chartdata = ref(computed(() => {
  return props.dailyRecord.map(record => ({
    date: record.date,
    pressure_average: record.pressure_average,
    max_temp_formatted: parseInt(record.max_temp_formatted),
    min_temp_formatted: parseInt(record.min_temp_formatted)
  }))
}))

watch(chartdata, createBarChart)

onMounted(() => createBarChart(props.dailyRecord))

function createBarChart(dataset) {
  const width = 600;
  const height = 400;
  const paddingInline = 60;
  const paddingBlock = 30;
  const barWidth = 20;

  d3.select("#dailychart > *").remove()

  const g = d3.select("#dailychart")
    .attr("viewBox", `0 0 ${width + paddingInline * 2} ${height + paddingBlock * 2} `)
    .append("g");

  const parseTime = d3.timeParse("%a, %d/%m/%Y");

  const xScale = d3
    .scaleTime()
    .domain(
      [
        d3.timeDay.offset(d3.min(dataset, d => parseTime(d.date)), -1),
        d3.timeDay.offset(d3.max(dataset, d => parseTime(d.date)), +1)
      ]
    )
    .range([0, width])

    const yScale = d3
    .scaleLinear()
    .domain(
      [0, d3.max(dataset, d => parseInt(d.max_temp_formatted) + 10)]
    )
    .range([height, 0]);

    const tempScale = d3
    .scaleLinear()
    .domain(
      [0, d3.max(dataset, d => parseInt(d.max_temp_formatted) + 10)]
    )
    .range([0, height])
    .nice()

    const pressureScale = d3
    .scaleLinear()
    .domain(
      [
        d3.max(dataset, d => parseInt(d.pressure_average) + 100),
        d3.min(dataset, d => parseInt(d.pressure_average) - 100)
      ]
    )
    .range([0, height])
    .nice()

  const XAxisGenerator = d3
    .axisBottom(xScale)
    .ticks(d3.timeDay.every(1))

  const YAxisGenerator = d3
    .axisLeft(yScale)
    
  const PressureAxisGenerator = d3
    .axisLeft(pressureScale)

  const xAxis = g.append("g")
    .call(XAxisGenerator)
    .attr(":transform", `translate(${paddingInline * 1.05}, ${height + paddingBlock})`)
    .attr("id", "x-axis-daily")
    .attr("class", "x-axis-daily")

  xAxis.select('.tick:first-of-type').remove()
  xAxis.select('.tick:last-of-type').remove()

  const yAxis = g.append("g")
    .attr(":transform", `translate(${paddingInline * 1.05},${paddingBlock})`)
    .call(YAxisGenerator)
    .attr("id", "y-axis-daily")
    .attr("class", "y-axis-daily")
    .append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("y", -35)
    .attr("x", -170)
    .attr("text-anchor", "end")
    .text("Temperature");

  const minbars = g
    .append("g")
    .selectAll("minbars")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("fill", "royalblue")
    .attr("x", (d) => paddingInline + xScale(parseTime(d.date)))
    .attr("y", (d) => height + paddingBlock - tempScale(parseInt(d.min_temp_formatted)))
    .attr("width", barWidth)
    .attr("height", d => tempScale(parseInt(d.min_temp_formatted)))
    .attr(":transform", `translate(-${barWidth}, 0)`)

const maxbars = g
    .append("g")
    .selectAll("maxbars")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("fill", "darkred")
    .attr("x", (d) => paddingInline + xScale(parseTime(d.date)))
    .attr("y", (d) => height + paddingBlock - tempScale(parseInt(d.max_temp_formatted)))
    .attr("width", 20)
    .attr("height", d => tempScale(parseInt(d.max_temp_formatted)))

  const pressureAxis = g.append("g")
    .attr(":transform", `translate(${width + paddingInline * 1.05},${paddingBlock})`)
    .call(PressureAxisGenerator)
    .attr("id", "y-axis-daily")
    .attr("class", "y-axis-daily")
    .append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("y", 30)
    .attr("x", -150)
    .attr("text-anchor", "end")
    .text("Atmospheric Pressure");

  const pressureline = d3
    .line()
    .x((d) => xScale(parseTime(d.date)))
    .y((d) => pressureScale(parseInt(d.pressure_average)))

  g.append("path")
    .datum(dataset)
    .attr(":transform", `translate(${paddingInline * 1.05},${paddingBlock})`)
    .attr("fill", "none")
    .attr("stroke", "darkslategray")
    .attr("stroke-width", 4)
    .attr(":d", pressureline);

    g.selectAll("spot-pressure")
    .data(dataset)
    .enter()
    .append("circle")
    .attr(":transform", `translate(${paddingInline},${paddingBlock})`)
    .attr("cx", (d) => xScale(parseTime(d.date)))
    .attr("cy", (d) => pressureScale(parseInt(d.pressure_average)))
    .attr("r", 5)
    .style("fill", "black")
}


</script>

<template>
  <div id="daily_chart_container">
    <div class="legends">
      <span class="box min_temp_label"></span>
        <span>Min temperature</span>
        <span class="box max_temp_label"></span>
        <span>Max temperature</span>
        <span class="box pressure_label"></span>
        <span>Atmospheric Pressure</span>
        <svg id="dailychart"></svg>
    </div>
  </div>
</template>

<style scoped>
#daily_chart_container {
  width: 100%;
  max-width: 700px;
  color: black;
  background-color: #cacacab0;
  padding-block: 1em;
}

.box {
  width: 10px;
  height: 10px;
  display: inline-block;
  margin-inline: 1em;
}

.min_temp_label {
  background-color: royalblue;
}

.max_temp_label {
  background-color: darkred;
}

.pressure_label {
  background-color: darkslategray;
}

</style>