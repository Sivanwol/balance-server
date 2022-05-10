import { IpwareIpInfo } from '@fullerstack/nax-ipware/src/lib/ipware.model';
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosRequestHeaders,
} from 'axios';
import { ServicesRoute } from '../constraints/knownservices';
import { UnknownServiceException } from '../exceptions/UnknownServiceException';
import crypto from 'crypto';
export enum RequestMethod {
  GET,
  POST,
  DELETE,
  PUT,
}
export class RequestService {
  private client: AxiosInstance;
  private headers: AxiosRequestHeaders;
  private serviceToken: string;

  public initRequest(service: ServicesRoute) {
    let uri;
    switch (service) {
      case ServicesRoute.APIGateWay:
        uri = process.env.APIGateWay_Host;
        break;
      case ServicesRoute.ConfigService:
        uri = process.env.ConfigService_Host;
        break;
      default:
        throw new UnknownServiceException();
    }

    const format = process.env.API_M2M_FORMAT_REF;
    const hash = crypto.createHmac('sha512', process.env.ENCRYPTION_KEY);
    const apiServiceCode = hash.update(
      format
        .replace(':CODE', process.env.API_M2M_CODE)
        .replace(':SALT', process.env.SALT)
        .replace(':SECRET', process.env.SECRET),
      'utf-8'
    );
    this.client = axios.create({
      baseURL: uri,
      headers: {
        'x-service-api-key': apiServiceCode.digest('hex'),
      },
    });
  }

  public setHeader(key: string, value: string) {
    const obj = {};
    obj[key] = value;
    this.headers = { ...this.headers, ...obj };
  }

  public async validateServiceToken(
    token: string,
    ip: IpwareIpInfo
  ): Promise<boolean> {
    return false;
  }

  public async request<T>(method: RequestMethod, uri: string, data?: any) {
    const configRequest: AxiosRequestConfig = {
      headers: this.headers,
      responseType: 'json',
      timeout: 30000,
    };
    switch (method) {
      case RequestMethod.GET: {
        configRequest.params = data;
        return await this.client.get<T>(uri, configRequest);
      }
      case RequestMethod.DELETE: {
        configRequest.params = data;
        return await this.client.delete<T>(uri, configRequest);
      }
      case RequestMethod.PUT: {
        return await this.client.put<T>(uri, data, configRequest);
      }
      case RequestMethod.POST: {
        return await this.client.post<T>(uri, data, configRequest);
      }
    }
  }
}
