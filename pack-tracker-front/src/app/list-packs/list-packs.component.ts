import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PackServiceService } from '../service/pack-service.service';
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
  modalDelete: any;
  modalUpdateInformation: any;
  validateForm!: FormGroup;
  validateFormUpdate!: FormGroup;
  validateFormUpdateInformation!: FormGroup;
  isFormSubmitted = false;
  isFormUpdateSubmitted = false;
  rowData: any
  trackings: any[] = []
  page: number = 1;
  filteredString: string = '';
  packToDeleteId: string = '';

  // Campos del formulario para actualizar
  description: string = '';
  weight: number = 0;
  width: number = 0;
  length: number = 0;
  sender_name: string = '';
  sender_email: string = '';
  receiver_name: string = '';
  receiver_email: string = '';
  destination: string = '';

  statusSuccess: boolean = false;
  registerSuccess: boolean = false;
  updateInformationSuccess: boolean = false;
  deleteSuccess: boolean = false;

  statusFailure: boolean = false;

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

    this.modalDelete = new window.bootstrap.Modal(
      document.getElementById('modalDelete')
    )

    this.modalUpdateInformation = new window.bootstrap.Modal(
      document.getElementById('modalUpdateInformation')
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

    this.validateFormUpdateInformation = this.fb.group({
      description_update: [null, [Validators.required]],
      width_update: [null, [Validators.required]],
      length_update: [null, [Validators.required]],
      weight_update: [null, [Validators.required]],
      sender_name_update: [null, [Validators.required]],
      sender_email_update: [null, [Validators.required]],
      receiver_name_update: [null, [Validators.required]],
      receiver_email_update: [null, [Validators.required]],
      destination_update: [null, [Validators.required]],
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

  openUpdateInformationModal(pack: any) {
    this.isFormUpdateSubmitted = false
    this.rowData = pack
    this.description = pack.description
    this.width = pack.width
    this.weight = pack.weight
    this.length = pack.length
    this.sender_name = pack.sender.name
    this.sender_email = pack.sender.email
    this.receiver_name = pack.receiver.name
    this.receiver_email = pack.receiver.email
    this.destination = pack.destination
    this.modalUpdateInformation.show()
  }

  openUpdateStatusModal(pack: any) {
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
                this.statusSuccess = true;
                this.loadPacks()
                setTimeout(() => {
                this.statusSuccess = false;
              }, 4000);
              },
              (error) => {
                this.showErrorLabel()
              }
            )
      }, (error) => {
        this.showErrorLabel()
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
            this.formModal.hide()
            this.registerSuccess = true;
            this.loadPacks()
            setTimeout(() => {
              this.registerSuccess = false;
              }, 4000);
          },
          (error) => {
            this.showErrorLabel()
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

    const modalBody = document.getElementById('modalBody')

    this.packService.getTrackingByPackId(id).subscribe(
      (response) => {
        this.trackings = response

        if (this.trackings.length > 0) {
          if (modalBody) {
            let html = `<div class="tracking-list"><ul>`
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
        this.showErrorLabel()
      }
    )


    this.modalTrackings.show()
  }

  openDeleteModal(pack_id: string) {
    this.packToDeleteId = pack_id;
    this.modalDelete.show()
  }

  deletePackById(pack_id: string) {

    this.packService.deletePackById(pack_id).subscribe(
      (response) => {
        this.modalDelete.hide()
        this.deleteSuccess = true;
        this.loadPacks()
        setTimeout(() => {
            this.deleteSuccess = false;
        }, 4000);
      },
      (error) => {
        this.showErrorLabel()
      }
    )
  }

  updatePackInformation() {
    this.isFormUpdateSubmitted = true

    if (this.validateFormUpdateInformation.valid) {

      this.rowData.description = this.validateFormUpdateInformation.value.description_update;
      this.rowData.width = this.validateFormUpdateInformation.value.width_update;
      this.rowData.length = this.validateFormUpdateInformation.value.length_update;
      this.rowData.weight = this.validateFormUpdateInformation.value.weight_update;
      this.rowData.sender.name = this.validateFormUpdateInformation.value.sender_name_update;
      this.rowData.sender.email = this.validateFormUpdateInformation.value.sender_email_update;
      this.rowData.receiver.name = this.validateFormUpdateInformation.value.receiver_name_update;
      this.rowData.receiver.email = this.validateFormUpdateInformation.value.receiver_email_update;
      this.rowData.destination = this.validateFormUpdateInformation.value.destination_update;

      this.packService.updatePackInformation(this.rowData).subscribe(
        (response) => {
          this.modalUpdateInformation.hide()
          this.updateInformationSuccess = true;
          this.loadPacks()
          setTimeout(() => {
            this.updateInformationSuccess = false;
        }, 4000);
        },
        (error) => {
          this.showErrorLabel()
        }
      )
    } else {
        Object.values(this.validateFormUpdateInformation.controls).forEach(control => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
    }
  }

  showErrorLabel() {
    this.statusFailure = true;
    this.loadPacks()
    setTimeout(() => {
      this.statusFailure = false;
    }, 4000);
  }
}
