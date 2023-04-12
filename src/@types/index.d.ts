type TypeProduct = {
  id: number;
  name: string;
  description: string;
  cluster: string;
  group: string;
};

type TypeGroup = {
  value: string;
  label: string;
};

type TypeCluster = {
  value: string;
  label: string;
};

type TypeAttributes = {
  count?: number;
  groups?: string;
  type: string;
  id?: number;
};

type TypeNode = {
  name: string;
  attributes: TypeAttributes;
  children?: TypeNode[]
}

type User = {
  id: number;
  firstName: string;
  secondName: string;
  displayName: string;
  login: string;
  email: string;
  phone: string;
  avatar?: string;
  password?: string;
};

type Action<T> = {
  type: string;
  payload: T;
};

type Reducer<T> = (state: T, action: Action<T>) => T;
