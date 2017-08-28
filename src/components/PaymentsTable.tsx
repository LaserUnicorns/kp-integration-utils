import * as React from 'react'
import orderBy from 'lodash-es/orderBy'
import { PaymentExport } from "../models/payment";
import { Sorter, SortDirection } from "./Sorter";

interface Props {
    showAdditionalInfo: boolean
    payments: PaymentExport[]
}

interface State {
    sortBy?: {
        key: keyof PaymentExport
        direction: SortDirection
    }
}

export class PaymentsTableComponent extends React.Component<Props, State> {

    constructor(props) {
        super(props)

        this.state = {}

        this.handleDateSort = this.handleDateSort.bind(this)
        this.handleAccountSort = this.handleAccountSort.bind(this)
    }

    handleDateSort(direction: SortDirection) {
        this.setState({
            sortBy: {
                key: 'date',
                direction,
            }
        })
    }

    handleAccountSort(direction: SortDirection) {
        this.setState({
            sortBy: {
                key: 'account',
                direction,
            }
        })
    }

    render() {
        const { showAdditionalInfo: info, payments } = this.props
        const colNum = info ? 11 : 5

        const sum = payments
            .map(p => p.transactionAmount.replace(',', '.'))
            .map(a => parseFloat(a))
            .reduce((sum, val) => sum + val, 0)

        const sorted = (this.state.sortBy && this.state.sortBy.direction !== 'none') ? orderBy(payments, [this.state.sortBy.key], [this.state.sortBy.direction]) : payments

        return (
            <table className="table table-striped table-bordered table-hover table-sm">
                <thead>
                    <tr>
                        <th style={{ whiteSpace: 'nowrap' }}>Дата <Sorter direction={this.state.sortBy && this.state.sortBy.key === 'date' ? this.state.sortBy.direction : 'none'} onDirectionChange={this.handleDateSort} /></th>
                        {info && <th>Номер отделения</th>}
                        {info && <th>Номер кассира/УС/СБОЛ</th>}
                        {info && <th>ЕПС</th>}
                        <th style={{ whiteSpace: 'nowrap' }}>№ счета <Sorter direction={this.state.sortBy && this.state.sortBy.key === 'account' ? this.state.sortBy.direction : 'none'} onDirectionChange={this.handleAccountSort} /></th>
                        <th>ФИО плательщика</th>
                        {info && <th>Адрес</th>}
                        <th>Период оплаты</th>
                        <th>Оплачено</th>
                        {info && <th>Зачислено</th>}
                        {info && <th>Комиссия</th>}
                    </tr>
                </thead>
                <tbody>
                    {sorted.map(p => (
                        <tr key={p.eps}>
                            <td>
                                <span style={{ whiteSpace: 'nowrap' }}>{p.date}</span>{' '}
                                <span style={{ whiteSpace: 'nowrap' }}>{p.time}</span>
                            </td>
                            {info && <td>{p.dep}</td>}
                            {info && <td>{p.cashier}</td>}
                            {info && <td>{p.eps}</td>}
                            <td>{p.account}</td>
                            <td>{p.fullname}</td>
                            {info && <td>{p.address}</td>}
                            <td>{p.paymentPeriod}</td>
                            <td>{p.transactionAmount}</td>
                            {info && <td>{p.transferAmount}</td>}
                            {info && <td>{p.commissionAmount}</td>}
                        </tr>
                    ))}
                </tbody>

                <tfoot>
                    <tr>
                        <th colSpan={colNum - 1}>Итого</th>
                        <th>{sum}</th>
                    </tr>
                </tfoot>
            </table>
        )
    }
}