import * as React from 'react'
import * as electron from 'electron'
import * as fs from 'fs'
import { prepareImportFile, parseArchive, getImportFileName } from "../services/payment-processing";
import { PaymentExport } from "../models/payment";
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

        const payments = parseArchive(archive[0])

        this.setState({
            payments,
        })
    }

    handleExport() {
        const file = electron.remote.dialog.showSaveDialog({
            defaultPath: getImportFileName(this.props.settings)
        })
        if (!file) { return }

        fs.writeFileSync(file, prepareImportFile(this.state.payments))
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