export interface FoodNode {
  name: string;
  id?: number;
  parentId?: number;
  children?: FoodNode[];
}

export interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}
