import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ModalService {

  private showModal = new BehaviorSubject<boolean>(false);

  showModal$ = this.showModal.asObservable();

  toggleModal(show: boolean): void {

    console.log("En el servicio")
    this.showModal.next(show);
  }

}
