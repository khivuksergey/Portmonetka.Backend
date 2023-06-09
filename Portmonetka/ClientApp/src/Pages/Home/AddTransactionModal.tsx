import { useState, useEffect, useRef } from "react";
import { Control, useFieldArray, useForm } from "react-hook-form";
import { ITransaction, ICategory, IWallet } from "../../DataTypes";
import Modal from "../../Components/Modal";
import Popper from "../../Components/Popper";
import AddCategory from "../../Components/AddCategory";
import DayPickerWithTodayButton from "../../Components/DayPickerWithTodayButton";
import useTransaction from "../../Hooks/useTransaction";
import useCategory from "../../Hooks/useCategory";
import usePopper from "../../Hooks/usePopper";
import { Form, Row, Col, InputGroup, Button } from "react-bootstrap";
import { format, isValid, parse, parseISO } from "date-fns";
import "react-day-picker/dist/style.css";

import { BiPlus } from "react-icons/bi";
import { GoCalendar } from "react-icons/go";
import { MdPlaylistRemove } from "react-icons/md";
import React from "react";

interface AddTransactionModalProps {
    show: boolean
    onClose: () => void
    wallet: IWallet
    //onAddTransactions: (transactions: ITransaction[]) => void
}

export interface IAddTransaction {
    //id?: number
    description: string
    amount: string
    date: {
        value: Date,
        text: string
    }
    categoryId?: number
    walletId: number
}


export default function AddTransactionModal({ show, onClose, wallet/*, onAddTransactions*/ }: AddTransactionModalProps) {

    const { handleAddTransactions } = useTransaction(wallet.id!);

    const [validated, setValidated] = useState<boolean>(false);

    const selectRefs = useRef([]);

    let transactionTemplate: IAddTransaction = {
        description: "",
        amount: "",
        date: {
            value: new Date(new Date().getTime()),
            text: format(new Date(new Date().getTime()), 'dd.MM.yy')
        },
        categoryId: 0,
        walletId: wallet.id as number
    }

    const [transactions, setTransactions] = useState<IAddTransaction[]>([transactionTemplate]);

    const [selectedDates, setSelectedDates] = useState<string[]>(
        [format(new Date(new Date().getTime()), 'dd.MM.yy')]
    );

    const { categories, handleAddCategory, dataFetched: categoriesLoaded } = useCategory();

    const [isPopperDateOpen, setIsPopperDateOpen] = useState(false);

    const {
        popper: popperDate,
        setPopperElement: setPopperDate,
        referenceElement: buttonDate,
        setReferenceElement: setButtonDate
    } = usePopper(setIsPopperDateOpen);

    const [isPopperCategoryOpen, setIsPopperCategoryOpen] = useState(false);

    const {
        popper: popperCategory,
        setPopperElement: setPopperCategory,
        referenceElement: buttonCategory,
        setReferenceElement: setButtonCategory
    } = usePopper(setIsPopperCategoryOpen);

    const [currentIndex, setCurrentIndex] = useState<number>(0);

    useEffect(() => {
        selectRefs.current.forEach((selectRef) => {
            setPlaceholderColor(selectRef);
        });
    }, [transactions]);

    const [isTransactionCardVisible, setIsTransactionCardVisible] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsTransactionCardVisible(transactions.length > 1 && window.innerWidth < 992);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [transactions]);

    const setPlaceholderColor = (selectRef: React.MutableRefObject<HTMLSelectElement | null>) => {
        if (!selectRef || !selectRef.current) return;
        const selectElement = selectRef.current;
        if (!selectElement.value) {
            selectElement.classList.add('placeholder-selected');
        } else {
            selectElement.classList.remove('placeholder-selected');
        }
    };

    const addRow = () => {
        //let lastTransaction: any = transactions.slice(-1)[0];
        let lastSelectedDate: any = selectedDates.slice(-1)[0];
        transactionTemplate.date = lastSelectedDate;
        setTransactions(transactions => [...transactions, transactionTemplate]);//unnecessary new date
        setSelectedDates(selectedDates => [...selectedDates, lastSelectedDate]);
    };

    const deleteRow = (index: number) => {
        const splicedTransactions = [...transactions];
        const splicedSelectedDates = [...selectedDates];

        splicedTransactions.splice(index, 1);
        splicedSelectedDates.splice(index, 1);

        setTransactions(splicedTransactions);
        setSelectedDates(splicedSelectedDates);
    }

    // #region Data change handlers

    const handleDescriptionChange = (e: any, i: number) => {
        let items = [...transactions];
        let item = { ...items[i] };
        item.description = e.target.value;
        items[i] = item;
        setTransactions(items);
    }

    const handleAmountChange = (e: any, i: number) => {
        let items = [...transactions]
        let item = { ...items[i] };
        if (!!item.categoryId) {
            let selectedCategory = categories.find(c => c.id == item.categoryId) as ICategory;
            item.amount = selectedCategory.isExpense ?
                (-Math.abs(e.target.value)).toString() :
                Math.abs(e.target.value).toString();
        } else {
            item.amount = e.target.value;
        }
        items[i] = item;
        setTransactions(items);
    }

    const handleCategoryChange = (e: any, i: number) => {
        setCurrentIndex(i);
        let items = [...transactions];
        let item = { ...items[i] };
        item.categoryId = e.target.value;
        if (!!item.categoryId) {
            let selectedCategory = categories.find(c => c.id == item.categoryId) as ICategory;

            if (!!item.amount) {
                item.amount = selectedCategory.isExpense ?
                    (-Math.abs(parseInt(item.amount))).toString() :
                    Math.abs(parseInt(item.amount)).toString();
            }
        }
        items[i] = item;
        setTransactions(items);
    }

    const handleDateChange = (e: any, i: number) => {
        console.log(e.target.value, e.target.valueAsDate);
        //let items = [...transactions];
        //let item = { ...items[i] };
        let dates = [...selectedDates];
        //let date = dates[i];

        const newDate = e.target.value;// parse(e.currentTarget.value, 'y-MM-dd', new Date());
        dates[i] = newDate;
        setSelectedDates(dates);
        //if (isValid(date)) {
        //    item.date = date;
        //    items[i] = item;
        //    setTransactions(items);
        //} else {
        //    //setSelected(undefined);
        //}

    }

    // #region Poppers
    const handleDateButtonClick = (e: any, i: number) => {
        setCurrentIndex(i);
        setButtonDate(e.target);
        setIsPopperDateOpen(prev => !prev);
    };

    const handleCategoryButtonClick = (e: any, i: number) => {
        setCurrentIndex(i);
        setButtonCategory(e.target);
        setIsPopperCategoryOpen(prev => !prev);
    }

    const onDateSelect = (date: Date) => {
        //let items = [...transactions];
        //let item = { ...items[currentIndex] };
        //item.date = format(new Date(
        //    date.getFullYear(),
        //    date.getMonth(),
        //    date.getDate()//,
        //    //item.date.getHours(),
        //    //item.date.getMinutes(),
        //    //item.date.getSeconds(),
        //    //item.date.getMilliseconds(),
        //), "dd.MM.yyyy");
        //items[currentIndex] = item;
        //setTransactions(items);
        let dates = [...selectedDates];
        const newDate = format(date, "dd.MM.yy");// parse(e.currentTarget.value, 'y-MM-dd', new Date());
        dates[currentIndex] = newDate;
        setSelectedDates(dates);
        setIsPopperDateOpen(false);
    };

    const onAddCategory = async (newCategory: ICategory) => {
        const newCategoryId = await handleAddCategory(newCategory);
        let items = [...transactions];
        let item = { ...items[currentIndex] };
        item.categoryId = newCategoryId;
        items[currentIndex] = item;
        setTransactions(items);
        setIsPopperCategoryOpen(false);
    }
    // #endregion

    // #endregion

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;

        if (form.checkValidity() === false ||
            !selectedDates.every(d => isValid(parse(d, "dd.MM.yy", new Date())))) {
            setValidated(false);
            event.stopPropagation();
        } else {
            setValidated(true);
            console.log(transactions, selectedDates);
            //handleAddTransactions
            //onAddTransactions(transactions);
            onClose();
        }
    };

    const modalTitle = <big>Add transactions to {wallet.name}</big>

    if (!show) return null;

    return (
        <Modal title={modalTitle} show={show} onClose={onClose} size="xl" contentClassName="modal-container">
            <Form validated={validated} onSubmit={onSubmit} /*noValidate*/>
                {
                    transactions.map(
                        (transaction, i) => {
                            const selectRef = selectRefs.current[i] || React.createRef();
                            selectRefs.current[i] = selectRef;

                            return (
                                <Row key={i} className={isTransactionCardVisible ? "transaction-container" : ""}>
                                    <Col sm={12} lg={5}>
                                        <InputGroup className="mb-3">
                                            {
                                                transactions.length > 1 ?
                                                    (<Button className="btn-dark button--delete" onClick={() => deleteRow(i)}>
                                                        <MdPlaylistRemove size={20} fill="darkgrey" />
                                                    </Button>)
                                                    : null
                                            }
                                            <Form.Control
                                                className="form-control--dark"
                                                placeholder="Description"
                                                value={transaction.description} maxLength={255}
                                                onChange={e => handleDescriptionChange(e, i)}
                                                autoFocus
                                                required
                                            />
                                        </InputGroup>
                                    </Col>
                                    <Col sm={4} lg={2}>
                                        <InputGroup className="mb-3">
                                            <Form.Control
                                                className="form-control--dark"
                                                placeholder="Amount"
                                                type="number"
                                                step="any"
                                                value={transaction.amount}
                                                onChange={e => handleAmountChange(e, i)}
                                                required
                                            />
                                        </InputGroup>
                                    </Col>
                                    <Col sm={4} lg={3}>
                                        <InputGroup className="mb-3" >
                                            <Button className="btn-dark button--add" onClick={(e) => handleCategoryButtonClick(e, i)}>
                                                <BiPlus fill="darkgrey" />
                                            </Button>
                                            <Form.Select aria-label="Category" id="category"
                                                className="form-control--dark"
                                                ref={selectRef}
                                                value={transaction.categoryId || ''}
                                                onChange={(e) => handleCategoryChange(e, i)}
                                                required>
                                                <option value="" disabled>Category</option>
                                                {
                                                    categoriesLoaded ?
                                                        categories && categories.length > 0 ?
                                                            categories.map((c) =>
                                                                <option key={c.id} value={c.id} >{c.name}</option>
                                                            ) : null
                                                        :
                                                        <option disabled>Loading...</option>
                                                }
                                            </Form.Select>
                                        </InputGroup>
                                    </Col>
                                    <Col sm={4} lg={2}>
                                        <InputGroup key={i} className="mb-3" >
                                            <Form.Control
                                                className="form-control--dark"
                                                /*value={format(transaction.date, 'dd.MM.yyyy')}*/
                                                /*value={transaction.date}*/
                                                value={selectedDates[i]}
                                                onChange={(e) => handleDateChange(e, i)}
                                                required />
                                            <Button key={i} className="btn-dark"
                                                onClick={(e) => handleDateButtonClick(e, i)}>
                                                <GoCalendar fill="darkgrey" />
                                            </Button>
                                        </InputGroup>
                                    </Col>
                                </Row>
                            );
                        }
                    )
                }

                <div className="d-grid" >
                    <Button className="button-add-transaction-row--dark" onClick={addRow}>
                        Add transaction
                    </Button>
                </div >



                <Popper open={isPopperDateOpen} setOpen={setIsPopperDateOpen} popper={popperDate} setPopperElement={setPopperDate}>
                    <DayPickerWithTodayButton
                        /*selected={parse(transactions[currentIndex].date, "dd.MM.yyyy", new Date())}*/
                        selected={parse(selectedDates[currentIndex], "dd.MM.yy", new Date())}
                        onSelect={onDateSelect as any} />
                </Popper>

                <Popper open={isPopperCategoryOpen} setOpen={setIsPopperDateOpen} popper={popperCategory} setPopperElement={setPopperCategory}>
                    <AddCategory onAddCategory={onAddCategory} />
                </Popper>


                <div className="modal-footer">
                    <Button type="reset" className="btn-dark" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" className="ok-btn">
                        Add
                    </Button>
                </div>
            </Form>

        </Modal>
    )
}