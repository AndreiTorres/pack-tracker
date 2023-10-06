import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PackServiceService } from '../service/pack-service.service';
import { ModalService } from '../service/modal.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

declare var window: any
@Component({
  selector: 'app-list-packs',
  templateUrl: './list-packs.component.html',
  styleUrls: ['./list-packs.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ListPacksComponent implements OnInit {

  packs: any[] = [];
  formModal: any
  formModalUpdate: any
  modalTrackings: any
  validateForm!: FormGroup;
  validateFormUpdate!: FormGroup;
  isFormSubmitted = false;
  isFormUpdateSubmitted = false;
  rowData: any
  trackings: any[] = []
  page: number = 1;

  constructor(private packService: PackServiceService, private fb: FormBuilder) { }

  ngOnInit(): void {

    this.loadPacks()


    this.formModal= new window.bootstrap.Modal(
      document.getElementById('modalRegistrar')
    )

    this.formModalUpdate = new window.bootstrap.Modal(
      document.getElementById('modalUpdate')
    )

    this.modalTrackings = new window.bootstrap.Modal(
      document.getElementById('modalTrackings')
    )


    this.validateForm = this.fb.group({
      description: [null, [Validators.required]],
      width: [null, [Validators.required]],
      length: [null, [Validators.required]],
      weight: [null, [Validators.required]],
      sender_name: [null, [Validators.required]],
      sender_email: [null, [Validators.required]],
      receiver_name: [null, [Validators.required]],
      receiver_email: [null, [Validators.required]],
      destination: [null, [Validators.required]],
    });

    this.validateFormUpdate = this.fb.group({
      status: [null, [Validators.required]],
      ubication: [null, [Validators.required]],
    });


  }

  loadPacks(): void {
    this.packService.getAllPacks().subscribe((response: any) => {
      this.packs = response
    })
  }

  openFormModal(): void {
    this.isFormSubmitted = false
    this.formModal.show()
  }

  openUpdateModal(pack: any) {
    this.isFormUpdateSubmitted = false
    this.rowData = pack
    this.validateFormUpdate.reset();
    this.formModalUpdate.show()
  }

  updateStatus(): void {
    this.isFormUpdateSubmitted = true

    if (this.validateFormUpdate.valid) {
      let ubication = this.validateFormUpdate.value.ubication;
      let status = this.validateFormUpdate.get('status')?.value

      this.packService.updateStatus(this.rowData, status).subscribe(
        (response) => {
            this.packService.registerTracking(this.rowData._id, ubication).subscribe(
              (response) => {
                console.log("Se registro el seguimiento del paquete")
                this.loadPacks()
              },
              (error) => {
                console.log("Ocurrio un error al registrar seguimiento del paquete")
              }
            )
      }, (error) => {
        console.log("Ocurrio un error al actualizar estatus")
      }
      );

      this.formModalUpdate.hide()
      this.loadPacks()
    } else {
        Object.values(this.validateFormUpdate.controls).forEach(control => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
    }
  }

  registerPack(): void {
    this.isFormSubmitted = true

    if (this.validateForm.valid) {
      let description = this.validateForm.value.description;
      let width = this.validateForm.value.width;
      let length = this.validateForm.value.length;
      let weight = this.validateForm.value.weight;
      let sender_name = this.validateForm.value.sender_name;
      let sender_email = this.validateForm.value.sender_email;
      let receiver_name = this.validateForm.value.receiver_name;
      let receiver_email = this.validateForm.value.receiver_email;
      let destination = this.validateForm.value.destination;

      this.packService.registerPack(description,
        width,
        length,
        weight,
        sender_name,
        sender_email,
        receiver_name,
        receiver_email,
        destination ).subscribe((response) => {
            console.log("Paquete registrado exitosamente")
            this.formModal.hide()
            this.loadPacks()
          },
          (error) => {
            console.error('Error al crear el paquete', error);
          }
        );


    } else {
        Object.values(this.validateForm.controls).forEach(control => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
    }
  }


  watchTrackings(id: string): void {
    console.log(id)

    const modalBody = document.getElementById('modal-body')

    this.packService.getTrackingByPackId(id).subscribe(
      (response) => {
        this.trackings = response

        if (this.trackings.length > 0) {
          if (modalBody) {
            let html = `<div class="tracking-list"><ul>`
            console.log(this.trackings)
            for (let tracking of this.trackings) {
              let date = new Date(tracking.date).toISOString().split('T')[0];
              html += `<li>`

                html += `<div class="tracking-item">`
                html += `<div class="location">` + `El paquete llegó a la sucursal de Pack Tracker en ` + tracking.ubication + `</div>`
                html +=  `<div class="timestamp">` + `el día ` + date + ` a las ` + tracking.time + `</div>`
                html +=  `</div>`
                html += `</li>`
            }

                html += `</ul></div>`
                modalBody.innerHTML = html
          }

        } else {
          if (modalBody) {
            let html = `<p>No se han registrado movimientos para este paquete</p>`
            modalBody.innerHTML = html
          }
        }
      },
      (error) => {
        console.log("Ocurrió un error al solicitar historial de seguimiento")
      }
    )


    this.modalTrackings.show()
  }

}
