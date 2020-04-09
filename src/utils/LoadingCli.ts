import loadingCli from 'loading-cli';

export default class LoadingCli {
  private loading: any;
  private texts: string[];

  constructor() {
    this.texts = [];
    this.loading = loadingCli('');
    this.loading.frame(['🌕 ', '🌖 ', '🌗 ', '🌘 ', '🌑 ', '🌒 ', '🌓 ', '🌔 ']);
  }

  start() {
    console.log();
    this.loading = this.loading.start();
  }

  stop() {
    this.loading.stop();
  }

  push(text: string) {
    this.texts.push(text);
    this.print();
  }

  pop() {
    this.texts.pop();
    this.print();
  }

  print() {
    this.loading.text = this.texts.join(' -> ');
  }
}
