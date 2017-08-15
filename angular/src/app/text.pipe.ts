import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'format'
})
export class TextPipe implements PipeTransform {
  private separateParagraphs(value: string): string {
    return "<p>" + value.replace(/\n/g,"</p>\n<p>") + "</p>";
  }
  private highlightLORD(value: string): string {
    return value.replace(/LORD'S/g, "<span class='lord'>LORD's</span>")
      .replace(/LORDS/g, "L&zwnj;ORDS")
      .replace(/LORD/g, "<span class='lord'>LORD</span>")
  }
  private capitalizeFirstWord(value: string): string {
    let index: number = value.substr(2).indexOf(' ') + 2;
    return value.substr(0, index).toUpperCase() + value.substr(index);
  }
  transform(value: string, args: any[]): string {
    let x = this.separateParagraphs(
      this.highlightLORD(
      this.capitalizeFirstWord(value)));
      return x;
  }
}
