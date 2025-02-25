'use client';

import { useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import { 
  ReactFlow, 
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  Handle,
  Position,
  NodeProps,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  ArrowUpOnSquareIcon, 
  Cog6ToothIcon, 
  TableCellsIcon 
} from '@heroicons/react/24/solid';

type NodeType = 'source' | 'transform' | 'target';

interface CustomNodeData extends Record<string, unknown> {
  label: string;
  type: NodeType;
  id: string;
  position: { x: number; y: number };
  data: Record<string, any>;
}

const TransformNode = ({ data }: NodeProps<CustomNodeData>) => {
  const { theme } = useTheme();
  return (
    <div className={`px-4 py-2 shadow-lg rounded-md ${
      theme === 'dark' 
        ? 'bg-gray-800 border-2 border-gray-700 text-white' 
        : 'bg-white border-2 border-gray-200 text-gray-800'
    }`}>
      <Handle type="target" position={Position.Left} />
      <div className="flex items-center">
        <div className={`w-6 h-6 rounded-full ${
          theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'
        } flex items-center justify-center`}>
          {data.type === 'source' && <ArrowUpOnSquareIcon className={`h-4 w-4 ${
            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
          }`} />}
          {data.type === 'transform' && <Cog6ToothIcon className={`h-4 w-4 ${
            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
          }`} />}
          {data.type === 'target' && <TableCellsIcon className={`h-4 w-4 ${
            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
          }`} />}
        </div>
        <span className={`ml-2 text-xs font-medium ${
          theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
        }`}>{data.data?.name || 'Unnamed Node'}</span>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nodeTypes: { [key: string]: React.FC<any> } = {
  transformNode: TransformNode,
};

const initialNodes: Node<CustomNodeData>[] = [
  // Main source
  {
    id: '1',
    type: 'transformNode',
    position: { x: 100, y: 200 },
    data: { label: 'Source', type: 'source', id: '1', position: { x: 100, y: 200 }, data: { name: 'Main Source' } },
  },
  // First branch
  {
    id: '2',
    type: 'transformNode',
    position: { x: 300, y: 100 },
    data: { label: 'Transform', type: 'transform', id: '2', position: { x: 300, y: 100 }, data: { name: 'Transform A-1' } },
  },
  {
    id: '3',
    type: 'transformNode',
    position: { x: 500, y: 100 },
    data: { label: 'Transform', type: 'transform', id: '3', position: { x: 500, y: 100 }, data: { name: 'Transform A-2' } },
  },
  {
    id: '4',
    type: 'transformNode',
    position: { x: 700, y: 100 },
    data: { label: 'Target', type: 'target', id: '4', position: { x: 700, y: 100 }, data: { name: 'Target A' } },
  },
  // Second branch
  {
    id: '5',
    type: 'transformNode',
    position: { x: 300, y: 300 },
    data: { label: 'Transform', type: 'transform', id: '5', position: { x: 300, y: 300 }, data: { name: 'Transform B-1' } },
  },
  {
    id: '6',
    type: 'transformNode',
    position: { x: 500, y: 300 },
    data: { label: 'Target', type: 'target', id: '6', position: { x: 500, y: 300 }, data: { name: 'Target B' } },
  },
  // Third branch (from node 5)
  {
    id: '7',
    type: 'transformNode',
    position: { x: 500, y: 400 },
    data: { label: 'Transform', type: 'transform', id: '7', position: { x: 500, y: 400 }, data: { name: 'Transform C-1' } },
  },
  {
    id: '8',
    type: 'transformNode',
    position: { x: 700, y: 400 },
    data: { label: 'Target', type: 'target', id: '8', position: { x: 700, y: 400 }, data: { name: 'Target C' } },
  },
];

const initialEdges: Edge[] = [
  // First branch
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e3-4', source: '3', target: '4' },
  
  // Second branch
  { id: 'e1-5', source: '1', target: '5' },
  { id: 'e5-6', source: '5', target: '6' },
  
  // Third branch (from node 5)
  { id: 'e5-7', source: '5', target: '7' },
  { id: 'e7-8', source: '7', target: '8' },
];

interface FlowCanvasProps {
  onNodeSelect?: (node: Node<CustomNodeData> | null) => void;
}

export default function FlowCanvas({ onNodeSelect }: FlowCanvasProps) {
  const { theme } = useTheme();
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node<CustomNodeData>) => {
    onNodeSelect?.(node);
  }, [onNodeSelect]);

  return (
    <div className={`w-full h-full ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
