import axios, { AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { Service } from 'typedi';
import { ServicesRoute } from '../constraints/knownservices';
import { UnknownServiceException } from '../exceptions/UnknownServiceException';

export enum RequestMethod {
  GET,
  POST,
  DELETE,
  PUT
}
export class RequestService {
  private client: AxiosInstance;
  private readonly apiHeaderParamName = 'X-SERVICE-API_KEY'
  private headers: AxiosRequestHeaders;
  private serviceToken: string;

  public initRequest( service: ServicesRoute ) {
    let uri;
    switch (service) {
      case ServicesRoute.APIGateWay:
        uri = process.env.APIGateWay_Host
        break;
      case ServicesRoute.ConfigService:
        uri = process.env.ConfigService_Host
        break;
      default:
        throw new UnknownServiceException;
    }
    this.client = axios.create( {
      baseURL: uri,
    } )
  }

  public setToken( value: string ) {
    this.serviceToken = value;
    const obj = {}
    obj[this.apiHeaderParamName] = this.serviceToken
    this.headers = obj
  }

  public setHeader( key: string, value: string ) {
    const obj = {}
    obj[key] = value
    this.headers = {...this.headers, ...obj}
  }

  public async request<T>( method: RequestMethod, uri: string, data?: any ) {
    const configRequest: AxiosRequestConfig = {
      headers: this.headers,
      responseType: 'json',
      timeout: 30000
    }
    switch (method) {
      case RequestMethod.GET: {
        return await this.client.get<T>( uri, configRequest )
      }
      case RequestMethod.DELETE: {
        return await this.client.delete<T>( uri, configRequest )
      }
      case RequestMethod.PUT: {
        return await this.client.put<T>( uri, data, configRequest )
      }
      case RequestMethod.POST: {
        return await this.client.post<T>( uri, data, configRequest )
      }
    }
  }

}
