import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import DayPickerWithTodayButton from '../../../Components/DayPickerWithTodayButton';
import Popper from "../../../Components/Popper";
import { SelectSingleEventHandler } from "react-day-picker";
import usePopper from '../../../Hooks/usePopper';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { GoCalendar } from 'react-icons/go';

interface CustomDateComponentProps {
    value: Date | undefined;
    onDateChanged: SelectSingleEventHandler | undefined;
}

export interface CustomDateComponentRef {
    getDate(): Date | undefined;
    setDate(date: Date | undefined): void;
    setInputPlaceholder(placeholder: string): void;
    setInputAriaLabel(label: string): void;
}

export default forwardRef<CustomDateComponentRef, CustomDateComponentProps>((props, ref) => {
    const [isPopperDateOpen, setIsPopperDateOpen] = useState(false);

    const {
        popper: popperDate,
        setPopperElement: setPopperDate,
        referenceElement: buttonDate,
        setReferenceElement: setButtonDate
    } = usePopper(setIsPopperDateOpen);


    const refInput = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
        getDate() {
            return refInput.current?.value ? new Date(refInput.current.value) : undefined;
        },

        setDate(date) {
            refInput.current?.setAttribute('value', date ? date.toISOString().substring(0, 10) : '');
        },

        setInputPlaceholder(placeholder) {
            if (refInput.current) {
                refInput.current.setAttribute('placeholder', placeholder);
            }
        },

        setInputAriaLabel(label) {
            if (refInput.current) {
                refInput.current.setAttribute('aria-label', label);
            }
        },
    }));

    const handleDateButtonClick = (e: any) => {
        setButtonDate(e.target);
        setIsPopperDateOpen(prev => !prev);
    }

    return (
        <>
            <Popper
                open={isPopperDateOpen}
                setOpen={setIsPopperDateOpen}
                popper={popperDate}
                setPopperElement={setPopperDate}
            >
                {/*<div className="ag-input-wrapper custom-date-filter" role="presentation">*/}
                <DayPickerWithTodayButton selected={props.value} onSelect={props.onDateChanged} />
                {/*</div>*/}
            </Popper>

            <InputGroup>
                <Form.Control
                    ref={refInput}
                    /*value={transaction.date.toLocaleDateString()}*/
                    onChange={() => { }}
                    className="form-control--dark"
                />
                <Button className="btn-dark"
                    onClick={(e) => handleDateButtonClick(e)}>
                    <GoCalendar fill="darkgrey" />
                </Button>
            </InputGroup>


        </>
    );
});


            //<input type="text" ref={refInput} className="ag-input-field-input ag-text-field-input" />
            //<Button className="btn-dark"
            //    onClick={(e) => handleDateButtonClick(e) }>
            //    <GoCalendar fill="darkgrey" />
            //</Button>