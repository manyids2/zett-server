import { commands, CompleteResult, ExtensionContext, listManager, sources, events, workspace } from 'coc.nvim';
import fs from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';

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
      // TODO: assumes directory exists.
      let stat = fs.statSync(sessiondir);
      if (!stat || !stat.isDirectory()) {
        mkdirp.sync(sessiondir);
      }
      nvim.command(`e ${sessiondir}/README.md`, true);
    })
  );
}
