/**
 * QuizEngine.ts
 * Kurdish AI - Quiz Generator & Manager
 * Generates 4 types of quizzes from the vocabulary database.
 */

import { MOCK_WORDS } from "../data/mockLessons";
import { Word } from "../types";

export type QuizType = "MULTIPLE_CHOICE" | "TRANSLATION" | "FILL_BLANK" | "TRUE_FALSE";

export interface QuizQuestion {
  type: QuizType;
  question: string;
  correctAnswer: string;
  options?: string[]; // For multiple choice
  hint?: string;
  targetWord?: Word;
}

export interface QuizSession {
  questions: QuizQuestion[];
  currentIndex: number;
  score: number;
  totalQuestions: number;
  isActive: boolean;
  pendingAnswer: boolean; // waiting for user answer
}

class QuizEngineClass {
  private activeSession: QuizSession | null = null;

  // Pick random words from the vocabulary
  private getRandomWords(count: number, exclude?: Word): Word[] {
    const available = MOCK_WORDS.filter((w) => w !== exclude && w.kurdish && w.translation);
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  // Generate a multiple-choice question
  private generateMultipleChoice(): QuizQuestion {
    const [target, ...others] = this.getRandomWords(4);
    const wrongOptions = others.map((w) => w.translation);
    const allOptions = [target.translation, ...wrongOptions].sort(() => Math.random() - 0.5);

    return {
      type: "MULTIPLE_CHOICE",
      question: `ما معنى الكلمة الكردية **"${target.kurdish}"**؟\n\n${allOptions.map((opt, i) => `${["١", "٢", "٣", "٤"][i]}️⃣ ${opt}`).join("\n")}\n\nأجب برقم الخيار (١، ٢، ٣، أو ٤) 🧠`,
      correctAnswer: target.translation,
      options: allOptions,
      hint: `النطق: *${target.pronunciation || target.kurdish}*`,
      targetWord: target,
    };
  }

  // Generate a translation question (Ar → Ku)
  private generateTranslation(): QuizQuestion {
    const [target] = this.getRandomWords(1);
    return {
      type: "TRANSLATION",
      question: `كيف تقول **"${target.translation}"** باللغة الكردية؟\n\n_(اكتب الكلمة الكردية)_ ✍️`,
      correctAnswer: target.kurdish.toLowerCase(),
      hint: `تلميح: تبدأ بحرف "${target.kurdish[0]}"`,
      targetWord: target,
    };
  }

  // Generate a fill-in-the-blank question
  private generateFillBlank(): QuizQuestion {
    const sentences = [
      { template: "من ___ دەخۆم.", blank: "نان", arabic: "أنا آكل ___.", blankAr: "خبزاً" },
      { template: "ئەو ___ دەخوێنێت.", blank: "کتێب", arabic: "هو يقرأ ___.", blankAr: "كتاباً" },
      { template: "ئێمە بە ___ دەچین.", blank: "ماشێن", arabic: "نذهب بـ ___.", blankAr: "السيارة" },
      { template: "دایکم ___ دەکات.", blank: "خواردن", arabic: "أمي تعمل ___.", blankAr: "الطعام" },
      { template: "ئەو ___ باشە.", blank: "مامۆستا", arabic: "هو/هي ___ جيد/ة.", blankAr: "معلم/معلمة" },
    ];
    const chosen = sentences[Math.floor(Math.random() * sentences.length)];
    return {
      type: "FILL_BLANK",
      question: `أكمل الجملة بالكلمة الصحيحة:\n\n**"${chosen.template}"**\n_(${chosen.arabic})_\n\nاكتب الكلمة المناسبة للفراغ 📝`,
      correctAnswer: chosen.blank,
      hint: `بالعربية: **${chosen.blankAr}**`,
    };
  }

  // Generate a true/false question
  private generateTrueFalse(): QuizQuestion {
    const [target] = this.getRandomWords(1);
    const fakeWords = this.getRandomWords(3, target);
    const isCorrect = Math.random() > 0.5;
    const displayedTranslation = isCorrect ? target.translation : fakeWords[0].translation;

    return {
      type: "TRUE_FALSE",
      question: `**صح أم خطأ؟** 🤔\n\nالكلمة الكردية **"${target.kurdish}"** تعني: **"${displayedTranslation}"**\n\nأجب بـ (صح) أو (خطأ)`,
      correctAnswer: isCorrect ? "صح" : "خطأ",
      hint: `المعنى الصحيح: **${target.translation}**`,
      targetWord: target,
    };
  }

  // Generate a quiz session
  public generateSession(questionCount: number = 3): QuizSession {
    const generators = [
      this.generateMultipleChoice.bind(this),
      this.generateTranslation.bind(this),
      this.generateFillBlank.bind(this),
      this.generateTrueFalse.bind(this),
    ];

    const questions: QuizQuestion[] = [];
    for (let i = 0; i < questionCount; i++) {
      const generator = generators[i % generators.length];
      questions.push(generator());
    }

    this.activeSession = {
      questions,
      currentIndex: 0,
      score: 0,
      totalQuestions: questionCount,
      isActive: true,
      pendingAnswer: true,
    };

    return this.activeSession;
  }

  // Get the current question as a formatted string
  public getCurrentQuestion(): string | null {
    if (!this.activeSession || !this.activeSession.isActive) return null;
    const q = this.activeSession.questions[this.activeSession.currentIndex];
    if (!q) return null;

    const progress = `📊 سؤال ${this.activeSession.currentIndex + 1} من ${this.activeSession.totalQuestions}\n\n`;
    return progress + q.question;
  }

  // Check an answer and return feedback
  public checkAnswer(userAnswer: string): string {
    if (!this.activeSession || !this.activeSession.isActive) {
      return "لا يوجد اختبار نشط. اكتب **اختبرني** لبدء اختبار جديد!";
    }

    const session = this.activeSession;
    const q = session.questions[session.currentIndex];
    if (!q || !session.pendingAnswer) return "";

    session.pendingAnswer = false;
    const clean = (s: string) => s.trim().toLowerCase().replace(/[؟?!.,،]/g, "");
    const isCorrect = clean(userAnswer).includes(clean(q.correctAnswer)) ||
                      clean(q.correctAnswer).includes(clean(userAnswer));

    let feedback = "";
    if (isCorrect) {
      session.score++;
      const congrats = ["🎉 ممتاز!", "⭐ إجابة صحيحة!", "🔥 أحسنت!", "✅ رائع!"];
      feedback = `${congrats[Math.floor(Math.random() * congrats.length)]}\n`;
      if (q.targetWord) {
        feedback += `**${q.targetWord.kurdish}** = **${q.targetWord.translation}**\n`;
      }
    } else {
      feedback = `❌ ليست الإجابة الصحيحة.\n${q.hint ? `${q.hint}\n` : ""}الإجابة الصحيحة: **${q.correctAnswer}**\n`;
    }

    // Move to next question or end session
    session.currentIndex++;
    if (session.currentIndex >= session.totalQuestions) {
      session.isActive = false;
      const pct = Math.round((session.score / session.totalQuestions) * 100);
      let emoji = pct >= 80 ? "🏆" : pct >= 50 ? "💪" : "📚";
      feedback += `\n---\n${emoji} **نتيجتك النهائية: ${session.score}/${session.totalQuestions} (${pct}%)**\n`;
      feedback += pct >= 80
        ? "أداء رائع! أنت متقدم جداً! 🌟"
        : pct >= 50
        ? "جيد! استمر في التدرب! 💙"
        : "لا بأس، التكرار هو مفتاح التعلم! اكتب **اختبرني** مجدداً! 🔄";
    } else {
      session.pendingAnswer = true;
      feedback += `\n➡️ **السؤال التالي:**\n\n${this.getCurrentQuestion()}`;
    }

    return feedback;
  }

  public hasActiveSession(): boolean {
    return this.activeSession !== null && this.activeSession.isActive;
  }

  public isPendingAnswer(): boolean {
    return this.activeSession?.pendingAnswer === true;
  }

  public clearSession(): void {
    this.activeSession = null;
  }
}

export const QuizEngine = new QuizEngineClass();
