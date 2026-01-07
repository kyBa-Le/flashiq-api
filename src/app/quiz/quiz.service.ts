import { Card } from '@prisma/client';
import { getCardBySetId } from '../cards/card.service';
import { Quiz } from './quiz.type';
import { random, shuffle } from 'lodash';
import { BaseException } from '../../errors/BaseException';
import { SALT } from '../../constants/quiz';
import CryptoJS from 'crypto-js';

export const getMultipleChoiceQuestions = async (setId: string) => {
  const cards: Card[] = await getCardBySetId(setId);
  if (cards.length < 4) {
    throw new BaseException(
      400,
      'The number of the cards are not enough to learn this mode'
    );
  }
  const quizzes: Quiz[] = [];
  cards.forEach((card, index) => {
    const correctAnswer = card.definition;
    const choices = generateChoicesFromCards(cards, index);
    const quiz = new Quiz(
      card.id,
      card.term,
      card.example ?? null,
      card.image_url ?? null,
      choices,
      hashValue(correctAnswer)
    );
    quizzes.push(quiz);
  });
  return shuffle(quizzes);
};

export const getTrueFalseQuestions = async (setId: string) => {
  const cards: Card[] = await getCardBySetId(setId);
  const quizzes: Quiz[] = [];
  if (cards.length < 2) {
    throw new BaseException(
      400,
      'The number of the cards are not enough to learn this mode'
    );
  }
  cards.forEach((card, index) => {
    let choices = null;
    if (random(0, 1) == 1) {
      choices = [card.definition];
    } else {
      choices = getRandomChoices(cards, 1, index);
    }
    const quiz = new Quiz(
      card.id,
      card.term,
      card.example ?? null,
      card.image_url ?? null,
      choices,
      hashValue(card.definition)
    );
    quizzes.push(quiz);
  });
  return shuffle(quizzes);
};

export const getFillBlankQuestions = async (setId: string) => {
  let cards: Card[] = await getCardBySetId(setId);
  const quizzes: Quiz[] = [];
  cards.forEach((card) => {
    const quiz = new Quiz(
      card.id,
      card.term,
      card.example ?? null,
      card.image_url ?? null,
      null,
      hashValue(card.definition.trim())
    );
    quizzes.push(quiz);
  });
  return shuffle(quizzes);
};

const generateChoicesFromCards = (
  cards: Card[],
  correctChoiceIndex: number
) => {
  const randomChoices = getRandomChoices(cards, 3, correctChoiceIndex);

  return shuffle([cards[correctChoiceIndex].definition, ...randomChoices]);
};

const getRandomChoices = (
  choices: any[],
  total: number,
  exceptIndex: number
) => {
  const otherDefinitions = choices
    .filter((_, index) => index !== exceptIndex)
    .map((card) => card.definition);

  return shuffle(otherDefinitions).slice(0, total);
};

const hashValue = (value: string) => {
  return CryptoJS.SHA256(value + SALT).toString();
};
