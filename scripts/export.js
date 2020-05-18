const pngToIco = require('png-to-ico');
const fs = require('fs-extra');
const ora = require('ora');
const path = require('path');
const zip = require('bestzip');

const args = process.argv;

const plateforms = args.pop().replace(/^-/g, '').split('');

function getValidPlateforms() {
    const spinner = ora({
        text: 'Searching current platform build...',
        spinner: 'line',
        color: 'cyan'
    }).start();
    if (process.platform === 'win32') {
        if (plateforms.includes('w')) {
            spinner.succeed('Plateform found: ' + process.platform + ' (Only Windows build available)');
            return ['w'];
        } else {
            spinner.fail('Plateform not compatible');
            throw new Error('Can\'t compile to Windows: not compatible OS');
        }
    } else {
        spinner.succeed('Plateform found: ' + process.platform + ' (All builds available)');
        return plateforms;
    }
}

async function zipBuilds() {
    const spinner = ora({
        text: 'Zip builds...',
        spinner: 'line',
        color: 'cyan'
    }).start();
    return fs.readdir('out')
        .then(files => {
            const statsJobs = [];
            for (const file of files) {
                const filePath = path.join('out', file);
                statsJobs.push(fs.stat(filePath).then(stat => {
                    return { stat, filePath };
                }));
            }
            return Promise.all(statsJobs);
        })
        .then(stats => {
            const zipJobs = [];
            for (const statInfos of stats) {
                const { stat, filePath } = statInfos;
                if (stat.isDirectory()) {
                    if (!fs.existsSync(filePath + '.zip')) {
                        zipJobs.push(
                            zip({
                                source: path.join('out', file),
                                destination: path.join('out', file + '.zip')
                            })
                        )
                    }
                }
            }
            return Promise.all(zipJobs);
        })
        .then(() => spinner.succeed('All builds have been zipped with success'));
}

// TODO: Compile to ICNS file for Mac
if (!fs.existsSync('public/images/favicon.ico')) {
    pngToIco('public/images/favicon.png')
        .then(v => fs.writeFileSync('public/images/favicon.ico', v))
}

const validPlateforms = getValidPlateforms();
const build = require('child_process')
    .exec('electron-builder build -' + validPlateforms.join('') +  ' -c configs/build.yml');
const spinner = ora({
    text: 'Building app...',
    spinner: 'line',
    color: 'cyan'
}).start();

build.stderr.on('data', data => console.error(data));
build.stdout.on('data', data => {
    spinner.text = data;
})

['disconnect', 'exit'].forEach(listner => {
    build.on(listner, () => {
        spinner.succeed('Build completed');
        zipBuilds();
    });
});