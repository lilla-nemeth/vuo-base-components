import { Dispatch } from "react";
import { FlavourFlowDataset, FlavourFlowMeal } from "@vuo/types/dataTypes";

// Function that updates id and returns the meals
const createDataForRanking = (
  dataset: FlavourFlowDataset,
): FlavourFlowMeal[] => {
  const meals = Object.values(dataset).flatMap((questionSet) =>
    questionSet.flatMap((question) =>
      Object.values(question).map((choice) => ({
        ...choice,
        id: Math.random().toString(36).slice(2, 9), // Generate random ID
      })),
    ),
  );

  return meals;
};

const probability = (
  rating1: FlavourFlowMeal["elo"],
  rating2: FlavourFlowMeal["elo"],
): number => {
  return 1 / (1 + Math.pow(10, (rating1 - rating2) / 400));
};

const calculateElo = (
  winner: FlavourFlowMeal,
  loser: FlavourFlowMeal,
  probability: (
    rating1: FlavourFlowMeal["elo"],
    rating2: FlavourFlowMeal["elo"],
  ) => number,
): { newWinnerElo: number; newLoserElo: number } => {
  const K = 32;
  const winnerElo = winner.elo;
  const loserElo = loser.elo;

  const expectedScoreWinner = probability(loserElo, winnerElo);
  const expectedScoreLoser = probability(winnerElo, loserElo);

  let newWinnerElo = winnerElo + K * (1 - expectedScoreWinner);
  let newLoserElo = loserElo + K * (0 - expectedScoreLoser);

  return {
    newWinnerElo: Math.round(newWinnerElo),
    newLoserElo: Math.round(newLoserElo),
  };
};

// Update meals' ELOs
const updateElo = (
  prevMeals: FlavourFlowMeal[],
  winner: FlavourFlowMeal,
  loser: FlavourFlowMeal,
  newWinnerElo: number,
  newLoserElo: number,
) => {
  return prevMeals.map((meal) => {
    if (meal.id === winner.id) {
      return { ...meal, elo: newWinnerElo };
    } else if (meal.id === loser.id) {
      return { ...meal, elo: newLoserElo };
    } else {
      return meal;
    }
  });
};

const findPairsByQuestionset = (
  meals: FlavourFlowMeal[],
): FlavourFlowMeal[][] => {
  const groupedMeals: Record<string, FlavourFlowMeal[]> = {};

  meals.forEach((meal) => {
    const questionset = meal.category as string;
    if (!groupedMeals[questionset]) {
      groupedMeals[questionset] = [];
    }
    groupedMeals[questionset].push(meal);
  });

  const pairs: FlavourFlowMeal[][] = [];

  for (const questionset in groupedMeals) {
    const mealsInQuestionset = groupedMeals[questionset];

    while (mealsInQuestionset.length > 1) {
      const meal1 = mealsInQuestionset.splice(
        Math.floor(Math.random() * mealsInQuestionset.length),
        1,
      )[0];
      const meal2 = mealsInQuestionset.splice(
        Math.floor(Math.random() * mealsInQuestionset.length),
        1,
      )[0];

      pairs.push([meal1, meal2]);
    }
  }

  return pairs;
};

const drawNewPair = (
  stateSetter: Dispatch<React.SetStateAction<FlavourFlowMeal[]>>,
  pairs: FlavourFlowMeal[][],
) => {
  if (pairs.length > 0) {
    const randomIndex = Math.floor(Math.random() * pairs.length);
    stateSetter(pairs[randomIndex]);
  } else {
    stateSetter([]);
  }
};

export {
  calculateElo,
  probability,
  updateElo,
  createDataForRanking,
  findPairsByQuestionset,
  drawNewPair,
};
