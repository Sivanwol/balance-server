import { Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';
import { Observable } from 'rxjs';

axiosRetry(axios, { retries: 3 });
export enum RequestMethod {
  GET,
  POST,
  PUT,
  DELETE,
}
@Injectable()
export class RequestService {
  public async requestData(method: RequestMethod, url: string, config?: AxiosRequestConfig<any>, data?: any): Promise<AxiosResponse> {
    switch (method) {
      case RequestMethod.GET:
        return await axios.get(url, config);
      case RequestMethod.DELETE:
        return await axios.delete(url, config);
      case RequestMethod.PUT:
        return await axios.put(url, data, config);
      case RequestMethod.POST:
        return await axios.post(url, data, config);
    }
  }
}
