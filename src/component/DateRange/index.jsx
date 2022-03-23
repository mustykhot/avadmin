/* eslint-disable react-hooks/exhaustive-deps */
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { addDays } from "date-fns";
import calender from "../../assets/icons/calendar.svg";
import moment from "moment";
import { useState } from "react";
import "./style.scss";
import { useEffect } from "react";
const DateRange = ({ handle, position }) => {
  const [showRange, setShowRange] = useState(false);

  const [dateRange, setDateRange] = useState([
    {
      // ate_from=&date_to=
      startDate: "",
      endDate: "",
      key: "selection",
    },
  ]);
  const handleRangeShow = () => {
    setShowRange(!showRange);
  };

  useEffect(() => {
    handle(dateRange);
  }, [dateRange]);
  return (
    <div className="dateFilter each">
      <div onClick={handleRangeShow} className="dateBox">
        <img src={calender} alt="date icon" />
        <p className="date-range">
          {` ${
            dateRange[0].startDate
              ? moment(dateRange[0].startDate).format("MM/DD/YYYY")
              : "Select Date"
          } - ${
            dateRange[0].endDate
              ? moment(dateRange[0].endDate).format("MM/DD/YYYY")
              : "Select Date"
          }`}

          {/* moment(dateRange[0].startDate).format('MM/DD/YYYY') */}
        </p>
      </div>

      {showRange && (
        <div style={{ left: position }} className="rangeDiv">
          <DateRangePicker
            onChange={(item) => setDateRange([item.selection])}
            showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            months={2}
            ranges={dateRange}
            direction="horizontal"
            preventSnapRefocus={true}
            calendarFocus="backwards"
          />

          <div onClick={handleRangeShow} className="applyBtn">
            <button type="button">Apply</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRange;
