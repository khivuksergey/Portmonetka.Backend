import { useContext } from "react";
import { Col, Placeholder, Row } from "react-bootstrap";
import { IThemeContext } from "../../../Common/DataTypes";
import { ThemeContext } from "../../../Context/ThemeContext";

export default function TransactionsTablePlaceholder() {
    const { isDarkTheme } = useContext<IThemeContext>(ThemeContext);

    return (
        <>
            {
                Array.from({ length: 3 }, (_, index) => (
                    <Row key={index}>
                        <Col xs={12} sm={5} className="mb-3">
                            <Placeholder bg={isDarkTheme ? "dark" : "light"} as="div" animation="wave" style={{ height: "38px", borderRadius: "5px" }} />
                        </Col>

                        <Col xs={8} sm={4} className="mb-3">
                            <Placeholder bg={isDarkTheme ? "dark" : "light"} as="div" animation="wave" style={{ height: "38px", borderRadius: "5px" }} />
                        </Col>

                        <Col xs={4} sm={3} className="mb-3">
                            <Placeholder bg={isDarkTheme ? "dark" : "light"} as="div" animation="wave" style={{ height: "38px", borderRadius: "5px" }} />
                        </Col>
                    </Row>
                ))
            }

            <div className="d-flex flex-row justify-content-end">
                <Placeholder bg={isDarkTheme ? "dark" : "light"} as="div" animation="wave" style={{ height: "38px", width: "63px", borderRadius: "5px" }} />
            </div>

        </>
    )
}