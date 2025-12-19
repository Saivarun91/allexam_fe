"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, XCircle, Clock, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export default function ReviewAnswersPage() {
  const params = useParams();
  const router = useRouter();
  
  const provider = params?.provider;
  const examCode = params?.examCode;
  
  const [questionsWithAnswers, setQuestionsWithAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedQuestions, setSelectedQuestions] = useState(new Set());

  useEffect(() => {
    loadReviewAnswers();
  }, []);

  const loadReviewAnswers = () => {
    try {
      // Get questions and user answers from sessionStorage
      const storedAnswers = sessionStorage.getItem('userAnswers');
      const storedQuestions = sessionStorage.getItem('testQuestions');
      const storedResults = sessionStorage.getItem('testResults');
      
      if (storedResults) {
        const results = JSON.parse(storedResults);
        
        // Try to get from testResults first, then fallback to separate storage
        let userAnswers = {};
        let questions = [];
        
        if (results.answers) {
          userAnswers = results.answers;
        } else if (storedAnswers) {
          userAnswers = JSON.parse(storedAnswers);
        }
        
        if (storedQuestions) {
          questions = JSON.parse(storedQuestions);
        }
        
        // Combine questions with user answers - show ALL questions
        const combined = questions.map((q, idx) => {
          const questionNum = idx + 1;
          const userAnswer = userAnswers[questionNum];
          
          // Handle both single answer and multiple choice
          let userAnswerValue = null;
          if (userAnswer !== undefined && userAnswer !== null) {
            if (Array.isArray(userAnswer)) {
              userAnswerValue = userAnswer.length > 0 ? userAnswer : null;
            } else if (userAnswer !== '' && userAnswer !== 'null' && userAnswer !== 'undefined') {
              userAnswerValue = userAnswer;
            }
          }
          
          // Check if correct (handle both single and multiple)
          let isCorrect = false;
          let isUnanswered = userAnswerValue === null || userAnswerValue === undefined;
          
          if (!isUnanswered && q.correct_answer) {
            if (Array.isArray(userAnswerValue)) {
              // Multiple choice - check if arrays match
              const correctArray = Array.isArray(q.correct_answer) ? q.correct_answer : [q.correct_answer];
              isCorrect = JSON.stringify(userAnswerValue.sort()) === JSON.stringify(correctArray.sort());
            } else {
              // Single choice - compare strings/values
              isCorrect = String(userAnswerValue).trim() === String(q.correct_answer).trim();
            }
          }
          
          return {
            ...q,
            questionNumber: questionNum,
            userAnswer: userAnswerValue,
            isCorrect: isCorrect,
            isUnanswered: isUnanswered
          };
        });
        
        setQuestionsWithAnswers(combined);
      } else {
        alert('No test results found. Please complete a test first.');
        router.push(`/test-review/${provider}/${examCode}`);
      }
    } catch (error) {
      console.error('Error loading answers:', error);
      alert('Failed to load answers. Please try again.');
      router.push(`/test-review/${provider}/${examCode}`);
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionNavigate = (index) => {
    setCurrentQuestionIndex(index);
    // Scroll to top of question
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questionsWithAnswers.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A73E8] mx-auto mb-4"></div>
          <p className="text-[#0C1A35]/70">Loading review answers...</p>
        </div>
      </div>
    );
  }

  if (questionsWithAnswers.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Link
            href={`/test-review/${provider}/${examCode}`}
            className="inline-flex items-center text-sm text-[#0C1A35]/70 hover:text-[#1A73E8] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Results
          </Link>
          <div className="text-center py-20">
            <p className="text-[#0C1A35]/70">No answers found. Please complete a test first.</p>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questionsWithAnswers[currentQuestionIndex];
  const totalQuestions = questionsWithAnswers.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Back Button */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href={`/test-review/${provider}/${examCode}`}
              className="inline-flex items-center text-sm text-[#0C1A35]/70 hover:text-[#1A73E8] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Results
            </Link>
            <div className="text-sm font-semibold text-[#0C1A35]">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Question Content */}
          <div className="lg:col-span-3">
            <Card className="border-[#DDE7FF]">
              <div className="p-6">
                {/* Question Header */}
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[#0C1A35]">
                    Question {currentQuestion.questionNumber}
                  </h2>
                  <Badge className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                    currentQuestion.isUnanswered
                      ? 'bg-yellow-100 text-yellow-700'
                      : currentQuestion.isCorrect 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {currentQuestion.isUnanswered ? (
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Unanswered
                      </span>
                    ) : currentQuestion.isCorrect ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Correct
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <XCircle className="w-4 h-4" />
                        Incorrect
                      </span>
                    )}
                  </Badge>
                </div>
                
                {/* Question Text */}
                <p className="mb-6 text-[#0C1A35] text-base leading-relaxed">
                  {currentQuestion.question_text || currentQuestion.text}
                </p>
                
                {/* Options */}
                <div className="space-y-3 mb-6">
                  {(() => {
                    // Handle both old format (option_a, option_b) and new format (options array)
                    let optionsList = [];
                    
                    if (currentQuestion.options && Array.isArray(currentQuestion.options) && currentQuestion.options.length > 0) {
                      // New format: options is an array of objects
                      optionsList = currentQuestion.options.map((opt, idx) => ({
                        letter: String.fromCharCode(65 + idx), // A, B, C, D...
                        text: typeof opt === 'string' ? opt : (opt.text || opt.label || opt.value || ''),
                        image: typeof opt === 'object' ? (opt.image_url || opt.image) : null
                      })).filter(opt => opt.text && opt.text.trim() !== '');
                    } else {
                      // Old format: option_a, option_b, etc.
                      ['A', 'B', 'C', 'D', 'E', 'F'].forEach((option) => {
                        const optionText = currentQuestion[`option_${option.toLowerCase()}`] || 
                                         currentQuestion[`option${option}`] || 
                                         currentQuestion[`option_${option}`] ||
                                         currentQuestion[`option_${option.toUpperCase()}`];
                        if (optionText && optionText.trim() !== '') {
                          optionsList.push({
                            letter: option,
                            text: optionText,
                            image: null
                          });
                        }
                      });
                    }
                    
                    // If still no options found, show message
                    if (optionsList.length === 0) {
                      return (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-yellow-800 text-sm">No options available for this question.</p>
                        </div>
                      );
                    }
                    
                    return optionsList.map((opt, optIdx) => {
                      const option = opt.letter;
                      const optionText = opt.text;
                      if (!optionText) return null;
                      
                      // Check if this is the user's answer
                      // Handle both letter format (A, B, C) and index format (0, 1, 2)
                      const isUserAnswer = currentQuestion.userAnswer !== null && currentQuestion.userAnswer !== undefined
                        ? (Array.isArray(currentQuestion.userAnswer) 
                            ? currentQuestion.userAnswer.includes(option) || 
                              currentQuestion.userAnswer.includes(opt.letter) ||
                              currentQuestion.userAnswer.includes(String(optIdx)) ||
                              currentQuestion.userAnswer.includes(optIdx)
                            : String(currentQuestion.userAnswer).trim() === option || 
                              String(currentQuestion.userAnswer).trim() === opt.letter ||
                              String(currentQuestion.userAnswer).trim() === String(optIdx) ||
                              currentQuestion.userAnswer === optIdx)
                        : false;
                      
                      // Check if this is the correct answer
                      // Handle both correct_answer (letter) and correct_answers (array of indices/letters)
                      const correctAnswer = currentQuestion.correct_answer || currentQuestion.correct_answers;
                      let isCorrectAnswer = false;
                      
                      if (correctAnswer) {
                        if (Array.isArray(correctAnswer)) {
                          // Array format - check if option letter or index matches
                          isCorrectAnswer = correctAnswer.includes(option) || 
                                          correctAnswer.includes(opt.letter) ||
                                          correctAnswer.includes(String(optIdx)) ||
                                          correctAnswer.includes(optIdx);
                        } else {
                          // Single value - check if matches option letter or index
                          const correctStr = String(correctAnswer).trim();
                          isCorrectAnswer = correctStr === option || 
                                          correctStr === opt.letter ||
                                          correctStr === String(optIdx) ||
                                          correctAnswer === optIdx;
                        }
                      }
                    
                    // Determine styling
                    // Priority: Show correct answers in green, wrong user answers in red
                    let bgColor = 'bg-white';
                    let borderColor = 'border-gray-200';
                    let textColor = 'text-[#0C1A35]';
                    let labelColor = 'text-[#0C1A35]';
                    let badge = null;
                    
                    if (isCorrectAnswer && isUserAnswer) {
                      // User's correct answer - green with checkmark
                      bgColor = 'bg-green-50';
                      borderColor = 'border-green-500';
                      textColor = 'text-green-900';
                      labelColor = 'text-green-700';
                      badge = (
                        <Badge className="bg-green-100 text-green-700 border-green-300">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Your Answer ✓ (Correct)
                        </Badge>
                      );
                    } else if (isCorrectAnswer) {
                      // Correct answer (not selected by user) - always green
                      bgColor = 'bg-green-50';
                      borderColor = 'border-green-500';
                      textColor = 'text-green-900';
                      labelColor = 'text-green-700';
                      badge = (
                        <Badge className="bg-green-100 text-green-700 border-green-300">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Correct Answer
                        </Badge>
                      );
                    } else if (isUserAnswer && !isCorrectAnswer) {
                      // User's wrong answer - red
                      bgColor = 'bg-red-50';
                      borderColor = 'border-red-500';
                      textColor = 'text-red-900';
                      labelColor = 'text-red-700';
                      badge = (
                        <Badge className="bg-red-100 text-red-700 border-red-300">
                          <XCircle className="w-3 h-3 mr-1" />
                          Your Answer (Wrong)
                        </Badge>
                      );
                    }
                    
                      return (
                        <div 
                          key={option}
                          className={`p-4 rounded-lg border-2 transition-all ${bgColor} ${borderColor} shadow-sm`}
                        >
                          <div className="flex items-start gap-3">
                            <span className={`font-semibold min-w-[24px] ${labelColor}`}>
                              {option}.
                            </span>
                            <span className={`flex-1 ${textColor} font-medium`}>
                              {optionText}
                            </span>
                            {badge}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
                
                {/* Explanation */}
                <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                  <p className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Explanation:
                  </p>
                  <p className="text-blue-800 leading-relaxed">
                    {currentQuestion.explanation || 'No explanation available for this question.'}
                  </p>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    className="min-w-32"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>

                  <div className="text-sm text-[#0C1A35]/70">
                    {currentQuestionIndex + 1} / {totalQuestions}
                  </div>

                  <Button
                    onClick={handleNext}
                    disabled={currentQuestionIndex === totalQuestions - 1}
                    className="bg-[#1A73E8] text-white hover:bg-[#1557B0] min-w-32"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Question Navigator Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-[#DDE7FF] sticky top-24">
              <div className="p-4">
                <h3 className="font-semibold text-[#0C1A35] mb-4">Question Navigator</h3>
                <div className="grid grid-cols-5 gap-2 max-h-[600px] overflow-y-auto">
                  {questionsWithAnswers.map((q, idx) => {
                    const isCurrent = idx === currentQuestionIndex;
                    const isCorrect = q.isCorrect;
                    const isUnanswered = q.isUnanswered;
                    const isAnswered = !q.isUnanswered;
                    
                    return (
                      <button
                        key={q.questionNumber}
                        onClick={() => handleQuestionNavigate(idx)}
                        className={`
                          aspect-square rounded-lg border-2 font-semibold text-sm transition-all
                          ${isCurrent ? 'border-[#1A73E8] bg-[#1A73E8] text-white shadow-md scale-110' : ''}
                          ${!isCurrent && isCorrect ? 'border-green-500 bg-green-50 text-green-700' : ''}
                          ${!isCurrent && !isCorrect && isAnswered ? 'border-red-500 bg-red-50 text-red-700' : ''}
                          ${!isCurrent && isUnanswered ? 'border-yellow-500 bg-yellow-50 text-yellow-700' : ''}
                          ${!isCurrent && !isCorrect && !isAnswered && !isUnanswered ? 'border-gray-300 bg-white text-[#0C1A35]/70 hover:border-[#1A73E8]/50' : ''}
                        `}
                      >
                        {q.questionNumber}
                      </button>
                    );
                  })}
                </div>
                
                {/* Summary */}
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Correct:</span>
                    <span className="font-semibold text-green-600">
                      {questionsWithAnswers.filter(q => q.isCorrect).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Incorrect:</span>
                    <span className="font-semibold text-red-600">
                      {questionsWithAnswers.filter(q => !q.isCorrect && !q.isUnanswered).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Unanswered:</span>
                    <span className="font-semibold text-yellow-600">
                      {questionsWithAnswers.filter(q => q.isUnanswered).length}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

