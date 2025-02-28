import React, { useState } from 'react';
import styled from 'styled-components';
import AuditRatioDisplay from '../components/AuditRatioDisplay';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Header = styled.h1`
  margin-bottom: 30px;
  color: #333;
`;

const DemoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-bottom: 50px;
`;

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 400px;
  margin-top: 30px;
`;

const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const SliderLabel = styled.label`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  
  span {
    font-weight: bold;
  }
`;

const Slider = styled.input`
  width: 100%;
`;

const AuditDemo = () => {
  const [done, setDone] = useState(1.16);
  const [received, setReceived] = useState(1.11);

  const handleDoneChange = (e) => {
    setDone(parseFloat(e.target.value));
  };

  const handleReceivedChange = (e) => {
    setReceived(parseFloat(e.target.value));
  };

  return (
    <PageContainer>
      <Header>Audit Ratio Demo</Header>
      
      <DemoSection>
        <AuditRatioDisplay done={done} received={received} />
        
        <ControlsContainer>
          <SliderContainer>
            <SliderLabel>
              Done (MB): <span>{done.toFixed(2)}</span>
            </SliderLabel>
            <Slider 
              type="range" 
              min="0" 
              max="3" 
              step="0.01" 
              value={done} 
              onChange={handleDoneChange} 
            />
          </SliderContainer>
          
          <SliderContainer>
            <SliderLabel>
              Received (MB): <span>{received.toFixed(2)}</span>
            </SliderLabel>
            <Slider 
              type="range" 
              min="0" 
              max="3" 
              step="0.01" 
              value={received} 
              onChange={handleReceivedChange} 
            />
          </SliderContainer>
        </ControlsContainer>
      </DemoSection>
    </PageContainer>
  );
};

export default AuditDemo; 