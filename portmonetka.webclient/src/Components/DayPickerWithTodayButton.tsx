import { useState, useEffect } from "react";
import { DayPicker, SelectSingleEventHandler } from "react-day-picker";
import { addMonths, isSameMonth } from "date-fns";

interface DayPickerWithTodayButtonProps {
    selected: Date | undefined
    onSelect: SelectSingleEventHandler | undefined
}

export default function DayPickerWithTodayButton({ selected, onSelect }: DayPickerWithTodayButtonProps) {
    const today = new Date();
    const nextMonth = addMonths(new Date(), 1);

    const [month, setMonth] = useState<Date | undefined>(undefined);

    useEffect(() => {
        if (selected) {
            setMonth(selected);
        }
    }, [selected]); 

    const changeMonth = (date: Date) => {
        setMonth(date);
    };

    const handleTodayClick = () => {
        setMonth(today);
    };

    const footer = (
        <button
            type="submit"
            className="daypicker__submit-button full-width"
            disabled={isSameMonth(today, month ?? nextMonth)}
            onClick={handleTodayClick}
        >
            Today
        </button>
    );

    return (
        <DayPicker
            selected={selected}
            onSelect={onSelect as any}
            mode="single"
            weekStartsOn={1}
            month={month || selected}
            defaultMonth={selected}
            onMonthChange={changeMonth}
            initialFocus={true}
            footer={footer} />
    )
}