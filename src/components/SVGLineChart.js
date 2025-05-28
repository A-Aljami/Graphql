import React from "react";
import styled from "styled-components";

const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const SVG = styled.svg`
  width: 100%;
  height: 100%;
`;

const Label = styled.text`
  font-size: 10px;
  fill: ${(props) => (props.darkMode ? "#ddd" : "#333")};
  text-anchor: ${(props) => props.anchor || "middle"};
`;

const Tooltip = styled.div`
  position: absolute;
  background: ${(props) =>
    props.darkMode ? "rgba(30, 30, 30, 0.9)" : "rgba(255, 255, 255, 0.9)"};
  color: ${(props) => (props.darkMode ? "#fff" : "#333")};
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;
  transform: translate(-50%, -100%);
  border: 1px solid ${(props) => (props.darkMode ? "#444" : "#e0e0e0")};
  z-index: 1000;
`;

const SVGLineChart = ({
  data,
  darkMode = false,
  width = 600,
  height = 300,
  margin = { top: 20, right: 30, bottom: 30, left: 40 },
}) => {
  const [tooltip, setTooltip] = React.useState(null);
  const chartRef = React.useRef(null);

  if (!data || data.length === 0) return null;

  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Calculate scales
  const xScale = (x) => {
    const minX = Math.min(...data.map((d) => d.x));
    const maxX = Math.max(...data.map((d) => d.x));
    return margin.left + ((x - minX) * chartWidth) / (maxX - minX);
  };

  const yScale = (y) => {
    const minY = Math.min(...data.map((d) => d.y));
    const maxY = Math.max(...data.map((d) => d.y));
    const padding = (maxY - minY) * 0.1;
    return (
      height -
      margin.bottom -
      ((y - minY) * chartHeight) / (maxY - minY + padding)
    );
  };

  // Generate the line path
  const linePath = data
    .map(
      (point, i) =>
        `${i === 0 ? "M" : "L"} ${xScale(point.x)} ${yScale(point.y)}`
    )
    .join(" ");

  // Generate grid lines and labels
  const yAxisTicks = 5;
  const gridLines = [];
  const yLabels = [];

  for (let i = 0; i <= yAxisTicks; i++) {
    const y =
      Math.min(...data.map((d) => d.y)) +
      (Math.max(...data.map((d) => d.y)) - Math.min(...data.map((d) => d.y))) *
        (i / yAxisTicks);

    gridLines.push(
      <line
        key={`grid-${i}`}
        x1={margin.left}
        y1={yScale(y)}
        x2={width - margin.right}
        y2={yScale(y)}
        stroke={darkMode ? "#333" : "#e0e0e0"}
        strokeWidth="1"
        strokeDasharray="4,4"
      />
    );

    yLabels.push(
      <Label
        key={`label-${i}`}
        x={margin.left - 10}
        y={yScale(y)}
        dy=".35em"
        anchor="end"
        darkMode={darkMode}
      >
        {Math.round(y)}
      </Label>
    );
  }

  // Handle mouse interactions
  const handleMouseMove = (event) => {
    if (!chartRef.current) return;

    const rect = chartRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left - margin.left;

    // Find the closest data point
    const xPos =
      (x / chartWidth) *
        (Math.max(...data.map((d) => d.x)) -
          Math.min(...data.map((d) => d.x))) +
      Math.min(...data.map((d) => d.x));
    const closest = data.reduce((prev, curr) =>
      Math.abs(curr.x - xPos) < Math.abs(prev.x - xPos) ? curr : prev
    );

    setTooltip({
      x: xScale(closest.x),
      y: yScale(closest.y),
      data: closest,
    });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  return (
    <ChartContainer ref={chartRef}>
      <SVG
        viewBox={`0 0 ${width} ${height}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Grid lines */}
        {gridLines}

        {/* Y-axis labels */}
        {yLabels}

        {/* X-axis */}
        <line
          x1={margin.left}
          y1={height - margin.bottom}
          x2={width - margin.right}
          y2={height - margin.bottom}
          stroke={darkMode ? "#333" : "#e0e0e0"}
          strokeWidth="1"
        />

        {/* Line chart */}
        <path
          d={linePath}
          fill="none"
          stroke={darkMode ? "rgb(107, 138, 253)" : "rgb(37, 117, 252)"}
          strokeWidth="2"
        />

        {/* Data points */}
        {data.map((point, i) => (
          <circle
            key={i}
            cx={xScale(point.x)}
            cy={yScale(point.y)}
            r="4"
            fill={darkMode ? "rgb(107, 138, 253)" : "rgb(37, 117, 252)"}
            stroke={darkMode ? "#333" : "#fff"}
            strokeWidth="2"
          />
        ))}

        {/* X-axis labels */}
        {data.map((point, i) => (
          <Label
            key={i}
            x={xScale(point.x)}
            y={height - margin.bottom + 20}
            darkMode={darkMode}
          >
            {point.label}
          </Label>
        ))}
      </SVG>

      {/* Tooltip */}
      {tooltip && (
        <Tooltip
          darkMode={darkMode}
          style={{
            left: tooltip.x,
            top: tooltip.y,
          }}
        >
          {tooltip.data.label}: {tooltip.data.y}
        </Tooltip>
      )}
    </ChartContainer>
  );
};

export default SVGLineChart;
