/**
 * KurdishAI.ts
 * The main AI orchestrator for Reber Local AI System.
 * Routes messages through the local engine first, falls back to Gemini only for unknown intents.
 */

import { intentDetector, type Intent } from "./IntentDetector";
import { responseGenerator } from "./ResponseGenerator";
import { QuizEngine } from "./QuizEngine";
import { ConversationManager } from "./ConversationManager";
import { type ChatMessage } from "../services/aiService";
import { type UserProfile } from "../types";

// Stats for local cache
interface LocalStats {
  localHits: number;
  apiCalls: number;
}

class KurdishAIOrchestrator {
  private stats: LocalStats = { localHits: 0, apiCalls: 0 };

  /**
   * Main entry point. Returns a local response if possible,
   * or null to signal the caller to use cloud AI.
   */
  public async process(
    userInput: string,
    _messages: ChatMessage[],
    _profile: UserProfile | null
  ): Promise<string | null> {
    const trimmed = userInput.trim();
    if (!trimmed) return "يبدو أن رسالتك فارغة! اكتب شيئاً وسأساعدك. 😊";

    // ── Step 1: Quiz session check (highest priority) ──────────────────────
    if (QuizEngine.hasActiveSession() && QuizEngine.isPendingAnswer()) {
      this.stats.localHits++;
      return QuizEngine.checkAnswer(trimmed);
    }

    let detection = intentDetector.detect(trimmed);

    // ── Step 2: Route to correct handler for specific intents only ─────────
    const { intent, extractedEntity } = detection;
    
    // Save state for next turn
    ConversationManager.updateState(intent, extractedEntity);

    // ── Step 3: Route to correct handler ──────────────────────────────────
    const localResponse = this.route(intent, trimmed, extractedEntity);

    if (localResponse !== null) {
      this.stats.localHits++;
      return localResponse;
    }

    // ── Step 4: Unknown → Signal caller to use Cloud AI ───────────────────
    // For all other intents, we let Gemini handle it because it is much smarter,
    // has a rich persona, and can keep the context.
    
    // Check if the input contains a Kurdish word we know about, just to give a quick offline fallback,
    // but the actual routing to Gemini happens if we return null.
    // If the user specifically is offline, the aiService will catch the null and provide an offline fallback.
    
    // We update stats for api call
    this.stats.apiCalls++;
    return null; // Caller (aiService) will use Gemini
  }

  private route(intent: Intent, rawInput: string, entity?: string): string | null {
    switch (intent) {
      case "TRAINING":
        return responseGenerator.trainingChallenge();
      case "SENTENCE_STRUCTURE":
        return responseGenerator.sentencePatternExplanation(rawInput);
      case "VERB_CONJUGATION":
        return responseGenerator.verbConjugation(rawInput);
      case "NUMBER_TRANSLATION":
        return responseGenerator.numberTranslation(entity);
      case "GREETING":
        return responseGenerator.greeting();
      case "VOCABULARY_LOOKUP":
        return responseGenerator.vocabularyLookup(entity);
      case "TRANSLATION_AR_TO_KU":
        return responseGenerator.translateArToKu(entity);
      case "TRANSLATION_KU_TO_AR":
        return responseGenerator.translateKuToAr(entity);
      case "GRAMMAR_QUESTION":
        return responseGenerator.grammarExplanation(rawInput);
      case "PRONUNCIATION_HELP":
        return responseGenerator.pronunciationHelp(rawInput);
      case "QUIZ_REQUEST": {
        const session = QuizEngine.generateSession(3);
        const firstQ = QuizEngine.getCurrentQuestion();
        return `🎯 **اختبار الطلاقة السريع! (${session.totalQuestions} أسئلة)**\n\n${firstQ}`;
      }
      case "CONVERSATION_PRACTICE":
        return responseGenerator.conversationPractice(rawInput);
      case "ENCOURAGEMENT_RESPONSE":
        return responseGenerator.encouragement();
      case "HELP_REQUEST":
      case "LESSON_REQUEST":
        return responseGenerator.helpMenu();
      case "WORD_EXAMPLES":
        return responseGenerator.vocabularyLookup(entity);
      case "UNKNOWN":
      default:
        // Try direct vocab search as fallback offline if word looks like Kurdish
        if (this.looksLikeKurdishWord(rawInput)) {
          const results = responseGenerator.searchVocabulary(rawInput);
          if (results.length > 0) {
            return responseGenerator.vocabularyLookup(rawInput);
          }
        }
        return null; // Fall through to Gemini
    }
  }

  private looksLikeKurdishWord(text: string): boolean {
    const kurdishChars = /[\u0695\u06BE\u06C6\u06CE\u06D5\u0647\u06AF\u067E\u06A4\u0681\u0698]/;
    return kurdishChars.test(text) || text.length <= 15;
  }

  public getStats(): LocalStats {
    return { ...this.stats };
  }
}

export const kurdishAI = new KurdishAIOrchestrator();
