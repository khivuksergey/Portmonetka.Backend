import { useEffect, useState, useMemo } from "react";
import Spinner from "react-bootstrap/Spinner";
import useTransaction from "../../Hooks/useTransaction";
import useCategory from "../../Hooks/useCategory";
import { utcToZonedTime } from "date-fns-tz";
import { MdDelete, MdRestoreFromTrash } from "react-icons/md";

import {
    ColDef,
    IDateFilterParams,
    INumberFilterParams,
    ITextFilterParams,
    ValueFormatterParams
} from "ag-grid-community";

import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./ag-theme-portmonetka.css";
import { ICategory } from "../../DataTypes";


interface TransactionsTableProps {
    walletId: number
    getTransactionsSum: (sum: number) => void
}

interface ITransactionsData {
    id: number
    description: string
    amount: number
    date: Date
    categoryId?: number
    categoryName?: string
    isExpense?: boolean
}

export default function TransactionsTable({ walletId, getTransactionsSum }: TransactionsTableProps) {
    const {
        transactions,
        transactionsSum,
        handleAddTransactions,
        handleDeleteMultipleTransactions,
        refreshTransactions,
        dataFetched: transactionsLoaded
    } = useTransaction(walletId);

    const {
        categories,
        dataFetched: categoriesLoaded
    } = useCategory();

    const [transactionsData, setTransactionsData] = useState<ITransactionsData[]>();

    useEffect(() => {
        if (!transactionsLoaded && !categoriesLoaded)
            return;

        setTransactionsData(() =>
            transactions.map(t => {
                const category: ICategory | undefined = categories.find(c => c.id === t.categoryId);

                return {
                    id: t.id!,
                    description: t.description,
                    amount: t.amount,
                    date: t.date,
                    categoryId: t.categoryId ?? undefined,
                    categoryName: category?.name,
                    isExpense: category?.isExpense
                }
            }));
    }, [transactionsLoaded, categoriesLoaded]);

    var dateFilterParams: IDateFilterParams = {
        comparator: (filterLocalDateAtMidnight: Date, cellValue: string) => {
            var dateAsString = cellValue;
            if (dateAsString == null) return -1;
            var dateParts = dateAsString.split('/');
            var cellDate = new Date(
                Number(dateParts[2]),
                Number(dateParts[1]) - 1,
                Number(dateParts[0])
            );
            if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
                return 0;
            }
            if (cellDate < filterLocalDateAtMidnight) {
                return -1;
            }
            if (cellDate > filterLocalDateAtMidnight) {
                return 1;
            }
            return 0;
        },
        //minValidYear: 2000,
        //maxValidYear: 2021,
        //inRangeFloatingFilterDateFormat: 'Do MMM YYYY',
    };

    const defaultColDef = useMemo<ColDef>(() => {
        return {
            suppressMenu: true,
            resizable: true,
            floatingFilter: true,
        };
    }, []);

    const columnDefs: ColDef[] = useMemo(() => [
        {
            field: 'amount',
            cellDataType: 'number',
            sortable: true,
            filter: 'agNumberColumnFilter',
            filterParams: {
                buttons: ['reset', 'apply'],
                closeOnApply: true
            } as INumberFilterParams,
            width: 150,
            minWidth: 150,
            /*cellStyle: { textAlign: 'right' }*/
        },
        {
            field: 'description',
            cellDataType: 'text',
            sortable: true,
            filter: true,
            filterParams: {
                buttons: ['reset', 'apply'],
                closeOnApply: true
            } as ITextFilterParams,
            width: 370
        },
        {
            field: 'categoryName',
            headerName: 'Category',
            cellDataType: 'text',
            sortable: true,
            filter: true,
            filterParams: {
                buttons: ['reset', 'apply'],
                closeOnApply: true
            } as ITextFilterParams,
            //width: 200
        },
        {
            field: 'date',
            cellDataType: 'date',
            sortable: true,
            filter: 'agDateColumnFilter',
            filterParams: {
                ...dateFilterParams,
                buttons: ['reset', 'apply'],
                closeOnApply: true,
                browserDatePicker: false,
            } as IDateFilterParams,
            minWidth: 105,
            valueFormatter: ({ value }: ValueFormatterParams) => UtcToLocalString(value)
        }
    ], []);

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

    //const UtcToLocal = (utcDate: Date): Date => {
    //    const timeZoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;
    //    const localDate = utcToZonedTime(utcDate, timeZoneName);
    //    return localDate;
    //}

    const UtcToLocalString = (utcDate: Date): string => {
        const timeZoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const localDate = utcToZonedTime(utcDate, timeZoneName);
        return localDate.toLocaleDateString();
    }

    return (
        <>
            {!transactionsLoaded ?

                <Spinner size="sm" animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>

                :
                <div className="transactions-table-container mb-4">
                    <AgGridReact<ITransactionsData>
                        className="ag-theme-alpine-dark ag-theme-portmonetka"
                        rowData={transactionsData}
                        defaultColDef={defaultColDef}
                        columnDefs={columnDefs}
                        rowSelection={'multiple'}
                        rowMultiSelectWithClick={true}
                    >
                    </AgGridReact>
                </div>
            }
        </>
    )
}

/*old table*/
//(<Table className="mt-4 table table-dark mb-0 prevent-select" size="sm" hover>
//    <tbody>
//        {
//            transactions
//                .map(t =>
//                    <tr key={t.id}>
//                        <td className={"text-light text-right no-stretch" + isDisabledClassName(t.id!)}>
//                            <b>
//                                {t.amount > 0 ?
//                                    `+${MoneyToLocaleString(t.amount)}` :
//                                    MoneyToLocaleString(t.amount)}
//                            </b>
//                        </td>

//                        <td className={"text-light transaction-name d-inlineblock text-truncate" + isDisabledClassName(t.id!)}>
//                            {t.description}
//                        </td>

//                        <td className={"text-light" + isDisabledClassName(t.id!)} >
//                            {categories.length ? categories.find(c => c.id === t.categoryId)!.name : ''}
//                        </td>

//                        <td className={"text-light text-right no-stretch" + isDisabledClassName(t.id!)}>
//                            {UtcToLocal(t.date).toLocaleDateString()}
//                        </td>

//                        <td style={{ width: 0 }}>
//                            {
//                                !transactionsToDelete.includes(t.id!) ?
//                                    <button className="btn btn-delete d-flex" onClick={() => handleDeleteTransaction(t.id!)}>
//                                        <MdDelete size={18} />
//                                    </button>
//                                    :
//                                    <button className="btn btn-restore d-flex" onClick={() => handleRestoreTransaction(t.id!)}>
//                                        <MdRestoreFromTrash size={18} />
//                                    </button>
//                            }
//                        </td>
//                    </tr>
//                )
//        }
//    </tbody>
//</Table>)