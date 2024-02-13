import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  public getHostUrl(): string {
    return environment.hostUrl;
  }

  public getVersion(): string {
    return environment.appVersion;
  }

  public getApiUrl(): string {
    return environment.apiUrl;
  }

  public getAdminAuthDataKey(): string {
    return environment.adminAuthDataKey;
  }

  public getAdminUserDataKey(): string {
    return environment.adminUserDataKey;
  }

  public getAuthDataKey(): string {
    return environment.authDataKey;
  }

  public getUserDataKey(): string {
    return environment.userDataKey;
  }

  public isCurrentDev(): boolean {
    return !environment.production;
  }

  public isCurrentProd(): boolean {
    return environment.production;
  }
}
