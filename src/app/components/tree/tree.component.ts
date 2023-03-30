import { Component } from '@angular/core';
import { FoodNode } from './interfaces/tree.interface';
import { TreeService } from './services/tree.service';
import { MatDialog } from '@angular/material/dialog';
import { TodoItemFlatNode, TodoItemNode } from './model/tree.model';
import { FlatTreeControl } from '@angular/cdk/tree';
import { FormularioComponent } from '../formulario/formulario.component';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css'],
})
export class TreeComponent {
  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: TodoItemFlatNode | null = null;

  /** The new item's name */
  newItemName = '';
  treeControl!: FlatTreeControl<TodoItemFlatNode>;
  treeFlattener!: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;
  dataSource!: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

  constructor(public treeService: TreeService, public dialog: MatDialog) {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren
    );
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(
      this.getLevel,
      this.isExpandable
    );
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );

    this.treeService.dataChange.subscribe((data) => {
      this.dataSource.data = data;
    });
  }

  ngOnInit(): void {}

  getLevel = (node: TodoItemFlatNode) => node.level;

  isExpandable = (node: TodoItemFlatNode) => node.expandable;
  getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;
  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

  transformer = (node: TodoItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.item === node.item
        ? existingNode
        : new TodoItemFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children?.length;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  /* Get the parent node of a node */
  getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  /** Select the category so we can insert the new item. */
  addNewItem(node: TodoItemFlatNode) {
    const parentNode = this.flatNodeMap.get(node);
    this.treeService.insertItem(parentNode!, '');
    this.treeControl.expand(node);
  }

  agregarItem(node: TodoItemFlatNode) {
    const dialogRef = this.dialog.open(FormularioComponent, {
      data: {
        node,
        flatNodeMap: this.flatNodeMap,
        treeControl: this.treeControl,
      },
    });
    dialogRef.afterClosed().subscribe();
  }
}
