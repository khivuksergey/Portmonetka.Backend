import { ICurrencyBalance } from "../../../Common/DataTypes";
import { CurrencyToSign, MoneyToLocaleString } from "../../../Utilities";
import { IconTrendingUp, IconTrendingDown, IconTrendingFlat } from "../../../Common/Icons";


interface BalanceBubbleProps {
    balance: ICurrencyBalance
}

export default function BalanceBubble({ balance }: BalanceBubbleProps) {
    return (
        <div className="balance prevent-select">
            <div className="balance__currency-sign" key={balance.currency}>
                <img
                    src="./superellipse-64x64.svg"
                    width={48}
                    alt="Superellipse"
                    className="balance__currency-sign__icon" />

                <h3 className="balance__currency-sign__text">
                    {CurrencyToSign(balance.currency)}
                </h3>
            </div>

            <div className="balance__info">
                <div className="balance__info__stats">
                    <h6>+{balance.income}</h6>

                    <div className="balance__info__stats__trend">
                        <h6>
                            <span>
                                {
                                    balance.incomeTrend > 0 ?
                                        `+${balance.incomeTrend}`
                                        :
                                        balance.incomeTrend < 0 ?
                                            `–${Math.abs(balance.incomeTrend)}`
                                            :
                                            0
                                }%
                            </span>
                        </h6>
                        <span>
                            {
                                balance.incomeTrend > 0 ?
                                    <IconTrendingUp color="var(--trend-green)" />
                                    :
                                    balance.incomeTrend < 0 ?
                                        <IconTrendingDown color="var(--trend-red)" />
                                        :
                                        <IconTrendingFlat color="var(--trend-grey)" />
                            }
                        </span>
                    </div>
                </div>

                <h3 key={balance.currency} style={{ alignSelf: "flex-end" }}>
                    {MoneyToLocaleString(balance.sum)}
                </h3>

                <div className="balance__info__stats">
                    <h6>{balance.outcome}</h6>

                    <div className="balance__info__stats__trend">
                        <h6>
                            <span>
                                {
                                    balance.outcomeTrend > 0 ?
                                        `+${balance.outcomeTrend}`
                                        :
                                        balance.outcomeTrend < 0 ?
                                            `–${Math.abs(balance.outcomeTrend)}`
                                            :
                                            0
                                }%
                            </span>
                        </h6>
                        <span>
                            {
                                balance.outcomeTrend > 0 ?
                                    <IconTrendingUp color="var(--trend-red)" />
                                    :
                                    balance.outcomeTrend < 0 ?
                                        <IconTrendingDown color="var(--trend-green)" />
                                        :
                                        <IconTrendingFlat color="var(--trend-grey)" />
                            }
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
