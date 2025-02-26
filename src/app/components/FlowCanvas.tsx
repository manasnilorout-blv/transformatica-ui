'use client';

import { useCallback, useState, useEffect } from 'react';
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
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { initialNodes, initialEdges } from './mockData';

type NodeType = 'source' | 'transform' | 'target';
type NodeStatus = 'idle' | 'in-progress' | 'completed' | 'error';

export interface CustomNodeData extends Record<string, unknown> {
  label: string;
  type: NodeType;
  id: string;
  position: { x: number; y: number };
  data: Record<string, any>;
  status?: NodeStatus;
  result?: any;
}

const TransformNode = ({ data }: NodeProps<CustomNodeData>) => {
  const { theme } = useTheme();
  const nodeData = data.data;
  // Check for status in both places for compatibility
  const status = data.status || nodeData?.status || 'idle';
  
  // Determine node class based on status
  const getNodeStatusClass = () => {
    switch (status) {
      case 'in-progress':
        return 'node-in-progress';
      case 'completed':
        return 'node-completed';
      case 'error':
        return 'node-error';
      default:
        return '';
    }
  };

  return (
    <div
      className={`transform-node ${theme === 'dark' ? 'transform-node-dark' : 'transform-node-light'} ${getNodeStatusClass()}`}
      title={nodeData?.description || 'No description available'}
    >
      <Handle type="target" position={Position.Left} />
      <div className="node-icon-wrapper">
        <div className={`node-icon-container ${theme === 'dark' ? 'node-icon-container-dark' : 'node-icon-container-light'}`}>
          {status === 'in-progress' ? (
            <ArrowPathIcon className={`node-icon node-spinner ${theme === 'dark' ? 'node-icon-dark' : 'node-icon-light'}`} />
          ) : (
            <>
              {data.type === 'source' && <ArrowUpOnSquareIcon className={`node-icon ${theme === 'dark' ? 'node-icon-dark' : 'node-icon-light'}`} />}
              {data.type === 'transform' && <Cog6ToothIcon className={`node-icon ${theme === 'dark' ? 'node-icon-dark' : 'node-icon-light'}`} />}
              {data.type === 'target' && <TableCellsIcon className={`node-icon ${theme === 'dark' ? 'node-icon-dark' : 'node-icon-light'}`} />}
            </>
          )}
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
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const [isExecuting, setIsExecuting] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [executionState, setExecutionState] = useState<{
    completedNodes: Set<string>;
    processingNodes: Set<string>;
  }>({
    completedNodes: new Set<string>(),
    processingNodes: new Set<string>(),
  });

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node<CustomNodeData>) => {
    onNodeSelect?.(node);
  }, [onNodeSelect]);

  // Mock function to simulate starting a job
  const startExecution = useCallback(() => {
    if (isExecuting) return;
    
    // Reset all nodes to idle state
    setNodes((nds) => 
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          status: 'idle',
        },
        status: 'idle',
        result: null
      }))
    );
    
    // Generate a mock job ID
    const mockJobId = `job-${Date.now()}`;
    setJobId(mockJobId);
    setIsExecuting(true);
    setExecutionState({
      completedNodes: new Set<string>(),
      processingNodes: new Set<string>(),
    });
    
    // Mock API call response
    console.log(`Started execution with job ID: ${mockJobId}`);
  }, [isExecuting, setNodes]);

  // Create dependency map once when execution starts
  const getDependencyMap = useCallback(() => {
    const dependencyMap = new Map<string, string[]>();
    edges.forEach(edge => {
      if (!dependencyMap.has(edge.target)) {
        dependencyMap.set(edge.target, []);
      }
      dependencyMap.get(edge.target)?.push(edge.source);
    });
    return dependencyMap;
  }, [edges]);

  // Find source nodes (nodes with no incoming edges)
  const getSourceNodes = useCallback(() => {
    return nodes
      .filter(node => !edges.some(edge => edge.target === node.id))
      .map(node => node.id);
  }, [nodes, edges]);

  // Process the next batch of nodes
  useEffect(() => {
    if (!isExecuting || !jobId) return;

    // Only initialize source nodes on first run
    if (executionState.completedNodes.size === 0 && executionState.processingNodes.size === 0) {
      const sourceNodes = getSourceNodes();
      
      // Start processing with source nodes
      setNodes(nds => 
        nds.map(node => 
          sourceNodes.includes(node.id)
            ? { 
                ...node, 
                status: 'in-progress',
                data: {
                  ...node.data,
                  status: 'in-progress'
                }
              }
            : node
        )
      );
      
      setExecutionState(prev => ({
        ...prev,
        processingNodes: new Set(sourceNodes)
      }));
      
      return;
    }
    
    // Skip if no nodes are currently processing
    if (executionState.processingNodes.size === 0) return;
    
    // Set a timer to complete the current processing nodes
    const timer = setTimeout(() => {
      const dependencyMap = getDependencyMap();
      const { completedNodes, processingNodes } = executionState;
      
      // Create new sets to avoid direct mutation
      const newCompletedNodes = new Set(completedNodes);
      const newProcessingNodes = new Set<string>();
      
      // Mark current processing nodes as completed
      processingNodes.forEach(nodeId => {
        newCompletedNodes.add(nodeId);
      });
      
      // Update nodes status to completed
      setNodes(nds => 
        nds.map(node => 
          processingNodes.has(node.id)
            ? { 
                ...node, 
                status: 'completed',
                data: {
                  ...node.data,
                  status: 'completed'
                }
              }
            : node
        )
      );
      
      // Find next nodes to process
      nodes.forEach(node => {
        // Skip if already completed or in processing queue
        if (newCompletedNodes.has(node.id) || processingNodes.has(node.id)) return;
        
        // Get dependencies for this node
        const dependencies = dependencyMap.get(node.id) || [];
        
        // Check if all dependencies are completed
        const allDependenciesCompleted = dependencies.every(depId => 
          newCompletedNodes.has(depId)
        );
        
        // If all dependencies are completed, add to next batch
        if (allDependenciesCompleted) {
          newProcessingNodes.add(node.id);
        }
      });
      
      // If no more nodes to process, we're done
      if (newProcessingNodes.size === 0) {
        if (newCompletedNodes.size === nodes.length) {
          setIsExecuting(false);
          setJobId(null);
          console.log('Execution completed successfully');
        }
        setExecutionState({
          completedNodes: newCompletedNodes,
          processingNodes: new Set()
        });
        return;
      }
      
      // Update nodes status to in-progress
      setNodes(nds => 
        nds.map(node => 
          newProcessingNodes.has(node.id)
            ? { 
                ...node, 
                status: 'in-progress',
                data: {
                  ...node.data,
                  status: 'in-progress'
                }
              }
            : node
        )
      );
      
      // Update execution state
      setExecutionState({
        completedNodes: newCompletedNodes,
        processingNodes: newProcessingNodes
      });
      
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [isExecuting, jobId, executionState, setNodes, getSourceNodes, getDependencyMap, nodes.length]);

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
        
        {/* Execute Button */}
        <div className="execute-button-container">
          <button
            className={`execute-button ${theme === 'dark' ? 'execute-button-dark' : 'execute-button-light'} ${isExecuting ? 'executing' : ''}`}
            onClick={startExecution}
            disabled={isExecuting}
          >
            {isExecuting ? (
              <>
                <ArrowPathIcon className="execute-spinner" />
                Executing...
              </>
            ) : (
              'Execute Flow'
            )}
          </button>
        </div>
      </ReactFlow>
    </div>
  );
}
