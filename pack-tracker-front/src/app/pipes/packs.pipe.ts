import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'packsPipe'
})
export class PacksPipe implements PipeTransform {

  transform(value: any, filterString: any) {
    if (value.length === 0 || filterString === '') {
      return value;
    }

    filterString = filterString.toLowerCase();

    return value.filter((pack: any) =>
      pack.description.toLowerCase().includes(filterString)
      || pack._id.toLowerCase().includes(filterString)
      || pack.destination.toLowerCase().includes(filterString)
      || pack.status.toLowerCase().includes(filterString)
    );
  }

}
