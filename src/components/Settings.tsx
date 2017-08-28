import * as React from 'react'
import { Settings } from "../models/settings";

interface Props {
    settings: Settings
    onSettingsChanged(settings: Settings): void
}

interface State {
    settings: Settings
}

export class SettingsComponent extends React.Component<Props, State> {

    constructor(props) {
        super(props)

        const { settings } = this.props

        this.state = {
            settings
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        const { settings } = nextProps

        if (settings !== this.props.settings) {
            this.setState({
                settings,
            })
        }
    }

    handleChange(ev: React.SyntheticEvent<HTMLInputElement>) {
        this.setState({
            settings: {
                ...this.state.settings,
                [ev.currentTarget.id]: ev.currentTarget.value,
            }
        })
    }

    handleSave() {
        this.props.onSettingsChanged(this.state.settings)
    }

    handleCancel() {
        this.setState({
            settings: this.props.settings
        })
    }

    render() {
        return (
            <div className="container">
                <h2 className="mb-4">Настройки</h2>
                <form>
                    <div className="form-group row">
                        <label htmlFor="inn" className="col-form-label col-2">ИНН</label>
                        <div className="col-6">
                            <input type="number" className="form-control" id="inn" placeholder="ИНН" value={this.state.settings.inn} onChange={this.handleChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="rs" className="col-form-label col-2">Р/счет</label>
                        <div className="col-6">
                            <input type="number" className="form-control" id="rs" placeholder="Р/счет" value={this.state.settings.rs} onChange={this.handleChange} />
                        </div>
                    </div>
                    <div className="form-group row" hidden>
                        <label htmlFor="ks" className="col-form-label col-2">К/счет</label>
                        <div className="col-6">
                            <input type="number" className="form-control" id="ks" placeholder="К/счет" value={this.state.settings.ks} onChange={this.handleChange} />
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-10 ml-auto">
                            <button className="btn btn-primary" onClick={this.handleSave}>Сохранить</button>{' '}
                            <button className="btn btn-secondary" onClick={this.handleCancel}>Отмена</button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}