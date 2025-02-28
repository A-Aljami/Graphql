import React from "react";
import styled from "styled-components";
import { Radar } from "react-chartjs-2";
import { useQuery } from "@apollo/client";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { GET_USER_SKILLS } from "../graphql/queries";

// Register Chart.js components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 20px;
  color: #f44336;
`;

const SkillsRadarChart = () => {
  // Fetch skills data
  const {
    data: skillsData,
    loading: skillsLoading,
    error: skillsError,
  } = useQuery(GET_USER_SKILLS);

  // Process skills data from transactions
  const processSkillsData = (transactions) => {
    if (!transactions || transactions.length === 0) {
      console.log("No skills transactions available");
      return [];
    }

    console.log("Processing", transactions.length, "skill transactions");

    // Create a map to store the most recent skill transactions
    const skillsMap = {};

    // Process transactions to extract skill levels
    transactions.forEach((transaction) => {
      const type = transaction.type || "";
      const createdAt = new Date(transaction.createdAt);

      // Check if this is a skill transaction (starts with "skill_")
      if (type.startsWith("skill_")) {
        // Extract the skill name by removing the "skill_" prefix
        const skillName = type.replace("skill_", "");

        // If we don't have this skill yet, or if this transaction is more recent
        if (
          !skillsMap[skillName] ||
          new Date(skillsMap[skillName].createdAt) < createdAt
        ) {
          skillsMap[skillName] = {
            amount: transaction.amount,
            createdAt: transaction.createdAt,
          };
        }
      }
    });

    // Check if we have any skills with values
    const hasSkills = Object.keys(skillsMap).length > 0;
    if (!hasSkills) {
      console.log("No skills found in transactions");
      return [];
    }

    console.log("Found skills:", skillsMap);

    // Convert to array format for the skills component
    return Object.entries(skillsMap)
      .map(([name, data]) => ({
        name,
        // Use the amount directly as a percentage
        level: data.amount,
        createdAt: data.createdAt,
      }))
      .sort((a, b) => b.level - a.level) // Sort by level descending
      .slice(0, 8); // Take top 8 skills
  };

  // Process skills data
  const processedSkills = processSkillsData(skillsData?.transaction || []);

  // Loading state
  if (skillsLoading) {
    return <LoadingContainer>Loading skills data...</LoadingContainer>;
  }

  // Error state
  if (skillsError) {
    return <ErrorContainer>Error loading skills data</ErrorContainer>;
  }

  // If no skills data, show message
  if (!processedSkills || processedSkills.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>
        No skills data available
      </div>
    );
  }

  // Format data for Chart.js
  const data = {
    labels: processedSkills.map(
      (skill) => skill.name.charAt(0).toUpperCase() + skill.name.slice(1)
    ),
    datasets: [
      {
        label: "Skill Level",
        data: processedSkills.map((skill) => skill.level),
        fill: true,
        backgroundColor: "rgba(37, 117, 252, 0.2)",
        borderColor: "rgb(37, 117, 252)",
        pointBackgroundColor: "rgb(37, 117, 252)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(37, 117, 252)",
      },
    ],
  };

  // Chart options
  const options = {
    scales: {
      r: {
        angleLines: {
          display: true,
          color: "#e0e0e0",
        },
        grid: {
          color: "#e0e0e0",
        },
        pointLabels: {
          font: {
            size: 12,
          },
          color: "#333",
        },
        suggestedMin: 0,
        suggestedMax: 100, // Set to 100 for percentage scale
        ticks: {
          display: false, // Hide the tick labels (20, 40, 60, 80, 100)
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
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        titleColor: "#333",
        bodyColor: "#666",
        borderColor: "#e0e0e0",
        borderWidth: 1,
        padding: 10,
        boxPadding: 3,
        callbacks: {
          label: function (context) {
            return `${context.raw}%`; // Add % to tooltip values
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <ChartContainer>
      <Radar data={data} options={options} />
    </ChartContainer>
  );
};

export default SkillsRadarChart;
