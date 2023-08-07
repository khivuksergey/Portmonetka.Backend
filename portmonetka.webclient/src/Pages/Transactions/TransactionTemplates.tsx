import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { AddCategory, Popper } from "../../Components";
import { useTransactionTemplate, useCategory, usePopper } from "../../Hooks";
import { ICategory, ITransactionTemplate } from "../../Common/DataTypes";
import { FieldArray, Formik, FormikErrors } from "formik";
import { Col, Form, InputGroup, Row } from "react-bootstrap";
import { IconAdd, IconRemoveRow, IconRestoreRow } from "../../Common/Icons";

interface IAddTemplate {
    id: number
    description: string
    categoryId: number
    amount: string
    isNew: boolean
    isDeleted: boolean
}

type TAddTemplatesType = {
    templates: IAddTemplate[]
}

interface ITransactionTemplatesProps {
    onError: (message: string) => void
}

export default function TransactionTemplates({ onError }: ITransactionTemplatesProps) {

    //#region Initializations

    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const {
        templates: templatesData,
        refreshTemplates,
        handleAddTemplates,
        handleChangeTemplates,
        handleDeleteTemplates,
        templatesExist,
        loading,
        error: templatesError
    } = useTransactionTemplate();

    const { categories, handleAddCategory, refreshCategories, dataFetched: categoriesLoaded } = useCategory();

    const validationSchema = yup.object().shape({
        templates: yup
            .array()
            .of(
                yup.object().shape({
                    description: yup
                        .string()
                        .max(255, "Maximum length is 255 characters").required("Description is required")
                        .test("unique-description", "Description must be unique", function (value) {
                            const templateIndex = this.options?.context?.path as number;
                            if (templateIndex === undefined) {
                                return true; // Validation will fail if templateIndex is not provided
                            }

                            // Check if any other templates have the same description
                            const otherTemplates = this.parent as Array<{ description: string }>;
                            const hasDuplicate = otherTemplates.some(
                                (template, index) => index !== templateIndex && template.description === value
                            );

                            return !hasDuplicate;
                        }),
                    categoryId: yup.number().positive().required("Category is required"),
                    amount: yup.number()
                })
            )
            .required(),
    });

    const getInitialTemplates = () => {
        if (templatesExist) {
            const result = templatesData.map((template) => ({
                id: template.id ?? 0,
                description: template.description,
                categoryId: template.categoryId,
                amount: template.amount?.toString() ?? "",
                isNew: false,
                isDeleted: false
            }));
            return { templates: result };
        } else {
            return { templates: [{ id: 0, description: "", categoryId: 0, amount: "", isNew: true, isDeleted: false }] };
        }
    };

    const [initialTemplates, setInitialTemplates] = useState<TAddTemplatesType>(getInitialTemplates);

    useEffect(() => {
        setInitialTemplates(getInitialTemplates());
    }, [templatesData, templatesExist]);

    //#endregion

    //#region UI functions

    useEffect(() => {
        if (!!templatesError && templatesError !== "Component unmounted") {
            onError(templatesError);
        }
    }, [templatesError])

    const [isPopperCategoryOpen, setIsPopperCategoryOpen] = useState(false);

    const {
        popper: popperCategory,
        setPopperElement: setPopperCategory,
        referenceElement: buttonCategory,
        setReferenceElement: setButtonCategory
    } = usePopper(setIsPopperCategoryOpen);

    const [isTemplateContainerVisible, setIsTemplateContainerVisible] = useState(false);

    const [isScreenSizeLessThan300, setIsScreenSizeLessThan300] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsTemplateContainerVisible(window.innerWidth < 576);
            setIsScreenSizeLessThan300(window.innerWidth < 300);
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const handleCategoryButtonClick = (e: any, i: number) => {
        setCurrentIndex(i);
        setButtonCategory(e.target);
        setIsPopperCategoryOpen(prev => !prev);
    }

    const handleAddRow = (push: Function) => {
        const newTemplate: IAddTemplate = { id: 0, description: "", categoryId: 0, amount: "", isNew: true, isDeleted: false };
        push(newTemplate);
    };

    const handleDeleteRow = (remove: Function, index: number, values: TAddTemplatesType, setFieldValue: Function) => {
        if (values.templates[index].isNew) {
            remove(index);
        } else {
            setFieldValue(`templates[${index}].isDeleted`, true);
            applyDisabledStyles(index);
        }
    }

    const handleRestoreRow = (index: number, values: TAddTemplatesType, setFieldValue: Function) => {
        setFieldValue(`templates[${index}].isDeleted`, false);
        applyEnabledStyles(index);
    }

    const applyDisabledStyles = (index: number) => {
        const inputs: NodeListOf<HTMLInputElement | HTMLSelectElement | HTMLButtonElement> = document.querySelectorAll(`[name^="templates[${index}]"]`);
        inputs.forEach((input: HTMLInputElement | HTMLSelectElement | HTMLButtonElement) => {
            input.disabled = true;
        });
        const container = document.getElementsByName(`templates[${index}]`).item(0);
        container.classList.add("disabled");
    }

    const applyEnabledStyles = (index: number) => {
        const inputs: NodeListOf<HTMLInputElement | HTMLSelectElement | HTMLButtonElement> = document.querySelectorAll(`[name^="templates[${index}]"]`);
        inputs.forEach((input: HTMLInputElement | HTMLSelectElement | HTMLButtonElement) => {
            input.disabled = false;
        });
        const container = document.getElementsByName(`templates[${index}]`).item(0);
        container.classList.remove("disabled");
    }

    const applyEnabledStylesOnReset = () => {
        const inputs: NodeListOf<HTMLInputElement | HTMLSelectElement | HTMLButtonElement> = document.querySelectorAll(`[name^="templates"`);
        inputs.forEach((input: HTMLInputElement | HTMLSelectElement | HTMLButtonElement) => {
            input.disabled = false;
        });
        const containers: NodeListOf<HTMLDivElement> = document.querySelectorAll(`[name^="templates"`);
        containers.forEach((input: HTMLDivElement) => {
            input.classList.remove("disabled");
        });
    }

    //#endregion

    // #region Data change handlers

    const handleAmountChange = (index: number, value: string, setFieldValue: Function, templates: IAddTemplate[]) => {
        const currentTemplate = templates[index];
        if (!!currentTemplate.categoryId) {
            const selectedCategory = categories.find(c => c.id == currentTemplate.categoryId) as ICategory;
            value = selectedCategory.isExpense ?
                (-Math.abs(parseFloat(value))).toString() :
                Math.abs(parseFloat(value)).toString();
        }
        setFieldValue(`templates[${index}].amount`, value);
    }

    const handleCategoryChange = (index: number, categoryId: number, setFieldValue: Function, templates: IAddTemplate[]) => {
        setCurrentIndex(index);
        setFieldValue(`templates[${index}].categoryId`, categoryId);
        const currentTemplate = templates[index];

        if (categoryId) {
            const selectedCategory = categories.find(c => c.id == categoryId) as ICategory;

            if (!!currentTemplate.amount) {
                const amount = selectedCategory.isExpense ?
                    (-Math.abs(parseFloat(currentTemplate.amount))) :
                    Math.abs(parseFloat(currentTemplate.amount));

                setFieldValue(`templates[${index}].amount`, amount);
            }
        }
    }

    const onAddCategory = async (newCategory: ICategory, index: number, setFieldValue: Function, templates: IAddTemplate[]) => {
        const newCategoryId = await handleAddCategory(newCategory);
        refreshCategories();
        setFieldValue(`templates[${index}].categoryId`, newCategoryId);
        const currentTemplate = templates[index];
        if (!!currentTemplate.amount) {
            const amount = newCategory.isExpense ?
                (-Math.abs(parseFloat(currentTemplate.amount))) :
                Math.abs(parseFloat(currentTemplate.amount));

            setFieldValue(`templates[${index}].amount`, amount);
        }
        setIsPopperCategoryOpen(false);
    }

    const handleSubmit = async (values: TAddTemplatesType) => {
        let deleted: boolean = false;
        let changed: boolean = false;
        let added: boolean = false;

        const templateIdsToDelete: number[] = values.templates
            .filter(t => t.isDeleted)
            .map((t) => { return t.id });

        const templatesToChange: ITransactionTemplate[] = values.templates
            .filter(t => !t.isDeleted && !t.isNew)
            .map((t) => {
                return {
                    id: t.id,
                    description: t.description,
                    amount: !!t.amount ? parseFloat(t.amount) : null,
                    categoryId: t.categoryId
                }
            });

        const templatesToAdd: ITransactionTemplate[] = values.templates
            .filter(t => t.isNew)
            .map((t) => {
                return {
                    id: t.id,
                    description: t.description,
                    amount: !!t.amount ? parseFloat(t.amount) : null,
                    categoryId: t.categoryId
                }
            });

        if (templateIdsToDelete.length > 0 || templatesToChange.length > 0 || templatesToAdd.length > 0) {
            if (!window.confirm("Are you sure you want to apply changes?"))
                return;
        }

        if (templateIdsToDelete.length > 0) {
            deleted = await handleDeleteTemplates(templateIdsToDelete);
        }

        if (templatesToChange.length > 0) {
            changed = await handleChangeTemplates(templatesToChange);
        }

        if (templatesToAdd.length > 0) {
            added = await handleAddTemplates(templatesToAdd);
        }

        if (changed || deleted || added) {
            refreshTemplates();
            applyEnabledStylesOnReset();
        }
    };

    // #endregion

    return (
        <section className="mb-4">
            <h3 className="mb-3">Templates</h3>

            <Formik
                enableReinitialize={true}
                initialValues={initialTemplates}
                validationSchema={validationSchema}
                onSubmit={(values) => handleSubmit(values)}
            >
                {({ handleSubmit, handleChange, handleReset, setFieldValue, values, touched, errors }) =>
                    <>
                        <Form onSubmit={handleSubmit} autoComplete="off" noValidate>
                            <FieldArray name="templates">
                                {({ push, remove }: { push: (obj: any) => void; remove: (index: number) => void }) =>
                                (
                                    <React.Fragment>
                                        {values.templates && values.templates.length > 0 &&
                                            values.templates.map(
                                                (template, i) => {
                                                    return (
                                                        <Row
                                                            key={i}
                                                            className={values.templates.length > 1 && isTemplateContainerVisible ? "template-container" : ""}
                                                            name={`templates[${i}]`}
                                                        >
                                                            <Col xs={12} sm={5}>
                                                                <InputGroup className="mb-3">
                                                                    {
                                                                        !values.templates[i].isDeleted ?
                                                                            <button type="button" className="button--delete" onClick={() => handleDeleteRow(remove, i, values, setFieldValue)}>
                                                                                <IconRemoveRow size={20} fill="darkgrey" />
                                                                            </button>
                                                                            :
                                                                            <button type="button" className="button--restore" onClick={() => handleRestoreRow(i, values, setFieldValue)}>
                                                                                <IconRestoreRow size={20} fill="darkgrey" />
                                                                            </button>
                                                                    }
                                                                    <Form.Control
                                                                        type="text"
                                                                        name={`templates[${i}].description`}
                                                                        placeholder="Description"
                                                                        value={template.description}
                                                                        onChange={handleChange}
                                                                        className="form-control--dark"
                                                                        isInvalid={touched.templates?.[i]?.description &&
                                                                            !!(errors.templates?.[i] as FormikErrors<IAddTemplate>)?.description}
                                                                    />
                                                                </InputGroup>
                                                            </Col>

                                                            <Col xs={isScreenSizeLessThan300 ? 12 : 8} sm={4}>
                                                                <InputGroup className="mb-3" >
                                                                    <button
                                                                        type="button"
                                                                        name={`templates[${i}].addCategory`}
                                                                        onClick={(e) => handleCategoryButtonClick(e, i)}
                                                                    >
                                                                        <IconAdd fill="darkgrey" className="pointer-events-none" />
                                                                    </button>
                                                                    <Form.Select
                                                                        name={`templates[${i}].categoryId`}
                                                                        value={template.categoryId || ""}
                                                                        onChange={(e) => handleCategoryChange(i, parseInt(e.target.value), setFieldValue, values.templates)}
                                                                        isInvalid={touched.templates?.[i]?.categoryId &&
                                                                            !!(errors.templates?.[i] as FormikErrors<IAddTemplate>)?.categoryId}
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

                                                            <Col xs={isScreenSizeLessThan300 ? 12 : 4} sm={3}>
                                                                <InputGroup className="mb-3">
                                                                    <Form.Control
                                                                        type="number"
                                                                        step="any"
                                                                        name={`templates[${i}].amount`}
                                                                        placeholder="Amount"
                                                                        value={template.amount}
                                                                        onChange={(e) => handleAmountChange(i, e.target.value, setFieldValue, values.templates)}
                                                                        isInvalid={touched.templates?.[i]?.amount &&
                                                                            !!(errors.templates?.[i] as FormikErrors<IAddTemplate>)?.amount}
                                                                        className="form-control--dark"
                                                                    />
                                                                </InputGroup>
                                                            </Col>
                                                        </Row>
                                                    );
                                                }
                                            )
                                        }

                                        <div className="d-grid" >
                                            <button type="button" className="button-add-transaction-row hyphenate" onClick={() => handleAddRow(push)}>
                                                Add template
                                            </button>
                                        </div>

                                        <Popper
                                            open={isPopperCategoryOpen}
                                            setOpen={setIsPopperCategoryOpen}
                                            popper={popperCategory}
                                            setPopperElement={setPopperCategory}
                                        >
                                            <AddCategory onAddCategory={(newCategory) => onAddCategory(newCategory, currentIndex, setFieldValue, values.templates)} />
                                        </Popper>

                                    </React.Fragment>
                                )
                                }
                            </FieldArray>

                            <div className="mt-3 d-flex flex-row gap-3 justify-content-end">
                                <button type="submit" disabled={loading}>
                                    Save
                                </button>
                            </div>

                        </Form>
                    </>
                }
            </Formik>
        </section >
    )
}