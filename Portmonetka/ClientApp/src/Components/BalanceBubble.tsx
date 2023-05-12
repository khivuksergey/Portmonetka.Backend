import { ICurrencyBalance } from "../DataTypes";
import CurrencyToSign from "../Utilities/CurrencyToSignConverter";
import MoneyToLocaleString from "../Utilities/MoneyToLocaleString";
import { MdTrendingUp, MdTrendingDown, MdTrendingFlat } from "react-icons/md";


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
                            <h6>
                                {
                                    balance.incomeTrend > 0 ?
                                        '+' + balance.incomeTrend
                                        :
                                        balance.incomeTrend < 0 ?
                                            '–' + Math.abs(balance.incomeTrend)
                                            :
                                            0
                                }%
                            </h6>
                            {
                                balance.incomeTrend > 0 ?
                                    <MdTrendingUp color="lightgreen" />
                                    :
                                    balance.incomeTrend < 0 ?
                                        <MdTrendingDown color="red" />
                                        :
                                        <MdTrendingFlat color="grey" />
                            }
                        </div>
                    </div>

                    <h3 key={balance.currency} style={{ alignSelf: "flex-end" }}>
                        {MoneyToLocaleString(balance.sum)}
                    </h3>

                    <div className="balance-progress">
                        <h6>{balance.outcome}</h6>

                        <div className="balance-trend">
                            <h6>
                                {
                                    balance.outcomeTrend > 0 ?
                                        '+' + balance.outcomeTrend
                                        :
                                        balance.outcomeTrend < 0 ?
                                            '–' + Math.abs(balance.outcomeTrend)
                                            :
                                            0
                                }%
                            </h6>
                            {
                                balance.outcomeTrend > 0 ?
                                    <MdTrendingUp color="red" />
                                    :
                                    balance.outcomeTrend < 0 ?
                                        <MdTrendingDown color="lightgreen" />
                                        :
                                        <MdTrendingFlat color="grey" />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
