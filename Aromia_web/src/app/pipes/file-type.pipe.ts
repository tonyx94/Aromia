import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'fileType',
})
export class FileTypePipe implements PipeTransform {
  transform(url: string): 'image' | 'pdf' | 'word' | 'excel' | 'other' {
    const extension = url.split('.').pop()?.toLowerCase();

    if (!extension) return 'other';

    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) {
      return 'image';
    }

    if (extension === 'pdf') {
      return 'pdf';
    }

    if (['doc', 'docx'].includes(extension)) {
      return 'word';
    }

    if (['xls', 'xlsx'].includes(extension)) {
      return 'excel';
    }

    return 'other';
  }
}
