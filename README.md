# Strings [WIP]

A simple editor built with [electron](electron.atom.io/) and [codemirror](https://codemirror.net).

![Strings demo](https://github.com/arjit95/Strings/raw/master/screenshots/screenshot1.png)

# Installation

* Clone the repository with `git clone https://github.com/arjit95/Strings.git`
* Open a shell and perform `npm i`
* Launch the editor with the following command `./node_modules/.bin/electron .`

# Features

* Open files from editor `Ctrl+O`
* Open complete project folders and save data `Ctrl+Shift+O`
* Save file with `Ctrl+S` or all files with `Ctrl+Shift+S`
* Tab based file editing, to close tab `Ctrl+W` or for all tabs `Ctrl+Shift+W`
* Open quick finder with `Ctrl+P`
* Themes can be applied by changing theme property in default.json. A list of all themes can be found at public/resources/codemirror/theme
* Basic find and replace operations `Ctrl+F` or `Ctrl+Shift+F`
* Jump to line `Ctrl+G`
* Simple autocompletion for Javascript

# Libraries

The following libraries were used:
* [electron](https://electron.atom.io/)
* [readdirp](https://github.com/thlorenz/readdirp)
* [Underscore.js](https://underscorejs.org/)
* [rfr](https://www.npmjs.com/package/rfr)
* [CodeMirror](https://codemirror.net)
* [jsTree](https://www.jstree.com)
* [bootstrap](http://getbootstrap.com/)
