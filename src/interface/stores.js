import { writable } from 'svelte/store';

const fs = require('fs-extra');
const yaml = require('js-yaml');
const path = require('path');

const assetsDir = path.join(__dirname, '..', 'assets');
const logs = require(__dirname + '/../src/logs');

function loadFromAssets(p) {
    return path.join(assetsDir, p);
}

function loadYamlFile(path) {
    const content = fs.readFileSync(path);
    return yaml.safeLoad(content);
}

function loadServers() {
    fs.readdir(loadFromAssets('servers'))
        .then(serversList => {
            const serversData = serversList.map(s => {
                const datas = loadYamlFile(loadFromAssets('servers/' + s));
                return [...Object.keys(datas).map(key => {
                    return {
                        ...datas[key],
                        version: s.replace(/\.ya?ml/g, '')
                    }
                })]
            })
            available_servers.set([].concat(...serversData).sort((a, b) => {
                let aVersion = a.version;
                let bVersion = b.version;
                if (aVersion.split('.')[1].length === 1) {
                    const aSplited = aVersion.split('.');
                    aVersion = [aSplited[0], '0' + aSplited[1], aSplited[2]].join('.');
                }
                if (bVersion.split('.')[1].length === 1) {
                    const bSplited = bVersion.split('.');
                    bVersion = [bSplited[0], '0' + bSplited[1], bSplited[2]].join('.');
                }
                return aVersion == bVersion ?
                    0 : +(aVersion > bVersion) || -1;
            }).reverse());
        })
        .catch(err => logs.logError(err));
    if (!fs.existsSync(loadFromAssets('profile/servers.json'))) {
        fs.writeFile(loadFromAssets('profile/servers.json'), JSON.stringify([], null, 2))
            .catch(err => logs.logError(err));
        logs.logSuccess('Servers loaded');
        return [];
    } else {
        const serversData = fs.readJSONSync(loadFromAssets('profile/servers.json'));
        logs.logSuccess('Servers loaded');
        return serversData;
    }
}

function loadConfig() {
    let defaultConfig = {
        theme: 'materia',
        language: 'en'
    }
    if (!fs.existsSync(loadFromAssets('profile/config.json'))) {
        fs.writeFile(loadFromAssets('profile/config.json'), JSON.stringify(defaultConfig, null, 2))
            .catch(err => logs.logError(err));
        logs.logSuccess('Config loaded');
        return defaultConfig;
    } else {
        logs.logSuccess('Config loaded');
        return fs.readJSONSync(loadFromAssets('profile/config.json'));
    }
}

function loadLanguage(c) {
    logs.logSuccess('Language \'' + c + '\' loaded');
    return loadYamlFile(loadFromAssets('languages/' + c + '.yml'));
}

async function loadTranslations() {
    return new Promise((resolve, rejects) => {
        fs.readdir(loadFromAssets('languages'))
            .then(translationsFiles => {
                translations.set(
                    translationsFiles.map(file => {
                        return loadLanguage(path.basename(file).replace(/\.yml$/g, ''));
                    })
                )
                resolve();
            })
            .catch(rejects)
    })
}

loadTranslations().catch(err => logs.logError(err));

const userConfig = loadConfig();

export { logs };
export const config = writable(userConfig);
export const workingServer = writable({});
export const created_servers = writable(loadServers());
export const available_servers = writable([]);
export const lang = writable(loadLanguage(userConfig.language));
export const translations = writable([]);

config.subscribe(v => {
    if (Object.keys(v) > 0) {
        fs.writeFile(loadFromAssets('profile/config.json'), JSON.stringify(v, null, 2));
    }
    return v;
})

workingServer.subscribe(server => {
    if (Object.keys(server) > 0) {
        servers.update(ss => {
            return ss.map(s => {
                if (s.name === server.name) {
                    s = server;
                }
                return s;
            })
        })
    }
    return server;
})

created_servers.subscribe(v => {
    if (v.length > 0) {
        fs.writeFile(loadFromAssets('profile/servers.json'), JSON.stringify(v, null, 2));
    }
    return v;
})