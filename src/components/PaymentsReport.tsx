import * as React from 'react'
import * as electron from 'electron'
import * as fs from 'fs'
import * as path from 'path'
import * as AdmZip from 'adm-zip'
import { parsePaymentExport, parseFile, convertPayment, prepareFile } from "../services/payment-processing";
import { PaymentExport } from "../models/payment";

interface Props {

}

interface State {
    payments: PaymentExport[]
    showAdditionalInfo: boolean
}

export class PaymentsReportComponent extends React.Component<Props, State> {

    constructor(props) {
        super(props)

        this.state = {
            payments: [],
            showAdditionalInfo: false,
        }

        this.handleOpenFolder = this.handleOpenFolder.bind(this)
        this.handleOpenArchive = this.handleOpenArchive.bind(this)
        this.handleExport = this.handleExport.bind(this)
        this.handleAdditionalInfoChange = this.handleAdditionalInfoChange.bind(this)
    }

    handleOpenFolder() {
        const folders = electron.remote.dialog.showOpenDialog({
            properties: [
                'openDirectory',
            ]
        })

        const folder = folders[0]

        const files = fs.readdirSync(folder)

        const lines = files
            .map(file => fs.readFileSync(path.join(folder, file)))
            .map(file => parseFile(file))
            .reduce((total, file) => total.concat(file), [])

        const payments = lines.map(line => parsePaymentExport(line))

        this.setState({
            payments,
        })
    }

    handleOpenArchive() {
        const archive = electron.remote.dialog.showOpenDialog({
            properties: [
                'openFile',
            ]
        })
        if (!archive) { return }

        const zip = new AdmZip(archive[0])

        const lines = zip.getEntries()
            .map(entry => parseFile(entry.getData()))
            .reduce((total, file) => total.concat(file), [])

        const payments = lines.map(line => parsePaymentExport(line))

        this.setState({
            payments,
        })
    }

    handleExport() {
        const file = electron.remote.dialog.showSaveDialog({

        })
        if (!file) { return }

        const lines = this.state.payments
            .map(convertPayment)
            .map(p => [p.type, p.ls, p.code, p.dateoper, p.val, p.note].join(';'))

        fs.writeFileSync(file, prepareFile(lines))
    }

    handleAdditionalInfoChange(ev: React.SyntheticEvent<HTMLInputElement>) {
        this.setState({
            showAdditionalInfo: ev.currentTarget.checked,
        })
    }

    render() {
        const { showAdditionalInfo: info } = this.state

        const sum = this.state.payments
            .map(p => p.transactionAmount.replace(',', '.'))
            .map(a => parseFloat(a))
            .reduce((sum, val) => sum + val, 0)

        const colNum = info ? 11 : 5

        return (

            <div className="container">
                <h2 className="mb-4">Платежи</h2>

                {/* <button className="btn btn-primary" onClick={this.handleOpenFolder}>Открыть папку</button>{' '} */}
                <button className="btn btn-primary" onClick={this.handleOpenArchive}>Открыть архив</button>

                <div className="my-3">

                    <div className="scrollable">

                        <table className="table table-striped table-bordered table-hover table-sm">
                            <thead>
                                <tr>
                                    <th>Дата</th>
                                    {info && <th>Номер отделения</th>}
                                    {info && <th>Номер кассира/УС/СБОЛ</th>}
                                    {info && <th>ЕПС</th>}
                                    <th>№ счета</th>
                                    <th>ФИО плательщика</th>
                                    {info && <th>Адрес</th>}
                                    <th>Период оплаты</th>
                                    <th>Оплачено</th>
                                    {info && <th>Зачислено</th>}
                                    {info && <th>Комиссия</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.payments.map(p => (
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

                    </div>

                    <form>
                        <div className="form-check">
                            <label className="form-check-label">
                                <input type="checkbox" className="form-check-input" checked={this.state.showAdditionalInfo} onChange={this.handleAdditionalInfoChange} /> {' '}
                                Дополнительная информация
                        </label>
                        </div>
                    </form>

                </div>

                <button className="btn btn-primary" onClick={this.handleExport}>Выгрузить</button>

            </div>
        )
    }
}