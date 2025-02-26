'use client';

import { useState } from 'react';
import Sidebar from './components/Sidebar';
import FlowCanvas, { CustomNodeData } from './components/FlowCanvas';
import NodeDetailsPanel from './components/NodeDetailsPanel';
import { Node } from '@xyflow/react';


export default function Home() {
  const [selectedNode, setSelectedNode] = useState<Node<CustomNodeData> | null>(null);

  return (
    <main className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 relative">
        <FlowCanvas onNodeSelect={setSelectedNode} />
      </div>
      <NodeDetailsPanel 
        node={selectedNode} 
        onClose={() => setSelectedNode(null)} 
      />
    </main>
  );
}
