import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background-color: #000;
  color: white;
  border-radius: 4px;
  padding: 15px;
  width: 300px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
`;

const Header = styled.h3`
  margin: 0 0 15px 0;
  font-size: 18px;
  font-weight: 500;
`;

const MetricRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
`;

const Label = styled.span`
  font-size: 14px;
`;

const Value = styled.span`
  font-size: 14px;
`;

const ProgressBar = styled.div`
  height: 8px;
  width: 100%;
  background-color: #333;
  border-radius: 4px;
  margin: 2px 0 10px 0;
  position: relative;
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  width: ${props => props.percentage}%;
  background-color: ${props => props.color};
  border-radius: 4px;
`;

const RatioDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 15px;
`;

const RatioValue = styled.div`
  font-size: 36px;
  font-weight: bold;
`;

const RatioLabel = styled.div`
  font-size: 14px;
  color: ${props => props.color || '#fff'};
`;

const AuditRatioDisplay = ({ done = 1.16, received = 1.11 }) => {
  // Calculate ratio
  const ratio = done / received;
  const formattedRatio = ratio.toFixed(1);
  
  // Determine if ratio is perfect
  const isPerfect = ratio >= 1.0;
  
  // Calculate percentages for progress bars (capped at 100%)
  const donePercentage = Math.min((done / Math.max(done, received)) * 100, 100);
  const receivedPercentage = Math.min((received / Math.max(done, received)) * 100, 100);

  return (
    <Container>
      <Header>Audit Ratio</Header>
      
      <MetricRow>
        <Label>Done</Label>
        <Value>{done.toFixed(2)} MB ↑</Value>
      </MetricRow>
      <ProgressBar>
        <Progress percentage={donePercentage} color="#4CAF50" />
      </ProgressBar>
      
      <MetricRow>
        <Label>Received</Label>
        <Value>{received.toFixed(2)} MB ↓</Value>
      </MetricRow>
      <ProgressBar>
        <Progress percentage={receivedPercentage} color="#FF9800" />
      </ProgressBar>
      
      <RatioDisplay>
        <RatioValue>{formattedRatio}</RatioValue>
        <RatioLabel color={isPerfect ? '#FF9800' : '#999'}>
          {isPerfect ? 'perfect' : ratio < 1.0 ? 'needs improvement' : 'excellent'}
        </RatioLabel>
      </RatioDisplay>
    </Container>
  );
};

export default AuditRatioDisplay; 