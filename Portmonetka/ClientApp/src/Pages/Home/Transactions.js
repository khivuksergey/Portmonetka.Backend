import { useEffect } from "react";
import useTransactions from "../../Hooks/useTransactions";
import useCategories from "../../Hooks/useCategories";
import { format, parseISO } from "date-fns";
import { Table } from "react-bootstrap";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { MdDelete } from "react-icons/md";

function Transactions({ wallet, calcTransactionsSum, isFullMode }) {
    const { transactions, deleteTransaction } = useTransactions(wallet)
    const categories = useCategories();

    //useMemo for future
    useEffect(() => {
        calculateBalance();
    }, [transactions])

    const calculateBalance = () => {
        let transactionsSum = transactions.reduce((sum, val) => sum + val.Amount, 0);
        calcTransactionsSum(transactionsSum);
    }

    const handleDeleteTransaction = (id) => {
        if (window.confirm("This item will be immediately deleted. Do you want to proceed?") === true) {
            deleteTransaction(id);
        }
    }

    return (
        <>
            {
                !isFullMode ?
                    (<>
                        <table className="table mb-0 prevent-select" size="sm">
                            <tbody>
                                {
                                    transactions
                                        .sort((a, b) => Date.parse(b.Date) - Date.parse(a.Date))
                                        .slice(0, 5)
                                        .map(t =>
                                            <tr key={t.Id}>
                                                <td className="text-right no-stretch">{t.Amount > 0 ? '+' + t.Amount : t.Amount}</td>
                                                <td className="transaction-name d-inlineblock text-truncate">{t.Name}</td>
                                                <td className="text-right no-stretch">{format(parseISO(t.Date), 'dd.MM.y')}</td>
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
                                    .sort((a, b) => Date.parse(b.Date) - Date.parse(a.Date))
                                    .map(t =>
                                        <tr key={t.Id}>
                                            <td className="text-dark text-right no-stretch"><b>{t.Amount > 0 ? '+' + t.Amount : t.Amount}</b></td>
                                            <td className="text-dark transaction-name d-inlineblock text-truncate">{t.Name}</td>
                                            <td className="text-dark">{categories.length ? categories.find(c => c.Id === t.CategoryId).Name : ''}</td>
                                            <td className="text-dark text-right no-stretch">{format(parseISO(t.Date), 'dd.MM.y')}</td>
                                            <td style={{ width: 0 }}>
                                                <button className="btn btn-delete d-flex" onClick={() => handleDeleteTransaction(t.Id)}>
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

export default Transactions;