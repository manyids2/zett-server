// from https://github.com/clangd/coc-clangd/blob/master/src/ctx.ts
import {
  Executable,
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

class ZettExtensionFeature implements StaticFeature {
  constructor() {}
  initialize() {}
  fillClientCapabilities(capabilities: any) {
    const textDocument = capabilities.textDocument as TextDocumentClientCapabilities;
    textDocument.completion?.editsNearCursor = true;
  }
}

export class Ctx {
  public readonly config: Config;
  client: LanguageClient | null = null;

  constructor(private readonly context: ExtensionContext) {
    this.config = new Config();
  }

  async startServer(bin: string) {
    const old = this.client;
    if (old) {
      await old.stop();
    }

    const exec: Executable = {
      command: bin,
      args: this.config.arguments,
    };

    const serverOptions: ServerOptions = exec;
    const outputChannel = workspace.createOutputChannel('zett log');

    const initializationOptions: any = { zettFileStatus: true, arguments: this.config.arguments };

    const clientOptions: LanguageClientOptions = {
      documentSelector: [{ scheme: 'file', language: 'markdown' }],
      initializationOptions,
      disableDiagnostics: this.config.disableDiagnostics,
      disableSnippetCompletion: this.config.disableSnippetCompletion,
      outputChannel,
      middleware: {
        provideOnTypeFormattingEdits: (document, position, ch, options, token, next) => {
          // coc sends "\n" when exiting insert mode, when there is no newline added to the doc.
          if (ch === '\n') ch = '';
          return next(document, position, ch, options, token);
        },
        provideWorkspaceSymbols: async (query, token, next) => {
          const symbols = await next(query, token);
          if (!symbols) return;

          return symbols.map((symbol) => {
            if (symbol.containerName) {
              symbol.name = `${symbol.containerName}::${symbol.name}`;
            }
            symbol.containerName = '';
            return symbol;
          });
        },
      },
    };

    const client = new LanguageClient('zett', serverOptions, clientOptions);
    client.registerFeature(new ZettExtensionFeature());
    this.context.subscriptions.push(services.registLanguageClient(client));
    await client.onReady();

    this.client = client;
  }

  get subscriptions(): Disposable[] {
    return this.context.subscriptions;
  }
}
