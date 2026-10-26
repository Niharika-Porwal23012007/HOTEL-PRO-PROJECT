import { AIService } from '../services/aiService.js';
import { Review } from '../models/Review.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export class AIController {
  /**
   * AI Concierge Chat (AI-01, AI-02, AI-03)
   */
  static async chat(req, res, next) {
    try {
      const { message, chatHistory } = req.body;
      if (!message || message.trim() === '') {
        return sendError(res, 400, 'Message is required');
      }

      const response = await AIService.handleChat({ message, chatHistory });
      return sendSuccess(res, 200, 'AI response', response);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Natural Language Search (AI-04 / SRC-12)
   */
  static async search(req, res, next) {
    try {
      const { query } = req.body;
      if (!query) return sendError(res, 400, 'Search query is required');

      const parsed = AIService.parseNaturalSearch(query);
      return sendSuccess(res, 200, 'Query parsed into filters', { filters: parsed });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Review Summary (AI-05 / HOT-08)
   */
  static async getReviewSummary(req, res, next) {
    try {
      const { id } = req.params;
      const reviews = await Review.find({ hotelId: id, status: 'approved' });
      const summary = await AIService.summarizeReviews(reviews);
      return sendSuccess(res, 200, 'Review summary generated', summary);
    } catch (err) {
      next(err);
    }
  }
}
