export interface Asteroid {
  id: string;
  name: string;
  diameter: number; // km
  velocity: number; // km/s
  missDistance: number; // km
  hazardous: boolean;
  closeApproachDate: string;
  magnitude: number;
  type: 'asteroid' | 'comet';
}
