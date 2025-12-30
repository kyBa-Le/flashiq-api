import { GoogleGenerativeAI } from '@google/generative-ai';
import { ENV } from '../../config/env';
import { findCardsBySetId } from './ai.repository';
import { BaseException } from '../../errors/BaseException';
import { BaseSuccessResponse } from '../../dto/SuccessResponse';
import { BaseErrorResponse } from '../../dto/ErrorResponse';
import { buildStoryPrompt } from './ai.prompt';

const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);

export const generateText = async (setId: string) => {
  try {
    const cards = await findCardsBySetId(setId);
    if (!cards || cards.length === 0) {
      throw new BaseException(400, 'Cards do not exist for this set');
    }
    const model = genAI.getGenerativeModel({ model: ENV.GEMINI_MODEL });
    const prompt = buildStoryPrompt(cards.map((card) => card.term));
    const result = await model.generateContent(prompt);
    const response = result.response;
    const story = response.text();
    return new BaseSuccessResponse('Story generated successfully', { story });
  } catch (error) {
    return new BaseErrorResponse('Internal Server Error', [
      error instanceof Error ? error.message : 'Failed to generate story',
    ]);
  }
};
