// from https://github.com/clangd/coc-clangd/blob/master/src/ctx.ts
import {
  ExtensionContext,
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  services,
  StaticFeature,
  workspace,
} from 'coc.nvim';
import { Disposable, TextDocumentClientCapabilities } from 'vscode-languageserver-protocol';
import { Config } from './config';

export class Ctx {
  public readonly config: Config;

  constructor(private readonly context: ExtensionContext) {
    this.config = new Config();
  }

  get subscriptions(): Disposable[] {
    return this.context.subscriptions;
  }
}
