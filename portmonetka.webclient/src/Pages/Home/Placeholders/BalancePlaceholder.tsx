import { useContext } from "react";
import { Placeholder } from "react-bootstrap";
import { IThemeContext } from "../../../Common/DataTypes";
import { ThemeContext } from "../../../Context/ThemeContext";


export default function BalancePlaceholder() {
    const { isDarkTheme } = useContext<IThemeContext>(ThemeContext);

    return (
        <section className="mb-4">
            <h3>Balance</h3>

            <div className="mt-3 d-flex gap-4">
                {
                    Array.from({ length: 3 }, (_, index) => (
                        <Placeholder bg={isDarkTheme ? "dark" : "light"} as="div" animation="wave" className="balance-placeholder" key={index} />
                    ))
                }
            </div>
        </section>
    )
}