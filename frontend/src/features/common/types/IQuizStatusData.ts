import IQuizQuestionStatus from "./IQuizQuestionStatus";

interface IQuizStatusData {
  activeQuizId: number;
  activeQuizTitle: string;
  activeQuizQuestions: IQuizQuestionStatus[];
  activePlanStartDate: string;
  activePlanEndDate: string;
  openQuizId: number;
  openQuizTitle: string;
  openPlanStartDate: string;
  openPlanEndDate: string;
  currDBDate: string;
}

export default IQuizStatusData;
