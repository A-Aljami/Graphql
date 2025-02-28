import React from "react";
import styled from "styled-components";
import AuditRatioDisplay from "../components/AuditRatioDisplay";

const DashboardContainer = styled.div`
  background-color: #121212;
  min-height: 100vh;
  color: white;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Logo = styled.h1`
  font-size: 24px;
  font-weight: 500;
`;

const LogoutButton = styled.button`
  background-color: white;
  color: black;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 14px;
  cursor: pointer;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 20px;
`;

const Card = styled.div`
  background-color: #1e1e1e;
  border-radius: 4px;
  padding: 16px;
`;

const CardTitle = styled.h2`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 16px;
`;

const PersonalDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DetailRow = styled.div`
  font-size: 14px;
`;

const DetailLabel = styled.span`
  font-weight: 500;
`;

const InterestingDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CohortTabs = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

const CohortTab = styled.div`
  flex: 1;
  text-align: center;
  padding: 8px;
  background-color: ${(props) => (props.active ? "#3a3a3a" : "#2a2a2a")};
  border-radius: 4px;
  margin-right: 4px;
  font-size: 14px;
  cursor: pointer;

  &:last-child {
    margin-right: 0;
  }
`;

const BarChart = styled.div`
  height: 200px;
  display: flex;
  align-items: flex-end;
  gap: 2px;
`;

const Bar = styled.div`
  flex: 1;
  background-color: #4169e1;
  height: ${(props) => props.height}%;
`;

const SkillsChart = styled.div`
  height: 250px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SkillsPolygon = styled.div`
  width: 200px;
  height: 200px;
  background-color: rgba(65, 105, 225, 0.5);
  clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
`;

const AuditsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #aaa;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #333;

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 8px;
  font-size: 14px;
`;

const StatusBadge = styled.span`
  background-color: #4caf50;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
`;

const Dashboard = () => {
  // Sample data
  const personalDetails = {
    name: "Ali Aljami",
    accountCreated: "27/08/2023, 01:08 pm",
    email: "alialjamee@gmail.com",
    username: "aaljami",
  };

  const interestingDetails = {
    mostAuditedProject: "lem-in (x5)",
    mostAuditedPerson: "musabi (x4)",
    totalAuditedProjects: 49,
  };

  // Sample data for bar chart
  const barHeights = [
    10, 20, 5, 15, 30, 25, 10, 5, 15, 20, 40, 60, 70, 50, 45, 65, 75, 60, 40,
    30, 25, 20, 15, 10, 5, 15, 10, 5, 10, 15,
  ];

  // Sample data for recent audits
  const recentAudits = [
    {
      project: "make-your-game",
      leader: "aakowai",
      date: "3/4/2025",
      status: "succeeded",
    },
    {
      project: "forum",
      leader: "qajafle",
      date: "2/1/2025",
      status: "succeeded",
    },
    {
      project: "forum",
      leader: "zmahdi",
      date: "1/29/2025",
      status: "succeeded",
    },
    {
      project: "forum",
      leader: "hhanoon",
      date: "1/27/2025",
      status: "succeeded",
    },
    {
      project: "search-bar",
      leader: "alhasan0",
      date: "1/23/2025",
      status: "succeeded",
    },
  ];

  return (
    <DashboardContainer>
      <Header>
        <Logo>GraphQL</Logo>
        <LogoutButton>logout</LogoutButton>
      </Header>

      <Grid>
        <Card>
          <CardTitle>Personal Details</CardTitle>
          <PersonalDetails>
            <DetailRow>{personalDetails.name}</DetailRow>
            <DetailRow>
              <DetailLabel>Account Created At: </DetailLabel>
              {personalDetails.accountCreated}
            </DetailRow>
            <DetailRow>
              <DetailLabel>Email: </DetailLabel>
              {personalDetails.email}
            </DetailRow>
            <DetailRow>
              <DetailLabel>Username: </DetailLabel>
              {personalDetails.username}
            </DetailRow>
          </PersonalDetails>
        </Card>

        <Card>
          <CardTitle>Interesting Details</CardTitle>
          <InterestingDetails>
            <DetailRow>
              <DetailLabel>Most Audited Project: </DetailLabel>
              {interestingDetails.mostAuditedProject}
            </DetailRow>
            <DetailRow>
              <DetailLabel>Most Audited Person: </DetailLabel>
              {interestingDetails.mostAuditedPerson}
            </DetailRow>
            <DetailRow>
              <DetailLabel>Total Audited Projects: </DetailLabel>
              {interestingDetails.totalAuditedProjects}
            </DetailRow>
          </InterestingDetails>
        </Card>

        <Card>
          <CardTitle>Audit Ratio</CardTitle>
          <AuditRatioDisplay done={1.16} received={1.11} />
        </Card>
      </Grid>

      <Grid>
        <Card style={{ gridColumn: "span 1" }}>
          <CardTitle>Level Distribution by Cohort</CardTitle>
          <CohortTabs>
            <CohortTab active>Cohort 1</CohortTab>
            <CohortTab>Cohort 2</CohortTab>
            <CohortTab>Cohort 3</CohortTab>
          </CohortTabs>
          <BarChart>
            {barHeights.map((height, index) => (
              <Bar key={index} height={height} />
            ))}
          </BarChart>
        </Card>

        <Card style={{ gridColumn: "span 1" }}>
          <CardTitle>User Skills</CardTitle>
          <SkillsChart>
            <SkillsPolygon />
          </SkillsChart>
        </Card>
      </Grid>

      <Card>
        <CardTitle>Your Recent Audits</CardTitle>
        <AuditsTable>
          <thead>
            <tr>
              <TableHeader>Project Name</TableHeader>
              <TableHeader>Leader Name</TableHeader>
              <TableHeader>Date</TableHeader>
              <TableHeader>Status</TableHeader>
            </tr>
          </thead>
          <tbody>
            {recentAudits.map((audit, index) => (
              <TableRow key={index}>
                <TableCell>{audit.project}</TableCell>
                <TableCell>{audit.leader}</TableCell>
                <TableCell>{audit.date}</TableCell>
                <TableCell>
                  <StatusBadge>{audit.status}</StatusBadge>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </AuditsTable>
      </Card>
    </DashboardContainer>
  );
};

export default Dashboard;
