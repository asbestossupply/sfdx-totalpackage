import {flags} from '@oclif/command';
import {join} from 'path';
import {SfdxCommand, core} from '@salesforce/command';
import * as tmp from 'tmp';
import {execSync} from 'child_process';
import {lstatSync, readdirSync, copySync, readFile, writeFile} from 'fs-extra';
import { tmpdir } from 'os';
import * as xml2js from 'xml2js';

core.Messages.importMessagesDirectory(join(__dirname, '..', '..', '..'));
const messages = core.Messages.loadMessages('sfdx-totalpackage', 'convert');
const isDirectory = source => lstatSync(source).isDirectory();

export default class Convert extends SfdxCommand {

  public static description = messages.getMessage('commandDescription');

  public static examples = [
  `$ sfdx source:convert --outputdir mdapi --packagename mypkg`
  ];

  protected static flagsConfig = {
    // flag with a value (-n, --name=VALUE)
    outputdir: flags.string({char: 'd', description: messages.getMessage('outputdirFlagDescription'), required: true}),
    packagename: flags.string({char: 'n', description: messages.getMessage('packagenameFlagDescription')})
  };

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = true;

  public async run(): Promise<any> { // tslint:disable-line:no-any
    // this.project is guaranteed since requiresProject is true
    const config = await this.project.resolveProjectConfig();
    const xmlParser = new xml2js.Parser();

    var combinedPackageData;
    for (let elem of config['packageDirectories']) {
      let path = elem['path'];
      // run sfdx force:source:convert
      var tmpDir = tmp.dirSync({prefix: 'sfdx-totalpkg-'});
      var buildCmd = `sfdx force:source:convert -r ${path} -d ${tmpDir.name}`;
      if (this.flags.packagename) {
        buildCmd += ` -n ${this.flags.packagename}`
      }
      this.ux.log(`exec: ${buildCmd}`);
      execSync(buildCmd);

      // copy files to output dir
      this.ux.log(`copying files from ${tmpDir.name} to ${this.flags.outputdir}`);
      var dirs = readdirSync(tmpDir.name).map(name => join(tmpDir.name, name)).filter(isDirectory);
      readdirSync(tmpDir.name).forEach(localName => {
        var fullPath = join(tmpDir.name, localName)
        if (!isDirectory(fullPath)) {
          return;
        }
        copySync(fullPath, join(this.flags.outputdir, localName));
      })

      // merge package.xml with that from output dir
      var pkgFileContents = await readFile(join(tmpDir.name, 'package.xml'));
      var pkgData = await new Promise((resolve, reject) => {
        xmlParser.parseString(pkgFileContents, function(err, result) {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });

      if (!combinedPackageData) {
        combinedPackageData = pkgData;
      } else {
        // add to combined package data
        pkgData['Package']['types'].forEach(t => {
          // get type from combinedPackageData
          let combinedType = combinedPackageData['Package']['types'].find(x => x['name'][0] == t['name'][0]);
          let combinedMembers = combinedType ? combinedType.members : [];
          combinedMembers = combinedMembers.concat(t.members);
          combinedMembers = Array.from(new Set(combinedMembers));
          combinedType.members = combinedMembers;
        })
      }
    }

    // write combinedPackageData to package.xml in output dir
    const outputPackageXmlPath = join(this.flags.outputdir, 'package.xml');
    this.ux.log(`writing combined package.xml to ${outputPackageXmlPath}`);

    var builder = new xml2js.Builder({standalone: undefined});
    var xml = builder.buildObject(combinedPackageData);
    await writeFile(outputPackageXmlPath, xml);

    return {pkgData: combinedPackageData}
  }
}