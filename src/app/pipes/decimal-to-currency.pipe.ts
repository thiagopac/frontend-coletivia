import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decimalToCurrencyPipe',
})
export class DecimalToCurrencyPipe implements PipeTransform {
  transform(value: number): string {
    if (isNaN(value)) {
      return '';
    }

    const roundedValue = Math.floor(value * 100) / 100;
    const parts = roundedValue.toFixed(2).split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return `${integerPart},${parts[1]}`;
  }
}
