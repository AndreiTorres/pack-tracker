import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pack } from './pack.model';
import { Tracking } from './tracking.model';

@Injectable({
  providedIn: 'root'
})
export class PackServiceService {

  apiUrl = "http://127.0.0.1:8097";

  constructor(private http: HttpClient) { }

  getAllPacks() {
    let header: HttpHeaders = new HttpHeaders({
      Accept: "application/json",
      "Content-Type": "application/json; charset='utf-8'",
     'Access-Control-Allow-Origin': '*'
  });

    return this.http.get(this.apiUrl + "/packs", { headers: header })
  }

  getPackById(id: string) {
    let header: HttpHeaders = new HttpHeaders({
      Accept: "application/json",
      "Content-Type": "application/json; charset='utf-8'",
     'Access-Control-Allow-Origin': '*'
  });

  return this.http.get(this.apiUrl + "/packs/" + id, { headers: header })
  }


  getTrackingByPackId(id: string):Observable<any> {
    let header: HttpHeaders = new HttpHeaders({
      Accept: "application/json",
      "Content-Type": "application/json; charset='utf-8'",
     'Access-Control-Allow-Origin': '*'
  });

  return this.http.get(this.apiUrl + "/packs/tracking/" + id, { headers: header })
  }


  registerPack(description: string,
    width: number,
    length: number,
    weight: number,
    sender_name: string,
    sender_email: string,
    receiver_name: string,
    receiver_email: string,
    destination: string ): Observable<Pack> {

      const pack: Pack = {
      description,
      width,
      length,
      weight,
      sender: {
        name: sender_name,
        email: sender_email,
      },
      receiver: {
        name: receiver_name,
        email: receiver_email,
      },
      destination,
      status: 'Pendiente',
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.post<Pack>(this.apiUrl + "/packs", pack, httpOptions);
  }

  updateStatus(pack:any, status:string): Observable<Pack> {

    const pack_update: Pack = {
      description: pack.description,
      width: pack.width,
      length: pack.length,
      weight: pack.weight,
      sender: {
        name: pack.sender.name,
        email: pack.sender.email,
      },
      receiver: {
        name: pack.receiver.name,
        email: pack.receiver.email,
      },
      destination: pack.destination,
      status: status,
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.put<Pack>(this.apiUrl + "/packs/" + pack._id, pack_update, httpOptions);
  }

  registerTracking(id: string, ubication: string): Observable<Tracking> {
    const tracking: Tracking = {
      pack_id: id,
      ubication: ubication
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.post<Tracking>(this.apiUrl + "/packs/tracking", tracking, httpOptions);
  }
}
