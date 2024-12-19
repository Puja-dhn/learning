interface ILossStationData {
  MASTER_ID: number;
  STATION: string;
  JOB_ID: string;
  ANDON_PC: string;
  START_TIME: string;
  CLOSE_TIME: string;
  DURATION: string;
  LOSS_DESCRIPTION: string;
  DATE_TIME: string;
  CONVEYOR: string;
  LOSS_TYPE: number;
  REASON: string;
  STATUS: string;
  SUB_REASON: string;
  UPDATE_TIME: string;
  TACK_TIME: string;
}

export default ILossStationData;
