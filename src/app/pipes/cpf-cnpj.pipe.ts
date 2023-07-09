import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cpfCnpjPipe',
})
export class CpfCnpjPipe implements PipeTransform {
  transform(value?: string): string {
    if (!value) {
      return '';
    }

    value = value.replace(/\D/g, '');

    if (value.length === 11) {
      return this.formatCpf(value);
    } else if (value.length === 14) {
      return this.formatCnpj(value);
    }

    return value;
  }

  private formatCpf(cpf: string): string {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  private formatCnpj(cnpj: string): string {
    return cnpj.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      '$1.$2.$3/$4-$5'
    );
  }
}
