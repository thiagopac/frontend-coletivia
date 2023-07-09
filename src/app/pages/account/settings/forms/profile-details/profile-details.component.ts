import { UserService } from 'src/app/services/user.service';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { NgSelectConfig } from '@ng-select/ng-select';
import { AlertMessageService } from 'src/app/services/alert-message.service';
import { LocationService } from 'src/app/services/location.service';
import { AsyncPipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, InfoType, UserType } from 'src/app/modules/auth';
import { State } from 'src/app/models/state';
import { City } from 'src/app/models/city';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
})
export class ProfileDetailsComponent implements OnInit, OnDestroy {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe: Subscription[] = [];
  private sub: Subscription;

  fg: FormGroup;
  user: UserType;
  states$: Observable<State[]>;
  cities$: Observable<City[]>;

  public cpfCnpjMask = '000.000.000-00';

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private locationService: LocationService,
    private config: NgSelectConfig,
    private alertMessageService: AlertMessageService,
    private authService: AuthService,
    private asyncPipe: AsyncPipe,
    private userService: UserService
  ) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);

    this.config.notFoundText = 'Nenhum registro encontrado';
    this.config.appendTo = 'body';
  }

  ngOnInit(): void {
    this.user = this.asyncPipe.transform(
      this.authService.currentUserSubject.asObservable()
    )!;
    this.states$ = this.locationService.getStates();
    const state_id = this.user.info.city.state_id;
    this.cities$ = this.locationService.getCitiesByState(state_id);
    this.buildFormGroup();
    this.fg.patchValue({ state_id, ...this.user.info });
  }

  buildFormGroup() {
    this.fg = this.fb.group({
      first_name: [null, [Validators.required]],
      last_name: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      state_id: [null, [Validators.required]],
      city_id: [null, [Validators.required]],
      registration_type: [null, [Validators.required]],
      cpf_cnpj: [null, [Validators.required]],
    });

    this.updateMask();
  }

  selectedState(event: any) {
    this.cities$ = this.locationService.getCitiesByState(event.letter);
  }

  saveSettings() {
    this.isLoading$.next(true);
    const filledInfo: InfoType = this.fg.value;

    this.sub = this.userService.updateInfo(filledInfo).subscribe(() => {
      this.alertMessageService.showToast(
        'Seus dados foram atualizados com sucesso!',
        'success'
      );
      this.isLoading$.next(false);
      this.cdr.detectChanges();
    });

    this.unsubscribe.push(this.sub);
  }

  public updateMask(): void {
    const registrationType = this.fg.get('registration_type')!.value;
    if (registrationType === 'PF') {
      this.cpfCnpjMask = '000.000.000-00';
    } else if (registrationType === 'PJ') {
      this.cpfCnpjMask = '00.000.000/0000.00';
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
