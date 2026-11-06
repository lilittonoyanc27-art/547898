export type QuestionStatus = 'pending' | 'correct' | 'wrong' | 'passed' | 'viewed';

export interface FootballQuestion {
  id: number;
  letter: string;           // Primary initial letter (e.g. 'E', 'P', 'S')
  questionEs: string;       // Spanish question
  questionArm: string;      // Armenian question
  answerEs: string;         // Spanish answer
  answerArm: string;        // Armenian answer
  aliases?: string[];       // Alternative acceptable spellings
  categoryEs: string;       // e.g. "Posición", "Regla", "Equipamiento"
  categoryArm: string;      // Armenian category
  phoneticArm?: string;     // Transliteration / pronunciation hint in Armenian
  explanationEs?: string;   // Brief context
  explanationArm?: string;  // Armenian explanation
}

export type GameMode = 'arm_to_es' | 'es_to_es' | 'study';
