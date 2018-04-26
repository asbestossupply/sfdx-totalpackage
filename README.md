sfdx-totalpackage
============

The built-in `sfdx force:source:convert` command converts only a single source directory into Metadata API format. This plugin converts *all* the source in a Salesforce DX project (as defined in the `sfdx-project.json` file' `packageDirectories` into metadata that you can deploy using Metadata API.

[![Version](https://img.shields.io/npm/v/sfdx-totalpackage.svg)](https://npmjs.org/package/sfdx-totalpackage)
[![CircleCI](https://circleci.com/gh/hackerhasid/sfdx-totalpackage/tree/master.svg?style=shield)](https://circleci.com/gh/hackerhasid/sfdx-totalpackage/tree/master)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/hackerhasid/sfdx-totalpackage?branch=master&svg=true)](https://ci.appveyor.com/project/heroku/sfdx-totalpackage/branch/master)
[![Codecov](https://codecov.io/gh/hackerhasid/sfdx-totalpackage/branch/master/graph/badge.svg)](https://codecov.io/gh/hackerhasid/sfdx-totalpackage)
[![Greenkeeper](https://badges.greenkeeper.io/hackerhasid/sfdx-totalpackage.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/hackerhasid/sfdx-totalpackage/badge.svg)](https://snyk.io/test/github/hackerhasid/sfdx-totalpackage)
[![Downloads/week](https://img.shields.io/npm/dw/sfdx-totalpackage.svg)](https://npmjs.org/package/sfdx-totalpackage)
[![License](https://img.shields.io/npm/l/sfdx-totalpackage.svg)](https://github.com/hackerhasid/sfdx-totalpackage/blob/master/package.json)

<!-- toc -->
* [Debugging your plugin](#debugging-your-plugin)
<!-- tocstop -->
<!-- install -->
<!-- usage -->
```sh-session
$ npm install -g sfdx-totalpackage
$ sfdx-totalpackage COMMAND
running command...
$ sfdx-totalpackage (-v|--version|version)
sfdx-totalpackage/0.0.0 darwin-x64 node-v9.3.0
$ sfdx-totalpackage --help [COMMAND]
USAGE
  $ sfdx-totalpackage COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
* [`sfdx-totalpackage source:convert -n my_package_name -d mdout`](#total-package-helloorg-file)

## `sfdx-totalpackage source:convert -n my_package_name -d mdout`

Converts *all* source in a Salesforce DX project into metadata that you can deploy using Metadata API.

```
USAGE
  $ sfdx-totalpackage source:convert

OPTIONS
  -d, --outputdir=outputdir                         (required) The output directory to export the Metadata API–formatted metadata to.            
  -n, --packagename=packagename                     The name of the package to associate with the Metadata API–formatted metadata.
  --json                                           format output as json
  --loglevel=(trace|debug|info|warn|error|fatal)   logging level for this command invocation

EXAMPLES
  $ sfdx-totalpackage source:convert -n my_package_name -d mdout
    exec: sfdx force:source:convert -r force-app -d /var/folders/m1/sd25288s7b1569c78ll5gs680000gn/T/sfdx-totalpkg-29223wXrBLNo56E7E -n my_package_name
    copying files from /var/folders/m1/sd25288s7b1569c78ll5gs680000gn/T/sfdx-totalpkg-29223wXrBLNo56E7E to mdout
    exec: sfdx force:source:convert -r other_code_directory -d /var/folders/m1/sd25288s7b1569c78ll5gs680000gn/T/sfdx-totalpkg-292236xR8rhv7Nhpe -n my_package_name
    copying files from /var/folders/m1/sd25288s7b1569c78ll5gs680000gn/T/sfdx-totalpkg-292236xR8rhv7Nhpe to mdout
    writing combined package.xml to testout/package.xml
```

_See code: [src/commands/hello/org.ts](https://github.com/hackerhasid/sfdx-totalpackage/blob/v0.0.0/src/commands/hello/org.ts)_
<!-- commandsstop -->
<!-- debugging-your-plugin -->
# Debugging your plugin
We recommend using the Visual Studio Code (VS Code) IDE for your plugin development. Included in the `.vscode` directory of this plugin is a `launch.json` config file, which allows you to attach a debugger to the node process when running your commands.

To debug the `hello:org` command: 
1. Start the inspector
  
If you linked your plugin to the sfdx cli, call your command with the `dev-suspend` switch: 
```sh-session
$ sfdx hello:org -u myOrg@example.com --dev-suspend
```
  
Alternatively, to call your command using the `bin/run` script, set the `NODE_OPTIONS` environment variable to `--inspect-brk` when starting the debugger:
```sh-session
$ NODE_OPTIONS=--inspect-brk bin/run hello:org -u myOrg@example.com
```

2. Set some breakpoints in your command code
3. Click on the Debug icon in the Activity Bar on the side of VS Code to open up the Debug view.
4. In the upper left hand corner of VS Code, verify that the "Attach to Remote" launch configuration has been chosen.
5. Hit the green play button to the left of the "Attach to Remote" launch configuration window. The debugger should now be suspended on the first line of the program. 
6. Hit the green play button at the top middle of VS Code (this play button will be to the right of the play button that you clicked in step #5).
<br><img src=".images/vscodeScreenshot.png" width="480" height="278"><br>
Congrats, you are debugging!
