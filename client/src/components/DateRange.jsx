import React, { useEffect, useState } from 'react';
import { DatePicker, Space } from 'antd';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const DateRange = ({ onDateChange, initialDates }) => {
  const [dateRange, setDateRange] = useState([]);

  const handleDateChange = (dates) => {
    setDateRange(dates);
    if (dates) {
      onDateChange([dates[0]?.format('YYYY-MM-DD'), dates[1]?.format('YYYY-MM-DD')]);
    } else {
      onDateChange([null, null]);
    }
  };
  
  useEffect(() => {
    if (initialDates && initialDates[0] && initialDates[1]) {
      setDateRange([dayjs(initialDates[0]), dayjs(initialDates[1])]);
    }
  }, [initialDates]);
  
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <RangePicker 
        onChange={handleDateChange} 
        value={dateRange} // Bind the value of the picker to the state
        style={{ height: '7vh' }} 
      />
    </Space>
  );
};

export default DateRange;
