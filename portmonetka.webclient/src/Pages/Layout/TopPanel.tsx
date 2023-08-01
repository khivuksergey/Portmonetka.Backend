import { useContext } from "react";
import { useLogin } from "../../Hooks";
import { ThemeContext } from "../../Context/ThemeContext";
import { AuthContext } from "../../Context/AuthContext";
import { IAuthContext, IThemeContext } from "../../Common/DataTypes";
import { IconLogout, IconPortmonetka, IconTheme } from "../../Common/Icons";

interface ITopPanelProps {
    onMenuButtonClick: () => void
}

export default function TopPanel({ onMenuButtonClick }: ITopPanelProps) {
    const { handleLogout } = useLogin();
    const { userName } = useContext<IAuthContext>(AuthContext);
    const { isDarkTheme, setIsDarkTheme } = useContext<IThemeContext>(ThemeContext);

    const handleChangeTheme = () => {
        setIsDarkTheme(!isDarkTheme);
    }

    return (
        <>
            <div className="top-panel" >
                <div className="logo prevent-select" onClick={onMenuButtonClick}>
                    <button type="button" className="logo__button">
                        <IconPortmonetka size={40} className="icon-portmonetka" />
                    </button>

                    <div className="logo__text">
                        Portmonetka
                    </div>
                </div>

                <section className="top-panel__options">
                    <button type="button" className="button--options" onClick={handleChangeTheme} >
                        <IconTheme size={32} isDarkMode={isDarkTheme} />
                    </button>

                    <button type="button" className="button--options" onClick={handleLogout} >
                        <IconLogout size={32} className=" " isDarkMode={isDarkTheme} />
                    </button>

                    <div className="top-panel__username prevent-select">
                        {userName}
                    </div>
                </section>

            </div>
        </>
    )
}