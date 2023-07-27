import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { IThemeContext } from "../../Common/DataTypes";
import { ThemeContext } from "../../Context/ThemeContext";
import * as Icons from "../../Common/Icons";

interface ISidebarProps {
    className: string
}

export default function Sidebar({ className }: ISidebarProps) {
    const { isDarkTheme } = useContext<IThemeContext>(ThemeContext);

    return (
        <div className={className}>
            <section className="sidebar__nav-links">
                <NavLink to="/" className="nav-link">
                    <Icons.IconOverview size={32} className="nav-link__icon" isDarkMode={isDarkTheme} />
                    <div className="nav-link__text">
                        Overview
                    </div>
                </NavLink>
                <NavLink to="/wallets" className="nav-link">
                    <Icons.IconWallets size={32} className="nav-link__icon" isDarkMode={isDarkTheme} />
                    <div className="nav-link__text">
                        Wallets
                    </div>
                </NavLink>
                <NavLink to="/transactions" className="nav-link">
                    <Icons.IconTransactions size={32} className="nav-link__icon" isDarkMode={isDarkTheme} />
                    <div className="nav-link__text">
                        Transactions
                    </div>
                </NavLink>
                <NavLink to="/categories" className="nav-link">
                    <Icons.IconCategories size={32} className="nav-link__icon" isDarkMode={isDarkTheme} />
                    <div className="nav-link__text">
                        Categories
                    </div>
                </NavLink>
            </section>
        </div>
    );
}