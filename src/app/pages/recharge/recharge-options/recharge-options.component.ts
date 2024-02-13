import { AlertMessageService } from 'src/app/services/alert-message.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RequiredInfoDialogComponent } from 'src/app/components/required-info-dialog/required-info-dialog.component';
import { InfoType } from 'src/app/models/user';
import { RechargeService } from 'src/app/services/recharge.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-recharge-options',
  templateUrl: './recharge-options.component.html',
  styleUrls: ['./recharge-options.component.scss'],
})
export class RechargeOptionsComponent implements OnInit {
  items$: Observable<any[]>;
  selectedOption: any;
  constructor(
    private rechargeService: RechargeService,
    private router: Router,
    private dialog: MatDialog,
    private userService: UserService,
    private alertMessageService: AlertMessageService
  ) {}

  ngOnInit(): void {
    this.listOptions();
  }

  listOptions() {
    this.items$ = this.rechargeService.listOptions();
  }

  selectValue(option: any) {
    this.selectedOption = option;
  }

  checkout() {
    this.userService.me().subscribe((res) => {
      if (!res.info.cpf_cnpj || !res.info.registration_type) {
        this.alertMessageService.showToast(
          'Você precisa completar o seu cadastro para continuar',
          'warning'
        );
        this.openDialog();
      } else {
        this.rechargeService
          .checkout(this.selectedOption.uuid)
          .subscribe((res) => {
            this.router.navigate(['/recharge/checkout-pix', res.uuid]);
          });
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(RequiredInfoDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      this.userService
        .updateInfo({
          registration_type: result.registrationType,
          cpf_cnpj: result.cpfCnpj,
        } as InfoType)
        .subscribe(() => {
          this.alertMessageService.showToast(
            'Seus dados foram atualizados com sucesso!',
            'success'
          );
        });
    });
  }
}
