export const API_BASE_URL = typeof window !== "undefined" 
  ? window.location.origin + "/api"
  : "http://localhost:3000/api";

export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    signup: "/auth/signup",
    logout: "/auth/logout",
    me: "/auth/me"
  },
  dashboard: {
    metrics: "/dashboard/metrics",
    trends: "/dashboard/trends",
    activities: "/dashboard/activities"
  },
  mood: {
    base: "/mood",
    logs: "/mood/logs",
    trends: "/mood/trends"
  },
  journal: {
    base: "/journal",
    entries: "/journal/entries",
    analyze: "/journal/analyze"
  },
  stress: {
    base: "/stress",
    readings: "/stress/readings",
    meditations: "/stress/meditations"
  },
  burnout: {
    base: "/burnout",
    metrics: "/burnout/metrics"
  },
  habit: {
    base: "/habits"
  }
};
