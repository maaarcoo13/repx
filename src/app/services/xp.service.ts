import { Injectable } from '@angular/core';

export interface Exercise {
  name: string;
  weight: number;   // lbs
  reps: number;
  sets: number;
  typeMultiplier: number; // e.g., 1.2 for deadlifts, 0.8 for pull-ups
}

export interface PhysicalProfile {
  height: number; // inches
  weight: number; // lbs
  reach: number;  // inches
}

@Injectable({
  providedIn: 'root'
})
export class XpService {

  // Convert lbs → kg, inches → cm
  private toKg(lbs: number): number {
    return lbs * 0.453592;
  }

  private toCm(inches: number): number {
    return inches * 2.54;
  }

  // Physical modifier based on height, reach, and BMI ratio
  private physicalModifier(profile: PhysicalProfile): number {
    const heightCm = this.toCm(profile.height);
    const reachCm = this.toCm(profile.reach);
    const weightKg = this.toKg(profile.weight);

    const heightRef = 175;
    const reachRef = 175;
    const bmiRef = 22;

    // Compute BMI
    const bmi = weightKg / Math.pow(heightCm / 100, 2);

    // Modifiers
    const hMod = Math.pow(heightRef / heightCm, 0.2);
    const rMod = Math.pow(reachRef / reachCm, 0.1);
    const hwMod = Math.pow(bmiRef / bmi, 0.3);

    return hMod * rMod * hwMod;
  }

  // Exercise XP (convert weight to kg for fairness)
  private exerciseXp(exercise: Exercise): number {
    const weightKg = this.toKg(exercise.weight);
    const baseXp = weightKg * exercise.reps * exercise.sets * 0.02;
    return baseXp * exercise.typeMultiplier;
  }

  // Streak multiplier with cap
  private streakMultiplier(days: number): number {
    const mult = 1 + 0.05 * (days - 1);
    return Math.min(mult, 1.5);
  }

  // Main function to compute total XP
  public calculateTotalXp(
    exercises: Exercise[],
    profile: PhysicalProfile,
    consecutiveDays: number
  ): number {
    const totalBaseXp = exercises.reduce((acc, ex) => acc + this.exerciseXp(ex), 0);
    const phys = this.physicalModifier(profile);
    const streak = this.streakMultiplier(consecutiveDays);

    const xp = totalBaseXp * phys * streak;
    return Math.round(xp);
  }
}
