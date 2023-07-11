import React, { useEffect, useImperativeHandle } from "react";
import { LatestTransactionsPreviewPlaceholder } from "../Placeholders";
import { useTransaction } from "../../../Hooks";
import { MoneyToLocaleString } from "../../../Utilities";
import { format, utcToZonedTime } from "date-fns-tz";

interface LatestTransactionsPreviewProps {
    walletId: number
    getTransactionsSum: (sum: number) => void
}

export interface LatestTransactionsPreviewRef {
    refreshTransactions: () => void;
}

const LatestTransactionsPreview = React.forwardRef<
    LatestTransactionsPreviewRef | undefined,
    LatestTransactionsPreviewProps
>(function LatestTransactionsPreview({ walletId, getTransactionsSum }, ref) {

    const {
        transactions,
        refreshTransactions,
        dataFetched: transactionsLoaded
    } = useTransaction(walletId, 6);

    const { transactionsSum, refreshTransactions: refreshAllTransactions } = useTransaction(walletId);

    useEffect(() => {
        returnTransactionsSum(transactionsSum);
    }, [transactionsSum]);

    const triggerRefreshTransactions = () => {
        refreshTransactions();
        refreshAllTransactions();
    }

    useImperativeHandle(ref, () => ({
        refreshTransactions: triggerRefreshTransactions
    }));

    const returnTransactionsSum = (transactionsSum: number) => {
        getTransactionsSum(transactionsSum);
    }

    const formatUtcToLocal = (utcDate: Date, formatString: string): string => {
        const timeZoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const localDate = utcToZonedTime(utcDate, timeZoneName);
        const formattedDate = format(localDate, formatString);
        return formattedDate;
    }

    return (
        <>
            {
                !transactionsLoaded ?
                    <LatestTransactionsPreviewPlaceholder />
                    :
                    (<>
                        {
                            transactions.length === 0 ?
                                <div className="mt-3 d-flex justify-content-center">
                                    <h6 style={{ textAlign: "center" }}>Your transactions will be displayed here</h6>
                                </div>
                                :
                                <table className="table mb-0 prevent-select">
                                    <tbody>
                                        {
                                            transactions
                                                .map(t =>
                                                    <tr key={t.id}>
                                                        <td className="text-right no-stretch">
                                                            {t.amount > 0 ?
                                                                `+${MoneyToLocaleString(t.amount)}` :
                                                                MoneyToLocaleString(t.amount)}
                                                        </td>
                                                        <td className="d-inlineblock max-width-100 text-truncate">{t.description}</td>
                                                        <td className="text-right no-stretch">{formatUtcToLocal(t.date, "dd.MM.yyyy")}</td>
                                                    </tr>
                                                )
                                        }
                                    </tbody>
                                </table>
                        }

                        <div className="transactions-preview-blur" />
                    </>)
            }
        </>
    )
})

export default LatestTransactionsPreview;