export interface IEmits extends Record<string, any> {
  help: [];
  minimize: [];
  maximize: [];
  close: [];
}

export interface IProps {
  name: string;
  minimizable?: boolean;
  maximizable?: boolean;
  closable?: boolean;
  showHelp?: boolean;
  appTitle?: string;
}
