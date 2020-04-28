const pkg = require('../package.json');
const pngToIco = require('png-to-ico');
const fs = require('fs-extra');

const icon = {
  png: pkg.icon,
  ico: pkg.icon.replace(/\.\w+$/g, '.ico'),
}

if (!fs.existsSync(icon.ico)) {
  pngToIco(pkg.icon)
    .then(buffer => fs.writeFileSync(pkg.icon.replace(/\.\w+$/g, '.ico'), buffer))
    .catch(console.error);
}

module.exports = {
  packagerConfig: {
    // all: true,
    overwrite: true
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: pkg.name,
        description: pkg.description,
        version: pkg.version,
        owners: [pkg.author, ...pkg.contributors],
        authors: [pkg.author, ...pkg.contributors],
        // setupIcon: icon.ico,
        // iconUrl: icon.url
      }
    },
    {
      name: '@electron-forge/maker-pkg',
      config: {}
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        name: pkg.name,
        description: pkg.description,
        version: pkg.version,
        homepage: pkg.homepage,
        icon: icon.png,
        maintainer: pkg.author.name,
        productName: pkg.name,
        productDescription: pkg.description,
        section: 'misc',
        categories: [
          'Development',
          'Game',
          'Network',
          'Utility'
        ],
      }
    }
  ]
}