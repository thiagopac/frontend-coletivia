import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable()
export class CustomPaginatorIntlService extends MatPaginatorIntl {
  rangeSeparator: string = 'de';
  constructor() {
    super();

    this.itemsPerPageLabel = 'Itens por página:';
    this.nextPageLabel = 'Próximo';
    this.previousPageLabel = 'Anterior';
    this.firstPageLabel = 'Primeiro';
    this.lastPageLabel = 'Último';
  }

  getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0 || pageSize === 0) {
      return `0 ${this.rangeSeparator} ${length}`;
    }

    length = Math.max(length, 0);

    const startIndex = page * pageSize + 1;
    const endIndex = Math.min(startIndex + pageSize - 1, length);

    return `${startIndex} - ${endIndex} ${this.rangeSeparator} ${length}`;
  };
}
