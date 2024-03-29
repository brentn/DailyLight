import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'format'
})
export class TextPipe implements PipeTransform {
  private separateParagraphs(value: string): string {
    return "<p>" + value.replace(/\n/g, "</p>\n<p>") + "</p>";
  }
  private highlightLORD(value: string): string {
    return value.replace(/LORD'S/g, "<span class='lord'>LORD's</span>")
      .replace(/LORD(?!S)(?!&nbsp;)/g, "<span class='lord'>LORD</span>")
  }
  private capitalizeFirstWord(value: string): string {
    let index: number = value.substring(2).indexOf(' ') + 2;
    return value.substring(0, index).toUpperCase() + value.substring(index);
  }
  transform(value: string): string {
    let x = this.separateParagraphs(
      this.highlightLORD(
        this.capitalizeFirstWord(value)));
    return x;
  }
}
