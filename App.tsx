/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Trophy,
  Volume2,
  VolumeX,
  RotateCcw,
  Play,
  Pause,
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  BookOpen,
  Sparkles,
  Search,
  Languages,
  Eye,
  ChevronRight,
  Info,
  Clock,
  Check,
  X,
  Volume
} from 'lucide-react';
import { FOOTBALL_QUESTIONS, checkAnswer } from './questions.ts';
import { FootballQuestion, QuestionStatus, GameMode } from './types.ts';
import { soundManager, speakText } from './audio.ts';
import { triggerConfetti } from './confetti.ts';

export default function App() {
  // Game states
  const [questions] = useState<FootballQuestion[]>(FOOTBALL_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [statuses, setStatuses] = useState<Record<number, QuestionStatus>>(() => {
    const init: Record<number, QuestionStatus> = {};
    FOOTBALL_QUESTIONS.forEach(q => (init[q.id] = 'pending'));
    return init;
  });

  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [currentInput, setCurrentInput] = useState<string>('');
  const [gameMode, setGameMode] = useState<GameMode>('es_to_es'); // es_to_es | study
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Armenian reveal states: "пусть только при клике на исп будет виден арм"
  const [revealedArmenian, setRevealedArmenian] = useState<boolean>(false);
  const [revealedStudyIds, setRevealedStudyIds] = useState<Record<number, boolean>>({});

  // Translation Modal / Popover state
  const [translationModalOpen, setTranslationModalOpen] = useState<boolean>(false);
  const [selectedQuestionForTranslation, setSelectedQuestionForTranslation] = useState<FootballQuestion | null>(null);

  // Reset revealed Armenian when switching questions so it's always hidden until clicked!
  useEffect(() => {
    setRevealedArmenian(false);
  }, [currentIndex]);

  // Timer (20 minutes = 1200 seconds)
  const GAME_DURATION_SECONDS = 20 * 60;
  const [timeRemaining, setTimeRemaining] = useState<number>(GAME_DURATION_SECONDS);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [isUnlimitedTime, setIsUnlimitedTime] = useState<boolean>(false);

  // Feedback banner state
  const [feedback, setFeedback] = useState<{
    type: 'correct' | 'wrong' | 'passed' | 'viewed' | null;
    messageEs: string;
    messageArm: string;
    correctAnswer?: string;
    armenianAnswer?: string;
  } | null>(null);

  // Study search & filter
  const [searchQuery, setSearchQuery] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);
  const currentQuestion = questions[currentIndex];

  // Calculate scores
  const scoreStats = useMemo(() => {
    let correct = 0;
    let wrong = 0;
    let viewed = 0;
    let passed = 0;
    let pending = 0;

    questions.forEach(q => {
      const s = statuses[q.id];
      if (s === 'correct') correct++;
      else if (s === 'wrong') wrong++;
      else if (s === 'viewed') viewed++;
      else if (s === 'passed') passed++;
      else pending++;
    });

    const isGameOver = pending === 0 && passed === 0;
    const totalAttempted = correct + wrong + viewed;

    return { correct, wrong, viewed, passed, pending, isGameOver, totalAttempted };
  }, [questions, statuses]);

  // Focus input whenever question changes
  useEffect(() => {
    if (gameMode !== 'study') {
      inputRef.current?.focus();
    }
  }, [currentIndex, gameMode]);

  // Timer countdown
  useEffect(() => {
    if (isUnlimitedTime || !isTimerRunning || scoreStats.isGameOver) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimerRunning(false);
          soundManager.playWrong();
          return 0;
        }
        if (prev <= 10) {
          soundManager.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerRunning, isUnlimitedTime, scoreStats.isGameOver]);

  // Victory celebration
  useEffect(() => {
    if (scoreStats.isGameOver && scoreStats.correct > 0) {
      soundManager.playVictory();
      triggerConfetti();
    }
  }, [scoreStats.isGameOver, scoreStats.correct]);

  // Find next unanswered index (pending or passed)
  const getNextAvailableIndex = (fromIdx: number): number => {
    const total = questions.length;
    // First try pending
    for (let i = 1; i <= total; i++) {
      const nextIdx = (fromIdx + i) % total;
      const qId = questions[nextIdx].id;
      if (statuses[qId] === 'pending') {
        return nextIdx;
      }
    }
    // Then try passed
    for (let i = 1; i <= total; i++) {
      const nextIdx = (fromIdx + i) % total;
      const qId = questions[nextIdx].id;
      if (statuses[qId] === 'passed') {
        return nextIdx;
      }
    }
    // All answered
    return fromIdx;
  };

  // Submit Answer
  const handleAnswerSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentInput.trim()) return;

    const isCorrect = checkAnswer(currentInput, currentQuestion);
    setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: currentInput.trim() }));

    if (isCorrect) {
      soundManager.playCorrect();
      setStatuses(prev => ({ ...prev, [currentQuestion.id]: 'correct' }));
      setFeedback({
        type: 'correct',
        messageEs: `¡Correcto! ${currentQuestion.answerEs}`,
        messageArm: `Ճիշտ է! ${currentQuestion.answerArm}`,
        correctAnswer: currentQuestion.answerEs,
        armenianAnswer: currentQuestion.answerArm
      });
      setCurrentInput('');

      // Auto advance to next question
      setTimeout(() => {
        setFeedback(null);
        const nextIdx = getNextAvailableIndex(currentIndex);
        setCurrentIndex(nextIdx);
      }, 1100);
    } else {
      soundManager.playWrong();
      // CRITICAL REQUIREMENT: "если ответ неверный всё равно продолжить играть"
      // Record as wrong, but display feedback and let the player continue playing immediately!
      setStatuses(prev => ({ ...prev, [currentQuestion.id]: 'wrong' }));
      setFeedback({
        type: 'wrong',
        messageEs: `Incorrecto. La respuesta es: ${currentQuestion.answerEs}`,
        messageArm: `Սխալ պատասխան: Ճիշտը՝ ${currentQuestion.answerArm} (${currentQuestion.answerEs})`,
        correctAnswer: currentQuestion.answerEs,
        armenianAnswer: currentQuestion.answerArm
      });
      setCurrentInput('');
    }
  };

  // Move to next question manually after seeing wrong feedback
  const handleContinueAfterWrong = () => {
    setFeedback(null);
    const nextIdx = getNextAvailableIndex(currentIndex);
    setCurrentIndex(nextIdx);
    setCurrentInput('');
    inputRef.current?.focus();
  };

  // Pasapalabra (Pass)
  const handlePasapalabra = () => {
    soundManager.playPasapalabra();
    // If it's already marked as passed or pending, preserve or set to passed
    if (statuses[currentQuestion.id] === 'pending') {
      setStatuses(prev => ({ ...prev, [currentQuestion.id]: 'passed' }));
    }
    setFeedback({
      type: 'passed',
      messageEs: '¡Pasapalabra! Pasamos a la siguiente letra.',
      messageArm: 'Փասափալաբրա! Անցնում ենք հաջորդ հարցին:'
    });

    setTimeout(() => {
      setFeedback(null);
      const nextIdx = getNextAvailableIndex(currentIndex);
      setCurrentIndex(nextIdx);
      setCurrentInput('');
      inputRef.current?.focus();
    }, 700);
  };

  // View Answer ("кнопка посмотереть ответ тоже добавь и есд смотрю ответ то не надо считат неверным")
  const handleViewAnswer = () => {
    soundManager.playPeek();
    // CRITICAL: Does NOT count as wrong/fallo! Set status as 'viewed'
    setStatuses(prev => ({ ...prev, [currentQuestion.id]: 'viewed' }));
    setFeedback({
      type: 'viewed',
      messageEs: `Respuesta: ${currentQuestion.answerEs} (No cuenta como fallo)`,
      messageArm: `Պատասխան՝ ${currentQuestion.answerArm} (${currentQuestion.answerEs}) — Սխալ չի համարվում:`,
      correctAnswer: currentQuestion.answerEs,
      armenianAnswer: currentQuestion.answerArm
    });
    setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: currentQuestion.answerEs }));
  };

  const handleFillAnswer = () => {
    setCurrentInput(currentQuestion.answerEs);
    inputRef.current?.focus();
  };

  // Reset Game
  const handleResetGame = () => {
    const initStatuses: Record<number, QuestionStatus> = {};
    FOOTBALL_QUESTIONS.forEach(q => (initStatuses[q.id] = 'pending'));
    setStatuses(initStatuses);
    setUserAnswers({});
    setCurrentIndex(0);
    setCurrentInput('');
    setTimeRemaining(GAME_DURATION_SECONDS);
    setIsTimerRunning(true);
    setFeedback(null);
    setTranslationModalOpen(false);
    setRevealedArmenian(false);
    setRevealedStudyIds({});
  };

  // Audio mute toggle
  const handleToggleSound = () => {
    const newMuteState = soundManager.toggleMute();
    setIsMuted(newMuteState);
  };

  // "пусть при клике на исп откроется перевод на арм"
  const handleOpenSpanishTranslation = (q: FootballQuestion) => {
    setSelectedQuestionForTranslation(q);
    setTranslationModalOpen(true);
  };

  // Virtual accent insertion
  const handleInsertChar = (char: string) => {
    setCurrentInput(prev => prev + char);
    inputRef.current?.focus();
  };

  // Format time (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Filtered study questions
  const filteredStudyQuestions = useMemo(() => {
    if (!searchQuery.trim()) return questions;
    const q = searchQuery.toLowerCase().trim();
    return questions.filter(
      item =>
        item.answerEs.toLowerCase().includes(q) ||
        item.answerArm.toLowerCase().includes(q) ||
        item.questionEs.toLowerCase().includes(q) ||
        item.questionArm.toLowerCase().includes(q) ||
        item.letter.toLowerCase() === q
    );
  }, [questions, searchQuery]);

  return (
    <div className="min-h-screen tv-ambient-bg text-slate-100 flex flex-col justify-between selection:bg-amber-400 selection:text-slate-950 font-sans">
      {/* Top TV Studio Banner & Navigation */}
      <header className="border-b border-blue-900/60 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-amber-400 p-[2px] shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-amber-400 text-lg">
                ⚽
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-amber-400 via-amber-200 to-white bg-clip-text text-transparent">
                  PASAPALABRA FÚTBOL
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-900/70 border border-blue-700/60 text-blue-300 font-semibold hidden sm:inline-block">
                  27 Հարց
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Español ⟷ Armenio · Իսպաներեն և Հայերեն
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs sm:text-sm">
            <button
              onClick={() => setGameMode('es_to_es')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                gameMode === 'es_to_es'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>⚽ Ռոսկո (El Rosco)</span>
            </button>
            <button
              onClick={() => setGameMode('study')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                gameMode === 'study'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Բառարան (27)</span>
            </button>
          </div>

          {/* Quick Actions (Sound & Reset) */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleSound}
              title={isMuted ? 'Միացնել ձայնը' : 'Անջատել ձայնը'}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
            <button
              onClick={handleResetGame}
              title="Վերսկսել խաղը / Reiniciar juego"
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Վերսկսել</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-6 w-full flex-1 flex flex-col items-center">
        {gameMode === 'study' ? (
          /* STUDY / DICTIONARY MODE: ALL 27 QUESTIONS */
          <div className="w-full max-w-5xl">
            <div className="mb-6 bg-slate-900/70 backdrop-blur border border-blue-900/40 rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-amber-400 flex items-center gap-2">
                    ⚽ 27 Հարց ֆուտբոլի մասին — Բառարան և Թարգմանություն
                  </h2>
                  <p className="text-sm text-slate-300 mt-1">
                    Կտտացրեք ցանկացած իսպաներեն բառի կամ հարցի վրա՝ հայերեն թարգմանությունն ու բացատրությունը տեսնելու համար:
                  </p>
                </div>
                <div className="relative min-w-[240px]">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Որոնել բառ կամ տառ..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Questions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStudyQuestions.map((q, idx) => {
                const isRevealed = !!revealedStudyIds[q.id];
                return (
                  <div
                    key={q.id}
                    onClick={() => {
                      setRevealedStudyIds(prev => ({ ...prev, [q.id]: !prev[q.id] }));
                    }}
                    className="group cursor-pointer bg-slate-900/60 hover:bg-slate-900/95 border border-slate-800 hover:border-amber-400/60 rounded-2xl p-4 transition-all duration-200 hover:shadow-xl hover:shadow-blue-900/20 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center border border-blue-400 shadow-sm">
                            {q.letter}
                          </span>
                          <span className="text-xs text-slate-400 font-semibold">#{q.id}</span>
                        </div>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60">
                          {q.categoryArm}
                        </span>
                      </div>

                      {/* Spanish Question with click indicator */}
                      <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 group-hover:border-blue-500/50 mb-2">
                        <div className="flex items-center justify-between text-[11px] text-blue-400 font-semibold mb-1">
                          <span>🇪🇸 Իսպաներեն հարց</span>
                          <span className="text-[10px] text-amber-400 font-medium flex items-center gap-1">
                            <Languages className="w-3 h-3" />
                            <span>{isRevealed ? 'Թաքցնել հայերենը' : 'Սեղմեք հայերենի համար'}</span>
                          </span>
                        </div>
                        <p className="text-sm text-slate-100 font-medium leading-snug">{q.questionEs}</p>
                      </div>

                      {/* Armenian Translation — ONLY VISIBLE ON CLICK */}
                      {isRevealed ? (
                        <div className="bg-blue-950/40 rounded-xl p-3 border border-amber-400/50 animate-fade-in">
                          <span className="text-[11px] text-amber-400 font-bold block mb-1">🇦🇲 Հայերեն թարգմանություն</span>
                          <p className="text-sm text-white font-medium leading-snug">{q.questionArm}</p>
                        </div>
                      ) : (
                        <div className="bg-slate-950/40 rounded-xl p-2.5 border border-dashed border-slate-800 text-center text-xs text-slate-400 group-hover:text-amber-300 transition">
                          <span>🔒 Կտտացրեք այստեղ՝ հայերենը տեսնելու համար</span>
                        </div>
                      )}
                    </div>

                    {/* Answers section */}
                    <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <div>
                        <div className="text-xs text-slate-400">Պատասխան / Respuesta:</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-extrabold text-amber-400 text-base">{q.answerEs}</span>
                          {isRevealed && (
                            <>
                              <span className="text-slate-500">—</span>
                              <span className="font-bold text-white text-sm">{q.answerArm}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            speakText(q.answerEs, 'es-ES');
                          }}
                          title="Լսել իսպաներեն"
                          className="p-2 rounded-lg bg-blue-900/40 hover:bg-blue-800 text-blue-300 transition"
                        >
                          <Volume className="w-4 h-4" />
                        </button>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            handleOpenSpanishTranslation(q);
                          }}
                          title="Բացել մանրամասն քարտը"
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 transition"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* PASAPALABRA ROSCO TV GAME MODE */
          <div className="w-full flex flex-col items-center">
            {/* TV Scoreboard Bar */}
            <div className="w-full max-w-4xl mb-4 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-blue-900/50 p-3 sm:p-4 shadow-2xl flex flex-wrap items-center justify-between gap-4">
              {/* Green Aciertos */}
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-emerald-500 border-2 border-emerald-300 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-emerald-500/30">
                  {scoreStats.correct}
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-emerald-400 font-bold">Aciertos · Ճիշտ</div>
                  <div className="text-xs text-slate-400">Կանաչ օղակներ</div>
                </div>
              </div>

              {/* Red Fallos */}
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-rose-600 border-2 border-rose-300 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-rose-600/30">
                  {scoreStats.wrong}
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-rose-400 font-bold">Fallos · Սխալ</div>
                  <div className="text-xs text-slate-400">Կարմիր օղակներ</div>
                </div>
              </div>

              {/* Viewed Answers (NOT WRONG!) */}
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-sky-600 border-2 border-sky-300 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-sky-600/30">
                  {scoreStats.viewed}
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-sky-400 font-bold">Vistos · Դիտված</div>
                  <div className="text-xs text-slate-400">Առանց սխալի</div>
                </div>
              </div>

              {/* Timer */}
              <div className="flex items-center gap-2">
                <div
                  className={`min-w-[76px] px-2.5 h-10 rounded-2xl flex items-center justify-center font-black text-base border-2 shadow-lg tracking-wider ${
                    isUnlimitedTime
                      ? 'bg-indigo-600 border-indigo-300 text-white shadow-indigo-600/30'
                      : timeRemaining <= 30
                      ? 'bg-rose-600 border-rose-300 text-white animate-pulse shadow-rose-600/40'
                      : 'bg-amber-500 border-amber-300 text-slate-950 shadow-amber-500/30'
                  }`}
                >
                  {isUnlimitedTime ? '∞' : formatTime(timeRemaining)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] uppercase tracking-wider text-amber-300 font-bold">
                      {isUnlimitedTime ? 'Անսահմանափակ' : 'Tiempo · Ժամանակ'}
                    </span>
                    {!isUnlimitedTime && (
                      <button
                        onClick={() => setIsTimerRunning(p => !p)}
                        className="text-slate-400 hover:text-white"
                        title={isTimerRunning ? 'Դադարեցնել' : 'Շարունակել'}
                      >
                        {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => setIsUnlimitedTime(p => !p)}
                    className="text-[11px] text-blue-400 hover:underline"
                  >
                    {isUnlimitedTime ? 'Միացնել ժամանակաչափը' : 'Անսահմանափակ ժամանակ'}
                  </button>
                </div>
              </div>

              {/* Pending / Passed counter */}
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-600 border-2 border-blue-400 flex items-center justify-center font-black text-white text-base shadow-lg shadow-blue-500/30">
                  {scoreStats.pending + scoreStats.passed}
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-blue-300 font-bold">Մնացել է</div>
                  <div className="text-xs text-slate-400">27-ից</div>
                </div>
              </div>
            </div>

            {/* Circular Rosco & Stage Layout */}
            <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center justify-center gap-8 py-2">
              {/* THE ROSCO WHEEL */}
              <div className="relative flex items-center justify-center w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] md:w-[500px] md:h-[500px] select-none">
                {/* Radial Decorative Ambient Lights */}
                <div className="absolute inset-8 rounded-full border border-blue-500/20 bg-gradient-to-b from-blue-950/40 via-blue-900/10 to-slate-950/80 pointer-events-none" />
                <div className="absolute inset-16 rounded-full border border-blue-400/10 pointer-events-none" />

                {/* Center of the Rosco: Active question letter & quick action */}
                <div className="absolute z-10 flex flex-col items-center justify-center text-center p-4 max-w-[200px] sm:max-w-[240px]">
                  <div className="text-xs uppercase tracking-widest text-blue-400 font-extrabold mb-0.5">
                    ՀԱՐՑ #{currentQuestion.id} / 27
                  </div>
                  <div className="text-4xl sm:text-5xl font-black bg-gradient-to-b from-white via-amber-200 to-amber-400 bg-clip-text text-transparent drop-shadow-md">
                    {currentQuestion.letter}
                  </div>
                  <div className="text-[11px] text-slate-300 mt-1 font-semibold">
                    {currentQuestion.categoryArm}
                  </div>

                  {/* Pasapalabra status pill */}
                  <div className="mt-2">
                    {statuses[currentQuestion.id] === 'correct' && (
                      <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" /> Ճիշտ է
                      </span>
                    )}
                    {statuses[currentQuestion.id] === 'wrong' && (
                      <span className="text-[11px] font-bold text-rose-400 bg-rose-950/80 border border-rose-500/50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <X className="w-3 h-3" /> Սխալ (Շարունակեք)
                      </span>
                    )}
                    {statuses[currentQuestion.id] === 'viewed' && (
                      <span className="text-[11px] font-bold text-sky-300 bg-sky-950/80 border border-sky-500/50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Eye className="w-3 h-3" /> Դիտված է (Առանց սխալի)
                      </span>
                    )}
                    {statuses[currentQuestion.id] === 'passed' && (
                      <span className="text-[11px] font-bold text-amber-300 bg-amber-950/80 border border-amber-500/50 px-2.5 py-0.5 rounded-full">
                        Բաց թողնված
                      </span>
                    )}
                    {statuses[currentQuestion.id] === 'pending' && (
                      <span className="text-[11px] font-medium text-blue-300 bg-blue-950/80 border border-blue-600/40 px-2.5 py-0.5 rounded-full">
                        Սպասող
                      </span>
                    )}
                  </div>
                </div>

                {/* 27 CIRCULAR NODES ON THE RING */}
                {questions.map((q, idx) => {
                  const total = questions.length;
                  // Distribute 27 circles radially around 360 degrees starting from 12 o'clock (-90 deg)
                  const angle = (idx / total) * 2 * Math.PI - Math.PI / 2;
                  // Radius percentage: center at 50%, nodes on ring ~42%
                  const radius = 41.5;
                  const left = 50 + radius * Math.cos(angle);
                  const top = 50 + radius * Math.sin(angle);

                  const status = statuses[q.id];
                  const isActive = idx === currentIndex;

                  // Compute colors according to game show rules
                  let nodeStyle = 'bg-blue-600 border-blue-400 text-white shadow-blue-500/30';
                  if (status === 'correct') {
                    nodeStyle = 'bg-emerald-500 border-emerald-300 text-white shadow-emerald-500/60 ring-2 ring-emerald-400/40';
                  } else if (status === 'wrong') {
                    nodeStyle = 'bg-rose-600 border-rose-300 text-white shadow-rose-600/60 ring-2 ring-rose-400/40';
                  } else if (status === 'viewed') {
                    nodeStyle = 'bg-sky-600 border-sky-300 text-white shadow-sky-500/60 ring-2 ring-sky-400/40';
                  } else if (status === 'passed') {
                    nodeStyle = 'bg-amber-500 border-amber-200 text-slate-950 font-black shadow-amber-500/50';
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setCurrentIndex(idx);
                        inputRef.current?.focus();
                      }}
                      style={{
                        left: `${left}%`,
                        top: `${top}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      title={`#${q.id} (${q.letter}): ${q.answerEs} — ${q.answerArm}${status === 'viewed' ? ' (Դիտված · Առանց սխալի)' : ''}`}
                      className={`absolute z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center font-extrabold text-xs sm:text-sm transition-all duration-200 cursor-pointer shadow-lg hover:scale-125 ${nodeStyle} ${
                        isActive
                          ? 'rosco-active-node scale-125 ring-4 ring-yellow-400 z-30 font-black'
                          : 'opacity-95 hover:opacity-100'
                      }`}
                    >
                      {status === 'correct' ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : status === 'wrong' ? (
                        <X className="w-4 h-4 stroke-[3]" />
                      ) : status === 'viewed' ? (
                        <Eye className="w-4 h-4 stroke-[2.5]" />
                      ) : (
                        <span>{q.letter}</span>
                      )}
                      {/* Tiny index indicator */}
                      <span className="absolute -bottom-1 -right-1 text-[8px] sm:text-[9px] bg-slate-950 text-slate-300 px-1 rounded-full font-normal border border-slate-700">
                        {q.id}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* GAME STAGE / QUESTION & ANSWER CONSOLE */}
              <div className="w-full max-w-xl flex-1 bg-slate-900/80 backdrop-blur-md rounded-3xl border border-blue-900/60 p-5 sm:p-7 shadow-2xl relative">
                {/* Active Question Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-extrabold text-xs">
                      LETRA {currentQuestion.letter}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Հարց {currentQuestion.id} / 27
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setRevealedArmenian(p => !p)}
                      title="Ցուցադրել կամ թաքցնել հայերեն թարգմանությունը"
                      className={`text-xs px-2.5 py-1 rounded-lg border transition flex items-center gap-1.5 ${
                        revealedArmenian
                          ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      <Languages className="w-3.5 h-3.5" />
                      <span>{revealedArmenian ? 'Հայերենը՝ բացված' : 'Հայերեն թարգմանություն'}</span>
                    </button>
                  </div>
                </div>

                {/* QUESTION DISPLAY: "пусть только при клике на исп будет виден арм" */}
                <div className="my-5">
                  <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                      <span>🇪🇸</span>
                      <span>Հարց իսպաներենով (Pregunta)</span>
                    </span>
                    <span className="text-[11px] text-sky-400 font-medium">
                      👆 Կտտացրեք իսպաներենի վրա՝ հայերենը տեսնելու համար
                    </span>
                  </div>

                  {/* Primary Spanish Question Card — CLICK REVEALS ARMENIAN */}
                  <div
                    onClick={() => setRevealedArmenian(prev => !prev)}
                    title="Կտտացրեք հայերեն թարգմանությունը տեսնելու համար / Haz clic para ver la traducción en armenio"
                    className={`cursor-pointer group relative bg-slate-950 hover:bg-blue-950/40 p-5 rounded-2xl border-2 transition-all duration-200 shadow-lg ${
                      revealedArmenian
                        ? 'border-amber-400 ring-2 ring-amber-400/20'
                        : 'border-blue-600/60 hover:border-amber-400'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wide">
                            🇪🇸 Español
                          </span>
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-900/60 border border-blue-500/50 text-blue-200 font-semibold flex items-center gap-1 group-hover:bg-amber-400 group-hover:text-slate-950 transition">
                            <Languages className="w-3 h-3" />
                            <span>{revealedArmenian ? 'Թաքցնել հայերենը' : 'Սեղմեք հայերեն թարգմանության համար'}</span>
                          </span>
                        </div>
                        <p className="text-base sm:text-xl text-white font-semibold leading-relaxed">
                          {currentQuestion.questionEs}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            speakText(currentQuestion.questionEs, 'es-ES');
                          }}
                          title="Լսել իսպաներեն"
                          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 transition"
                        >
                          <Volume className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ARMENIAN TRANSLATION: ONLY VISIBLE UPON CLICKING SPANISH! */}
                  {revealedArmenian ? (
                    <div className="mt-3 p-4 bg-gradient-to-r from-blue-950/90 to-slate-950 rounded-2xl border-2 border-amber-400/80 shadow-xl animate-fade-in">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                              <span>🇦🇲</span>
                              <span>Հայերեն թարգմանություն</span>
                            </span>
                            <span className="text-[11px] text-slate-300 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                              {currentQuestion.categoryArm}
                            </span>
                          </div>
                          <p className="text-base sm:text-lg text-slate-100 font-semibold leading-relaxed">
                            {currentQuestion.questionArm}
                          </p>
                        </div>
                        <button
                          onClick={() => speakText(currentQuestion.questionArm, 'hy-AM')}
                          title="Լսել հայերեն"
                          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-400 transition shrink-0"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                        <button
                          onClick={() => handleOpenSpanishTranslation(currentQuestion)}
                          className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                        >
                          <span>Տեսնել մանրամասն քարտը (Բացատրություն և արտասանություն) ➜</span>
                        </button>
                        <button
                          onClick={() => setRevealedArmenian(false)}
                          className="text-xs text-slate-400 hover:text-white"
                        >
                          Փակել
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => setRevealedArmenian(true)}
                      className="mt-2.5 p-3 rounded-xl border border-dashed border-slate-800 hover:border-amber-400/60 bg-slate-950/60 hover:bg-slate-950 cursor-pointer flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-amber-300 transition"
                    >
                      <Languages className="w-3.5 h-3.5 text-amber-400" />
                      <span>Հայերեն թարգմանությունը թաքցված է · Սեղմեք այստեղ կամ իսպաներեն հարցի վրա՝ բացելու համար</span>
                    </div>
                  )}
                </div>

                {/* FEEDBACK BANNER (Shows upon correct, wrong, viewed, or pass) */}
                {feedback && (
                  <div
                    className={`mb-4 p-4 rounded-2xl border transition-all ${
                      feedback.type === 'correct'
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                        : feedback.type === 'wrong'
                        ? 'bg-rose-950/90 border-rose-500 text-rose-200'
                        : feedback.type === 'viewed'
                        ? 'bg-sky-950/90 border-sky-500 text-sky-200'
                        : 'bg-amber-950/80 border-amber-500 text-amber-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        {feedback.type === 'correct' ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                        ) : feedback.type === 'wrong' ? (
                          <XCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                        ) : feedback.type === 'viewed' ? (
                          <Eye className="w-6 h-6 text-sky-400 shrink-0 mt-0.5" />
                        ) : (
                          <HelpCircle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <div className="font-bold text-sm sm:text-base">{feedback.messageArm}</div>
                          <div className="text-xs opacity-90 mt-0.5">{feedback.messageEs}</div>
                          {feedback.correctAnswer && (
                            <div className="mt-2 text-xs bg-black/40 px-3 py-1.5 rounded-lg inline-flex items-center gap-2 border border-white/10">
                              <span>Պատասխան: </span>
                              <strong className="text-white font-extrabold underline">{feedback.correctAnswer}</strong>
                              <span> — </span>
                              <strong className="text-amber-300">{feedback.armenianAnswer}</strong>
                              <button
                                type="button"
                                onClick={() => speakText(feedback.correctAnswer!, 'es-ES')}
                                className="ml-1 text-slate-300 hover:text-white"
                                title="Լսել արտասանությունը"
                              >
                                <Volume className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions for wrong or viewed (always allows continuing to play!) */}
                      {(feedback.type === 'wrong' || feedback.type === 'viewed') && (
                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
                          {feedback.type === 'viewed' && (
                            <button
                              type="button"
                              onClick={handleFillAnswer}
                              className="px-3 py-1.5 rounded-xl bg-sky-900/60 hover:bg-sky-800 text-sky-200 border border-sky-700 text-xs font-semibold transition"
                              title="Լրացնել տեքստային դաշտում"
                            >
                              Լրացնել
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={handleContinueAfterWrong}
                            className={`px-3.5 py-1.5 rounded-xl text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 ${
                              feedback.type === 'wrong'
                                ? 'bg-rose-600 hover:bg-rose-500'
                                : 'bg-sky-600 hover:bg-sky-500'
                            }`}
                          >
                            <span>Շարունակել</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ANSWER INPUT FORM */}
                <form onSubmit={handleAnswerSubmit} className="space-y-3">
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={currentInput}
                      onChange={e => setCurrentInput(e.target.value)}
                      placeholder={`Գրեք պատասխանը իսպաներեն (${currentQuestion.letter} տառով)...`}
                      className="w-full bg-slate-950 border-2 border-blue-800/80 focus:border-amber-400 rounded-2xl px-4 py-3.5 text-base sm:text-lg font-semibold text-white placeholder:text-slate-500 focus:outline-none transition shadow-inner"
                    />
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      {currentInput && (
                        <button
                          type="button"
                          onClick={() => setCurrentInput('')}
                          className="p-1 text-slate-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Accented character helper buttons */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="text-slate-400 text-[11px] font-medium mr-1">Իսպաներեն տառեր:</span>
                    {['á', 'é', 'í', 'ó', 'ú', 'ñ', '-'].map(ch => (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => handleInsertChar(ch)}
                        className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-400 text-amber-300 font-bold transition hover:bg-slate-900"
                      >
                        {ch}
                      </button>
                    ))}
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                    {/* Submit / Comprobar */}
                    <button
                      type="submit"
                      disabled={!currentInput.trim()}
                      className="px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 disabled:pointer-events-none text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Պատասխանել</span>
                    </button>

                    {/* Pasapalabra (Pass) */}
                    <button
                      type="button"
                      onClick={handlePasapalabra}
                      className="px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>¡Pasapalabra!</span>
                    </button>

                    {/* View Answer Button ("кнопка посмотереть ответ тоже добавь и есд смотрю ответ то не надо считат неверным") */}
                    <button
                      type="button"
                      onClick={handleViewAnswer}
                      title="Տեսնել ճիշտ պատասխանը առանց սխալի հաշվառման (Ver respuesta sin fallo)"
                      className="px-4 py-3 rounded-2xl bg-slate-900 hover:bg-sky-950/80 border-2 border-sky-500/60 hover:border-sky-400 text-sky-200 hover:text-white font-extrabold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-sky-950/50"
                    >
                      <Eye className="w-4 h-4 text-sky-400 shrink-0" />
                      <div className="text-left leading-tight">
                        <div className="font-bold">Տեսնել պատասխանը</div>
                        <div className="text-[10px] text-sky-400 font-normal">առանց սխալի</div>
                      </div>
                    </button>
                  </div>
                </form>

                {/* Helpful navigation controls */}
                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <button
                    onClick={() => {
                      const prevIdx = (currentIndex - 1 + questions.length) % questions.length;
                      setCurrentIndex(prevIdx);
                    }}
                    className="hover:text-white transition flex items-center gap-1"
                  >
                    <span>⬅ Նախորդ</span>
                  </button>
                  <span className="text-[11px] text-slate-500">
                    Կարող եք նաև սեղմել ցանկացած տառի օղակին
                  </span>
                  <button
                    onClick={() => {
                      const nextIdx = (currentIndex + 1) % questions.length;
                      setCurrentIndex(nextIdx);
                    }}
                    className="hover:text-white transition flex items-center gap-1"
                  >
                    <span>Հաջորդ ➡</span>
                  </button>
                </div>
              </div>
            </div>

            {/* GAME COMPLETED SUMMARY CARD */}
            {scoreStats.isGameOver && (
              <div className="w-full max-w-3xl mt-8 bg-slate-900 border-2 border-amber-400 rounded-3xl p-6 sm:p-8 shadow-2xl animate-fade-in text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center text-3xl mb-4">
                  🏆
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-amber-300">
                  Խաղն ավարտվեց! ¡Rosco Completado!
                </h3>
                <p className="text-sm text-slate-300 mt-1 max-w-md mx-auto">
                  Դուք պատասխանեցիք ֆուտբոլի մասին բոլոր 27 հարցերին իսպաներենով և հայերենով:
                </p>

                {/* Final Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6 max-w-2xl mx-auto">
                  <div className="bg-slate-950 p-3 rounded-2xl border border-emerald-500/40">
                    <div className="text-2xl font-black text-emerald-400">{scoreStats.correct}</div>
                    <div className="text-xs text-slate-400">Ճիշտ (Aciertos)</div>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-2xl border border-rose-500/40">
                    <div className="text-2xl font-black text-rose-400">{scoreStats.wrong}</div>
                    <div className="text-xs text-slate-400">Սխալ (Fallos)</div>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-2xl border border-sky-500/40">
                    <div className="text-2xl font-black text-sky-400">{scoreStats.viewed}</div>
                    <div className="text-xs text-slate-400">Դիտված (Առանց սխալի)</div>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-2xl border border-blue-500/40">
                    <div className="text-2xl font-black text-blue-400">
                      {Math.round((scoreStats.correct / 27) * 100)}%
                    </div>
                    <div className="text-xs text-slate-400">Հաջողություն</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={handleResetGame}
                    className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/30 transition flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Խաղալ նորից</span>
                  </button>
                  <button
                    onClick={() => setGameMode('study')}
                    className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Տեսնել բառարանը (27)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 px-4 text-center text-xs text-slate-500">
        <p>
          ⚽ 27 preguntas de fútbol — Español y armenio · 27 հետաքրքիր հարց ֆուտբոլի մասին՝ իսպաներեն և հայերեն
        </p>
      </footer>

      {/* TRANSLATION MODAL: "пусть при клике на исп откроется перевод на арм" */}
      {translationModalOpen && selectedQuestionForTranslation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-slate-900 border-2 border-amber-400/80 rounded-3xl p-6 sm:p-7 shadow-2xl relative text-left">
            {/* Close Button */}
            <button
              onClick={() => setTranslationModalOpen(false)}
              className="absolute right-4 top-4 p-2 rounded-xl bg-slate-950 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 font-black text-xl flex items-center justify-center shadow-md">
                {selectedQuestionForTranslation.letter}
              </span>
              <div>
                <span className="text-xs uppercase tracking-wider text-amber-400 font-bold block">
                  Հայերեն Թարգմանություն · Traducción
                </span>
                <h3 className="text-lg font-extrabold text-white">
                  Հարց #{selectedQuestionForTranslation.id} ({selectedQuestionForTranslation.categoryArm})
                </h3>
              </div>
            </div>

            {/* Spanish Block */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-blue-900/40 mb-3">
              <div className="flex items-center justify-between text-xs text-blue-400 font-bold mb-1">
                <span>🇪🇸 Իսպաներեն (Español):</span>
                <button
                  onClick={() => speakText(selectedQuestionForTranslation.questionEs, 'es-ES')}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-blue-300"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Լսել</span>
                </button>
              </div>
              <p className="text-sm sm:text-base text-slate-200 font-medium">
                {selectedQuestionForTranslation.questionEs}
              </p>
            </div>

            {/* Armenian Translation Block */}
            <div className="bg-gradient-to-br from-blue-950/80 to-slate-950 p-4 rounded-2xl border border-amber-500/40 mb-4 shadow-inner">
              <div className="flex items-center justify-between text-xs text-amber-400 font-bold mb-1">
                <span>🇦🇲 Հայերեն թարգմանություն:</span>
                <button
                  onClick={() => speakText(selectedQuestionForTranslation.questionArm, 'hy-AM')}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-amber-300"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Լսել</span>
                </button>
              </div>
              <p className="text-base sm:text-lg text-white font-bold leading-relaxed">
                {selectedQuestionForTranslation.questionArm}
              </p>
            </div>

            {/* Answer Translation Card */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 mb-4">
              <span className="text-xs text-slate-400 font-semibold block mb-1">
                Պատասխան / Respuesta:
              </span>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xl font-black text-amber-400 flex items-center gap-2">
                    <span>{selectedQuestionForTranslation.answerEs}</span>
                    <button
                      onClick={() => speakText(selectedQuestionForTranslation.answerEs, 'es-ES')}
                      title="Լսել իսպաներեն արտասանությունը"
                      className="p-1 rounded-lg text-slate-400 hover:text-amber-300"
                    >
                      <Volume className="w-4 h-4" />
                    </button>
                  </div>
                  {selectedQuestionForTranslation.phoneticArm && (
                    <div className="text-xs text-slate-400 mt-0.5">
                      Արտասանություն՝ <span className="text-slate-200 font-medium">{selectedQuestionForTranslation.phoneticArm}</span>
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <div className="text-lg font-extrabold text-white">
                    {selectedQuestionForTranslation.answerArm}
                  </div>
                  <div className="text-xs text-slate-400">
                    {selectedQuestionForTranslation.categoryArm}
                  </div>
                </div>
              </div>
            </div>

            {/* Context & Explanation */}
            {selectedQuestionForTranslation.explanationArm && (
              <div className="p-3 bg-blue-950/30 rounded-xl border border-blue-900/30 text-xs text-slate-300 mb-5">
                <span className="text-amber-400 font-bold block mb-0.5">💡 Բացատրություն:</span>
                <p>{selectedQuestionForTranslation.explanationArm}</p>
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={() => setTranslationModalOpen(false)}
              className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition shadow-lg shadow-amber-500/20"
            >
              Փակել և շարունակել խաղալ (Cerrar)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
