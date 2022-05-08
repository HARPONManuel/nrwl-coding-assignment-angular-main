import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css']
})
export class TicketListComponent implements OnInit {

  tickets = [];
  endsubs$: Subject<any> = new Subject();

  constructor(
    private backendService: BackendService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,) { }

    ngOnInit(): void {
      this._getTickets();
    }

    private _getTickets() {
      this.backendService
        .getTickets()
        .pipe(takeUntil(this.endsubs$))
        .subscribe((tickets) => {
          this.tickets = tickets;
        });
    }

    updateProduct(id: number) {
      this.router.navigateByUrl(`ticketDetail/${id}`);
    }
  

}
