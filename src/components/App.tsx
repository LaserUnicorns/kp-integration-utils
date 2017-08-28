import * as React from "react";
import { HashRouter as Router, Route, NavLink as Link } from 'react-router-dom'
import { SettingsComponent } from "./Settings";
import { Settings } from "../models/settings";
import { getSettings, saveSettings } from "../services/settings-service";
import { PaymentsReportComponent } from "./PaymentsReport";

interface AppState {
    settings: Settings
}

export class App extends React.Component<{}, AppState> {

    constructor(props) {
        super(props)

        this.state = {
            settings: {
                inn: '',
                ks: '',
                rs: '',
            }
        }

        this.handleSettingsChange = this.handleSettingsChange.bind(this)
    }

    async componentDidMount() {
        const settings = await getSettings()
        this.setState({ settings })
    }

    async handleSettingsChange(settings: Settings) {
        await saveSettings(settings)
        this.setState({ settings })
    }

    render() {
        return (
            <Router>
                <div>
                    <nav className="navbar navbar-expand navbar-dark bg-dark">
                        <span className="navbar-brand">KPDR</span>
                        <ul className="navbar-nav">
                            {/* <li className="nav-item disabled">
                                <Link to="/debt-report"  className="nav-link disabled" activeClassName="active">Задолженности</Link>
                            </li> */}
                            <li className="nav-item">
                                <Link to="/payments" className="nav-link" activeClassName="active">Платежи</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/settings" className="nav-link" activeClassName="active">Настройки</Link>
                            </li>
                        </ul>
                    </nav>

                    <div className="my-3">
                        {/* <Route path="/debt-report" component={DebtReportComponent} /> */}
                        <Route path="/payments" render={props => <PaymentsReportComponent settings={this.state.settings} />} />
                        <Route path="/settings" render={props => <SettingsComponent settings={this.state.settings} onSettingsChanged={this.handleSettingsChange} />} />
                    </div>
                </div>
            </Router>
        )
    }
}