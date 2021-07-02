class TextClear {
  static full(text: string): string {
    return text
      .replace(/(\r\n|\n|\r)/gm, '')
      .replace(/  +/g, ' ')
      .trim();
  }
}

export default TextClear;
