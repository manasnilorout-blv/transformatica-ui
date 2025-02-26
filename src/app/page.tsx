'use client';

import { useState } from 'react';
import Sidebar from './components/Sidebar';
import FlowCanvas, { CustomNodeData } from './components/FlowCanvas';
import NodeDetailsPanel from './components/NodeDetailsPanel';
import { Node } from '@xyflow/react';
import './page.css';

export default function Home() {
  const [selectedNode, setSelectedNode] = useState<Node<CustomNodeData> | null>(null);

  return (
    <main className="main-container">
      <Sidebar />
      <div className="content-container">
        <FlowCanvas onNodeSelect={setSelectedNode} />
      </div>
      <NodeDetailsPanel
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
      />
    </main>
  );
}
