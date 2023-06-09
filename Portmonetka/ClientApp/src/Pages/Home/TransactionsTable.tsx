import { useEffect, useState } from "react";
import useTransaction from "../../Hooks/useTransaction";
import useCategory from "../../Hooks/useCategory";
import MoneyToLocaleString from "../../Utilities/MoneyToLocaleString";
import { format, utcToZonedTime } from "date-fns-tz";
import { Table } from "react-bootstrap";
import { MdDelete, MdRestoreFromTrash } from "react-icons/md";

interface TransactionsTableProps {
    walletId: number
    getTransactionsSum: (sum: number) => void
}

export default function TransactionsTable({ walletId, getTransactionsSum }: TransactionsTableProps) {
    const { transactions, transactionsSum, handleAddTransactions, handleDeleteMultipleTransactions, refreshTransactions, dataFetched: transactionsLoaded } = useTransaction(walletId);

    const { categories } = useCategory();

    const [transactionsToDelete, setTransactionsToDelete] = useState<number[]>([]);

    useEffect(() => {
        returnTransactionsSum(transactionsSum);
    }, [transactionsSum]);

    const returnTransactionsSum = (transactionsSum: number) => {
        getTransactionsSum(transactionsSum);
    }

    const handleDeleteTransaction = (id: number) => {
        setTransactionsToDelete([...transactionsToDelete, id]);
    }

    const handleRestoreTransaction = (id: number) => {
        setTransactionsToDelete(prev => prev.filter(t => t !== id));
    }

    const isDisabledClassName = (id: number) => {
        return (transactionsToDelete.includes(id) ? " text-disabled" : "");
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

                    <div>Loading</div>

                    :

                    (<Table className="mt-4 table table-dark mb-0 prevent-select" size="sm" hover>
                        <tbody>
                            {
                                transactions
                                    .map(t =>
                                        <tr key={t.id}>
                                            <td className={"text-light text-right no-stretch" + isDisabledClassName(t.id!)}><b>
                                                {t.amount > 0 ?
                                                    `+${MoneyToLocaleString(t.amount)}` :
                                                    MoneyToLocaleString(t.amount)}
                                            </b></td>
                                            <td className={"text-light transaction-name d-inlineblock text-truncate" + isDisabledClassName(t.id!)}>{t.description}</td>
                                            <td className={"text-light" + isDisabledClassName(t.id!)} >{categories.length ? categories.find(c => c.id === t.categoryId)!.name : ''}</td>
                                            <td className={"text-light text-right no-stretch" + isDisabledClassName(t.id!)}>{formatUtcToLocal(t.date, 'dd.MM.yyyy')}</td>
                                            <td style={{ width: 0 }}>
                                                {
                                                    !transactionsToDelete.includes(t.id!) ?
                                                        <button className="btn btn-delete d-flex" onClick={() => handleDeleteTransaction(t.id!)}>
                                                            <MdDelete size={18} />
                                                        </button>
                                                        :
                                                        <button className="btn btn-restore d-flex" onClick={() => handleRestoreTransaction(t.id!)}>
                                                            <MdRestoreFromTrash size={18} />
                                                        </button>
                                                }
                                            </td>
                                        </tr>
                                    )
                            }
                        </tbody>
                    </Table>)
            }
        </>
    )
}