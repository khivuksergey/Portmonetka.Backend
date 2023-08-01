import { useContext } from "react";
import { Placeholder } from "react-bootstrap";
import { IThemeContext } from "../../../Common/DataTypes";
import { ThemeContext } from "../../../Context/ThemeContext";

export default function LatestTransactionsPreviewPlaceholder() {
    const { isDarkTheme } = useContext<IThemeContext>(ThemeContext);

    return (
        <div className="mt-2">
            {
                Array.from({ length: 8 }, (_, index) => (
                    <div key={index} className="d-flex gap-3 mb-3">
                        <Placeholder bg={isDarkTheme ? "dark" : "light"} as="div" animation="wave" style={{ height: "1.5rem", width: "8rem" }} />
                        <Placeholder bg={isDarkTheme ? "dark" : "light"} as="div" animation="wave" style={{ height: "1.5rem", width: "100%" }} />
                        <Placeholder bg={isDarkTheme ? "dark" : "light"} as="div" animation="wave" style={{ height: "1.5rem", width: "10rem" }} />
                    </div>
                ))
            }
            <div className="transactions-preview-blur"></div>
        </div>
    )
}