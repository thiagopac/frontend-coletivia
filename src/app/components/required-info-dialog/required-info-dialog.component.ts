import { AlertMessageService } from 'src/app/services/alert-message.service';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Validator from 'src/app/validators/cpf-cnpj-email.validator';

@Component({
  selector: 'app-required-info-dialog',
  templateUrl: './required-info-dialog.component.html',
  styleUrls: ['./required-info-dialog.component.scss'],
})
export class RequiredInfoDialogComponent {
  registrationType: string = 'PF';
  cpfCnpj: string = '';
  cpfCnpjLabel: string = 'CPF';
  cpfCnpjMask: string = '000.000.000-00';

  constructor(
    public dialogRef: MatDialogRef<RequiredInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private alertMessageService: AlertMessageService
  ) {}

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onConfirmClick(): void {
    const cpfIsValid = Validator.cpfValidator(this.cpfCnpj);
    const cnpjIsValid = Validator.cnpjValidator(this.cpfCnpj);
    if (this.registrationType === 'PF' && !cpfIsValid) {
      this.alertMessageService.showAlert('CPF inválido', 'warning');
      return;
    } else if (this.registrationType === 'PJ' && !cnpjIsValid) {
      this.alertMessageService.showAlert('CNPJ inválido', 'warning');
      return;
    }

    const formValues = {
      registrationType: this.registrationType,
      cpfCnpj: this.cpfCnpj,
    };
    this.dialogRef.close(formValues);
  }

  onRegistrationTypeChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.registrationType = value;
    this.cpfCnpjLabel = value === 'PF' ? 'CPF' : 'CNPJ';

    if (value === 'PF') {
      this.cpfCnpjMask = '000.000.000-00';
    } else if (value === 'PJ') {
      this.cpfCnpjMask = '00.000.000/0000.00';
    }
  }
}
