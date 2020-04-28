const fse = require('fs-extra');
const fs = require('fs');
const dayjs = require('dayjs');
const colorReset = require('strip-ansi');
const chalk = require('chalk');

const logsFile = 'assets/profile/logs.txt';
const logs = [];

if (fse.existsSync(logsFile)) {
    fse.removeSync(logsFile);
}

function logSuccess(message) {
    addLog(chalk.greenBright('[Success] ' + message));
}

function logError(message) {
    addLog(chalk.red('[Error] ' + message));
}

function log(message) {
    console.log(message);
}

function writeLogs() {
    fs.writeFile(logsFile, logs.join('\n'), err => err && logError(err));
}

function addLog(message) {
    const dateFormat = '[' + dayjs().format('HH:mm:ss') + ']';
    log(dateFormat + ': ' + message);
    logs.push(dateFormat + ': ' + colorReset(message));
    writeLogs();
}

exports.logSuccess = logSuccess;
exports.logError = logError;
exports.log = log;
exports.writeLogs = writeLogs;