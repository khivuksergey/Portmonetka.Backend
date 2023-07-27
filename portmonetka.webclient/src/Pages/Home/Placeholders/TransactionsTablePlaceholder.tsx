import { useContext } from "react";
import { Placeholder } from "react-bootstrap";
import { IThemeContext } from "../../../Common/DataTypes";
import { ThemeContext } from "../../../Context/ThemeContext";

export default function TransactionsTablePlaceholder() {
    const { isDarkTheme } = useContext<IThemeContext>(ThemeContext);
    
    return (
        <div style={{ paddingTop: "8px", paddingBottom: "13px" }}>
            {Array.from({ length: 2 }, (_, index) => (
                <div key={index} className="d-flex gap-3 mb-3">
                    <Placeholder bg={isDarkTheme ? "dark" : "light"} as="div" animation="wave" style={{ height: "32px", width: "150px" }} />
                    <Placeholder bg={isDarkTheme ? "dark" : "light"} as="div" animation="wave" style={{ height: "32px", width: "370px" }} />
                    <Placeholder bg={isDarkTheme ? "dark" : "light"} as="div" animation="wave" style={{ height: "32px", width: "200px" }} />
                    <Placeholder bg={isDarkTheme ? "dark" : "light"} as="div" animation="wave" style={{ height: "32px", width: "200px" }} />
                </div>
            ))}
            <div className="d-flex gap-3 mb-3">
                <Placeholder bg={isDarkTheme ? "dark" : "light"} as="div" animation="wave" style={{ height: "28px", width: "150px" }} />
                <Placeholder bg={isDarkTheme ? "dark" : "light"} as="div" animation="wave" style={{ height: "28px", width: "370px" }} />
                <Placeholder bg={isDarkTheme ? "dark" : "light"} as="div" animation="wave" style={{ height: "28px", width: "200px" }} />
                <Placeholder bg={isDarkTheme ? "dark" : "light"} as="div" animation="wave" style={{ height: "28px", width: "200px" }} />
            </div>
            <div className="d-flex gap-3">
                <Placeholder bg={isDarkTheme ? "dark" : "light"} as="div" animation="wave" style={{ height: "28px", width: "150px" }} />
                <Placeholder bg={isDarkTheme ? "dark" : "light"} as="div" animation="wave" style={{ height: "28px", width: "370px" }} />
                <Placeholder bg={isDarkTheme ? "dark" : "light"} as="div" animation="wave" style={{ height: "28px", width: "200px" }} />
                <Placeholder bg={isDarkTheme ? "dark" : "light"} as="div" animation="wave" style={{ height: "28px", width: "200px" }} />
            </div>
        </div>
    )
}