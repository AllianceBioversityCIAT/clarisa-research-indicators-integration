import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map } from 'rxjs';
import { env } from 'process';
import { BadRequestException } from '@nestjs/common';
import { ConnectionInterface } from './agresso-tools.connection';

export class AgressoToolsHttp implements ConnectionInterface {
  private readonly agressoHost: string;
  private readonly isProduction: boolean;
  constructor(
    private readonly http: HttpService,
    isProduction = false,
  ) {
    this.isProduction = isProduction;
    this.agressoHost =
      (this.isProduction
        ? env.DS_ARI_AGRESSO_URL
        : env.DS_ARI_AGRESSO_URL_DEV_HTTP) || '';
  }

  private async getToken(): Promise<string> {
    return firstValueFrom(
      this.http
        .post<{ accessToken: string }>(
          this.agressoHost + 'erp-employment-api/api/v1/auth/login',
          {
            username: this.isProduction
              ? env.DS_ARI_AGRESSO_STAFF_USER
              : env.DS_ARI_AGRESSO_STAFF_USER_DEV,
            password: this.isProduction
              ? env.DS_ARI_AGRESSO_STAFF_PASS
              : env.DS_ARI_AGRESSO_STAFF_PASS_DEV,
          },
        )
        .pipe(
          map(({ data }) => {
            return data.accessToken;
          }),
        ),
    ).catch((err) => {
      throw new BadRequestException(err);
    });
  }

  private async setAuth() {
    const token = await this.getToken();
    if (!token) return undefined;
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  async getRaw<T>(path: string): Promise<T> {
    const auth = await this.setAuth();
    return firstValueFrom(
      this.http
        .get<T>(this.agressoHost + path, auth)
        .pipe(map(({ data }) => data)),
    ).catch((err) => {
      throw new BadRequestException(err);
    });
  }

  async get(path: string) {
    const auth = await this.setAuth();
    return firstValueFrom(
      this.http
        .get(this.agressoHost + path, auth)
        .pipe(map(({ data }) => data.content)),
    ).catch((err) => {
      throw new BadRequestException(err);
    });
  }
}
