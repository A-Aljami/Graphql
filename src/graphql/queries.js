import { gql } from "@apollo/client";

// Updated query to get basic user information including createdAt
export const GET_USER_INFO = gql`
  query GetUserInfo {
    user {
      id
      login
      email
      createdAt
    }
  }
`;

// Query to get user's XP transactions
export const GET_USER_XP = gql`
  query GetUserXP {
    transaction(where: { type: { _eq: "xp" } }, order_by: { createdAt: desc }) {
      id
      type
      amount
      createdAt
      path
    }
  }
`;

// Query to get user's progress data
export const GET_USER_PROGRESS = gql`
  query GetUserProgress {
    progress {
      id
      grade
      createdAt
      updatedAt
      path
      object {
        id
        name
        type
      }
    }
  }
`;

// Query to get user's results
export const GET_USER_RESULTS = gql`
  query GetUserResults {
    result {
      id
      grade
      createdAt
      updatedAt
      path
      object {
        id
        name
        type
      }
    }
  }
`;

// Query to get XP by project
export const GET_XP_BY_PROJECT = gql`
  query GetXPByProject {
    transaction(where: { type: { _eq: "xp" } }) {
      id
      amount
      path
      createdAt
    }
  }
`;

// Query to get audit ratio
export const GET_AUDIT_RATIO = gql`
  query GetAuditRatio {
    transaction(
      where: { _or: [{ type: { _eq: "up" } }, { type: { _eq: "down" } }] }
    ) {
      id
      type
      amount
      createdAt
    }
  }
`;

// Query to get user's skill data
export const GET_USER_SKILLS = gql`
  query GetUserSkills {
    transaction(where: { type: { _like: "skill_%" } }) {
      id
      type
      amount
      createdAt
      path
    }
  }
`;

// Query to get user's latest progress for the "What's up" card
export const GET_LATEST_PROGRESS = gql`
  query GetLatestProgress {
    user {
      progresses(order_by: { updatedAt: desc }, limit: 1) {
        path
        createdAt
        grade
      }
    }
  }
`;
