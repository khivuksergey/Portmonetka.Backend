import { useContext } from "react";
import { useLogin } from "../../Hooks";
import { ThemeContext } from "../../Context/ThemeContext";
import { AuthContext } from "../../Context/AuthContext";
import { IAuthContext, IThemeContext, TTheme } from "../../Common/DataTypes";
import { IconLogout, IconPortmonetka, IconTheme } from "../../Common/Icons";

interface ITopPanelProps {
    onMenuButtonClick: () => void
}

export default function TopPanel({ onMenuButtonClick }: ITopPanelProps) {
    const { handleLogout } = useLogin();
    const { userName } = useContext<IAuthContext>(AuthContext);
    const { theme, setTheme, isDarkTheme } = useContext<IThemeContext>(ThemeContext);
    const themeOptions: TTheme[] = ["dark", "light", "system"];

    const handleChangeTheme = () => {
        const currentIndex = themeOptions.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themeOptions.length;
        setTheme(themeOptions[nextIndex]);
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
                        <IconTheme size={32} theme={theme} />
                    </button>

                    <button type="button" className="button--options" onClick={handleLogout} >
                        <IconLogout size={32} />
                    </button>

                    <div className="top-panel__username prevent-select">
                        {userName}
                    </div>
                </section>

            </div>
        </>
    )
}