import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import styled from "styled-components";
import { useAuth } from "../utils/AuthContext";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import SkillsRadarChart from "../components/SkillsRadarChart";
import {
  GET_USER_INFO,
  GET_USER_XP,
  GET_USER_PROGRESS,
  GET_AUDIT_RATIO,
} from "../graphql/queries";

// Register Chart.js components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// Light theme styling
const ProfileContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f7fa;
  color: #333;
  font-family: "Segoe UI", Roboto, "Helvetica Neue", sans-serif;

  @media (max-width: 768px) {
    padding: 15px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px 0;
`;

const Title = styled.h1`
  font-size: 20px;
  color: #333;
  margin: 0;
  font-weight: 500;
`;

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ThemeToggle = styled.button`
  background-color: transparent;
  color: #333;
  border: 1px solid #e0e0e0;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  font-size: 18px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const LogoutButton = styled.button`
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #d32f2f;
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: auto auto;
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    gap: 15px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

const Card = styled.div`
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 15px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 12px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const CardTitle = styled.h3`
  font-size: 14px;
  color: #2575fc;
  margin: 0 0 15px 0;
  font-weight: 500;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
`;

const PersonalDetailsCard = styled(Card)`
  grid-column: 1 / 2;
  grid-row: 1 / 2;

  @media (max-width: 480px) {
    grid-column: 1;
    grid-row: 1;
  }
`;

const AuditRatioCard = styled(Card)`
  grid-column: 2 / 3;
  grid-row: 1 / 2;

  @media (max-width: 480px) {
    grid-column: 1;
    grid-row: 2;
  }
`;

const UserSkillsCard = styled(Card)`
  grid-column: 1 / 3; /* Span both columns */
  grid-row: 2 / 3;

  @media (max-width: 480px) {
    grid-column: 1;
    grid-row: 3;
  }
`;

const UserInfo = styled.div`
  margin-bottom: 15px;
`;

const UserName = styled.h2`
  font-size: 18px;
  color: #333;
  margin: 0 0 5px 0;
  font-weight: 500;
`;

const UserDetail = styled.p`
  font-size: 13px;
  color: #666;
  margin: 5px 0;
`;

const AuditMetric = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const MetricLabel = styled.span`
  font-size: 13px;
  color: #666;
`;

const MetricValue = styled.span`
  font-size: 13px;
  color: #333;
  font-weight: 500;
`;

const ProgressBar = styled.div`
  height: 4px;
  width: 100%;
  background-color: #f0f0f0;
  border-radius: 2px;
  margin-bottom: 12px;
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  width: ${(props) => props.percentage}%;
  background-color: ${(props) => props.color};
`;

const RatioValue = styled.div`
  font-size: 36px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin: 15px 0 5px;
`;

const RatioLabel = styled.div`
  font-size: 14px;
  color: #ffa726;
  text-align: center;
  text-transform: lowercase;
`;

const SkillsChartContainer = styled.div`
  width: 100%;
  height: 300px;
  position: relative;
  margin-top: 10px;

  @media (max-width: 768px) {
    height: 280px;
  }

  @media (max-width: 480px) {
    height: 250px;
  }
`;

const SkillsDescription = styled.p`
  font-size: 13px;
  color: #666;
  margin: 5px 0 15px 0;
`;

const Profile = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = React.useState(false);

  // Fetch user info
  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useQuery(GET_USER_INFO);

  // Fetch XP data
  const {
    data: xpData,
    loading: xpLoading,
    error: xpError,
  } = useQuery(GET_USER_XP);

  // Fetch progress data
  const {
    data: progressData,
    loading: progressLoading,
    error: progressError,
  } = useQuery(GET_USER_PROGRESS);

  // Fetch audit ratio data
  const {
    data: auditData,
    loading: auditLoading,
    error: auditError,
  } = useQuery(GET_AUDIT_RATIO);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Calculate audit metrics
  const auditsDone =
    auditData?.transaction
      .filter((t) => t.type === "up")
      .reduce((sum, t) => sum + t.amount, 0) || 0;

  const auditsReceived =
    auditData?.transaction
      .filter((t) => t.type === "down")
      .reduce((sum, t) => sum + t.amount, 0) || 0;

  const auditRatio =
    auditsReceived > 0 ? (auditsDone / auditsReceived).toFixed(1) : "0.0";

  // Calculate the max value for percentage calculations
  const maxAuditValue = Math.max(auditsDone, auditsReceived);

  // Calculate percentages for progress bars
  const donePercentage =
    maxAuditValue > 0 ? (auditsDone / maxAuditValue) * 100 : 0;
  const receivedPercentage =
    maxAuditValue > 0 ? (auditsReceived / maxAuditValue) * 100 : 0;

  // Format bytes for display
  const formatBytes = (bytes) => {
    if (bytes >= 1000000) {
      return (bytes / 1000000).toFixed(2) + " MB";
    } else if (bytes >= 1000) {
      return (bytes / 1000).toFixed(2) + " KB";
    }
    return bytes.toFixed(2) + " B";
  };

  // Determine ratio status
  const getRatioStatus = (ratio) => {
    const numRatio = parseFloat(ratio);
    if (numRatio >= 1.0) {
      return numRatio > 1.2 ? "excellent" : "perfect";
    } else if (numRatio >= 0.8) {
      return "good";
    } else {
      return "needs improvement";
    }
  };

  const ratioStatus = getRatioStatus(auditRatio);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(",", "");
  };

  // Loading state
  if (userLoading || xpLoading || progressLoading || auditLoading) {
    return (
      <ProfileContainer>
        <Header>
          <Title>GraphQL</Title>
          <HeaderControls>
            <ThemeToggle onClick={toggleTheme}>
              {darkMode ? "☀️" : "🌙"}
            </ThemeToggle>
            <LogoutButton onClick={handleLogout}>logout</LogoutButton>
          </HeaderControls>
        </Header>
        <div>Loading profile data...</div>
      </ProfileContainer>
    );
  }

  // Error state
  if (userError || xpError || progressError || auditError) {
    return (
      <ProfileContainer>
        <Header>
          <Title>GraphQL</Title>
          <HeaderControls>
            <ThemeToggle onClick={toggleTheme}>
              {darkMode ? "☀️" : "🌙"}
            </ThemeToggle>
            <LogoutButton onClick={handleLogout}>logout</LogoutButton>
          </HeaderControls>
        </Header>
        <div>Error loading profile data. Please try again later.</div>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <Header>
        <Title>GraphQL</Title>
        <HeaderControls>
          <ThemeToggle onClick={toggleTheme}>
            {darkMode ? "☀️" : "🌙"}
          </ThemeToggle>
          <LogoutButton onClick={handleLogout}>logout</LogoutButton>
        </HeaderControls>
      </Header>

      <DashboardGrid>
        {/* Personal Details Card - Using real data from query */}
        <PersonalDetailsCard>
          <CardTitle>Personal Details</CardTitle>
          <UserInfo>
            <UserName>{userData?.user[0]?.login || "User"}</UserName>
          </UserInfo>
          <UserDetail>
            Account Created At:{" "}
            {formatDate(userData?.user[0]?.createdAt) || "Not available"}
          </UserDetail>
          <UserDetail>
            Email: {userData?.user[0]?.email || "Not available"}
          </UserDetail>
          <UserDetail>
            Username: {userData?.user[0]?.login || "Not available"}
          </UserDetail>
        </PersonalDetailsCard>

        {/* Audit Ratio Card */}
        <AuditRatioCard>
          <CardTitle>Audit Ratio</CardTitle>
          <AuditMetric>
            <MetricLabel>Done</MetricLabel>
            <MetricValue>{formatBytes(auditsDone)}</MetricValue>
          </AuditMetric>
          <ProgressBar>
            <Progress percentage={donePercentage} color="#4caf50" />
          </ProgressBar>

          <AuditMetric>
            <MetricLabel>Received</MetricLabel>
            <MetricValue>{formatBytes(auditsReceived)}</MetricValue>
          </AuditMetric>
          <ProgressBar>
            <Progress percentage={receivedPercentage} color="#ffa726" />
          </ProgressBar>

          <RatioValue>{auditRatio}</RatioValue>
          <RatioLabel>{ratioStatus}</RatioLabel>
        </AuditRatioCard>

        {/* User Skills Card - Using the self-contained SkillsRadarChart component */}
        <UserSkillsCard>
          <CardTitle>Best skills</CardTitle>
          <SkillsDescription>
            Here are your skills with the highest completion rate among all
            categories.
          </SkillsDescription>
          <SkillsChartContainer>
            <SkillsRadarChart />
          </SkillsChartContainer>
        </UserSkillsCard>
      </DashboardGrid>
    </ProfileContainer>
  );
};

export default Profile;
