import * as React from 'react'
import * as electron from 'electron'
import * as fs from 'fs'
import * as path from 'path'
import * as AdmZip from 'adm-zip'
import * as uuid from 'uuid'
import { parsePaymentExport, parseFile, convertPayment, prepareFile } from "../services/payment-processing";
import { PaymentExport, ImportFileType } from "../models/payment";
import { Settings } from "../models/settings";
import { PaymentsTableComponent } from "./PaymentsTable";

interface Props {
    settings: Settings
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

        this.handleOpenArchive = this.handleOpenArchive.bind(this)
        this.handleExport = this.handleExport.bind(this)
        this.handleAdditionalInfoChange = this.handleAdditionalInfoChange.bind(this)
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
            defaultPath: `${ImportFileType.Payments}_${this.props.settings.inn}_${uuid()}.csv`
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

        const loaded = !!this.state.payments.length

        return (
            <div className="container-fluid">
                <h2 className="mb-4">Платежи</h2>

                <button className="btn btn-primary" onClick={this.handleOpenArchive}>Открыть архив</button>

                {loaded &&
                    <div className="my-3">

                        <PaymentsTableComponent payments={this.state.payments} showAdditionalInfo={this.state.showAdditionalInfo} />

                        <form>
                            <div className="form-check">
                                <label className="form-check-label">
                                    <input type="checkbox" className="form-check-input" checked={this.state.showAdditionalInfo} onChange={this.handleAdditionalInfoChange} /> {' '}
                                    Дополнительная информация
                                </label>
                            </div>
                        </form>

                    </div>
                }

                {loaded && <button className="btn btn-primary" onClick={this.handleExport}>Выгрузить</button>}

            </div>
        )
    }
}