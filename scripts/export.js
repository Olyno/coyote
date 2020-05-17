const pngToIco = require('png-to-ico');
const fs = require('fs-extra');
const ora = require('ora');

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

build.on('disconnect', () => spinner.succeed('Build completed'))
build.on('exit', () => spinner.succeed('Build completed'))