// from https://github.com/clangd/coc-clangd/blob/master/src/config.ts
import { workspace, WorkspaceConfiguration } from 'coc.nvim';
export class Config {
  private cfg: WorkspaceConfiguration;

  constructor() {
    this.cfg = workspace.getConfiguration('zett');
  }

  get enabled() {
    return this.cfg.get('enabled') as boolean;
  }

  get disableDiagnostics() {
    return this.cfg.get('disableDiagnostics') as boolean;
  }

  get disableSnippetCompletion() {
    return this.cfg.get('disableSnippetCompletion') as boolean;
  }

  get arguments() {
    return this.cfg.get<string[]>('arguments', []);
  }

  get showDBChangedNotification() {
    return this.cfg.get('showDBChangedNotification') as boolean;
  }
}
