// ============================================
// CALCULATOR LOGIC - ALL CALCULATORS IN ONE FILE
// ============================================

// ============================================
// ALUMINIUM DOOR CALCULATOR
// ============================================

export type AluminiumDoorThickness = "1.2 MM" | "1.6 MM" | "1.2 MM Hindalco";

export interface AluminiumDoorRates {
  door: number;
  chaukhat: number;
  accessories: number;
  decorFilm: number;
  brownCoated: number;
}

export const aluminiumDoorRates: Record<AluminiumDoorThickness, AluminiumDoorRates> = {
  "1.2 MM": {
    door: 130,
    chaukhat: 75,
    accessories: 160,
    decorFilm: 30,
    brownCoated: 60,
  },
  "1.6 MM": {
    door: 180,
    chaukhat: 95,
    accessories: 160,
    decorFilm: 30,
    brownCoated: 60,
  },
  "1.2 MM Hindalco": {
    door: 150,
    chaukhat: 85,
    accessories: 160,
    decorFilm: 30,
    brownCoated: 60,
  },
};

export interface AluminiumDoorInputs {
  height: number;
  width: number;
  heightSoot: number;
  widthSoot: number;
  selectedThickness: AluminiumDoorThickness;
  chaukhat: boolean;
  accessories: boolean;
  decorFilm: boolean;
  brownCoated: boolean;
}

export interface AluminiumDoorCalculations {
  heightInch: number;
  widthInch: number;
  area: number;
  chaukhatRft: number;
  doorCost: number;
  chaukhatCost: number;
  accessoriesCost: number;
  decorFilmCost: number;
  brownCoatedCost: number;
  total: number;
  addonsTotal: number;
  sizeDisplay: string;
  approvedName: string;
  heightDisplay: string;
  widthDisplay: string;
}

export function calculateAluminiumDoor(
  inputs: AluminiumDoorInputs
): AluminiumDoorCalculations {
  const { height, width, heightSoot, widthSoot, selectedThickness, chaukhat, accessories, decorFilm, brownCoated } = inputs;

  const heightInch = heightSoot > 0 ? height + heightSoot / 8 : height;
  const widthInch = widthSoot > 0 ? width + widthSoot / 8 : width;
  const area = Math.round(((heightInch * widthInch) / 144) * 100) / 100;
  const chaukhatRft = Math.max(
    Math.round(((heightInch * 2 + widthInch) / 12) * 100) / 100,
    14.5
  );

  const currentRates = aluminiumDoorRates[selectedThickness];

  const doorCost = area * currentRates.door;
  const chaukhatCost = chaukhat ? (chaukhatRft * currentRates.chaukhat) : 0;
  const accessoriesCost = accessories ? currentRates.accessories : 0;
  const decorFilmCost = decorFilm ? area * currentRates.decorFilm : 0;
  const brownCoatedCost = brownCoated ? area * currentRates.brownCoated : 0;

  const total = doorCost + chaukhatCost + accessoriesCost;
  const addonsTotal = decorFilmCost + brownCoatedCost;

  const heightDisplay = heightSoot > 0 ? `${height} ${heightSoot}/8''` : `${height}''`;
  const widthDisplay = widthSoot > 0 ? `${width} ${widthSoot}/8''` : `${width}''`;
  const sizeDisplay = `${heightDisplay}  X  ${widthDisplay}`;
  const approvedName = `${heightDisplay} X  ${widthDisplay} Aluminium Door`;

  return {
    heightInch,
    widthInch,
    area,
    chaukhatRft,
    doorCost,
    chaukhatCost,
    accessoriesCost,
    decorFilmCost,
    brownCoatedCost,
    total,
    addonsTotal,
    sizeDisplay,
    approvedName,
    heightDisplay,
    widthDisplay,
  };
}

// ============================================
// 2-TRACK WINDOW CALCULATOR
// ============================================

export type WindowThickness = "1.2 MM" | "1.6 MM" | "1.2 MM Hindalco";
export type GlassType = "clear" | "reflective";

export interface WindowBaseRates {
  clear: number;
  reflective: number;
  chaukhat: number;
}

export const window2TrackBaseRates: Record<WindowThickness, WindowBaseRates> = {
  "1.2 MM": { clear: 0, reflective: 20, chaukhat: 75 },
  "1.6 MM": { clear: 50, reflective: 50, chaukhat: 85 },
  "1.2 MM Hindalco": { clear: 40, reflective: 40, chaukhat: 85 },
};

// Area-based rate lookup table (from Excel)
export const window2TrackAreaRates = [
  { area: 6, rate: 240 },
  { area: 7.5, rate: 260 },
  { area: 9, rate: 230 },
  { area: 12, rate: 210 },
  { area: 16, rate: 190 },
  { area: 20, rate: 180 },
  { area: 24, rate: 170 },
];

export function getWindow2TrackBaseRate(area: number): number {
  const sortedRates = [...window2TrackAreaRates].sort((a, b) => b.area - a.area);
  for (const rate of sortedRates) {
    if (area >= rate.area) {
      return rate.rate;
    }
  }
  return sortedRates[sortedRates.length - 1].rate; // Return smallest rate if area is too small
}

export interface Window2TrackInputs {
  height: number;
  width: number;
  heightSoot: number;
  widthSoot: number;
  selectedThickness: WindowThickness;
  glassType: GlassType;
  chaukhat: boolean;
  decorFilm: boolean;
  fullSSNet: boolean;
  brownCoated: boolean;
}

export interface Window2TrackCalculations {
  heightInch: number;
  widthInch: number;
  area: number;
  baseRate: number;
  glassRate: number;
  glassCost: number;
  chaukhatCost: number;
  decorFilmCost: number;
  fullSSNetCost: number;
  brownCoatedCost: number;
  total: number;
  addonsTotal: number;
  sizeDisplay: string;
  approvedName: string;
  heightDisplay: string;
  widthDisplay: string;
}

export function calculateWindow2Track(
  inputs: Window2TrackInputs
): Window2TrackCalculations {
  const { height, width, heightSoot, widthSoot, selectedThickness, glassType, chaukhat, decorFilm, fullSSNet, brownCoated } = inputs;

  const heightInch = heightSoot > 0 ? height + heightSoot / 8 : height;
  const widthInch = widthSoot > 0 ? width + widthSoot / 8 : width;
  const area = Math.round(((heightInch * widthInch) / 144) * 100) / 100;

  const baseRate = getWindow2TrackBaseRate(area);
  const thicknessRates = window2TrackBaseRates[selectedThickness];
  const glassRate = glassType === "clear" 
    ? baseRate + thicknessRates.clear 
    : baseRate + thicknessRates.reflective;

  const glassCost = area * glassRate;
  const chaukhatCost = chaukhat ? ((heightInch * 2 + widthInch) / 12) * thicknessRates.chaukhat : 0;
  const decorFilmCost = decorFilm ? area * 30 : 0;
  const fullSSNetCost = fullSSNet ? area * 50 : 0;
  const brownCoatedCost = brownCoated ? area * 40 : 0;

  const total = glassCost + chaukhatCost;
  const addonsTotal = decorFilmCost + fullSSNetCost + brownCoatedCost;

  const heightDisplay = heightSoot > 0 ? `${height} ${heightSoot}/8''` : `${height}''`;
  const widthDisplay = widthSoot > 0 ? `${width} ${widthSoot}/8''` : `${width}''`;
  const sizeDisplay = `${heightDisplay}  X  ${widthDisplay}`;
  const approvedName = `${heightDisplay} X  ${widthDisplay}  2 Track Aluminium Window`;

  return {
    heightInch,
    widthInch,
    area,
    baseRate,
    glassRate,
    glassCost,
    chaukhatCost,
    decorFilmCost,
    fullSSNetCost,
    brownCoatedCost,
    total,
    addonsTotal,
    sizeDisplay,
    approvedName,
    heightDisplay,
    widthDisplay,
  };
}

// ============================================
// 3-TRACK WINDOW CALCULATOR
// ============================================

export type Window3TrackThickness = "1.2 mm" | "1.6 mm" | "1.2 mm Hindalco";

export const window3TrackBaseRates: Record<Window3TrackThickness, WindowBaseRates> = {
  "1.2 mm": { clear: 0, reflective: 20, chaukhat: 75 },
  "1.6 mm": { clear: 50, reflective: 50, chaukhat: 85 },
  "1.2 mm Hindalco": { clear: 40, reflective: 40, chaukhat: 85 },
};

// Area-based rate lookup table for 3 Track (from Excel)
export const window3TrackAreaRates = [
  { area: 6, rate: 360 },
  { area: 7.5, rate: 320 },
  { area: 9, rate: 300 },
  { area: 12, rate: 280 },
  { area: 16, rate: 250 },
  { area: 20, rate: 240 },
  { area: 24, rate: 230 },
];

export function getWindow3TrackBaseRate(area: number): number {
  const sortedRates = [...window3TrackAreaRates].sort((a, b) => b.area - a.area);
  for (const rate of sortedRates) {
    if (area >= rate.area) {
      return rate.rate;
    }
  }
  return sortedRates[sortedRates.length - 1].rate;
}

export interface Window3TrackInputs {
  height: number;
  width: number;
  heightSoot: number;
  widthSoot: number;
  selectedThickness: Window3TrackThickness;
  glassType: GlassType;
  chaukhat: boolean;
  decorFilm: boolean;
  ssNet: boolean;
  brownCoated: boolean;
}

export interface Window3TrackCalculations {
  heightInch: number;
  widthInch: number;
  area: number;
  baseRate: number;
  glassRate: number;
  glassCost: number;
  chaukhatCost: number;
  decorFilmCost: number;
  ssNetCost: number;
  brownCoatedCost: number;
  total: number;
  addonsTotal: number;
  sizeDisplay: string;
  approvedName: string;
  heightDisplay: string;
  widthDisplay: string;
}

export function calculateWindow3Track(
  inputs: Window3TrackInputs
): Window3TrackCalculations {
  const { height, width, heightSoot, widthSoot, selectedThickness, glassType, chaukhat, decorFilm, ssNet, brownCoated } = inputs;

  const heightInch = heightSoot > 0 ? height + heightSoot / 8 : height;
  const widthInch = widthSoot > 0 ? width + widthSoot / 8 : width;
  const area = Math.round(((heightInch * widthInch) / 144) * 100) / 100;

  const baseRate = getWindow3TrackBaseRate(area);
  const thicknessRates = window3TrackBaseRates[selectedThickness];
  const glassRate = glassType === "clear" 
    ? baseRate + thicknessRates.clear 
    : baseRate + thicknessRates.reflective;

  const glassCost = area * glassRate;
  const chaukhatCost = chaukhat ? ((heightInch * 2 + widthInch) / 12) * thicknessRates.chaukhat : 0;
  const decorFilmCost = decorFilm ? area * 30 : 0;
  const ssNetCost = ssNet ? area * 50 : 0;
  const brownCoatedCost = brownCoated ? area * 40 : 0;

  const total = glassCost + chaukhatCost;
  const addonsTotal = decorFilmCost + ssNetCost + brownCoatedCost;

  const heightDisplay = heightSoot > 0 ? `${height} ${heightSoot}/8''` : `${height}''`;
  const widthDisplay = widthSoot > 0 ? `${width} ${widthSoot}/8''` : `${width}''`;
  const sizeDisplay = `${heightDisplay}  X  ${widthDisplay}`;
  const approvedName = `${heightDisplay} X  ${widthDisplay}  3 Track Aluminium Window`;

  return {
    heightInch,
    widthInch,
    area,
    baseRate,
    glassRate,
    glassCost,
    chaukhatCost,
    decorFilmCost,
    ssNetCost,
    brownCoatedCost,
    total,
    addonsTotal,
    sizeDisplay,
    approvedName,
    heightDisplay,
    widthDisplay,
  };
}

