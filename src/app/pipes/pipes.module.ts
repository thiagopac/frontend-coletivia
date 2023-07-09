import { FlatObjectPipe } from './flat-object.pipe';
import { UserFullnamePipe } from './user-fullname.pipe';
import { UserInitialsPipe } from './user-initials.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DecimalToCurrencyPipe } from 'src/app/pipes/decimal-to-currency.pipe';
import { CpfCnpjPipe } from 'src/app/pipes/cpf-cnpj.pipe';

const pipes = [
  DecimalToCurrencyPipe,
  UserInitialsPipe,
  UserFullnamePipe,
  FlatObjectPipe,
  CpfCnpjPipe,
];

@NgModule({
  declarations: pipes,
  imports: [CommonModule],
  exports: pipes,
})
export class PipesModule {}
