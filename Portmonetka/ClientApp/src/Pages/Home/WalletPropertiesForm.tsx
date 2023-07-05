import { ReactNode } from "react";
import { Formik, FormikErrors } from "formik";
import * as yup from "yup";
import { IWalletProps } from "../../DataTypes";
import { Col, Form, Row } from "react-bootstrap";

interface IWalletPropertiesFormProps {
    initialValues: IWalletProps
    handleSubmit: (wallet: any) => void
    children?: ReactNode
}

export default function WalletPropertiesForm({
    initialValues,
    handleSubmit,
    children
}: IWalletPropertiesFormProps) {
    const validationSchema = yup.object().shape(
        {
            name: yup.string().max(128, "Maximum 128 characters").required("Name is required"),
            currency: yup.string().matches(/^[A-Za-z]{3}$/, 'e.g. USD').required("Currency is required"),
            initialAmount: yup.number().min(0, "Minimum 0").required("Initial amount is required"),
            iconFileName: yup.string()//.required("Icon is required")
        }
    );

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => handleSubmit(values)}
        >
            {({ handleSubmit, handleChange, values: wallet, touched, errors }) =>
                <Form onSubmit={handleSubmit} autoComplete="off" noValidate>
                    <Row style={{ marginBottom: "2rem" }}>
                        <Col xs={12} sm={5} className="mb-4 mb-sm-0">
                            <Form.Group>
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    name={`name`}
                                    placeholder="My wallet"
                                    value={wallet.name}
                                    onChange={handleChange}
                                    className="form-control--dark"
                                    isInvalid={touched.name &&
                                        !!(errors as FormikErrors<IWalletProps>)?.name}
                                /*autoFocus*/
                                />
                                {
                                    !(errors as FormikErrors<IWalletProps>)?.name?.includes("required") ?
                                        <Form.Control.Feedback type="invalid" style={{ position: "fixed", paddingLeft: "0.25rem" }}>
                                            {(errors as FormikErrors<IWalletProps>).name}
                                        </Form.Control.Feedback>
                                        : null
                                }
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={3} className="mb-4 mb-sm-0">
                            <Form.Group>
                                <Form.Label>Currency</Form.Label>
                                <Form.Control
                                    type="text"
                                    name={`currency`}
                                    placeholder="USD"
                                    maxLength={3}
                                    value={wallet.currency}
                                    onChange={(e) => {
                                        const uppercaseValue = e.target.value.toUpperCase();
                                        handleChange({
                                            target: {
                                                name: e.target.name,
                                                value: uppercaseValue,
                                            },
                                        });
                                    }}
                                    className="form-control--dark"
                                    isInvalid={touched.currency &&
                                        !!(errors as FormikErrors<IWalletProps>)?.currency}
                                />
                                {
                                    !(errors as FormikErrors<IWalletProps>)?.currency?.includes("required") ?
                                        <Form.Control.Feedback type="invalid" style={{ position: "fixed", paddingLeft: "0.25rem" }}>
                                            {(errors as FormikErrors<IWalletProps>).currency}
                                        </Form.Control.Feedback>
                                        : null
                                }
                            </Form.Group>
                        </Col>
                        <Col xs={12} sm={4} className="mb-4 mb-sm-0">
                            <Form.Group>
                                <Form.Label>Balance</Form.Label>
                                <Form.Control
                                    type="number"
                                    step="any"
                                    name={`initialAmount`}
                                    placeholder="10000"
                                    value={wallet.initialAmount ?? ''}
                                    onChange={handleChange}
                                    className="form-control--dark"
                                    isInvalid={touched.initialAmount &&
                                        !!(errors as FormikErrors<IWalletProps>)?.initialAmount}
                                />
                                {
                                    !(errors as FormikErrors<IWalletProps>)?.initialAmount?.includes("required") ?
                                        <Form.Control.Feedback type="invalid" style={{ position: "fixed", paddingLeft: "0.25rem" }}>
                                            {(errors as FormikErrors<IWalletProps>).initialAmount}
                                        </Form.Control.Feedback>
                                        : null
                                }
                            </Form.Group>
                        </Col>
                    </Row>

                    {children}

                </Form>
            }
        </Formik>
    )
}