import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormularioComponent } from './components/formulario/formulario.component';
import { TreeService } from './components/tree/services/tree.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'material-ui';
  constructor(public dialog: MatDialog, public treeService: TreeService) {}

  agregarItem() {
    const dialogRef = this.dialog.open(FormularioComponent);
    dialogRef.afterClosed().subscribe();
  }
}
