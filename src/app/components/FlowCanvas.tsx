'use client';

import { useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import { 
  ReactFlow, 
  Node,
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
import './FlowStyles.css';
import { 
  ArrowUpOnSquareIcon, 
  Cog6ToothIcon, 
  TableCellsIcon 
} from '@heroicons/react/24/solid';
import { initialNodes, initialEdges } from './mockData';

type NodeType = 'source' | 'transform' | 'target';

export interface CustomNodeData extends Record<string, unknown> {
  label: string;
  type: NodeType;
  id: string;
  position: { x: number; y: number };
  data: Record<string, any>;
}

const TransformNode = ({ data }: NodeProps<CustomNodeData>) => {
  const { theme } = useTheme();
  const nodeData = data.data;
  return (
    <div 
      className={`px-4 py-2 shadow-lg rounded-md ${
        theme === 'dark' 
          ? 'bg-gray-800 border-2 border-gray-700 text-white' 
          : 'bg-white border-2 border-gray-200 text-gray-800'
      }`}
      title={nodeData?.description || 'No description available'}
    >
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
        }`}>{nodeData?.name || 'Unnamed Node'}</span>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nodeTypes: { [key: string]: React.FC<any> } = {
  transformNode: TransformNode,
};

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

  // Theme-based styles for ReactFlow components
  const controlsStyle = {
    backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
    borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
    color: theme === 'dark' ? '#d1d5db' : '#4b5563',
    boxShadow: theme === 'dark' ? '0 4px 6px -1px rgba(0, 0, 0, 0.2)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  };

  const minimapStyle = {
    backgroundColor: theme === 'dark' ? '#111827' : '#f9fafb',
    borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
    maskColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.2)',
    border: theme === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb',
  };

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
        proOptions={{ hideAttribution: true }}
        className={theme === 'dark' ? 'react-flow-dark-theme' : ''}
      >
        <Background color={theme === 'dark' ? '#374151' : '#e5e7eb'} gap={16} />
        <Controls position="top-right" style={controlsStyle} />
        <MiniMap 
          position="bottom-right" 
          style={minimapStyle}
          nodeColor={theme === 'dark' ? '#4b5563' : '#d1d5db'}
          maskColor={theme === 'dark' ? 'rgba(17, 24, 39, 0.7)' : 'rgba(249, 250, 251, 0.7)'}
        />
      </ReactFlow>
    </div>
  );
}
