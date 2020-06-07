import { Injectable } from '@angular/core';

// HTTP
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServiceCepService {

  constructor(
              public http: HttpClient) { 

  }

  getServiceCep(cep: String): any {
    return this.http.get(`http://viacep.com.br/ws/` + cep + `/json/`)
  }

}
