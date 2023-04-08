/* eslint-disable max-len */
import React from 'react';
import Tree from 'react-d3-tree';
import { useCenteredTree, Point } from './helpers';
import data from '../../../mock/mock';

const containerStyles = {
  width: '100%',
  height: '100%',
  background: '#eee',
};

// Here we're using `renderCustomNodeElement` render a component that uses
// both SVG and HTML tags side-by-side.
// This is made possible by `foreignObject`, which wraps the HTML tags to
// allow for them to be injected into the SVG namespace.
// const renderForeignObjectNode = ({
//   nodeDatum,
//   toggleNode,
//   foreignObjectProps,
//   classes,
// }: any) => (
//   <>
//     {/* `foreignObject` requires width & height to be explicitly set. */}
//     <foreignObject {...foreignObjectProps}>
//       <Button
//         className={classes.button}
//         variant="contained"
//         onClick={toggleNode}
//       >
//         <div className={classes.name}>{nodeDatum.name}</div>
//         <div>
//           Age:
//           {nodeDatum.attributes.age}
//         </div>
//         <IconButton className={classes.edit} aria-label="edit">
//           <Edit />
//         </IconButton>
//         <div className={classes.attributes}>
//           <AttachMoney style={{ color: '#459C7F' }} />
//           <Accessible style={{ color: '#459C7F' }} />
//         </div>
//       </Button>
//     </foreignObject>
//   </>
// );
type UseUserData = [Point, (v: HTMLDivElement | null) => void]

export default function Main() {
  // const classes = useStyles();
  // const foreignObjectProps = { width: nodeSize.x, height: nodeSize.y, x: -125 };
  const [translate, containerRef] = useCenteredTree() as unknown as UseUserData;
  const nodeSize = { x: 300, y: 250 };
  const separation = { siblings: 1, nonSiblings: 2 };

  return (
    <div style={containerStyles} ref={containerRef}>
      <Tree
        data={data}
        orientation="horizontal"
        nodeSize={nodeSize}
        separation={separation}
        translate={translate}
        // pathFunc="step"
      />
    </div>
  );
}
