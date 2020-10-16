import { commands, CompleteResult, ExtensionContext, listManager, sources, events, workspace } from 'coc.nvim';
import fs from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';

function timeStamp() {
  let now = new Date();
  let date = [now.getMonth() + 1, now.getDate(), now.getFullYear()].map((d) =>
    d.toString().length === 1 ? '0' + d : d
  );
  let time = [now.getHours(), now.getMinutes(), now.getSeconds()].map((d) => (d.toString().length === 1 ? '0' + d : d));
  return date.join('-') + ':' + time.join('-');
}

function doesExist(dirpath) {
  try {
    fs.statSync(dirpath);
    return true;
  } catch (err) {
    return !(err && err.code === 'ENOENT');
  }
}

function checkAndMakeDir(dirpath, channel) {
  if (!doesExist(dirpath)) {
    mkdirp.sync(dirpath);
  }
}

export async function activate(context: ExtensionContext): Promise<void> {
  let { subscriptions } = context;
  const { nvim } = workspace;
  const config = workspace.getConfiguration('zett');
  const channel = workspace.createOutputChannel('zett');
  // if (!config.enabled) return;

  function _get_currentsession() {
    return fs.readFileSync(currentsessionfile).toString().trim();
  }

  // Get config variables.
  const basedir: string = config.get<string>('basedir')!.toString();
  const currentsessionfile: string = config.get<string>('currentsessionfile')!.toString();

  let currentsession: string = _get_currentsession();
  let sessiondir: string = path.join(basedir, currentsession);

  // Log to output channel.
  channel.appendLine(`zett.basedir: ${basedir}`);
  channel.appendLine(`zett.currentsessionfile: ${currentsessionfile}`);
  channel.appendLine(`zett.currentsession: ${currentsession}`);
  channel.appendLine(`zett.sessiondir: ${sessiondir}`);

  // Commands.
  subscriptions.push(
    commands.registerCommand('zett.currentsession', async () => {
      currentsession = _get_currentsession();
      channel.appendLine(`zett.currentsession: ${currentsession}`);
      channel.appendLine(`zett.sessiondir: ${sessiondir}`);
    })
  );

  subscriptions.push(
    commands.registerCommand('zett.openreadme', async () => {
      checkAndMakeDir(sessiondir, channel);
      nvim.command(`e ${sessiondir}/README.md`, true);
    })
  );

  subscriptions.push(
    commands.registerCommand('zett.quicknote', async () => {
      const notesdir: string = path.join(sessiondir, 'notes');
      checkAndMakeDir(notesdir, channel);

      const notesfile: string = path.join(notesdir, timeStamp());
      channel.appendLine(`notesfile: ${notesfile}.md`);
      nvim.command(`e ${notesfile}.md`, true);
    })
  );
}
