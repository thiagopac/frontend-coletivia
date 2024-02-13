import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertMessageService {
  toast: any;

  constructor(private router: Router) {
    this.toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 10000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
  }

  showToast(message: string, icon: SweetAlertIcon, text?: string) {
    this.toast.fire({
      icon: icon,
      title: message,
      text: text,
    });
  }

  showAlert(message: string, icon: SweetAlertIcon = 'info') {
    Swal.fire({
      text: message,
      icon: icon,
      confirmButtonText: 'OK',
      confirmButtonColor: '#31abcc',
    });
  }

  alertWithHandler(
    message: string,
    icon: 'success' | 'error' | 'warning' | 'info' | 'question' = 'question',
    handleConfirmation: Function,
    isHtml: boolean = false
  ) {
    Swal.fire({
      html: isHtml ? message : undefined,
      text: isHtml ? undefined : message,
      icon: icon,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sim',
      confirmButtonColor: '#31abcc',
    }).then((result) => {
      if (result.isConfirmed) handleConfirmation();
    });
  }

  insufficientBalanceAlert(
    title: string = 'Você não possui créditos',
    message: string = 'Não é possível prosseguir com sua solicitação.<br /> Faça uma recarga para continuar.'
  ) {
    Swal.fire({
      title: title,
      html: `${message}`,
      imageUrl: 'assets/media/illustrations/custom/sad-no-credit.jpg',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Ver opções de recarga',
      confirmButtonColor: '#31abcc',
      imageWidth: 400,
      width: 800,
      padding: '4rem',
    }).then((result) => {
      if (result.isConfirmed) this.router.navigate(['/recharge/options']);
    });
  }
}
