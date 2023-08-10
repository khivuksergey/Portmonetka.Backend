import { useEffect, useState, useMemo, useRef, forwardRef, useImperativeHandle, useContext } from "react";
import { TransactionsTablePlaceholder } from "../Placeholders";
import { ICategory, IThemeContext, ITransaction } from "../../../Common/DataTypes";
import { useCategory, useTransaction } from "../../../Hooks";
import { UtcDateToLocalString } from "../../../Utilities";
import { IconDelete, IconRestore } from "../../../Common/Icons";

import {
    CellValueChangedEvent,
    ColDef,
    ICellRendererParams,
    IDateFilterParams,
    ValueFormatterParams
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./ag-theme-portmonetka.css";
import { ThemeContext } from "../../../Context/ThemeContext";

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
    isDeleted: boolean
}

export interface TransactionsTableRef {
    updateTransactions: () => Promise<boolean>;
    getTransactionsCount: () => number;
    cancelRequest: () => void;
}

const TransactionsTable: React.ForwardRefRenderFunction<TransactionsTableRef, TransactionsTableProps> =
    ({ walletId, getTransactionsSum }: TransactionsTableProps, ref) => {

        //#region Data Initializations
        const { isDarkTheme } = useContext<IThemeContext>(ThemeContext);

        const {
            transactions,
            transactionsSum,
            handleChangeTransactions,
            handleDeleteTransactions,
            handleCancelRequest,
            transactionsExist,
            loading: transactionsLoading,
            dataFetched: transactionsLoaded,
            error: transactionsError
        } = useTransaction(walletId);

        const {
            categories,
            dataFetched: categoriesLoaded
        } = useCategory();

        const [transactionsData, setTransactionsData] = useState<ITransactionsData[]>([]);

        const [editedData, setEditedData] = useState<ITransactionsData[]>([]);

        useEffect(() => {
            if (!transactionsExist && !transactionsLoaded && !categoriesLoaded)
                return;

            const data = transactions.map(t => {
                const category: ICategory | undefined = categories.find(c => c.id === t.categoryId);

                return {
                    id: t.id!,
                    description: t.description,
                    amount: t.amount,
                    date: t.date,
                    categoryId: t.categoryId ?? undefined,
                    categoryName: category?.name,
                    isExpense: category?.isExpense,
                    isDeleted: false
                }
            });

            setTransactionsData(data);

        }, [transactionsExist, transactionsLoaded, categoriesLoaded]);

        //#endregion

        //#region Data Handle Functions

        useEffect(() => {
            returnTransactionsSum(transactionsSum);
        }, [transactionsSum]);

        const returnTransactionsSum = (transactionsSum: number) => {
            getTransactionsSum(transactionsSum);
        }

        useImperativeHandle(ref, () => ({
            async updateTransactions(): Promise<boolean> {
                if (editedData.length === 0) {
                    return false;
                }

                if (window.confirm(`Do you want to apply changes to transactions?`) === true) {
                    let dataDeleted = false;
                    let dataUpdated = false;

                    const transactionsToDelete: number[] = editedData.filter(e => e.isDeleted).map(d => d.id);

                    if (transactionsToDelete.length > 0) {
                        dataDeleted = await handleDeleteTransactions(transactionsToDelete);
                    }

                    const transactionsToUpdate: ITransaction[] = editedData
                        .filter(e => !e.isDeleted)
                        .map(d => {
                            return {
                                id: d.id,
                                walletId: walletId,
                                description: d.description,
                                categoryId: d.categoryId,
                                amount: d.amount,
                                date: d.date
                            }
                        });

                    if (transactionsToUpdate.length > 0) {
                        dataUpdated = await handleChangeTransactions(transactionsToUpdate);
                    }

                    return dataDeleted || dataUpdated;
                }

                return false;
            },

            getTransactionsCount(): number {
                return transactions.length
            },

            cancelRequest() {
                handleCancelRequest();
            }
        }));

        //#endregion

        //#region UI

        const gridRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            const numVisibleRows = !transactionsData || transactionsData?.length === 0 ? 0 : Math.min(transactionsData!.length, 10);
            const rowHeight = 42;
            const gridHeight = 97 + numVisibleRows * rowHeight; //height of table headers is 97px

            if (gridRef.current) {
                gridRef.current.style.height = `${gridHeight}px`;
            }
        }, [transactionsData]);

        const getRowStyle = (params: any) => {
            if (params.data.isDeleted) {
                return { color: "grey", pointerEvents: "none" };
            }
            return undefined;
        };

        //#endregion

        //#region AgGridReact

        const [forceRefresh, setForceRefresh] = useState(false);

        useEffect(() => {
            // Delay toggling the floatingFilter property, otherwise filters are not rendered
            const timeoutId = setTimeout(() => {
                setForceRefresh(true);
            }, 1);

            return () => {
                clearTimeout(timeoutId);
            };
        }, []);

        const defaultColDef = useMemo<ColDef>(() => {
            return {
                suppressMenu: true,
                resizable: true,
                editable: true,
                sortable: true,
                floatingFilter: forceRefresh,
                filterParams: {
                    maxNumConditions: 1,
                    filterOptions: ["contains", "notContains", "equals", "notEqual"],
                }
            };
        }, [forceRefresh]);

        interface ITransactionDeletedCellRendererProps {
            value: boolean;
            onToggle: () => void;
        }

        const transactionDeletedCellRenderer = ({ value: isDeleted, onToggle }: ITransactionDeletedCellRendererProps) => {
            const handleToggle = () => {
                onToggle();
            };

            return (
                !isDeleted ?
                    <div className="button--delete-transaction" onClick={handleToggle}>
                        <IconDelete size={18} />
                    </div>
                    :
                    <div className="button--restore-transaction" onClick={handleToggle}>
                        <IconRestore size={18} />
                    </div>
            );
        }

        const dateFilterParams: IDateFilterParams = {
            comparator: (filterDate: Date, cellValue: string) => {
                const cellDate = new Date(cellValue);
                cellDate.setHours(0, 0, 0, 0);

                if (cellDate < filterDate) {
                    return -1;
                } else if (cellDate > filterDate) {
                    return 1;
                } else {
                    return 0;
                }
            },
            maxNumConditions: 1
        };

        const columnDefs: ColDef[] = useMemo(() => [
            {
                field: "amount",
                cellDataType: "number",
                filter: "agNumberColumnFilter",
                filterParams: {
                    defaultFilterOption: "equals"
                },
                width: 150,
                minWidth: 150,
                cellEditor: "agNumberCellEditor",
                cellEditorParams: {
                    precision: 2
                },
                valueParser: params => !params.newValue ? params.oldValue : params.newValue
            },
            {
                field: "description",
                cellDataType: "text",
                filter: "agTextColumnFilter",
                width: 340,
                cellEditor: "agTextCellEditor",
                cellEditorParams: {
                    maxLength: 256
                },
                valueParser: params => !params.newValue ? params.oldValue : params.newValue
            },
            {
                field: "categoryName",
                headerName: "Category",
                cellDataType: "text",
                filter: "agTextColumnFilter",
                cellEditor: "agSelectCellEditor",
                cellEditorParams: {
                    values: categories?.map(category => category.name) || [],
                }
            },
            {
                field: "date",
                editable: false,
                filter: "agDateColumnFilter",
                filterParams: {
                    ...dateFilterParams,
                    filterOptions: ["equals", "lessThan", "greaterThan", "inRange"],
                    browserDatePicker: true,
                } as IDateFilterParams,
                minWidth: 105,
                valueFormatter: ({ value }: ValueFormatterParams) => UtcDateToLocalString(value),
                cellEditor: "agDateCellEditor",
            },
            {
                field: "isDeleted",
                headerName: "",
                editable: false,
                cellDataType: "boolean",
                cellRenderer: transactionDeletedCellRenderer,
                cellRendererParams: (params: ICellRendererParams) => ({
                    value: params.value,
                    onToggle: () => handleToggleDeleted(params.data.id),
                }),
                filter: false,
                width: 30
            }
        ], [categories]);

        const filteredColumnDefs: ColDef[] = useMemo(() => {
            const hasData = transactionsData && transactionsData.length > 0;

            const defs = columnDefs.map((columnDef: ColDef) => {
                return {
                    ...columnDef,
                    filter: hasData ? columnDef.filter : undefined
                };
            });

            return defs;
        }, [columnDefs, transactionsData]);

        const handleToggleDeleted = (id: number) => {
            setTransactionsData((prevData: ITransactionsData[]) => {
                return prevData.map((row) => {
                    if (row.id === id) {
                        const updatedRow = { ...row, isDeleted: !row.isDeleted };
                        setEditedData((prevEditedData: ITransactionsData[]) => {
                            const existingRow = prevEditedData.find((editedRow) => editedRow.id === id);
                            if (existingRow) {
                                return prevEditedData.map((editedRow) =>
                                    editedRow.id === id ? { ...editedRow, ...updatedRow } : editedRow
                                );
                            } else {
                                return [...prevEditedData, updatedRow];
                            }
                        });
                        return updatedRow;
                    }
                    return row;
                });
            });
        };

        const handleCellValueChanged = (event: CellValueChangedEvent<ITransactionsData>) => {
            const { data } = event;

            const category = categories.find(c => c.name === data.categoryName);

            if (category?.isExpense) {
                data.amount = -Math.abs(data.amount);
                data.isExpense = true;
            } else {
                data.amount = Math.abs(data.amount);
                data.isExpense = false;
            }

            data.categoryId = category?.id;

            setTransactionsData((prevData: ITransactionsData[]) => {
                return prevData.map(row => (row.id === data.id ? { ...row, ...data } : row));
            });

            setEditedData((prevData: ITransactionsData[]) => {
                const existingRow = prevData.find(row => row.id === data.id);
                if (existingRow) {
                    return prevData.map(row => (row.id === data.id ? { ...row, ...data } : row));
                } else {
                    return [...prevData, data];
                }
            });
        };

        //#endregion

        return (
            <>
                {transactionsLoading ?
                    <TransactionsTablePlaceholder />
                    :
                    <div className="full-width mb-4" ref={gridRef}>
                        <AgGridReact<ITransactionsData>
                            className={`ag-theme-alpine-dark ag-theme-portmonetka-${isDarkTheme ? "dark" : "light"}`}
                            rowData={transactionsData}
                            defaultColDef={defaultColDef}
                            columnDefs={filteredColumnDefs}
                            onCellValueChanged={handleCellValueChanged}
                            getRowStyle={getRowStyle}
                        >
                        </AgGridReact>
                    </div>
                }
            </>
        )
    }

export default forwardRef(TransactionsTable);