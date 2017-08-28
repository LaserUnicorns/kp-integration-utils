import { Settings } from "../models/settings";

const defaultSettings: Settings = {
    inn: '',
    ks: '',
}

export async function getSettings() {
    const settings: Settings = JSON.parse(localStorage.getItem('settings')) || defaultSettings
    return settings
}

export async function saveSettings(settings) {
    localStorage.setItem('settings', JSON.stringify(settings))
}