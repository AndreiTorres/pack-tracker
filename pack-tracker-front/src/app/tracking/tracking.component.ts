import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PackServiceService } from '../service/pack-service.service';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.css']
})

export class TrackingComponent implements OnInit {
  id: string | null = null;;
  isNotFound = false;
  pack: any
  trackings: any[] = []

  constructor(private route: ActivatedRoute, private packService: PackServiceService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.packService.getPackById(this.id).subscribe(
          (response) => {
            this.pack = response
            this.packService.getTrackingByPackId(this.pack._id).subscribe((res) => {
              this.trackings = res
              console.log(this.trackings)
            })

          },
          (error) => {
            if (error.status === 404 || error.status === 400) {
                this.isNotFound = true
            }
          }
        )
      }
    })
  }

  formatDate(date: string): string {
    return new Date(date).toISOString().split('T')[0];
  }


}
