import { NavLink } from "react-router-dom";
import { GiTwoCoins } from "react-icons/gi";
import { HiWallet } from "react-icons/hi2";
import { IoIosCash } from "react-icons/io";
import { MdCategory, MdSpaceDashboard } from "react-icons/md";

interface ISidebarProps {
    className: string
    onClose: () => void
}

export default function Sidebar({ className, onClose }: ISidebarProps) {
    return (
        <div className={className}>
            <div className="sidebar__logo">
                <div className="flexbox logo prevent-select" onClick={onClose}>
                    <button className="logo__button" >
                        <GiTwoCoins size={40} color={"var(--primary)"}/>
                    </button>

                    <div className="logo__text">
                        Portmonetka
                    </div>
                </div>
            </div>

            <section className="sidebar__nav-links">
                <NavLink to="/" className="nav-link">
                    <MdSpaceDashboard size={32} className="nav-link__icon" />
                    <div className="nav-link__text">
                        Dashboard
                    </div>
                </NavLink>
                <NavLink to="/wallets" className="nav-link">
                    <HiWallet size={32} className="nav-link__icon" />
                    <div className="nav-link__text">
                        Wallets
                    </div>
                </NavLink>
                <NavLink to="/transactions" className="nav-link">
                    <IoIosCash size={32} className="nav-link__icon" />
                    <div className="nav-link__text">
                        Transactions
                    </div>
                </NavLink>
                <NavLink to="/categories" className="nav-link">
                    <MdCategory size={32} className="nav-link__icon" />
                    <div className="nav-link__text">
                        Categories
                    </div>
                </NavLink>
            </section>
        </div>
    );
}