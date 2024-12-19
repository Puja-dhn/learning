import { IOptionList } from "@/features/ui/types";

const MOC_REQUIRED_LIST: IOptionList[] = [
  { id: "Yes", name: "Yes" },
  { id: "No", name: "No" },
];

const PERMIST_LIST: IOptionList[] = [
  { id: "P1", name: "Work At Height" },
  { id: "P2", name: "ESMS Work Permit" },
  { id: "P3", name: "Hot Work Permit" },
  { id: "P4", name: "Excavation Work Permit" },
  { id: "P5", name: "Confined Space" },
];

const HAZARD_RISKS = [
  { id: "1", name: "Fire Hazards" },
  { id: "2", name: "Fall material" },
  { id: "3", name: "Lack of oxygen" },
  { id: "4", name: "Noise exposure" },
  { id: "5", name: "Fall from height / into depth" },
  { id: "8", name: "Dust exposure" },
  { id: "9", name: "Exposure of corrosive" },
  { id: "10", name: "Electric shock" },
  { id: "11", name: "Electric flash / burn" },
  { id: "12", name: "Heat exposure" },
  { id: "13", name: "Crush / cut injury" },
  { id: "14", name: "Slip/ trip/ fall injury" },
  { id: "15", name: "Stored energy" },
  { id: "16", name: "Radiation exposure" },
  { id: "17", name: "Pressurized system" },
  { id: "18", name: "Others" },
];

const JOB_EQUIPMENT_PREPARATION = [
  { id: 19, name: "Risk" },
  {
    id: 20,
    name: "Work at height compliance",
  },
  {
    id: 21,
    name: "Scaffolding compliance",
  },
  {
    id: 22,
    name: "Use 24V lamp (Flame proof)",
  },
  {
    id: 23,
    name: "Use 30-mA ELCB",
  },
  {
    id: 24,
    name: "Vehicle entry procedure compliance",
  },
  {
    id: 25,
    name: "Hot work compliance",
  },
  {
    id: 26,
    name: "Confined space compliance",
  },
  {
    id: 27,
    name: "Excavation compliance",
  },
  {
    id: 28,
    name: "ESMS compliance",
  },
  {
    id: 29,
    name: "Grounding compliance",
  },
  {
    id: 30,
    name: "Barricades / cordon off",
  },
  {
    id: 31,
    name: "Emergency response / Rescue plan",
  },
  {
    id: 32,
    name: "Inform affected plant / peoples",
  },
  {
    id: 33,
    name: "Road blocks / Traffic diversion",
  },
  {
    id: 34,
    name: "Fire protection",
  },
  {
    id: 35,
    name: "Standby person required",
  },
  {
    id: 36,
    name: "Others:",
  },
];

const TOOLS_AND_EQUIPMENT_REQUIRED = [
  { id: 55, name: "Welding machine" },
  { id: 56, name: "Gas cutting set and cylinders" },
  { id: 57, name: "Portable electric tools" },
  { id: 58, name: "Hydraulic / pneumatic tools" },
  { id: 59, name: "Lifting tools and tackles" },
  { id: 60, name: "Fixed crane" },
  { id: 61, name: "Mobile Crane" },
  { id: 62, name: "Fork lift" },
  { id: 63, name: "Excavator" },
  { id: 64, name: "Heavy vehicles" },
  { id: 65, name: "Portable ladders" },
  { id: 66, name: "Scaffold" },
  { id: 67, name: "Non sparking tools" },
  { id: 68, name: "Temporary electrical supply" },
  { id: 69, name: "Other" },
];

const PPE_FIRE_PROTECTION = [
  { id: 144, name: "Safety helmet" },
  { id: 38, name: "Fire Hose Available / Hose reel" },
  { id: 39, name: "Fire blanket" },
  { id: 40, name: "Face shield" },
  { id: 41, name: "Safety glasses" },
  { id: 42, name: "Splash goggles" },
  { id: 43, name: "Safety shoes" },
  { id: 44, name: "Ear plug" },
  { id: 45, name: "Ear muff" },
  { id: 46, name: "Dust mask", checked: false },
  { id: 47, name: "Cartridge gas mask", checked: false },
  { id: 48, name: "SCBA", checked: false },
  { id: 49, name: "Supplied air line / BA", checked: false },
  { id: 50, name: "Glove", checked: false },
  { id: 51, name: "Protective overalls", checked: false },
  { id: 37, name: "Fire Extinguisher", checked: false },
];

const HRS_LIST: IOptionList[] = [
  { id: 0, name: "0" },
  { id: 1, name: "1" },
  { id: 2, name: "2" },
  { id: 3, name: "3" },
  { id: 4, name: "4" },
  { id: 5, name: "5" },
  { id: 6, name: "6" },
  { id: 7, name: "7" },
  { id: 8, name: "8" },
  { id: 9, name: "9" },
  { id: 10, name: "10" },
  { id: 11, name: "11" },
  { id: 12, name: "12" },
  { id: 13, name: "13" },
  { id: 14, name: "14" },
  { id: 15, name: "15" },
  { id: 16, name: "16" },
  { id: 17, name: "17" },
  { id: 18, name: "18" },
  { id: 19, name: "19" },
  { id: 20, name: "20" },
  { id: 21, name: "21" },
  { id: 22, name: "22" },
  { id: 23, name: "23" },
];
const MINUTES_LIST: IOptionList[] = [
  { id: "00", name: "00" },
  { id: "15", name: "15" },
  { id: "30", name: "30" },
  { id: "45", name: "45" },
];

export {
  MOC_REQUIRED_LIST,
  PERMIST_LIST,
  HAZARD_RISKS,
  JOB_EQUIPMENT_PREPARATION,
  TOOLS_AND_EQUIPMENT_REQUIRED,
  PPE_FIRE_PROTECTION,
  HRS_LIST,
  MINUTES_LIST,
};
