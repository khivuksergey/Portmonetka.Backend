import { useState, useRef } from "react";
import { ITransaction, ICategory, IWallet } from "../../DataTypes";
import Modal from "../../Components/Modal";
import Popper from "../../Components/Popper";
import AddCategory from "../../Components/AddCategory";
import useCategory from "../../Hooks/useCategory";
import usePopper from "../../Hooks/usePopper";
import { Form, Row, Col, InputGroup, Button } from "react-bootstrap";
import { DayPicker } from "react-day-picker";
import { format, isValid, parse } from "date-fns";
import "react-day-picker/dist/style.css";

import { BiMinus, BiPlus } from "react-icons/bi";
import { GoCalendar } from "react-icons/go";

interface AddTransactionModalProps {
    show: boolean
    onClose: () => void
    wallet: IWallet
    onAddTransactions: (transactions: ITransaction[]) => void
}


const AddTransactionModal = ({ show, onClose, wallet, onAddTransactions }: AddTransactionModalProps) => {
    const [validated, setValidated] = useState<boolean>(false);

    let transactionTemplate: any = {
        description: "",
        amount: "",
        date: new Date(new Date().getTime()),
        categoryId: 0,
        walletId: wallet.id as number
    }

    const [transactions, setTransactions] = useState<ITransaction[]>([transactionTemplate]);

    const { categories, handleAddCategory } = useCategory();

    const [isPopperDateOpen, setIsPopperDateOpen] = useState(false);

    const {
        popper: popperDate,
        setPopperElement: setPopperDate,
        referenceElement: buttonDate,
        setReferenceElement: setButtonDate
    } = usePopper();

    const [isPopperCategoryOpen, setIsPopperCategoryOpen] = useState(false);

    const {
        popper: popperCategory,
        setPopperElement: setPopperCategory,
        referenceElement: buttonCategory,
        setReferenceElement: setButtonCategory
    } = usePopper();

    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const addRow = () => {
        let lastTransaction: any = transactions.slice(-1)[0];
        transactionTemplate.date = lastTransaction.date;
        setTransactions(transactions => [...transactions, transactionTemplate]);
    };

    const deleteRow = (index: number) => {
        const spliced = [...transactions];
        spliced.splice(index, 1);
        setTransactions(spliced);
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
            item.amount = selectedCategory.isExpense ? -Math.abs(e.target.value) : Math.abs(e.target.value);
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
            item.amount = selectedCategory.isExpense ? -Math.abs(item.amount) : Math.abs(item.amount);
        }
        items[i] = item;
        setTransactions(items);
    }

    //const handleDateChange = (e: any/*React.ChangeEvent<HTMLInputElement>*/, i: number) => {
    //    //doesn't work - TODO
    //    //let items = [...transactions];
    //    //let item = { ...items[i] };
    //    //item.date = format(e.target.value, 'dd.MM.y');
    //    //items[i] = item;
    //    //setTransactions(items);


    //    const { value } = e.target;

    //    // Create a ref to store the timeout ID
    //    const timeoutRef = useRef<number | undefined>(undefined);

    //    // Debounce delay in milliseconds
    //    const debounceDelay = 500; // Adjust as needed

    //    // Clear the previous timeout
    //    if (timeoutRef.current) {
    //        clearTimeout(timeoutRef.current);
    //    }

    //    // Set a new timeout to update the date after the debounce delay
    //    timeoutRef.current = window.setTimeout(() => {
    //        const parsedDate = parse(value, 'dd.MM.y', new Date());

    //        if (isValid(parsedDate)) {
    //            // Update the transaction's date in your state or data structure
    //            const updatedTransactions = [...transactions];
    //            updatedTransactions[i].date = parsedDate;
    //            setTransactions(updatedTransactions);
    //        }
    //    }, debounceDelay);
    //};

    const handleDateChange = (e: any, i: number) => {
        console.log(e, i);
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
        let items = [...transactions];
        let item = { ...items[currentIndex] };
        item.date = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            item.date.getHours(),
            item.date.getMinutes(),
            item.date.getSeconds(),
            item.date.getMilliseconds(),
        );
        items[currentIndex] = item;
        setTransactions(items);
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
        //console.log("transactions to be added: ", transactions);
        if (form.checkValidity() === false) {
            setValidated(false);
            event.stopPropagation();
        } else {
            setValidated(true);
            onAddTransactions(transactions);
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
                        (transaction, i) => (
                            <Row key={i}>
                                <Col sm={12} lg={5}>
                                    <InputGroup className="mb-3">
                                        {
                                            transactions.length > 1 ?
                                                (<Button className="btn-dark" onClick={() => deleteRow(i)}>
                                                    <BiMinus />
                                                </Button>)
                                                : null
                                        }
                                        <Form.Control
                                            placeholder="Description"
                                            value={transaction.description} maxLength={255}
                                            onChange={e => handleDescriptionChange(e, i)}
                                            autoFocus
                                            required
                                        />
                                    </InputGroup>
                                </Col>
                                <Col sm={12} lg={2}>
                                    <InputGroup className="mb-3">
                                        <Form.Control
                                            placeholder="Amount"
                                            type="number"
                                            step="any"
                                            value={transaction.amount}
                                            onChange={e => handleAmountChange(e, i)}
                                            required
                                        />
                                    </InputGroup>
                                </Col>
                                <Col sm={12} lg={3}>
                                    <InputGroup className="mb-3" >
                                        <Form.Select aria-label="Category" id="category"
                                            value={transaction.categoryId}
                                            onChange={(e) => handleCategoryChange(e, i)}
                                            required>
                                            <option value="">Category</option>
                                            {
                                                categories && categories.length > 0 ?
                                                    categories.map((c) =>
                                                        <option key={c.id} value={c.id} >{c.name}</option>
                                                    ) : null
                                            }
                                        </Form.Select>
                                        <Button className="btn-dark" onClick={(e) => handleCategoryButtonClick(e, i)}>
                                            <BiPlus />
                                        </Button>
                                    </InputGroup>
                                </Col>
                                <Col sm={12} lg={2}>
                                    <InputGroup key={i} className="mb-3" >

                                        <Form.Control
                                            /*type="date"*/
                                            placeholder={format(transaction.date, "dd.MM.y")}                                            value={format(transaction.date, "dd.MM.y")}                                          /*defaultValue={format(transaction.date, "dd.MM.y")}*/
                                            onChange={(e) => handleDateChange(e, i)}
                                            required
                                        />
                                        <Button key={i} className="btn-dark"
                                            onClick={(e) => handleDateButtonClick(e, i)}>
                                            <GoCalendar />
                                        </Button>
                                    </InputGroup>
                                </Col>
                            </Row>
                        )
                    )
                }

                <div className="d-grid mb-3" >
                    <Button className="button-add-transaction-row" onClick={addRow}>
                        <BiPlus size={18} />
                    </Button>
                </div >



                <Popper open={isPopperDateOpen} setOpen={setIsPopperDateOpen} popper={popperDate} setPopperElement={setPopperDate}>
                    <DayPicker
                        selected={transactions[currentIndex].date}
                        onSelect={onDateSelect as any}
                        mode="single"
                        weekStartsOn={1}
                        initialFocus={isPopperDateOpen} />
                </Popper>

                <Popper open={isPopperCategoryOpen} setOpen={setIsPopperDateOpen} popper={popperCategory} setPopperElement={setPopperCategory}>
                    <AddCategory onAddCategory={onAddCategory} />
                </Popper>


                <div className="modal-footer">
                    <Button variant="secondary" type="reset" className="cancel-btn" onClick={onClose}>
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

export default AddTransactionModal;