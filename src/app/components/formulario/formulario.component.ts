import { Component, Inject, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TreeService } from '../tree/services/tree.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css'],
})
export class FormularioComponent {
  miFormulario = this.fb.group({
    item: '',
  });
  constructor(
    private fb: FormBuilder,
    private treeService: TreeService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onSubmit() {
    let item = this.miFormulario.get('item')?.value;
    if (!this.data) {
      console.log(item);
    } else {
      const parentNode = this.data?.flatNodeMap.get(this.data.node);
      this.treeService.insertItem(parentNode!, item as string);
      this.data?.treeControl.expand(this.data.node);
    }
  }
}
