import { useState } from "react";
import useCategory from "../../Hooks/useCategory";
import { ITransaction } from "../../DataTypes";
import { differenceInMinutes, parseISO } from "date-fns";
import { format, utcToZonedTime } from "date-fns-tz";
import MoneyToLocaleString from "../../Utilities/MoneyToLocaleString";
import { Table } from "react-bootstrap";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { MdDelete, MdRestoreFromTrash } from "react-icons/md";

interface TransactionsProps {
    transactions: ITransaction[]
    onDeleteTransaction?: (id: number) => void
    onRestoreTransaction?: (id: number) => void
    isFullMode: boolean
}

export default function Transactions({ transactions, onDeleteTransaction, onRestoreTransaction, isFullMode }: TransactionsProps) {
    const { categories } = useCategory();
    const [transactionsToDelete, setTransactionsToDelete] = useState<number[]>([]);

    const handleDeleteTransaction = (id: number) => {
        if (onDeleteTransaction === undefined)
            return;

        onDeleteTransaction!(id);
        setTransactionsToDelete([...transactionsToDelete, id]);
    }

    const handleRestoreTransaction = (id: number) => {
        if (onRestoreTransaction === undefined)
            return;

        onRestoreTransaction(id);
        setTransactionsToDelete(prev => prev.filter(t => t !== id));
    }

    const formatUtcToLocal = (utcDate: Date, formatString: string): string => {
        const timeZoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const localDate = utcToZonedTime(utcDate, timeZoneName);
        const formattedDate = format(localDate, formatString);
        return formattedDate;
    }

    const sortDatesDesc = (a: Date, b: Date) => {
        return differenceInMinutes(parseISO(b.toString()), parseISO(a.toString()));
    }

    const isDisabledClassName = (id: number) => {
        return (transactionsToDelete.includes(id) ? " text-disabled" : "");
    }

    return (
        <>
            {
                !isFullMode ?
                    (<>
                        <table className="table mb-0 prevent-select" /*size="sm"*/>
                            <tbody>
                                {
                                    transactions
                                        .sort((a, b) => sortDatesDesc(a.date, b.date))
                                        .slice(0, 3)
                                        .map(t =>
                                            <tr key={t.id}>
                                                <td className="text-right no-stretch">
                                                    {t.amount > 0 ?
                                                        `+${MoneyToLocaleString(t.amount)}` :
                                                        MoneyToLocaleString(t.amount)}
                                                </td>
                                                <td className="transaction-name d-inlineblock text-truncate">{t.description}</td>
                                                <td className="text-right no-stretch">{formatUtcToLocal(t.date, 'dd.MM.yyyy')}</td>
                                            </tr>
                                        )
                                }
                            </tbody>
                        </table>
                        {transactions.length > 3 ? <BiDotsHorizontalRounded className="transactions-dots" /> : null}
                    </>)

                    :

                    (<Table className="mt-4 table mb-0 prevent-select" size="sm" hover={isFullMode}>
                        <tbody>
                            {
                                transactions
                                    .sort((a, b) => sortDatesDesc(a.date, b.date))
                                    .map(t =>
                                        <tr key={t.id}>
                                            <td className={"text-dark text-right no-stretch" + isDisabledClassName(t.id!)}><b>
                                                {t.amount > 0 ?
                                                    `+${MoneyToLocaleString(t.amount)}` :
                                                    MoneyToLocaleString(t.amount)}
                                            </b></td>
                                            <td className={"text-dark transaction-name d-inlineblock text-truncate" + isDisabledClassName(t.id!)}>{t.description}</td>
                                            <td className={"text-dark" + isDisabledClassName(t.id!)} >{categories.length ? categories.find(c => c.id === t.categoryId)!.name : ''}</td>
                                            <td className={"text-dark text-right no-stretch" + isDisabledClassName(t.id!)}>{formatUtcToLocal(t.date, 'dd.MM.yyyy')}</td>
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