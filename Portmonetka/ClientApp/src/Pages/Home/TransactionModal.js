import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import axios from "axios";
import FocusTrap from "focus-trap-react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import { DayPicker } from "react-day-picker";
import { usePopper } from "react-popper";
import { BiMinus, BiPlus } from "react-icons/bi";
import { GoCalendar } from "react-icons/go";
import "react-day-picker/dist/style.css";

const TransactionModal = ({ open, onClose, onDataChanged, walletId }) => {
    const [validated, setValidated] = useState(false);

    const [currentIndex, setCurrentIndex] = useState(0);

    const [transactions, setTransactions] = useState([
        {
            name: "",
            amount: "",
            date: new Date(),
            categoryId: -1,
            walletId: walletId
        }
    ]);

    const [newCategory, setNewCategory] = useState({
        name: "",
        isExpense: true,
        iconFileName: null
    });

    const [categories, setCategories] = useState([]);
    useEffect(() => {
        getCategories();
    }, []);

    const [isSelectDateOpen, setIsSelectDateOpen] = useState(false);
    const [popperSelectDate, setPopperSelectDate] = useState(null);//popper element
    const [buttonSelectDate, setButtonSelectDate] = useState(null);//reference element

    const popperDate = usePopper(buttonSelectDate, popperSelectDate, {
        placement: "bottom-end"
    });

    const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
    const [popperAddCategory, setPopperAddCategory] = useState(null);//popper element
    const [buttonAddCategory, setButtonAddCategory] = useState(null);//reference element

    const popperCategory = usePopper(buttonAddCategory, popperAddCategory, {
        placement: "bottom-end"
    });

    const transactionTemplate = {
        name: "",
        amount: "",
        date: new Date(),
        categoryId: 0,
        walletId: walletId
    };

    const addNewRow = () => {
        setTransactions(transactions => [...transactions, transactionTemplate]);
    };

    const deleteRow = (index) => {
        const spliced = [...transactions];
        spliced.splice(index, 1);
        setTransactions(spliced);
    }

    const closeSelectDatePopper = () => {
        setIsSelectDateOpen(false);
        buttonSelectDate?.current?.focus();
    };

    const closeCategoryPopper = () => {
        setIsAddCategoryOpen(false);
        buttonAddCategory?.current?.focus();
    };

    const handleDescriptionChange = (e, i) => {
        let items = [...transactions];
        let item = { ...items[i] };
        item.name = e.target.value;
        items[i] = item;
        setTransactions(items);
    }

    const handleAmountChange = (e, i) => {
        let items = [...transactions];
        let item = { ...items[i] };
        if (item.categoryId > 0) {
            let selectedCategory = categories.find(c => c.Id == item.categoryId);
            item.amount = selectedCategory.IsExpense ? -Math.abs(e.target.value) : Math.abs(e.target.value);
        } else {
            item.amount = e.target.value;
        }
        items[i] = item;
        setTransactions(items);
    }

    const handleCategoryChange = (e, i) => {
        setCurrentIndex(i);
        let items = [...transactions];
        let item = { ...items[i] };
        item.categoryId = e.target.value;
        if (item.categoryId > 0) {
            let selectedCategory = categories.find(c => c.Id == item.categoryId);
            item.amount = selectedCategory.IsExpense ? -Math.abs(item.amount) : Math.abs(item.amount);
        }
        items[i] = item;
        setTransactions(items);
    }

    const handleDateChange = (e, i) => {
        //doesn't work - TODO
        //let items = [...transactions];
        //let item = { ...items[i] };
        //item.date = format(e.target.value, 'dd.MM.y');
        //items[i] = item;
        //setTransactions(items);
    };

    const handleDateButtonClick = (e, i) => {
        setCurrentIndex(i);
        setButtonSelectDate(e.target);
        setIsSelectDateOpen(true);
    };

    const handleDateSelect = (date) => {
        let items = [...transactions];
        let item = { ...items[currentIndex] };
        item.date = date;
        items[currentIndex] = item;
        setTransactions(items);
        setIsSelectDateOpen(false);
    };

    const handleCategoryButtonClick = (e, i) => {
        setCurrentIndex(i);
        setButtonAddCategory(e.target);
        setIsAddCategoryOpen(true);
    }

    const getCategories = async () => {
        const url = "api/category";
        try {
            const result = await axios.get(url)
                .then((result) => {
                    setCategories(result.data)
                })
        } catch (error) {
            console.error(error);
        }
    }

    const postCategory = () => {
        const url = "api/category";
        const data = {
            "name": newCategory.name,
            "isExpense": newCategory.isExpense,
            "iconFileName": "",
        };

        axios.post(url, data)
            .then((response) => {
                getCategories();

                let items = [...transactions];
                let item = { ...items[currentIndex] };
                item.categoryId = response.data.Id;
                items[currentIndex] = item;
                setTransactions(items);
                setIsAddCategoryOpen(false);
            });
    }

    const handleSubmit = (event) => {
        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            setValidated(false);
            event.preventDefault();
            event.stopPropagation();
        } else {
            setValidated(true);
            onSubmit();
        }

        
    };

    const onSubmit = () => {
        //if (!validated)
        //    alert('invalid input');
        const url = "api/transaction";
        let data = transactions;
        axios.post(url, data)
            .then(() => { onDataChanged(); });
    }

    if (!open) return null;

    return (
        <Modal show={open} onHide={onClose} backdrop="static" size="xl"
            contentClassName="modal-container">

            <Modal.Header closeButton>
                <Modal.Title><big>Where have the money gone?</big></Modal.Title>
            </Modal.Header>

            <Modal.Body >
                <Form /*noValidate*/ validated={validated} onSubmit={handleSubmit}>
                    {
                        transactions.map((transaction, i) => (
                            <Row key={i}>
                                <Col sm={12} lg={4}>
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
                                            aria-label="Description"
                                            aria-describedby="basic-addon1"
                                            value={transaction.name} maxLength="255"
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
                                            aria-label="Amount"
                                            aria-describedby="basic-addon1"
                                            type="number"
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
                                                        <option key={c.Id} value={c.Id} >{c.Name}</option>
                                                    ) : null
                                            }
                                        </Form.Select>
                                        <Button className="btn-dark" onClick={(e) => handleCategoryButtonClick(e, i)}>
                                            <BiPlus />
                                        </Button>
                                    </InputGroup>
                                </Col>
                                <Col sm={12} lg={3 }>
                                    <InputGroup key={i} className="mb-3" >

                                        <Form.Control
                                            placeholder={transaction.date}
                                            aria-label="Date"
                                            aria-describedby="basic-addon1"
                                            value={format(transaction.date, "dd.MM.y")}
                                            onChange={(e) => handleDateChange(e, i)}
                                            required
                                        />
                                        <Button key={i} className="btn-dark"
                                            aria-label="Pick a date"
                                            onClick={(e) => handleDateButtonClick(e, i)}>
                                            <GoCalendar />
                                        </Button>
                                    </InputGroup>
                                </Col>
                            </Row>
                        ))
                    }
                    <div className="d-grid mb-3">
                        <Button variant="outline-light" onClick={addNewRow}><BiPlus/></Button>
                    </div>

                    <div className="modal-footer">
                        <Button variant="primary" size="lg" type="submit" >
                            Add
                        </Button>
                    </div>
                </Form>

                {isSelectDateOpen && (
                    <FocusTrap
                        active
                        focusTrapOptions={{
                            initialFocus: false,
                            allowOutsideClick: true,
                            clickOutsideDeactivates: true,
                            onDeactivate: closeSelectDatePopper,
                            fallbackFocus: buttonSelectDate.current
                        }} >
                        <div
                            tabIndex={-1}
                            style={popperDate.styles.popper}
                            className="popper"
                            {...popperDate.attributes.popper}
                            ref={setPopperSelectDate}
                            role="dialog" >
                            <DayPicker
                                selected={parseISO(transactions[currentIndex].date)}
                                onSelect={handleDateSelect}
                                mode="single"
                                weekStartsOn={1}
                                initialFocus={isSelectDateOpen} />
                        </div>
                    </FocusTrap>
                )}

                {isAddCategoryOpen && (
                    <FocusTrap
                        active
                        focusTrapOptions={{
                            initialFocus: false,
                            allowOutsideClick: true,
                            clickOutsideDeactivates: true,
                            onDeactivate: closeCategoryPopper,
                            fallbackFocus: buttonAddCategory.current
                        }} >
                        <div
                            tabIndex={-1}
                            style={popperCategory.styles.popper}
                            className="popper"
                            {...popperCategory.attributes.popper}
                            ref={setPopperAddCategory}
                            role="dialog" >

                            <Form className="p-3">
                                <Row className="mb-2">
                                    <Col>
                                        <Form.Control
                                            placeholder="New category"
                                            aria-label="Name of category"
                                            value={newCategory.name} maxLength="255"
                                            onChange={e => {
                                                setNewCategory({ ...newCategory, name: e.target.value })
                                            }} required />
                                    </Col>
                                </Row>
                                <Row className="mb-2">
                                    <Col>
                                        <Form.Check
                                            type="switch"
                                            id="expense-switch"
                                            label="This is expense"
                                            checked={newCategory.isExpense}
                                            onChange={e => {
                                                setNewCategory({ ...newCategory, isExpense: e.target.checked })
                                            }}
                                        />
                                    </Col>
                                </Row>
                                <div className="d-grid">
                                    <Button className="btn-dark"
                                        aria-label="Post new category"
                                        onClick={postCategory}>
                                        Add
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </FocusTrap>
                )}
            </Modal.Body>
        </Modal>
    )
}

export default TransactionModal;