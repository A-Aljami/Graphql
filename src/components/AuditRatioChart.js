import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

const ChartContainer = styled.div`
  width: 100%;
  height: auto;
  min-height: 150px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const Tooltip = styled.div`
  position: absolute;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;
  z-index: 10;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transition: opacity 0.2s;
  transform: translate(-50%, -100%);
  margin-top: -8px;
`;

const MetricContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  padding: 0;
`;

const MetricRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
`;

const Label = styled.span`
  font-size: 13px;
  color: #555;
  font-weight: 500;
`;

const Value = styled.span`
  font-size: 13px;
  color: #333;
  font-weight: 600;
`;

const ProgressBar = styled.div`
  height: 6px;
  width: 100%;
  background-color: #f0f0f0;
  border-radius: 3px;
  margin: 0 0 10px 0;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const Progress = styled.div`
  height: 100%;
  width: ${(props) => props.percentage}%;
  background-color: ${(props) => props.color};
  border-radius: 3px;
  transition: width 0.5s ease-in-out;
`;

const RatioDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 15px 0;
  width: 100%;
`;

const RatioValue = styled.div`
  font-size: 38px;
  font-weight: bold;
  color: ${(props) => props.color || "#2575fc"};
  margin-bottom: 5px;
  line-height: 1;
`;

const RatioLabel = styled.div`
  font-size: 14px;
  color: ${(props) => props.color || "#555"};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const AuditRatioChart = ({ data }) => {
  const [auditData, setAuditData] = useState({
    done: 0,
    received: 0,
    ratio: 0,
  });

  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    content: "",
  });

  const containerRef = useRef(null);

  useEffect(() => {
    if (data && data.length > 0) {
      // Calculate audit statistics
      let auditsDone = 0;
      let auditsReceived = 0;

      data.forEach((item) => {
        if (item.type === "up") {
          auditsDone += item.amount;
        } else if (item.type === "down") {
          auditsReceived += item.amount;
        }
      });

      const ratio = auditsReceived > 0 ? auditsDone / auditsReceived : 0;

      setAuditData({
        done: auditsDone,
        received: auditsReceived,
        ratio: ratio,
      });
    }
  }, [data]);

  // Calculate percentages for progress bars (capped at 100%)
  const donePercentage = Math.min(
    (auditData.done / Math.max(auditData.done, auditData.received)) * 100,
    100
  );
  const receivedPercentage = Math.min(
    (auditData.received / Math.max(auditData.done, auditData.received)) * 100,
    100
  );

  // Determine ratio status and color
  const getRatioStatus = (ratio) => {
    if (ratio >= 1.0) {
      return {
        status: ratio > 1.2 ? "excellent" : "perfect",
        color: ratio > 1.2 ? "#26de81" : "#2575fc",
      };
    } else if (ratio >= 0.8) {
      return { status: "good", color: "#fed330" };
    } else {
      return { status: "needs improvement", color: "#fc5c65" };
    }
  };

  const { status, color } = getRatioStatus(auditData.ratio);

  // Format large numbers with appropriate units
  const formatBytes = (bytes) => {
    if (bytes >= 1000000) {
      return (bytes / 1000000).toFixed(2) + " MB";
    } else if (bytes >= 1000) {
      return (bytes / 1000).toFixed(2) + " KB";
    }
    return bytes.toFixed(2) + " B";
  };

  const handleMouseEnter = (e, content) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setTooltip({
      visible: true,
      x,
      y,
      content,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ ...tooltip, visible: false });
  };

  return (
    <ChartContainer ref={containerRef}>
      <Tooltip
        visible={tooltip.visible}
        style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
      >
        {tooltip.content}
      </Tooltip>

      <RatioDisplay>
        <RatioValue color={color}>{auditData.ratio.toFixed(1)}</RatioValue>
        <RatioLabel color={color}>{status}</RatioLabel>
      </RatioDisplay>

      <MetricContainer>
        <MetricRow>
          <Label>Audits Done</Label>
          <Value
            onMouseEnter={(e) =>
              handleMouseEnter(
                e,
                `You've done ${formatBytes(auditData.done)} of audits`
              )
            }
            onMouseLeave={handleMouseLeave}
          >
            {formatBytes(auditData.done)} ↑
          </Value>
        </MetricRow>
        <ProgressBar>
          <Progress percentage={donePercentage} color="#4CAF50" />
        </ProgressBar>

        <MetricRow>
          <Label>Audits Received</Label>
          <Value
            onMouseEnter={(e) =>
              handleMouseEnter(
                e,
                `You've received ${formatBytes(auditData.received)} of audits`
              )
            }
            onMouseLeave={handleMouseLeave}
          >
            {formatBytes(auditData.received)} ↓
          </Value>
        </MetricRow>
        <ProgressBar>
          <Progress percentage={receivedPercentage} color="#2575fc" />
        </ProgressBar>
      </MetricContainer>
    </ChartContainer>
  );
};

export default AuditRatioChart;
