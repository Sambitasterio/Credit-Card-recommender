// Pre-built "parsed SMS" profiles used by Demo Mode.
//
// In the real product, the on-device SMS parser would produce these signals from
// a user's financial messages (see PRD §4.1). Here we ship four ready-made
// profiles — one per PRD persona — so the demo flows end-to-end without needing
// access to a real phone's inbox. The `smsSamples` strings are shown in the
// MockSMSBanner to illustrate what was "read".

import type { SpendCategory } from "./cards";

export type SpendSignal = { name: SpendCategory; monthlySpend: number };

export type ParsedSMSProfile = {
  key: string;
  /** Display label, e.g. "Riya — Digital Millennial". */
  label: string;
  /** Short blurb for the demo-picker card. */
  blurb: string;
  monthlyIncome: number;
  topCategories: SpendSignal[];
  hasExistingCard: boolean;
  existingCards: string[];
  salaryDetected: boolean;
  employmentType: "salaried" | "self-employed" | "student";
  /** Fake transaction lines shown in the demo banner. */
  smsSamples: string[];
};

export const demoProfiles: Record<string, ParsedSMSProfile> = {
  digitalNative: {
    key: "digitalNative",
    label: "Riya — Digital Millennial",
    blurb: "Food delivery, OTT & weekend shopping",
    monthlyIncome: 85000,
    topCategories: [
      { name: "food", monthlySpend: 6000 },
      { name: "shopping", monthlySpend: 5000 },
      { name: "entertainment", monthlySpend: 2500 },
    ],
    hasExistingCard: false,
    existingCards: [],
    salaryDetected: true,
    employmentType: "salaried",
    smsSamples: [
      "Salary of ₹85,000 credited to a/c XX4321",
      "₹540 spent on Swiggy via UPI",
      "₹2,199 paid to Amazon",
      "₹649 charged by Netflix",
    ],
  },
  salariedProfessional: {
    key: "salariedProfessional",
    label: "Ramesh — Salaried Professional",
    blurb: "Fuel, groceries & utility bills",
    monthlyIncome: 90000,
    topCategories: [
      { name: "groceries", monthlySpend: 5000 },
      { name: "fuel", monthlySpend: 4000 },
      { name: "utilities", monthlySpend: 3500 },
    ],
    hasExistingCard: true,
    existingCards: ["SBI SimplyCLICK"],
    salaryDetected: true,
    employmentType: "salaried",
    smsSamples: [
      "Salary of ₹90,000 credited to a/c XX7788",
      "₹1,500 spent at HPCL fuel station",
      "₹2,200 paid for electricity bill",
      "₹1,800 spent at BigBasket",
    ],
  },
  firstTimer: {
    key: "firstTimer",
    label: "Ananya — First-Timer",
    blurb: "New to credit, light online spends",
    monthlyIncome: 28000,
    topCategories: [
      { name: "shopping", monthlySpend: 2500 },
      { name: "food", monthlySpend: 1500 },
      { name: "entertainment", monthlySpend: 1000 },
    ],
    hasExistingCard: false,
    existingCards: [],
    salaryDetected: true,
    employmentType: "salaried",
    smsSamples: [
      "Salary of ₹28,000 credited to a/c XX1209",
      "₹899 paid to Flipkart",
      "₹240 spent on Zomato",
    ],
  },
  businessTraveler: {
    key: "businessTraveler",
    label: "Vivek — Business Traveler",
    blurb: "Frequent flights, hotels & dining",
    monthlyIncome: 250000,
    topCategories: [
      { name: "travel", monthlySpend: 18000 },
      { name: "dining", monthlySpend: 8000 },
      { name: "utilities", monthlySpend: 4000 },
    ],
    hasExistingCard: true,
    existingCards: ["HDFC Infinia", "ICICI Sapphiro"],
    salaryDetected: true,
    employmentType: "salaried",
    smsSamples: [
      "Salary of ₹2,50,000 credited to a/c XX9001",
      "₹12,400 paid to MakeMyTrip",
      "₹3,200 spent at Taj Hotels",
      "₹2,100 spent on fine dining",
    ],
  },
};

export const demoProfileList: ParsedSMSProfile[] = Object.values(demoProfiles);
