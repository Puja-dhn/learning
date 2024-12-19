interface IAlertProps {
  status: boolean;
  severity: "success" | "warning" | "info" | "error";
  message: string;
  autoClose: boolean;
  autoCloseTime: number;
}

export default IAlertProps;
