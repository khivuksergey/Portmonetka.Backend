import { ICurrencyBalance } from "../DataTypes";
import CurrencyToSign from "../Utilities/CurrencyToSignConverter";
import MoneyToLocaleString from "../Utilities/MoneyToLocaleString";
import { MdTrendingUp, MdTrendingDown } from "react-icons/md";


interface BalanceBubbleProps {
    balance: ICurrencyBalance
}

export default function BalanceBubble({ balance }: BalanceBubbleProps) {
    return (
        <div className="balance">
            <div className="balance-content">
                <div className="currency-sign-container" key={balance.currency}>
                    <img
                        src="./superellipse-64x64.svg"
                        width={48}
                        alt="Superellipse"
                        className="currencySuperEllispe" />

                    <h3 className="text-overlay">
                        {CurrencyToSign(balance.currency)}
                    </h3>
                </div>

                <div className="balance-info">
                    <div className="balance-progress">
                        <h6>+{balance.income}</h6>

                        <div className="balance-trend">
                            {
                                balance.incomeTrend > 0 ?
                                    <MdTrendingUp color="lightgreen" />
                                    :
                                    <MdTrendingDown color="red" />
                            }
                            <h6>{balance.incomeTrend > 0 ? '+' + balance.incomeTrend : '–' + Math.abs(balance.incomeTrend)}%</h6>
                        </div>
                    </div>

                    <h3 key={balance.currency} style={{ alignSelf: "flex-end" }}>
                        {MoneyToLocaleString(balance.sum)}
                    </h3>

                    <div className="balance-progress">
                        <h6>{balance.outcome}</h6>

                        <div className="balance-trend">
                            {
                                balance.outcomeTrend > 0 ?
                                    <MdTrendingUp color="red" />
                                    :
                                    <MdTrendingDown color="lightgreen" />
                            }
                            <h6>{balance.outcomeTrend > 0 ? '+' + balance.outcomeTrend : '–' + Math.abs(balance.outcomeTrend)}%</h6>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
