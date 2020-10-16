import { commands, CompleteResult, ExtensionContext, listManager, sources, events, workspace } from 'coc.nvim';
import * as path from 'path';

import { fsStat, fsWriteFile, fsReadFile, fsMkdir } from './fs';
import DB from './db';
import Bookmark from './commands';

export async function activate(context: ExtensionContext): Promise<void> {
  const config = workspace.getConfiguration('zett');

  const { subscriptions, storagePath } = context;
  const { nvim } = workspace;

  workspace.showMessage(storagePath);

  const db = new DB(path.join(storagePath, 'zett.json'));
  const bookmark = new Bookmark(nvim, db);

  const stat = await fsStat(storagePath);
  if (!stat?.isDirectory()) {
    workspace.showMessage('waiting for fsMkdir');
    await fsMkdir(storagePath);
  }

  events.on(
    'BufEnter',
    async () => {
      workspace.showMessage('waiting for refresh');
      await bookmark.refresh();
      workspace.showMessage('done refresh');
    },
    null,
    subscriptions
  );

  subscriptions.push(commands.registerCommand('zett-server.toggle', async () => await bookmark.toggle()));
}
