import React, { useState, useEffect } from "react";
import { Formik, FieldArray, FormikErrors } from "formik";
import * as yup from "yup";
import { addDays } from "date-fns";
import { ICategory, ITransaction, IWallet } from "../../../Common/DataTypes";
import { AddCategory, DayPickerWithTodayButton, Modal, ModalFooter, Popper } from "../../../Components";
import { useCategory, useTransaction, useTransactionTemplate, usePopper } from "../../../Hooks";
import { Form, Row, Col, InputGroup } from "react-bootstrap";
import { IconRemoveRow, IconCalendar, IconAdd, IconNext } from "../../../Common/Icons";
import "react-day-picker/dist/style.css";

interface IAddTransactionModalProps {
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

type TAddTransactionsType = {
    transactions: IAddTransaction[]
}


export default function AddTransactionModal({ show, onClose, wallet }: IAddTransactionModalProps) {

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

    const initialValues: TAddTransactionsType = {
        transactions: [generateTransactionTemplate(new Date(new Date().getTime()))]
    }

    const { handleAddTransactions } = useTransaction(wallet.id!);

    const { templates } = useTransactionTemplate();

    const { categories, handleAddCategory, dataFetched: categoriesLoaded, refreshCategories } = useCategory(true);

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

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const handleAddRow = (push: Function, values: TAddTransactionsType) => {
        let lastTransaction: IAddTransaction = values.transactions[values.transactions.length - 1];
        const newTransaction = generateTransactionTemplate(lastTransaction.date);
        push(newTransaction);
    };

    const handleDeleteRow = (remove: Function, index: number) => {
        remove(index);
    }

    const handleNextDayButtonClick = (index: number, setFieldValue: Function, currentDate: Date) => {
        const nextDay = addDays(currentDate, 1);
        setFieldValue(`transactions[${index}].date`, nextDay);
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

    const handleDescriptionChange = (index: number, value: string, setFieldValue: Function) => {
        const description = value;
        const template = templates.find(t => t.description.toLowerCase() === description.toLowerCase())
        if (template) {
            setFieldValue(`transactions[${index}].categoryId`, template.categoryId);
            if (!!template.amount) {
                setFieldValue(`transactions[${index}].amount`, template.amount);
            }
        }
        setFieldValue(`transactions[${index}].description`, value);
    }

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
                    (-Math.abs(parseFloat(currentTransaction.amount))).toString() :
                    Math.abs(parseFloat(currentTransaction.amount)).toString();

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
                (-Math.abs(parseFloat(currentTransaction.amount))).toString() :
                Math.abs(parseFloat(currentTransaction.amount)).toString();

            setFieldValue(`transactions[${index}].amount`, amount);
        }
        setIsPopperCategoryOpen(false);
    }

    const handleSubmit = (values: TAddTransactionsType) => {
        const added = handleAddTransactions(values.transactions as unknown as ITransaction[]);
        added.then((success) => {
            onClose(success);
        });
    };

    // #endregion

    const modalTitle = <div className="hyphenate min-width-0">
        <big className="hyphenate">Add transactions to {wallet.name}</big>
    </div>

    if (!show) return null;

    return (
        <Modal title={modalTitle} show={show} onClose={() => onClose(false)} backdrop="static" size="xl" contentClassName="modal-container min-width-200">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values) => handleSubmit(values)}
            >
                {({ handleSubmit, handleChange, setFieldValue, values, touched, errors }) =>
                    <Form onSubmit={handleSubmit} autoComplete="off" noValidate>
                        <FieldArray name="transactions">
                            {({ push, remove }: { push: (obj: any) => void; remove: (index: number) => void }) =>
                            (
                                <React.Fragment>
                                    {values.transactions && values.transactions.length > 0 &&
                                        values.transactions.map(
                                            (transaction, i) => {
                                                return (
                                                    <Row key={i} className={values.transactions.length > 1 && isTransactionContainerVisible ? "transaction-container" : ""}>
                                                        <Col sm={7} lg={4}>
                                                            <InputGroup className="mb-3">
                                                                {
                                                                    values.transactions.length > 1 ?
                                                                        (<button type="button" className="button--delete" onClick={() => handleDeleteRow(remove, i)}>
                                                                            <IconRemoveRow size={20} fill="var(--text-color)" />
                                                                        </button>)
                                                                        : null
                                                                }
                                                                <Form.Control
                                                                    type="text"
                                                                    name={`transactions[${i}].description`}
                                                                    placeholder="Description"
                                                                    value={transaction.description}
                                                                    onChange={(e) => handleDescriptionChange(i, e.target.value, setFieldValue)}
                                                                    className="form-control--dark"
                                                                    isInvalid={touched.transactions?.[i]?.description &&
                                                                        !!(errors.transactions?.[i] as FormikErrors<IAddTransaction>)?.description}
                                                                    autoFocus
                                                                />
                                                            </InputGroup>
                                                        </Col>
                                                        <Col sm={5} lg={2}>
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
                                                        <Col sm={7} lg={3}>
                                                            <InputGroup className="mb-3" >
                                                                <button type="button" onClick={(e) => handleCategoryButtonClick(e, i)} >
                                                                    <IconAdd fill="var(--text-color)" />
                                                                </button>
                                                                <Form.Select
                                                                    name={`transactions[${i}.categoryId]`}
                                                                    value={transaction.categoryId || ""}
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
                                                        <Col sm={5} lg={3}>
                                                            <InputGroup key={i} className="mb-3" >
                                                                <Form.Control
                                                                    name={`transactions[${i}].date`}
                                                                    value={transaction.date.toLocaleDateString()}
                                                                    onChange={() => { }}
                                                                    isInvalid={touched.transactions?.[i]?.date &&
                                                                        !!(errors.transactions?.[i] as FormikErrors<IAddTransaction>)?.date}
                                                                    className="form-control--dark"
                                                                />
                                                                <button key={`nextday-${i}`} type="button"
                                                                    onClick={(e) => handleNextDayButtonClick(i, setFieldValue, transaction.date)}
                                                                >
                                                                    <IconNext fill="var(--text-color)" />
                                                                </button>
                                                                <button key={i} type="button"
                                                                    onClick={(e) => handleDateButtonClick(e, i)}
                                                                >
                                                                    <IconCalendar fill="var(--text-color)" />
                                                                </button>
                                                            </InputGroup>
                                                        </Col>
                                                    </Row>
                                                );
                                            }
                                        )
                                    }

                                    <div className="d-grid" >
                                        <button type="button" className="button-add-transaction-row hyphenate" onClick={() => handleAddRow(push, values)}>
                                            Add transaction
                                        </button>
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
                                        setOpen={setIsPopperCategoryOpen}
                                        popper={popperCategory}
                                        setPopperElement={setPopperCategory}
                                    >
                                        <AddCategory onAddCategory={(newCategory) => onAddCategory(newCategory, currentIndex, setFieldValue, values.transactions)} />
                                    </Popper>

                                </React.Fragment>
                            )
                            }
                        </FieldArray>

                        <ModalFooter onReset={() => onClose(false)} submitText="Add" />

                    </Form>
                }
            </Formik>

        </Modal>
    )
}