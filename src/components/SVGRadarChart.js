import React from "react";
import styled from "styled-components";

const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const SVG = styled.svg`
  width: 100%;
  height: 100%;
`;

const Label = styled.text`
  font-size: 12px;
  fill: ${(props) => (props.darkMode ? "#ddd" : "#333")};
  text-anchor: middle;
`;

const Tooltip = styled.div`
  position: absolute;
  background: ${(props) =>
    props.darkMode ? "rgba(30, 30, 30, 0.95)" : "rgba(255, 255, 255, 0.95)"};
  color: ${(props) => (props.darkMode ? "#fff" : "#333")};
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;
  transform: translate(-50%, -100%) translateY(-8px);
  border: 1px solid ${(props) => (props.darkMode ? "#444" : "#e0e0e0")};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  white-space: nowrap;

  &:after {
    content: "";
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid
      ${(props) =>
        props.darkMode
          ? "rgba(30, 30, 30, 0.95)"
          : "rgba(255, 255, 255, 0.95)"};
  }
`;

const DataPoint = styled.circle`
  cursor: pointer;
  transition: r 0.2s ease;

  &:hover {
    r: 6;
  }
`;

const SVGRadarChart = ({ data, darkMode = false, size = 300, margin = 50 }) => {
  const [tooltip, setTooltip] = React.useState(null);
  const chartRef = React.useRef(null);
  const svgRef = React.useRef(null);

  if (!data || data.length === 0) return null;

  const centerX = size / 2;
  const centerY = size / 2;
  const radius = (size - margin * 2) / 2;
  const angleStep = (2 * Math.PI) / data.length;

  // Calculate points for the radar chart
  const points = data.map((item, i) => {
    const angle = i * angleStep - Math.PI / 2; // Start from top
    const value = item.level / 100; // Normalize to 0-1
    return {
      x: centerX + radius * value * Math.cos(angle),
      y: centerY + radius * value * Math.sin(angle),
      label: {
        x: centerX + (radius + 20) * Math.cos(angle),
        y: centerY + (radius + 20) * Math.sin(angle),
      },
      data: item,
    };
  });

  // Generate grid circles
  const gridCircles = [0.2, 0.4, 0.6, 0.8, 1].map((scale) => {
    const r = radius * scale;
    return (
      <circle
        key={scale}
        cx={centerX}
        cy={centerY}
        r={r}
        fill="none"
        stroke={darkMode ? "#333" : "#e0e0e0"}
        strokeWidth="1"
      />
    );
  });

  // Generate grid lines
  const gridLines = data.map((_, i) => {
    const angle = i * angleStep - Math.PI / 2;
    return (
      <line
        key={i}
        x1={centerX}
        y1={centerY}
        x2={centerX + radius * Math.cos(angle)}
        y2={centerY + radius * Math.sin(angle)}
        stroke={darkMode ? "#333" : "#e0e0e0"}
        strokeWidth="1"
      />
    );
  });

  // Generate the radar shape
  const radarPath =
    points
      .map((point, i) => `${i === 0 ? "M" : "L"} ${point.x} ${point.y}`)
      .join(" ") + " Z";

  const handleMouseEnter = (point, event) => {
    if (!chartRef.current || !svgRef.current) return;

    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();

    // Get SVG's CTM (Current Transform Matrix)
    const ctm = svg.getScreenCTM();

    // Create a point in SVG space
    const svgPoint = svg.createSVGPoint();
    svgPoint.x = point.x;
    svgPoint.y = point.y;

    // Convert to screen coordinates
    const screenPoint = svgPoint.matrixTransform(ctm);

    // Calculate position relative to the container
    const containerRect = chartRef.current.getBoundingClientRect();
    const x = screenPoint.x - containerRect.left;
    const y = screenPoint.y - containerRect.top;

    setTooltip({
      x,
      y,
      data: point.data,
    });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  return (
    <ChartContainer ref={chartRef}>
      <SVG viewBox={`0 0 ${size} ${size}`} ref={svgRef}>
        {/* Grid */}
        {gridCircles}
        {gridLines}

        {/* Radar shape */}
        <path
          d={radarPath}
          fill={
            darkMode ? "rgba(107, 138, 253, 0.2)" : "rgba(37, 117, 252, 0.2)"
          }
          stroke={darkMode ? "rgb(107, 138, 253)" : "rgb(37, 117, 252)"}
          strokeWidth="2"
        />

        {/* Data points */}
        {points.map((point, i) => (
          <DataPoint
            key={i}
            cx={point.x}
            cy={point.y}
            r="4"
            fill={darkMode ? "rgb(107, 138, 253)" : "rgb(37, 117, 252)"}
            stroke={darkMode ? "#333" : "#fff"}
            strokeWidth="2"
            onMouseEnter={(e) => handleMouseEnter(point, e)}
            onMouseLeave={handleMouseLeave}
          />
        ))}

        {/* Labels */}
        {points.map((point, i) => (
          <g key={i}>
            <Label
              x={point.label.x}
              y={point.label.y}
              dy=".35em"
              darkMode={darkMode}
            >
              {point.data.name.charAt(0).toUpperCase() +
                point.data.name.slice(1)}
            </Label>
          </g>
        ))}
      </SVG>

      {/* Tooltip */}
      {tooltip && (
        <Tooltip
          darkMode={darkMode}
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
          }}
        >
          <strong>
            {tooltip.data.name.charAt(0).toUpperCase() +
              tooltip.data.name.slice(1)}
          </strong>
          : {tooltip.data.level}%
        </Tooltip>
      )}
    </ChartContainer>
  );
};

export default SVGRadarChart;
