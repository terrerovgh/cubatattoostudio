
export interface BookingData {
  // Step 1: Design
  placement: string;
  description: string;
  style: string; // New: Tattoo Style (e.g., Realism, Traditional)
  complexity: string; // New: Complexity level
  size: string; // New: Size of the tattoo
  estimatedPrice: string; // New: Calculated price range
  referenceImage: string | null; // Base64
  aiGeneratedDesign: string | null; // Base64
  aiSimulation: string | null; // Base64 (Body + Tattoo)
  bodyPhoto: string | null; // Base64 (Original Body Photo)

  // Step 2: Date
  date: Date | null;
  timeSlot: string | null;

  // Step 3: Personal
  fullName: string;
  email: string;
  phone: string;
}

export enum Step {
  PERSONAL = 0,
  DATETIME = 1,
  PAYMENT = 2,
  DESIGN = 3,
  SIMULATION = 4,
  SUMMARY = 5,
}

export const TIME_SLOTS = [
  "10:00 AM", "11:30 AM", "01:00 PM", "02:30 PM", "04:00 PM", "05:30 PM", "07:00 PM"
];

export const BODY_PLACEMENTS = [
  "Forearm", "Upper Arm", "Chest", "Back", "Thigh", "Calf", "Neck", "Wrist", "Ankle",
  "Shoulder", "Sternum", "Elbow", "Knee"
];