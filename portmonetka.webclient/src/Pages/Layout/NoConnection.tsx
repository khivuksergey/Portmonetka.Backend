import { useContext } from "react";
import { IconServerOff } from "../../Common/Icons";
import { IThemeContext } from "../../Common/DataTypes";
import { ThemeContext } from "../../Context/ThemeContext";

export default function NoConnection() {
    const {isDarkTheme} = useContext<IThemeContext>(ThemeContext);

    return(
        <div className="d-flex flex-column align-items-center mt-5">
            <IconServerOff
                size={128}
                fill="transparent"
                className="mb-4"
                style={{opacity: isDarkTheme ? "0.5" : "0.23"}}
            />
            <h3
                style={{
                    color: "var(--placeholder-grey)",
                    textAlign: "center"
                }}
            >
                Unfortunately, there are some problems with the server.<br></br>
                Please, try later.
            </h3>
        </div>
    )
}