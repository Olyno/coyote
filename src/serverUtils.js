const kill = require('tree-kill');
const path = require('path');
const fs = require('fs-extra');
const https = require('https');
const { logError, logSuccess } = require('./logs');

function startServer(server) {
    if (Object.keys(server).length > 0 && server.path) {
        const serverDir = path.dirname(server.path);
        const serverFile = path.basename(server.path);
        return require('child_process').exec('cd ' + serverDir + ' && java -jar ' + serverFile, {
            shell: true
        }).on('error', err => logError(err))
    } else {
        logError('Can\'t start server: unknown server');
        return { error: 'unknown selected server' };
    }
}

function stopServer(server) {
    if (server.running.process) {
        server.running.process.stdin.write('stop\n');
        logSuccess('Server \'' + server.name + '\' stopped');
    }
}

function forceStopServer(server) {
    if (server.running.process) {
        kill(server.running.process.pid);
        logSuccess('Server \'' + server.name + '\' forced to stop');
    }
}

function executeCommand(command, server) {
    server.running.process.stdin.write(command + '\n');
    logSuccess('Command \'/' + command + '\' executed');
}

function createServer(data) {
    return new Promise((resolve, rejects) => {
        const serverDir = 'assets/profile/created_servers/' + data.name;
        console.log(serverDir)
        fs.ensureDir(serverDir)
            .then(() => {
                const file = fs.createWriteStream(serverDir + '/server.jar');
                const request = https.get(data.version.link, (response) => {
                    response.pipe(file);
                })
                    .on('finish', () => {
                        fs.writeFile(serverDir + '/eula.txt', 'eula=true')
                            .then(() => resolve({
                                name: data.name,
                                path: 'assets/profile/created_servers/' + data.name + '/server.jar',
                                running: {
                                    process: undefined,
                                    logs: []
                                }
                            }))
                            .catch(rejects)
                    })
                    .on('error', rejects);
            })
            .catch(rejects)
    })
}

exports.startServer = startServer;
exports.forceStopServer = forceStopServer;
exports.stopServer = stopServer;
exports.executeCommand = executeCommand;
exports.createServer = createServer;