/**
 * ConversationManager.ts
 * Kurdish AI - Context & State Manager
 * Tracks short-term memory to handle follow-up questions.
 */

import { type ChatMessage } from "../services/aiService";

export interface ConversationState {
  lastIntent: string | null;
  lastEntity: string | null;
  topic: string | null;
  turnCount: number;
}

class ConversationManagerClass {
  private state: ConversationState = {
    lastIntent: null,
    lastEntity: null,
    topic: null,
    turnCount: 0,
  };

  /**
   * Updates state based on the current interaction
   */
  public updateState(intent: string, entity?: string): void {
    this.state.lastIntent = intent;
    if (entity) this.state.lastEntity = entity;
    this.state.turnCount++;

    // Try to determine a general topic
    if (entity) {
      this.state.topic = entity;
    }
  }

  /**
   * Tries to resolve context for ambiguous queries like "and how do I say it?"
   */
  public resolveContext(input: string): { intent: string | null; entity: string | null } {
    const text = input.toLowerCase();
    
    // Check for follow-up patterns
    const isFollowUp = text.includes("كيف") || text.includes("شو") || text.includes("أيضاً") || text.includes("كمان");
    
    if (isFollowUp && this.state.lastEntity) {
      return {
        intent: this.state.lastIntent,
        entity: this.state.lastEntity,
      };
    }

    return { intent: null, entity: null };
  }

  public getState(): ConversationState {
    return { ...this.state };
  }

  public reset(): void {
    this.state = {
      lastIntent: null,
      lastEntity: null,
      topic: null,
      turnCount: 0,
    };
  }
}

export const ConversationManager = new ConversationManagerClass();
