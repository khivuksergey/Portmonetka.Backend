import { useContext } from "react";
import { Placeholder } from "react-bootstrap";
import { IThemeContext } from "../../../Common/DataTypes";
import { ThemeContext } from "../../../Context/ThemeContext";


export default function WalletsPlaceholder() {
    const { isDarkTheme } = useContext<IThemeContext>(ThemeContext);

    return (
        <section>
            <div>
                <h3>Wallets</h3>
            </div>


            <div className="wallets-placeholder mt-3">
                {
                    Array.from({ length: 3 }, (_, index) => (
                        <Placeholder bg={isDarkTheme ? "dark" : "light"} as="div" animation="wave" className="wallet-placeholder" key={index} />
                    ))
                }
            </div>
        </section>
    )
}