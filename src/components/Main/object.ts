export type TypeProduct = {
  id: number;
  name: string;
  description: string;
  cluster: string;
  group: string;
};

export type TypeGroup = {
  id: number;
  name: string;
};

export type TypeCluster = {
  id: number;
  name: string;
};

export type TypeNode = {
  id: number;
  type: TypeCluster | TypeGroup | TypeProduct;
  name: string;
  parent: number;
  children: Node[];
  opened: boolean;
  description: string;
}

// Add, Delete, Edit
// Validation
// Histrory by event
