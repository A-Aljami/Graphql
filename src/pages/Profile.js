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
  GET_AUDIT_RATIO,
  GET_LATEST_PROGRESS,
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
  align-items: center;
  margin-bottom: 20px;
  padding: 10px 0;
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
  background-color: ${(props) => (props.darkMode ? "#121212" : "white")};
  border: 1px solid ${(props) => (props.darkMode ? "#333" : "#e0e0e0")};
  border-radius: 8px;
  padding: 20px;
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
    padding: 15px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const CardTitle = styled.h3`
  font-size: 16px;
  color: ${(props) => (props.darkMode ? "#a78bfa" : "#2575fc")};
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
  color: ${(props) => (props.darkMode ? "#a0a0a0" : "#666")};
  margin: 5px 0;
`;

const AuditMetric = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const MetricLabel = styled.span`
  font-size: 13px;
  color: ${(props) => (props.darkMode ? "#a0a0a0" : "#666")};
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
  color: ${(props) => (props.darkMode ? "#a78bfa" : "#2575fc")};
  text-align: center;
  margin: 15px 0 5px;
`;

const RatioLabel = styled.div`
  font-size: 14px;
  color: ${(props) => (props.darkMode ? "#a78bfa" : "#2575fc")};
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
  color: ${(props) => (props.darkMode ? "#a0a0a0" : "#666")};
  margin: 5px 0 15px 0;
`;

const SeeMoreButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  background: transparent;
  border: none;
  color: ${(props) => (props.darkMode ? "#a78bfa" : "#2575fc")};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 5px 10px;
  margin-left: auto;
  transition: transform 0.2s;

  &:hover {
    color: ${(props) => (props.darkMode ? "#c4b5fd" : "#1a5dc8")};
    transform: translateX(3px);
  }
`;

const ChartTitle = styled.h4`
  font-size: 14px;
  color: ${(props) => (props.darkMode ? "#fff" : "#333")};
  margin: 0 0 10px 0;
  text-align: center;
  font-weight: 500;
`;

const WhatsUpCard = styled(Card)`
  margin-top: 20px;
  padding: 25px;
  width: 100%;
`;

const WhatsUpTitle = styled.h2`
  font-size: 32px;
  color: ${(props) => (props.darkMode ? "#a78bfa" : "#2575fc")};
  margin: 0 0 15px 0;
  font-weight: 500;
`;

const ResumeLink = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;

  svg {
    color: ${(props) => (props.darkMode ? "#a78bfa" : "#2575fc")};
    margin-right: 10px;
  }
`;

const ResumeText = styled.span`
  color: ${(props) => (props.darkMode ? "#a0a0a0" : "#666")};
  margin-right: 10px;
  font-size: 14px;
`;

const ResumeButton = styled.a`
  background: transparent;
  border: none;
  color: ${(props) => (props.darkMode ? "#a78bfa" : "#2575fc")};
  text-decoration: underline;
  font-size: 14px;
  cursor: pointer;
  font-family: monospace;

  &:hover {
    color: ${(props) => (props.darkMode ? "#c4b5fd" : "#1a5dc8")};
  }
`;

const NoProjectText = styled.span`
  color: ${(props) => (props.darkMode ? "#a0a0a0" : "#666")};
  font-style: italic;
  font-size: 14px;
`;

// Add these new styled components for the sidebar
const MainLayout = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 20px;
  background-color: ${(props) => (props.darkMode ? "#121212" : "#f5f7fa")};
  color: ${(props) => (props.darkMode ? "#fff" : "#333")};
  font-family: "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
`;

const Sidebar = styled.div`
  width: 70px;
  background-color: ${(props) => (props.darkMode ? "#1e1e1e" : "#ffffff")};
  border-left: 1px solid ${(props) => (props.darkMode ? "#333" : "#e0e0e0")};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
`;

const SidebarButton = styled.button`
  background-color: transparent;
  color: ${(props) => (props.darkMode ? "#fff" : "#333")};
  border: 1px solid ${(props) => (props.darkMode ? "#333" : "#e0e0e0")};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  font-size: 18px;
  margin-bottom: 20px;
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) => (props.darkMode ? "#333" : "#f0f0f0")};
    transform: scale(1.05);
  }
`;

const LogoutSidebarButton = styled(SidebarButton)`
  margin-top: auto;
  background-color: ${(props) => (props.darkMode ? "#2a2a2a" : "#f5f5f5")};
  color: ${(props) => (props.darkMode ? "#f44336" : "#f44336")};
  border-color: ${(props) => (props.darkMode ? "#3a3a3a" : "#e0e0e0")};

  &:hover {
    background-color: ${(props) => (props.darkMode ? "#3a3a3a" : "#fafafa")};
  }
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

  // Fetch latest progress data
  const {
    data: progressData,
    loading: progressLoading,
    error: progressError,
  } = useQuery(GET_LATEST_PROGRESS);

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

  // Format project path to show only the last part
  const formatProjectPath = (path) => {
    if (!path) return "";

    // Remove "/bahrain/bh-module" prefix
    let formattedPath = path.replace("/bahrain/bh-module/", "");

    // If path starts with "bahrain\", extract just the last part
    if (path.startsWith("bahrain\\") || path.startsWith("bahrain/")) {
      const parts = path.split(/[\\\/]/); // Split by both \ and /
      formattedPath = parts[parts.length - 1];
    }

    return formattedPath;
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

  // Get the latest project from progress data
  const latestProgress = progressData?.user[0]?.progresses[0];

  // Loading state
  if (userLoading || auditLoading || progressLoading) {
    return (
      <MainLayout>
        <ContentArea darkMode={darkMode}>
          <Header>{/* Title and logo removed */}</Header>
          <div
            style={{ color: "#a0a0a0", fontSize: "16px", marginTop: "20px" }}
          >
            Loading profile data...
          </div>
        </ContentArea>
        <Sidebar darkMode={darkMode}>
          <SidebarButton darkMode={darkMode} onClick={toggleTheme}>
            {darkMode ? "☀️" : "🌙"}
          </SidebarButton>
          <LogoutSidebarButton darkMode={darkMode} onClick={handleLogout}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 17L21 12L16 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 12H9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </LogoutSidebarButton>
        </Sidebar>
      </MainLayout>
    );
  }

  // Error state
  if (userError || auditError || progressError) {
    return (
      <MainLayout>
        <ContentArea darkMode={darkMode}>
          <Header>{/* Title and logo removed */}</Header>
          <div
            style={{ color: "#a0a0a0", fontSize: "16px", marginTop: "20px" }}
          >
            Error loading profile data. Please try again later.
          </div>
        </ContentArea>
        <Sidebar darkMode={darkMode}>
          <SidebarButton darkMode={darkMode} onClick={toggleTheme}>
            {darkMode ? "☀️" : "🌙"}
          </SidebarButton>
          <LogoutSidebarButton darkMode={darkMode} onClick={handleLogout}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 17L21 12L16 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 12H9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </LogoutSidebarButton>
        </Sidebar>
      </MainLayout>
    );
  }

  // Main content
  return (
    <MainLayout>
      <ContentArea darkMode={darkMode}>
        <Header>{/* Title and logo removed */}</Header>

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
                  <ChartTitle darkMode={darkMode}>
                    Programming Skills
                  </ChartTitle>
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

        <WhatsUpCard darkMode={darkMode}>
          <WhatsUpTitle darkMode={darkMode}>What's up</WhatsUpTitle>
          <ResumeLink darkMode={darkMode}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
            <ResumeText darkMode={darkMode}>Resume</ResumeText>
            {latestProgress ? (
              <ResumeButton darkMode={darkMode} href="#">
                {formatProjectPath(latestProgress.path)}
              </ResumeButton>
            ) : (
              <NoProjectText darkMode={darkMode}>No projects yet</NoProjectText>
            )}
          </ResumeLink>
          {latestProgress && (
            <UserDetail
              darkMode={darkMode}
              style={{ marginTop: "5px", marginLeft: "26px" }}
            >
              Last updated: {formatDate(latestProgress.createdAt)}
            </UserDetail>
          )}
        </WhatsUpCard>
      </ContentArea>
      <Sidebar darkMode={darkMode}>
        <SidebarButton darkMode={darkMode} onClick={toggleTheme}>
          {darkMode ? "☀️" : "🌙"}
        </SidebarButton>
        <LogoutSidebarButton darkMode={darkMode} onClick={handleLogout}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 17L21 12L16 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 12H9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </LogoutSidebarButton>
      </Sidebar>
    </MainLayout>
  );
};

export default Profile;
