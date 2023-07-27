import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Form, Row } from "react-bootstrap";
import * as yup from "yup";
import { Formik, FormikErrors } from "formik";
import { IUserCredentials, PasswordStrength } from "../../Common/DataTypes";
import { CheckPasswordStrength } from "../../Utilities";
import { useLogin } from "../../Hooks";
import { IconPortmonetka } from "../../Common/Icons";
import { ErrorAlert } from "../../Components";

export default function Login() {
    const [showError, setShowError] = useState(false);
    const [userName, setUserName] = useState<string>("");
    const [userNameExists, setUserNameExists] = useState<boolean | null>(null);
    const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null);
    const navigate = useNavigate();
    const { handleCheckUserName, handleLogin, handleSignup, loading, error: loginError } = useLogin();

    useEffect(() => {
        setShowError(!!loginError && !loginError.includes("User doesn't exist"));
    }, [loginError])

    useEffect(() => {
        const delay = 200;

        const debounceTimer = setTimeout(async () => {
            if (userName !== "") {
                const exists = await handleCheckUserName(userName);
                setUserNameExists(exists);
            }
        }, delay);

        return () => {
            clearTimeout(debounceTimer);
        };
    }, [userName])

    const validationSchema = yup.object().shape(
        {
            name: yup.string()
                .min(3, "Minimum 3 characters")
                .max(32, "Maximum 32 characters")
                .matches(/^[a-zA-Z0-9-_]+$/, "Unacceptable characters")
                .required("Name is required"),
            password: yup.string()
                .required("Password is required"),
            keepLoggedIn: yup.boolean()
        }
    );

    const initialValues: IUserCredentials = {
        name: "",
        password: "",
        keepLoggedIn: true
    }

    const handleNameChange = (e: React.ChangeEvent<any>) => {
        const newValue = e.target.value;
        setUserName(newValue);
    }

    const handleSubmit = async (user: IUserCredentials) => {
        let loggedIn = false;

        if (userNameExists) {
            loggedIn = await handleLogin(user);
        } else {
            const signedUp = await handleSignup(user);
            if (signedUp) {
                loggedIn = await handleLogin(user);
            }
        }

        if (loggedIn) {
            navigate("/");
        }
    }

    return (
        <div className="full-width" style={{ padding: "1rem" }}>
            <ErrorAlert showError={showError} onClose={() => setShowError(false)} error={loginError} />

            <div
                className="d-flex flex-column align-items-center justify-content-center"
                style={{ height: "80vh", gap: "2rem" }}
            >
                <div className="d-flex align-items-center gap-2">
                    <IconPortmonetka size={40} className="icon-portmonetka" />
                    <h1 className="prevent-select" style={{ margin: "0", fontSize: "2rem" }}>
                        Portmonetka
                    </h1>
                </div>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values) => handleSubmit(values)}
                >
                    {({ handleSubmit, handleChange, values: user, touched, errors }) =>
                        <Form
                            onSubmit={handleSubmit}
                            autoComplete="off"
                            style={{ width: "260px" }}
                            noValidate
                        >
                            <Row style={{ marginBottom: "2rem" }}>
                                <Col>
                                    <Form.Group>
                                        <Form.Control
                                            type="text"
                                            placeholder="Name"
                                            name={`name`}
                                            value={userName.trim().toLowerCase()}
                                            onChange={(e) => {
                                                handleChange(e);
                                                handleNameChange(e);
                                            }}
                                            className="form-control--dark"
                                            isInvalid={touched.name &&
                                                !!(errors as FormikErrors<IUserCredentials>)?.name}
                                        />
                                        {
                                            !(errors as FormikErrors<IUserCredentials>)?.name?.includes("required") ?
                                                <Form.Control.Feedback type="invalid" style={{ position: "fixed", paddingLeft: "0.25rem" }}>
                                                    {(errors as FormikErrors<IUserCredentials>).name}
                                                </Form.Control.Feedback>
                                                : null
                                        }
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Form.Group>
                                        <Form.Control
                                            type="password"
                                            placeholder="Password"
                                            name={`password`}
                                            value={user.password}
                                            onChange={(e) => {
                                                handleChange(e);
                                                setPasswordStrength(CheckPasswordStrength(e.target.value));
                                            }}
                                            className="form-control--dark"
                                            isInvalid={touched.password &&
                                                !!(errors as FormikErrors<IUserCredentials>)?.password}
                                        />
                                        {
                                            !(errors as FormikErrors<IUserCredentials>)?.password?.includes("required") ?
                                                <Form.Control.Feedback type="invalid" style={{ position: "fixed", paddingLeft: "0.25rem" }}>
                                                    {(errors as FormikErrors<IUserCredentials>).password}
                                                </Form.Control.Feedback>
                                                : null
                                        }
                                    </Form.Group>
                                </Col>

                                <div className="password-info"
                                    style={{ visibility: userNameExists === true || passwordStrength === null ? "hidden" : "visible" }}
                                >
                                    <div className="password-strength mt-2">
                                        <div className={`strength ${passwordStrength === PasswordStrength.WEAK ? "weak" : ""}`}></div>
                                        <div className={`strength ${passwordStrength === PasswordStrength.MEDIUM ? "medium" : ""}`}></div>
                                        <div className={`strength ${passwordStrength === PasswordStrength.STRONG ? "strong" : ""}`}></div>
                                    </div>

                                    <div className={`strength-text ${passwordStrength?.toLowerCase()}`}>{passwordStrength}</div>
                                </div>
                            </Row>

                            <Row style={{ marginBottom: "2rem" }}>
                                <Col>
                                    <button
                                        type="submit"
                                        className="full-width"
                                        style={{ height: "38px" }}
                                        disabled={loading}
                                    >
                                        {userNameExists === true ? "Sign in" : "Create new account"}
                                    </button>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Form.Check
                                        className=""
                                        type="checkbox"
                                        label="Keep me signed in"
                                        name={`keepLoggedIn`}
                                        checked={user.keepLoggedIn}
                                        onChange={handleChange}
                                    />
                                </Col>
                            </Row>
                        </Form>
                    }
                </Formik>
            </div>
        </div>
    )
}