import dayjs from "dayjs";
import { IFYear } from "../types";

const dateDiffWithoutSunday = (
  endDate: dayjs.Dayjs,
  startDate: dayjs.Dayjs,
) => {
  let retval = 0;
  const dtEndDate = endDate.day() <= 0 ? endDate.subtract(1, "d") : endDate;

  const dateDiffVal = dtEndDate.diff(startDate, "d");
  if (dateDiffVal > 0) {
    const fullWeeks = Math.floor(dateDiffVal / 7);
    const daysLeft = dateDiffVal % 7;
    retval =
      fullWeeks * 6 +
      (daysLeft >= 1 && startDate.day() > 0 ? 1 : 0) +
      (daysLeft >= 2 && startDate.add(1, "day").day() > 0 ? 1 : 0) +
      (daysLeft >= 3 && startDate.add(2, "day").day() > 0 ? 1 : 0) +
      (daysLeft >= 4 && startDate.add(3, "day").day() > 0 ? 1 : 0) +
      (daysLeft >= 5 && startDate.add(4, "day").day() > 0 ? 1 : 0) +
      (daysLeft >= 6 && startDate.add(5, "day").day() > 0 ? 1 : 0);
  }
  return retval;
};

const dateDiffWithoutSundayNegative = (
  endDate: dayjs.Dayjs,
  startDate: dayjs.Dayjs,
) => {
  let retval = 0;
  const dtEndDate = endDate.day() <= 0 ? endDate.subtract(1, "d") : endDate;

  const dateDiffVal = dtEndDate.diff(startDate, "d");

  if (dateDiffVal < 0) {
    retval = -dateDiffWithoutSunday(startDate, endDate);
  } else {
    retval = dateDiffWithoutSunday(endDate, startDate);
  }

  return retval;
};

const getFYearList = () => {
  const currDate = new Date();
  let currYear = currDate.getFullYear();
  const currMonth = currDate.getMonth() + 1;
  if (currMonth < 4) {
    currYear -= 1;
  }
  const startYear = 2022;
  const currYearList: IFYear[] = [];
  for (let iYear = startYear; iYear <= currYear; iYear += 1) {
    const yearName = `${iYear}-${(iYear + 1).toString().substring(2)}`;
    currYearList.push({ year_no: iYear, year_name: yearName });
  }

  return currYearList;
};

const getFYearListByDate = (
  currStrDate: string,
  currStartYear: number = 2022,
) => {
  const currDate = new Date(currStrDate);
  let currYear = currDate.getFullYear();
  const currMonth = currDate.getMonth() + 1;
  if (currMonth < 4) {
    currYear -= 1;
  }
  const startYear = currStartYear;
  const currYearList: IFYear[] = [];
  for (let iYear = startYear; iYear <= currYear; iYear += 1) {
    const yearName = `${iYear}-${(iYear + 1).toString().substring(2)}`;
    currYearList.push({ year_no: iYear, year_name: yearName });
  }

  return currYearList;
};

export {
  getFYearList,
  getFYearListByDate,
  dateDiffWithoutSundayNegative,
  dateDiffWithoutSunday,
};
