import type { Employee } from "@/types";

// C07 — first three employees (the doc's worked example: Aisha, Ben, Chen).
const coreEmployees: Employee[] = [
  {
    id: "emp-aisha",
    name: "Aisha Rahman",
    team: "Product",
    weeklyCapacity: 40,
    allocatedHours: 18, // 22h free — healthy
    skills: { frontend: 5, backend: 4, data: 3, design: 4 },
    workStyle: { ambiguity: 0.7, communication: 0.6, pace: 0.8, collaboration: 0.7 },
    assignmentsLast30Days: 3,
    active: true,
  },
  {
    id: "emp-ben",
    name: "Ben Carter",
    team: "Product",
    weeklyCapacity: 40,
    allocatedHours: 34, // only 6h free — near capacity
    skills: { frontend: 5, backend: 3, data: 2, design: 5 },
    workStyle: { ambiguity: 0.5, communication: 0.8, pace: 0.6, collaboration: 0.9 },
    assignmentsLast30Days: 6, // frequently assigned — lowers distribution score
    active: true,
  },
  {
    id: "emp-chen",
    name: "Chen Wei",
    team: "Platform",
    weeklyCapacity: 40,
    allocatedHours: 8, // 32h free
    skills: { frontend: 2, backend: 5, data: 5, design: 2 }, // scarce data:5
    workStyle: { ambiguity: 0.6, communication: 0.5, pace: 0.7, collaboration: 0.5 },
    assignmentsLast30Days: 1,
    active: true,
  },
];

// C08 — three more with varied capacity (part-time, idle, overloaded).
const extendedEmployees: Employee[] = [
  {
    id: "emp-dara",
    name: "Dara Okafor",
    team: "Platform",
    weeklyCapacity: 20, // part-time
    allocatedHours: 6,
    skills: { frontend: 3, backend: 4, data: 4, design: 3 },
    workStyle: { ambiguity: 0.6, communication: 0.7, pace: 0.5, collaboration: 0.6 },
    assignmentsLast30Days: 2,
    active: true,
  },
  {
    id: "emp-elif",
    name: "Elif Demir",
    team: "Product",
    weeklyCapacity: 45, // high capacity, idle talent
    allocatedHours: 5,
    skills: { frontend: 4, backend: 5, data: 3, design: 3 },
    workStyle: { ambiguity: 0.8, communication: 0.5, pace: 0.9, collaboration: 0.4 },
    assignmentsLast30Days: 0, // underused — top distribution score
    active: true,
  },
  {
    id: "emp-farid",
    name: "Farid Hassan",
    team: "Platform",
    weeklyCapacity: 40,
    allocatedHours: 39, // 1h free — overloaded top performer
    skills: { frontend: 4, backend: 5, data: 5, design: 4 }, // also holds scarce data:5
    workStyle: { ambiguity: 0.7, communication: 0.6, pace: 0.8, collaboration: 0.7 },
    assignmentsLast30Days: 7, // most-assigned — lowest distribution score
    active: true,
  },
];

/** Six seeded employees across two teams (Product, Platform). */
export const seedEmployees: Employee[] = [...coreEmployees, ...extendedEmployees];
