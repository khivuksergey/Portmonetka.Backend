import { NavLink } from "react-router-dom";
import { useLogin } from "../Hooks";
import { IconTwoCoins, IconDashboard, IconWallet, IconCash, IconCategory, IconLogout } from "../Common/Icons";

interface ISidebarProps {
    className: string
    onClose: () => void
}

export default function Sidebar({ className, onClose }: ISidebarProps) {
    const { handleLogout } = useLogin();
    return (
        <div className={className}>
            <div className="logo prevent-select" onClick={onClose}>
                <button type="button" className="logo__button" >
                    <IconTwoCoins size={40} color={"var(--primary)"} />
                </button>

                <div className="logo__text">
                    Portmonetka
                </div>
            </div>

            <section className="sidebar__nav-links">
                <NavLink to="/" className="nav-link">
                    <IconDashboard size={32} className="nav-link__icon" />
                    <div className="nav-link__text">
                        Dashboard
                    </div>
                </NavLink>
                <NavLink to="/wallets" className="nav-link">
                    <IconWallet size={32} className="nav-link__icon" />
                    <div className="nav-link__text">
                        Wallets
                    </div>
                </NavLink>
                <NavLink to="/transactions" className="nav-link">
                    <IconCash size={32} className="nav-link__icon" />
                    <div className="nav-link__text">
                        Transactions
                    </div>
                </NavLink>
                <NavLink to="/categories" className="nav-link">
                    <IconCategory size={32} className="nav-link__icon" />
                    <div className="nav-link__text">
                        Categories
                    </div>
                </NavLink>
            </section>

            <button
                type="button"
                className="nav-link"
                style={{
                    position: "absolute",
                    width: "calc(100% - 0.5rem)",
                    bottom: "0",
                    margin: "0.75rem 0.25rem",
                    textAlign: "left"
                }}
                onClick={handleLogout}
            >
                <IconLogout size={32} className="nav-link__icon"/>
                <div className="nav-link__text">
                        Logout
                    </div>
            </button>
        </div>
    );
}