import { TicketDetailComponent } from './../ticket-detail/ticket-detail.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TicketListComponent } from '../ticket-list/ticket-list.component';

const routes: Routes = [
  {path: "", redirectTo:"ticketList", pathMatch:"full"},
  {path: "ticketList/form", component: TicketDetailComponent },
  {path: "ticketDetail/:id", component: TicketDetailComponent },
  {path: "ticketList", component: TicketListComponent }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes, { initialNavigation: 'enabled' }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
