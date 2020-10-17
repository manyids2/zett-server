import { BasicList, ListAction, ListContext, ListItem, Neovim, workspace } from 'coc.nvim';

export default class ZettList extends BasicList {
  public readonly name = 'zett';
  public readonly description = 'CocList for zett-server';
  public readonly defaultAction = 'open';
  public actions: ListAction[] = [];
  public sessions: string[] = [];
  public basedir: string = '';

  constructor(nvim: Neovim, sessions: string[], basedir: string) {
    super(nvim);
    this.basedir = basedir;
    this.sessions = sessions;

    this.addLocationActions();

    this.addAction('open', (item: ListItem) => {
      workspace.showMessage(`${item.label}, ${item.data.name}`);
    });
  }

  public async loadItems(context: ListContext): Promise<ListItem[]> {
    return [
      {
        label: this.sessions[0],
        data: { name: `${this.basedir}/${this.sessions[0]}` },
      },
      {
        label: this.sessions[1],
        data: { name: `${this.basedir}/${this.sessions[1]}` },
      },
    ];
  }
}
