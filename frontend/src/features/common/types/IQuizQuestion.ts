interface IQuizQuestion {
  ID: number;
  QUIZ_ID: number;
  QUESTION_DESC: string;
  ANSWER_1: string;
  ANSWER_2: string;
  ANSWER_3: string;
  ANSWER_4: string;
  CORRECT_ANSWER: string;
  ANSWER_TIMER_DURATION: number;
  PLAN_END_DATE: string;
  STATUS: string;
  SRNO: number;
  QUESTION_TYPE: string;
  QUESTION_AUDIO_VIDEO: string;
  ANSWER_AUDIO_VIDEO_1: string;
  ANSWER_AUDIO_VIDEO_2: string;
  ANSWER_AUDIO_VIDEO_3: string;
  ANSWER_AUDIO_VIDEO_4: string;
}

export default IQuizQuestion;
