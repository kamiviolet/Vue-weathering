<script setup>
import * as d3 from "d3";
import { onMounted } from "vue";
import { convertKevinToCelcius } from "../../assets/convert";

const props = defineProps({
  forecast: {
    time: String,
    temp: Number
  }
})

onMounted(() => {
  createChart()
})

function createChart() {
  const width = 600;
  const height = 300;
  const paddingInline = 40;
  const paddingBlock = 20;
  const data = props.forecast.map(d => {
    console.log(d)
    return ({...d, temp: convertKevinToCelcius(d.temp)})
  });

  const svg = d3
    .select("svg")
    .attr("id", "tempchart")
    .attr("viewBox", `0 0 ${width + paddingInline} ${height + paddingBlock*2} `);
    
  const g = svg.append("g");

  const parseTime = d3.timeParse("%d/%m/%Y, %H");

  const xScale = d3
    .scaleTime()
    .domain(
      d3.extent(data, (d) => parseTime(d.time))
    )
    .range([0, width]);

  const yScale = d3
    .scaleLinear()
    .domain(
      d3.extent(data, (d) => d.temp)
    )
    .range([height, 0]);

  const line = d3
    .line()
    .x((d) => xScale(parseTime(d.time)))
    .y((d) => yScale(d.temp));

  const XAxisGenerator = d3
    .axisBottom(xScale)

  const YAxisGenerator = d3
    .axisLeft(yScale)

  g.append("g")
    .attr("transform", `translate(${paddingInline}, ${height+paddingBlock})`)
    .attr("id", "x-axis")
    .attr("class", "x-axis")
    .call(XAxisGenerator)

  g.append("g")
    .attr("transform", `translate(${paddingInline},${paddingBlock})`)
    .call(YAxisGenerator)
    .append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("y", 10)
    .attr("x", -125)
    .attr("dy", "1em")
    .attr("text-anchor", "end")
    .text("Temperature (C°)");    

  g.append("path")
    .datum(data)
    .attr("transform", `translate(${paddingInline},${paddingBlock})`)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)
    .attr("d", line);
}

</script>

<template>
      <h3>Daily temperature change</h3>
  <div class="tempChart">
    <svg></svg>
  </div>
</template>

<style>
.tempChart {
  padding: 1em;
  background: rgba(255, 255, 255, 0.6);
  max-width: 700px;
  margin: 0 auto;
  margin-block: 3em;
}
</style>
