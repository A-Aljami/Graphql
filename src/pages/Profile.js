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
import { GET_USER_INFO, GET_AUDIT_RATIO } from "../graphql/queries";

// Register Chart.js components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// Theme styling
const ProfileContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  background-color: ${(props) => (props.darkMode ? "#121212" : "#f5f7fa")};
  color: ${(props) => (props.darkMode ? "#fff" : "#333")};
  font-family: "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
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
  color: ${(props) => (props.darkMode ? "#fff" : "#333")};
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
  color: ${(props) => (props.darkMode ? "#fff" : "#333")};
  border: 1px solid ${(props) => (props.darkMode ? "#333" : "#e0e0e0")};
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  font-size: 18px;

  &:hover {
    background-color: ${(props) => (props.darkMode ? "#333" : "#f0f0f0")};
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
  background-color: ${(props) => (props.darkMode ? "#1e1e1e" : "white")};
  border: 1px solid ${(props) => (props.darkMode ? "#333" : "#e0e0e0")};
  border-radius: 4px;
  padding: 15px;
  overflow: hidden;
  box-shadow: 0 2px 4px
    ${(props) =>
      props.darkMode ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.05)"};
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px
      ${(props) =>
        props.darkMode ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0.1)"};
  }

  @media (max-width: 768px) {
    padding: 12px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const CardTitle = styled.h3`
  font-size: 14px;
  color: ${(props) => (props.darkMode ? "#6b8afd" : "#2575fc")};
  margin: 0 0 15px 0;
  font-weight: 500;
  border-bottom: 1px solid ${(props) => (props.darkMode ? "#333" : "#eee")};
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
  color: ${(props) => (props.darkMode ? "#fff" : "#333")};
  margin: 0 0 5px 0;
  font-weight: 500;
`;

const UserDetail = styled.p`
  font-size: 13px;
  color: ${(props) => (props.darkMode ? "#aaa" : "#666")};
  margin: 5px 0;
`;

const AuditMetric = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const MetricLabel = styled.span`
  font-size: 13px;
  color: ${(props) => (props.darkMode ? "#aaa" : "#666")};
`;

const MetricValue = styled.span`
  font-size: 13px;
  color: ${(props) => (props.darkMode ? "#fff" : "#333")};
  font-weight: 500;
`;

const ProgressBar = styled.div`
  height: 4px;
  width: 100%;
  background-color: ${(props) => (props.darkMode ? "#333" : "#f0f0f0")};
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
  color: ${(props) => (props.darkMode ? "#f0c14b" : "#333")};
  text-align: center;
  margin: 15px 0 5px;
`;

const RatioLabel = styled.div`
  font-size: 14px;
  color: ${(props) => (props.darkMode ? "#f0c14b" : "#ffa726")};
  text-align: center;
  text-transform: lowercase;
`;

const SkillsChartContainer = styled.div`
  width: 100%;
  position: relative;
  margin-top: 10px;
  display: ${(props) => (props.expanded ? "grid" : "block")};
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  height: ${(props) => (props.expanded ? "auto" : "300px")};
  min-height: ${(props) => (props.expanded ? "400px" : "300px")};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    min-height: ${(props) => (props.expanded ? "700px" : "280px")};
  }

  @media (max-width: 480px) {
    min-height: ${(props) => (props.expanded ? "600px" : "250px")};
  }
`;

const ChartWrapper = styled.div`
  height: 300px;
  width: 100%;
  position: relative;

  @media (max-width: 768px) {
    height: 280px;
  }

  @media (max-width: 480px) {
    height: 250px;
  }
`;

const SkillsDescription = styled.p`
  font-size: 13px;
  color: ${(props) => (props.darkMode ? "#aaa" : "#666")};
  margin: 5px 0 15px 0;
`;

const SeeMoreButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  background: transparent;
  border: none;
  color: ${(props) => (props.darkMode ? "#6b8afd" : "#2575fc")};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 5px 10px;
  margin-left: auto;
  transition: transform 0.2s;

  &:hover {
    color: ${(props) => (props.darkMode ? "#8ba5ff" : "#1a5dc8")};
    transform: translateX(3px);
  }
`;

const ChartTitle = styled.h4`
  font-size: 14px;
  color: ${(props) => (props.darkMode ? "#ddd" : "#555")};
  margin: 0 0 10px 0;
  text-align: center;
  font-weight: 500;
`;

const Profile = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = React.useState(true);
  const [expandedSkills, setExpandedSkills] = React.useState(false);

  // Fetch user info
  const {
    data: userData,
    loading: userLoading,
    error: userError,
  } = useQuery(GET_USER_INFO);

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

  const toggleExpandSkills = () => {
    setExpandedSkills(!expandedSkills);
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

  // Update chart options based on theme
  const getChartOptions = (isDarkMode) => {
    return {
      scales: {
        r: {
          angleLines: {
            display: true,
            color: isDarkMode ? "#333" : "#e0e0e0",
          },
          grid: {
            color: isDarkMode ? "#333" : "#e0e0e0",
          },
          pointLabels: {
            font: {
              size: 12,
            },
            color: isDarkMode ? "#ddd" : "#333",
          },
          suggestedMin: 0,
          suggestedMax: 100,
          ticks: {
            display: false,
            stepSize: 20,
            backdropColor: "transparent",
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: isDarkMode
            ? "rgba(30, 30, 30, 0.9)"
            : "rgba(255, 255, 255, 0.9)",
          titleColor: isDarkMode ? "#fff" : "#333",
          bodyColor: isDarkMode ? "#ddd" : "#666",
          borderColor: isDarkMode ? "#444" : "#e0e0e0",
          borderWidth: 1,
          padding: 10,
          boxPadding: 3,
          callbacks: {
            label: function (context) {
              return `${context.raw}%`;
            },
          },
        },
      },
      maintainAspectRatio: false,
    };
  };

  // Loading state
  if (userLoading || auditLoading) {
    return (
      <ProfileContainer darkMode={darkMode}>
        <Header>
          <Title darkMode={darkMode}>GraphQL</Title>
          <HeaderControls>
            <ThemeToggle darkMode={darkMode} onClick={toggleTheme}>
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
  if (userError || auditError) {
    return (
      <ProfileContainer darkMode={darkMode}>
        <Header>
          <Title darkMode={darkMode}>GraphQL</Title>
          <HeaderControls>
            <ThemeToggle darkMode={darkMode} onClick={toggleTheme}>
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
    <ProfileContainer darkMode={darkMode}>
      <Header>
        <Title darkMode={darkMode}>GraphQL</Title>
        <HeaderControls>
          <ThemeToggle darkMode={darkMode} onClick={toggleTheme}>
            {darkMode ? "☀️" : "🌙"}
          </ThemeToggle>
          <LogoutButton onClick={handleLogout}>logout</LogoutButton>
        </HeaderControls>
      </Header>

      <DashboardGrid>
        {/* Personal Details Card */}
        <PersonalDetailsCard darkMode={darkMode}>
          <CardTitle darkMode={darkMode}>Personal Details</CardTitle>
          <UserInfo>
            <UserName darkMode={darkMode}>
              {userData?.user[0]?.login || "User"}
            </UserName>
          </UserInfo>
          <UserDetail darkMode={darkMode}>
            Account Created At:{" "}
            {formatDate(userData?.user[0]?.createdAt) || "Not available"}
          </UserDetail>
          <UserDetail darkMode={darkMode}>
            Email: {userData?.user[0]?.email || "Not available"}
          </UserDetail>
          <UserDetail darkMode={darkMode}>
            Username: {userData?.user[0]?.login || "Not available"}
          </UserDetail>
        </PersonalDetailsCard>

        {/* Audit Ratio Card */}
        <AuditRatioCard darkMode={darkMode}>
          <CardTitle darkMode={darkMode}>Audit Ratio</CardTitle>
          <AuditMetric>
            <MetricLabel darkMode={darkMode}>Done</MetricLabel>
            <MetricValue darkMode={darkMode}>
              {formatBytes(auditsDone)}
            </MetricValue>
          </AuditMetric>
          <ProgressBar darkMode={darkMode}>
            <Progress percentage={donePercentage} color="#4caf50" />
          </ProgressBar>

          <AuditMetric>
            <MetricLabel darkMode={darkMode}>Received</MetricLabel>
            <MetricValue darkMode={darkMode}>
              {formatBytes(auditsReceived)}
            </MetricValue>
          </AuditMetric>
          <ProgressBar darkMode={darkMode}>
            <Progress percentage={receivedPercentage} color="#ffa726" />
          </ProgressBar>

          <RatioValue darkMode={darkMode}>{auditRatio}</RatioValue>
          <RatioLabel darkMode={darkMode}>{ratioStatus}</RatioLabel>
        </AuditRatioCard>

        {/* User Skills Card */}
        <UserSkillsCard darkMode={darkMode}>
          <CardTitle darkMode={darkMode}>Best skills</CardTitle>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <SkillsDescription darkMode={darkMode}>
              Here are your skills with the highest completion rate among all
              categories.
            </SkillsDescription>
            <SeeMoreButton darkMode={darkMode} onClick={toggleExpandSkills}>
              {expandedSkills ? "See less" : "See more"}
              {expandedSkills ? "↑" : "→"}
            </SeeMoreButton>
          </div>

          {!expandedSkills ? (
            <SkillsChartContainer expanded={false}>
              <SkillsRadarChart
                skillsFilter={[
                  "prog",
                  "go",
                  "back-end",
                  "front-end",
                  "js",
                  "html",
                ]}
                darkMode={darkMode}
                chartOptions={getChartOptions(darkMode)}
              />
            </SkillsChartContainer>
          ) : (
            <SkillsChartContainer expanded={true}>
              <div>
                <ChartTitle darkMode={darkMode}>Programming Skills</ChartTitle>
                <ChartWrapper>
                  <SkillsRadarChart
                    skillsFilter={[
                      "prog",
                      "algo",
                      "game",
                      "stats",
                      "tcp",
                      "back-end",
                      "front-end",
                    ]}
                    darkMode={darkMode}
                    chartOptions={getChartOptions(darkMode)}
                  />
                </ChartWrapper>
              </div>
              <div>
                <ChartTitle darkMode={darkMode}>Technology Skills</ChartTitle>
                <ChartWrapper>
                  <SkillsRadarChart
                    skillsFilter={[
                      "go",
                      "js",
                      "html",
                      "css",
                      "sql",
                      "docker",
                      "unix",
                    ]}
                    darkMode={darkMode}
                    chartOptions={getChartOptions(darkMode)}
                  />
                </ChartWrapper>
              </div>
            </SkillsChartContainer>
          )}
        </UserSkillsCard>
      </DashboardGrid>
    </ProfileContainer>
  );
};

export default Profile;
