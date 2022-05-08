import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BackendService, Ticket } from '../backend.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.css']
})
export class TicketDetailComponent implements OnInit {

  editmode = false;
  form: FormGroup;
  isSubmitted = false;
  users = [];
  currentUpdate: Partial<Omit<Ticket, "id">>;
  endsubs$: Subject<any> = new Subject();

  constructor(
    private formBuilder: FormBuilder,
    private backendService: BackendService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this._initForm();
    this._getUsers();
    this._checkEditMode();
  }

  ngOnDestroy() {
    this.endsubs$.next();
    this.endsubs$.complete();
  }

  private _getUsers() {
    this.backendService
      .getUsers()
      .pipe(takeUntil(this.endsubs$))
      .subscribe((users) => {
        this.users = users;
      });
  }

  private _initForm() {
    this.form = this.formBuilder.group({
      id: ['', Validators.required],
      description: [''],
      assigneeId: [''],
      completed:  [''],
    });
  }

  private _addProduct() {
    this.backendService
      .newTicket()
      .pipe(takeUntil(this.endsubs$))
      .subscribe(
        (ticket: Ticket) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Ticket ${ticket.id} is created!`
          });
          timer(2000)
            .toPromise()
            .then(() => {
              this.location.back();
            });
        },
        () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Ticket is not created!'
          });
        }
      );
  }

  private _updateTicket(ticketId: number) {
    this.backendService
      .update(ticketId, this.currentUpdate)
      .pipe(takeUntil(this.endsubs$))
      .subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product is updated!'
          });
          timer(2000)
            .toPromise()
            .then(() => {
              this.location.back();
            });
        },
        () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Product is not updated!'
          });
        }
      );
  }

  private _checkEditMode() {
    this.route.params.pipe(takeUntil(this.endsubs$)).subscribe((params) => {
      if (params.id) {
        this.editmode = true;
        this.currentUpdate = params.id;
        this.backendService
          .ticket(params.id)
          .pipe(takeUntil(this.endsubs$))
          .subscribe((ticket) => {
            this.ticketForm.id.setValue(ticket.id);
            this.ticketForm.description.setValue(ticket.description);
            this.ticketForm.assigneeId.setValue(ticket.assigneeId);
            this.ticketForm.completed.setValue(ticket.completed);
          });
      }
    });
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) return;

    let ticket = null;
    Object.keys(this.ticketForm).map((key) => {
      ticket.append(key, this.ticketForm[key].value);
    });
    if (this.editmode) {
      this._updateTicket(ticket);
    } else {
      this._addProduct();
    }
  }
  onCancle() {
    this.location.back();
  }

  get ticketForm() {
    return this.form.controls;
  }
}
