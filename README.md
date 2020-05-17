# coyote

<p align="center">
    <img src="https://i.imgur.com/Ka1pIpk.png">
</p>

---
## Buy me a coffee

Whether you use this project, have learned something from it, or just like it, please consider supporting it by buying me a coffee, so I can dedicate more time on open-source projects like this :)

<a href="https://www.buymeacoffee.com/Olyno" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: auto !important;width: auto !important;" ></a>

---

## Downloads

You can find all downloads on the website of the project, so [here](https://olyno.github.io/coyote).

Or simply in [releases](https://github.com/Olyno/coyote/releases).

---

## Developement

### Install

```bash
npm i # or yarn
```

### Start

```bash
npm run dev # or yarn dev
```

### Export/Build app

```bash
npm run export # or yarn export
```

When developing with Coyote, you have a specific file structure:

```
Coyote
    |- assets
        |- languages ------------------------- Different languages available (e.g English)
        |- profile --------------------------- User stuff, like config, created servers etc...
        |- servers --------------------------- List of available servers (e.g 1.14.4)
    |- src
        |- interface ------------------------- Contains all UI stuff
            |- components -------------------- Reusable components
            |- pages ------------------------- Different views of Coyote
            |- stores.js --------------------- Everything that need to be stored (e.g languages)
        |- index.js -------------------------- Electron app
        |- logs.js --------------------------- Logs system of Coyote
        |- serverUtils.js -------------------- Everything related to Miecraft servers
    |- package.json
```

---

## Contribute

Contributions are welcome. Here is some ways where you can contribute to the project:

**I'm a developer:**

Awesome! You can help us with code, like review pull requests, add new features according to [the roadmap](https://github.com/Olyno/coyote/blob/master/ROADMAP.md), or fix bugs!

**I'm a designer:**

Awesome! You can help us with designs, like create better designs, choose better colors etc... and [when custom themes will be available](https://github.com/Olyno/coyote/blob/master/ROADMAP.md), you can contribute by adding new themes!

**I'm not a developer, neither a designer:**

Awesome! You can help us with translations. Coyote has a multiple languages support, available in the directory ``assets/languages``. It's simple ``.yml`` file, really simple to recreate and edit.

## License

Code released under GPL-3.0 license.

Copyright ©, [Olyno](https://github.com/Olyno).