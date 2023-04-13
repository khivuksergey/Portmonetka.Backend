import { useEffect } from "react";
import useTransaction from "../../Hooks/useTransaction";
import useCategory from "../../Hooks/useCategory";
import { IWallet } from "../../DataTypes";
import { format } from "date-fns";
import { Table } from "react-bootstrap";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { MdDelete } from "react-icons/md";

interface TransactionsProps {
    wallet: IWallet
    calcTransactionsSum: (value: number) => void
    isFullMode: boolean
}

export default function Transactions({ wallet, calcTransactionsSum, isFullMode }: TransactionsProps) {
    const { transactions, handleDeleteTransaction } = useTransaction(wallet.id!)
    const { categories } = useCategory();

    //useMemo for future
    useEffect(() => {
        calculateBalance();
    }, [transactions])

    const calculateBalance = () => {
        let transactionsSum = transactions.reduce((sum, val) => sum + val.amount, 0);
        calcTransactionsSum(transactionsSum);
    }

    const onDeleteTransaction = (id: number) => {
        if (window.confirm("This item will be immediately deleted. Do you want to proceed?") === true) {
            handleDeleteTransaction(id);
        }
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
                                        .sort((a, b) => b.date.valueOf() - a.date.valueOf())
                                        .slice(0, 5)
                                        .map(t =>
                                            <tr key={t.id}>
                                                <td className="text-right no-stretch">{t.amount > 0 ? '+' + t.amount : t.amount}</td>
                                                <td className="transaction-name d-inlineblock text-truncate">{t.name}</td>
                                                <td className="text-right no-stretch">{format(t.date.valueOf(), 'dd.MM.y')}</td>
                                            </tr>
                                        )
                                }
                            </tbody>
                        </table>
                        {transactions.length > 5 ? <BiDotsHorizontalRounded className="transactions-dots" /> : null}
                    </>)

                    :

                    (<Table className="mt-4 table mb-0 prevent-select" size="sm" hover={isFullMode}>
                        <tbody>
                            {
                                transactions
                                    .sort((a, b) => b.date.valueOf()- a.date.valueOf())
                                    .map(t =>
                                        <tr key={t.id}>
                                            <td className="text-dark text-right no-stretch"><b>{t.amount > 0 ? '+' + t.amount : t.amount}</b></td>
                                            <td className="text-dark transaction-name d-inlineblock text-truncate">{t.name}</td>
                                            <td className="text-dark">{categories.length ? categories.find(c => c.id === t.categoryId)!.name : ''}</td>
                                            <td className="text-dark text-right no-stretch">{format(t.date.valueOf(), 'dd.MM.y')}</td>
                                            <td style={{ width: 0 }}>
                                                <button className="btn btn-delete d-flex" onClick={() => onDeleteTransaction(t.id!)}>
                                                    <MdDelete size={18} />
                                                </button>
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