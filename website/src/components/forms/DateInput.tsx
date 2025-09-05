import React from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateInput = (
    { showIcon,
        icon,
        dateOrTimeFormatString,
        selectedDate,
        minDate,
        onChangeDate,
        placeholderText,
        highlightedDate,
        labelText,
        showTimeSelectOnly,
        timeIntervals,
        minTime,
        timeFormatString
    }: any) => {

    const defaultDateOrTimeFormat = showTimeSelectOnly ? "h:mm aa" : "dd/MM/yyy"
    const defaultPlaceholder = showTimeSelectOnly ? "Select a time (EST)" : "Select a date"

    return (
        <div className="input-wrap">
            <h2 className="title-small">{labelText ? labelText : defaultPlaceholder}</h2>
            <DatePicker
                showIcon={showIcon}
                icon={icon}
                dateFormat={
                    dateOrTimeFormatString
                        ?
                        dateOrTimeFormatString
                        :
                        defaultDateOrTimeFormat
                }
                selected={selectedDate}
                minDate={minDate}
                onChange={onChangeDate}
                placeholderText={placeholderText}
                highlightDates={highlightedDate}
                showTimeSelect={showTimeSelectOnly}
                showTimeSelectOnly={showTimeSelectOnly}
                timeIntervals={timeIntervals}
                minTime={minTime && minTime}
                timeFormat={showTimeSelectOnly && timeFormatString}

            />
        </div>
    );
};

export default DateInput;