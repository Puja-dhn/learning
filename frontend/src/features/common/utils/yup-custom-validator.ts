import dayjs from "dayjs";

const validateWithCurrentDate = (val: string | undefined) => {
  if (val && val.length > 0) {
    const currDate = dayjs(new Date()).format("YYYY-MM-DD");
    const dtCurrValue = dayjs(val, "YYYY-MM-DD");
    const dtCurrDate = dayjs(currDate, "YYYY-MM-DD");
    return !(dtCurrValue.diff(dtCurrDate, "d") > 0);
  }
  return true;
};

const validateFromCurrentDate = (
  val: string | undefined,
  backDays: number = 0,
) => {
  if (val && val.length > 0) {
    const currDate = dayjs(new Date()).format("YYYY-MM-DD");
    const dtCurrValue = dayjs(val, "YYYY-MM-DD");
    const dtCurrDate = dayjs(currDate, "YYYY-MM-DD");
    return !(dtCurrDate.diff(dtCurrValue, "d") > backDays);
  }
  return true;
};

const validateTwoDates = (startDate: string = "", endDate: string = "") => {
  if (startDate && endDate && startDate.length > 0 && endDate.length > 0) {
    const dtStartDate = dayjs(startDate, "YYYY-MM-DD");
    const dtEndDate = dayjs(endDate, "YYYY-MM-DD");
    return !(dtStartDate.diff(dtEndDate, "d") > 0);
  }
  return true;
};

const validateTwoDiff = (
  startDate: string = "",
  endDate: string = "",
  diffValue: number = 1,
) => {
  if (startDate && endDate && startDate.length > 0 && endDate.length > 0) {
    const dtStartDate = dayjs(startDate, "YYYY-MM-DD");
    const dtEndDate = dayjs(endDate, "YYYY-MM-DD");
    return !(dtEndDate.diff(dtStartDate, "d") > diffValue);
  }
  return true;
};

const validateSameYearDates = (
  startDate: string = "",
  endDate: string = "",
) => {
  if (startDate && endDate && startDate.length > 0 && endDate.length > 0) {
    const startYear = dayjs(startDate, "YYYY-MM-DD").format("yyyy");
    const endYear = dayjs(endDate, "YYYY-MM-DD").format("yyyy");
    return startYear === endYear;
  }
  return true;
};

const validateDateSunday = (currDate: string = "") => {
  if (currDate && currDate.length > 0) {
    const currDay = dayjs(currDate, "YYYY-MM-DD").format("dddd").trim();
    return currDay === "Sunday";
  }
  return true;
};

export {
  validateWithCurrentDate,
  validateFromCurrentDate,
  validateTwoDates,
  validateTwoDiff,
  validateSameYearDates,
  validateDateSunday,
};
