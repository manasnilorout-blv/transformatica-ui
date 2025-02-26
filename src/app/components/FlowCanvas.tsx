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
import './FlowCanvas.css';
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
      className={`transform-node ${theme === 'dark' ? 'transform-node-dark' : 'transform-node-light'}`}
      title={nodeData?.description || 'No description available'}
    >
      <Handle type="target" position={Position.Left} />
      <div className="node-icon-wrapper">
        <div className={`node-icon-container ${theme === 'dark' ? 'node-icon-container-dark' : 'node-icon-container-light'}`}>
          {data.type === 'source' && <ArrowUpOnSquareIcon className={`node-icon ${theme === 'dark' ? 'node-icon-dark' : 'node-icon-light'}`} />}
          {data.type === 'transform' && <Cog6ToothIcon className={`node-icon ${theme === 'dark' ? 'node-icon-dark' : 'node-icon-light'}`} />}
          {data.type === 'target' && <TableCellsIcon className={`node-icon ${theme === 'dark' ? 'node-icon-dark' : 'node-icon-light'}`} />}
        </div>
        <span className={`node-label ${theme === 'dark' ? 'node-label-dark' : 'node-label-light'}`}>
          {nodeData?.name || 'Unnamed Node'}
        </span>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

// Need to use any here for the node types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nodeTypes: Record<string, React.ComponentType<any>> = {
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

  return (
    <div className={`flow-canvas ${theme === 'dark' ? 'flow-canvas-dark' : 'flow-canvas-light'}`}>
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
        <Controls 
          position="top-right" 
          style={{
            backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
            borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
            color: theme === 'dark' ? '#d1d5db' : '#4b5563',
            boxShadow: theme === 'dark' ? '0 4px 6px -1px rgba(0, 0, 0, 0.2)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        />
        <MiniMap
          position="bottom-right"
          className={theme === 'dark' ? 'minimap-dark' : 'minimap-light'}
          nodeColor={theme === 'dark' ? '#4b5563' : '#d1d5db'}
          maskColor={theme === 'dark' ? 'rgba(17, 24, 39, 0.7)' : 'rgba(249, 250, 251, 0.7)'}
        />
      </ReactFlow>
    </div>
  );
}
