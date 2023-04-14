const buildTree = (
  {
    clusters,
    groups,
    products,
    clustersArray,
    groupsArray,
  } : {
    clusters: TypeCluster[],
    groups: TypeGroup[],
    products: TypeProduct[],
    clustersArray: string[],
    groupsArray: string[],
  },
) => ({
  name: 'Clusters',
  attributes: {
    count: clustersArray.length,
    groups: groupsArray.length,
    type: 'clusters',
  },
  children: clustersArray.map((item: string) => ({
    name: clusters.find((x: TypeCluster) => x.value === item)?.label ?? '',
    attributes: {
      // eslint-disable-next-line max-len
      count: Array.from(new Set(products.filter((x: TypeProduct) => item === x.cluster))).length ?? 0,
      groups: Array.from(new Set(products.filter((x: TypeProduct) => item === x.cluster)
        .map(({ group }) => group))).length ?? 0,
      id: item,
      type: 'cluster',
    },
    children: Array.from(new Set(products.filter((x: TypeProduct) => item === x.cluster)
      .map(({ group }) => group))).map((g) => ({
      name: groups.find((x: TypeGroup) => x.value === g)?.label ?? '',
      attributes: {
        count: products.filter((x: TypeProduct) => item === x.cluster)
          .filter((x: TypeProduct) => g === x.group).length ?? 0,
        // groups: '===',
        id: g,
        type: 'group',
      },
      children: products.filter((x: TypeProduct) => item === x.cluster)
        .filter((x: TypeProduct) => g === x.group).map((prd: TypeProduct) => ({
          name: prd.name,
          attributes: {
            id: prd.id,
            type: 'product',
          },
        })),
    })),
  })),
});

export default buildTree;
