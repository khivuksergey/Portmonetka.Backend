import React, { useState, useEffect } from "react";
import { Formik, FieldArray, FormikErrors } from "formik";
import * as yup from "yup";
import { ICategory, ITransaction, IWallet } from "../../DataTypes";
import Modal from "../../Components/Modal";
import Popper from "../../Components/Popper";
import AddCategory from "../../Components/AddCategory";
import DayPickerWithTodayButton from "../../Components/DayPickerWithTodayButton";
import useTransaction from "../../Hooks/useTransaction";
import useCategory from "../../Hooks/useCategory";
import usePopper from "../../Hooks/usePopper";
import { Form, Row, Col, InputGroup, Button } from "react-bootstrap";
import "react-day-picker/dist/style.css";

import { BiPlus } from "react-icons/bi";
import { GoCalendar } from "react-icons/go";
import { MdPlaylistRemove } from "react-icons/md";

interface AddTransactionModalProps {
    show: boolean
    onClose: (dataAdded: boolean) => void
    wallet: IWallet
}

interface IAddTransaction {
    description: string
    amount: string
    categoryId: number
    date: Date
    walletId: number
}

type valuesType = {
    transactions: IAddTransaction[]
}


export default function AddTransactionModal({ show, onClose, wallet }: AddTransactionModalProps) {

    // #region Initializations

    const validationSchema = yup.object().shape({
        transactions: yup
            .array().of(
                yup.object().shape(
                    {
                        description: yup.string().max(255, "Maximum length is 255 characters").required("Description is required"),
                        amount: yup.number().required("Amount is required"),
                        categoryId: yup.number().positive().required("Category is required"),
                        date: yup.date().required("Date is required"),
                        walletId: yup.number().oneOf([wallet.id!]).required()
                    }
                )
            )
            .required()
    });

    const generateTransactionTemplate = (date: Date): IAddTransaction => {
        return (
            {
                description: "",
                amount: "",
                categoryId: 0,
                date: date,
                walletId: wallet.id as number
            }
        )
    }

    const initialValues: valuesType = {
        transactions: [generateTransactionTemplate(new Date(new Date().getTime()))]
    }

    const { handleAddTransactions } = useTransaction(wallet.id!);

    const { categories, handleAddCategory, dataFetched: categoriesLoaded, refreshCategories } = useCategory();

    const [currentIndex, setCurrentIndex] = useState<number>(0);

    // #endregion

    // #region UI functions

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

    const [isTransactionContainerVisible, setIsTransactionContainerVisible] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsTransactionContainerVisible(window.innerWidth < 992);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleAddRow = (push: Function, values: valuesType) => {
        let lastTransaction: IAddTransaction = values.transactions[values.transactions.length - 1];
        const newTransaction = generateTransactionTemplate(lastTransaction.date);
        push(newTransaction);
    };

    const handleDeleteRow = (remove: Function, index: number) => {
        remove(index);
    }

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

    // #endregion

    // #region Data change handlers

    const handleAmountChange = (index: number, value: string, setFieldValue: Function, transactions: IAddTransaction[]) => {
        const currentTransaction = transactions[index];
        if (!!currentTransaction.categoryId) {
            const selectedCategory = categories.find(c => c.id == currentTransaction.categoryId) as ICategory;
            value = selectedCategory.isExpense ?
                (-Math.abs(parseFloat(value))).toString() :
                Math.abs(parseFloat(value)).toString();
        }
        setFieldValue(`transactions[${index}].amount`, value);
    }

    const handleCategoryChange = (index: number, categoryId: number, setFieldValue: Function, transactions: IAddTransaction[]) => {
        setCurrentIndex(index);
        setFieldValue(`transactions[${index}].categoryId`, categoryId);
        const currentTransaction = transactions[index];

        if (categoryId) {
            const selectedCategory = categories.find(c => c.id == categoryId) as ICategory;

            if (!!currentTransaction.amount) {
                const amount = selectedCategory.isExpense ?
                    (-Math.abs(parseInt(currentTransaction.amount))).toString() :
                    Math.abs(parseInt(currentTransaction.amount)).toString();

                setFieldValue(`transactions[${index}].amount`, amount);
            }
        }
    }

    const onDateSelect = (date: Date, transaction: IAddTransaction) => {
        const now = new Date();
        const newDate = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            now.getHours(),
            now.getMinutes(),
            now.getSeconds(),
            now.getMilliseconds(),
        );
        transaction.date = newDate;
        setIsPopperDateOpen(false);
    };

    const onAddCategory = async (newCategory: ICategory, index: number, setFieldValue: Function, transactions: IAddTransaction[]) => {
        const newCategoryId = await handleAddCategory(newCategory);
        refreshCategories();
        setFieldValue(`transactions[${index}].categoryId`, newCategoryId);
        const currentTransaction = transactions[index];
        if (!!currentTransaction.amount) {
            const amount = newCategory.isExpense ?
                (-Math.abs(parseInt(currentTransaction.amount))).toString() :
                Math.abs(parseInt(currentTransaction.amount)).toString();

            setFieldValue(`transactions[${index}].amount`, amount);
        }
        setIsPopperCategoryOpen(false);
    }

    const handleSubmit = (values: valuesType) => {
        handleAddTransactions(values.transactions as unknown as ITransaction[])
        onClose(true);
    };

    // #endregion

    const modalTitle = <big>Add transactions to {wallet.name}</big>

    if (!show) return null;

    return (
        <Modal title={modalTitle} show={show} onClose={() => onClose(false)} backdrop="static" size="xl" contentClassName="modal-container">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values) => handleSubmit(values)}
            >
                {({ handleSubmit, handleChange, setFieldValue, values, touched, errors }) =>
                    <Form onSubmit={handleSubmit} noValidate>
                        <FieldArray name="transactions">
                            {({ push, remove }) =>
                            (
                                <React.Fragment>
                                    {values.transactions && values.transactions.length > 0 &&
                                        values.transactions.map(
                                            (transaction, i) => {
                                                return (
                                                    <Row key={i} className={values.transactions.length > 1 && isTransactionContainerVisible ? "transaction-container" : ""}>
                                                        <Col sm={12} lg={4}>
                                                            <InputGroup className="mb-3">
                                                                {
                                                                    values.transactions.length > 1 ?
                                                                        (<Button className="btn-dark button--delete" onClick={() => handleDeleteRow(remove, i)}>
                                                                            <MdPlaylistRemove size={20} fill="darkgrey" />
                                                                        </Button>)
                                                                        : null
                                                                }
                                                                <Form.Control
                                                                    type="text"
                                                                    name={`transactions[${i}].description`}
                                                                    placeholder="Description"
                                                                    value={transaction.description}
                                                                    onChange={handleChange}
                                                                    className="form-control--dark"
                                                                    isInvalid={touched.transactions?.[i]?.description &&
                                                                        !!(errors.transactions?.[i] as FormikErrors<IAddTransaction>)?.description}
                                                                    autoFocus
                                                                />
                                                            </InputGroup>
                                                        </Col>
                                                        <Col sm={4} lg={2}>
                                                            <InputGroup className="mb-3">
                                                                <Form.Control
                                                                    type="number"
                                                                    step="any"
                                                                    name={`transactions[${i}].amount`}
                                                                    placeholder="Amount"
                                                                    value={transaction.amount}
                                                                    onChange={(e) => handleAmountChange(i, e.target.value, setFieldValue, values.transactions)}
                                                                    isInvalid={touched.transactions?.[i]?.amount &&
                                                                        !!(errors.transactions?.[i] as FormikErrors<IAddTransaction>)?.amount}
                                                                    className="form-control--dark"
                                                                />
                                                            </InputGroup>
                                                        </Col>
                                                        <Col sm={4} lg={3}>
                                                            <InputGroup className="mb-3" >
                                                                <Button className="btn-dark button--add" onClick={(e) => handleCategoryButtonClick(e, i)}>
                                                                    <BiPlus fill="darkgrey" />
                                                                </Button>
                                                                <Form.Select
                                                                    name={`transactions[${i}.categoryId]`}
                                                                    value={transaction.categoryId || ''}
                                                                    onChange={(e) => handleCategoryChange(i, parseInt(e.target.value), setFieldValue, values.transactions)}
                                                                    isInvalid={touched.transactions?.[i]?.categoryId &&
                                                                        !!(errors.transactions?.[i] as FormikErrors<IAddTransaction>)?.categoryId}
                                                                    className="form-control--dark"
                                                                    required
                                                                >
                                                                    <option value="" disabled hidden>Category</option>
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
                                                        <Col sm={4} lg={3}>
                                                            <InputGroup key={i} className="mb-3" >
                                                                <Form.Control
                                                                    name={`transactions[${i}].date`}
                                                                    value={transaction.date.toLocaleDateString()}
                                                                    onChange={() => { }}
                                                                    isInvalid={touched.transactions?.[i]?.date &&
                                                                        !!(errors.transactions?.[i] as FormikErrors<IAddTransaction>)?.date}
                                                                    className="form-control--dark"
                                                                />
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
                                        <Button className="button-add-transaction-row--dark" onClick={() => handleAddRow(push, values)}>
                                            Add transaction
                                        </Button>
                                    </div >

                                    <Popper
                                        open={isPopperDateOpen}
                                        setOpen={setIsPopperDateOpen}
                                        popper={popperDate}
                                        setPopperElement={setPopperDate}
                                    >
                                        <DayPickerWithTodayButton
                                            selected={values.transactions[currentIndex]?.date}
                                            onSelect={(date) => onDateSelect(date!, values.transactions[currentIndex])} />
                                    </Popper>

                                    <Popper
                                        open={isPopperCategoryOpen}
                                        setOpen={setIsPopperDateOpen}
                                        popper={popperCategory}
                                        setPopperElement={setPopperCategory}
                                    >
                                        <AddCategory onAddCategory={(newCategory) => onAddCategory(newCategory, currentIndex, setFieldValue, values.transactions)} />
                                    </Popper>

                                </React.Fragment>
                            )
                            }
                        </FieldArray>

                        <div className="modal-footer">
                            <Button type="reset" className="btn-dark" onClick={() => onClose(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit" className="ok-btn">
                                Add
                            </Button>
                        </div>
                    </Form>
                }
            </Formik>

        </Modal>
    )
}