'use client';

import { Fragment, useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Dialog, Transition, Tab } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Node } from '@xyflow/react';
import { CustomNodeData } from './FlowCanvas';
import './NodeDetailsPanel.css';

interface NodeDetailsPanelProps {
  node: Node<CustomNodeData> | null;
  onClose: () => void;
}

export default function NodeDetailsPanel({ node, onClose }: NodeDetailsPanelProps) {
  const { theme } = useTheme();
  const nodeData = node?.data;
  const [panelHeight, setPanelHeight] = useState(25);
  const [isDragging, setIsDragging] = useState(false);
  const dragHandleRef = useRef<HTMLDivElement>(null);

  // Setup drag handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      // Calculate distance from bottom of screen (in vh)
      const viewportHeight = window.innerHeight;
      const mouseDistanceFromBottom = viewportHeight - e.clientY;
      const heightInVh = (mouseDistanceFromBottom / viewportHeight) * 100;

      // Clamp between 15vh and 90vh
      const newHeight = Math.min(Math.max(heightInVh, 15), 90);
      setPanelHeight(newHeight);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      // Add a class to the body to prevent text selection during resize
      document.body.classList.add('resize-dragging');
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.classList.remove('resize-dragging');
    };
  }, [isDragging]);

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const tabs = [
    { name: 'Properties', content: 'Properties content here' },
    { name: 'SQL', content: nodeData?.data?.metadata?.sql || 'No SQL available' },
    { name: 'Preview', content: 'Preview content here' },
  ];

  return (
    <Transition.Root show={!!node} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="panel-enter"
          enterFrom="panel-enter-from"
          enterTo="panel-enter-to"
          leave="panel-leave"
          leaveFrom="panel-leave-from"
          leaveTo="panel-leave-to"
        >
          <div className="panel-backdrop" />
        </Transition.Child>

        <div className="panel-container">
          <div className="panel-inner">
            <div
              className="panel-wrapper"
              style={{ height: `${panelHeight}vh` }}
            >
              <Transition.Child
                as={Fragment}
                enter="panel-slide-enter"
                enterFrom="panel-slide-enter-from"
                enterTo="panel-slide-enter-to"
                leave="panel-slide-leave"
                leaveFrom="panel-slide-leave-from"
                leaveTo="panel-slide-leave-to"
              >
                <Dialog.Panel className="panel">
                  <div
                    className={`${theme === 'dark' ? 'panel-content-dark' : 'panel-content-light'}`}
                  >
                    <div
                      ref={dragHandleRef}
                      className={`drag-handle ${theme === 'dark' ? 'drag-handle-dark' : 'drag-handle-light'} ${isDragging ? 'dragging' : ''}`}
                      onMouseDown={handleDragStart}
                    >
                      <div className={`${theme === 'dark' ? 'drag-handle-indicator-dark' : 'drag-handle-indicator-light'}`} />
                    </div>
                    <div className="panel-header">
                      <div className="panel-header-inner">
                        <Dialog.Title className={`${theme === 'dark' ? 'panel-title-dark' : 'panel-title-light'}`}>
                          {node?.data?.label || 'Node Details'}
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className={`${theme === 'dark' ? 'panel-close-button-dark' : 'panel-close-button-light'}`}
                            onClick={onClose}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="panel-close-icon" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <Tab.Group>
                      <Tab.List className={`${theme === 'dark' ? 'tab-list-dark' : 'tab-list-light'}`}>
                        {tabs.map((tab) => (
                          <Tab
                            key={tab.name}
                            className={({ selected }) =>
                              `${theme === 'dark' ? 'tab-dark' : 'tab-light'} ${selected ? 'selected' : 'not-selected'}`
                            }
                          >
                            {tab.name}
                          </Tab>
                        ))}
                      </Tab.List>
                      <Tab.Panels className="tab-panels">
                        {tabs.map((tab) => (
                          <Tab.Panel
                            key={tab.name}
                            className="tab-panel"
                          >
                            {tab.content}
                          </Tab.Panel>
                        ))}
                      </Tab.Panels>
                    </Tab.Group>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
