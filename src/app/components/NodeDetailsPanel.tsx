'use client';

import { Fragment, useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Dialog, Transition, Tab } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Node } from '@xyflow/react';
import { CustomNodeData } from './FlowCanvas';

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
      <Dialog as="div" className="relative z-30" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed right-0 top-0 left-24 bottom-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed right-0 top-0 left-24 bottom-0 overflow-hidden">
          <div className="absolute right-0 left-0 overflow-hidden">
            <div 
              className="pointer-events-none fixed right-0 left-24 bottom-0 flex transform"
              style={{ height: `${panelHeight}vh` }}
            >
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-y-full"
                enterTo="translate-y-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-y-0"
                leaveTo="translate-y-full"
              >
                <Dialog.Panel className="pointer-events-auto w-full">
                  <div 
                    className={`flex h-full flex-col overflow-y-auto shadow-xl ${
                      theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                    }`}
                  >
                    <div 
                      ref={dragHandleRef}
                      className={`h-2 w-full cursor-ns-resize flex items-center justify-center ${
                        theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                      } ${isDragging ? (theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200') : ''}`}
                      onMouseDown={handleDragStart}
                    >
                      <div className={`w-10 h-1 rounded-full ${theme === 'dark' ? 'bg-gray-500' : 'bg-gray-300'}`} />
                    </div>
                    <div className="px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className={`text-base font-semibold leading-6 ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                          {node?.data?.label || 'Node Details'}
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className={`rounded-md ${
                              theme === 'dark' 
                                ? 'bg-gray-800 text-gray-400 hover:text-gray-300' 
                                : 'bg-white text-gray-400 hover:text-gray-500'
                            }`}
                            onClick={onClose}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <Tab.Group>
                      <Tab.List className={`border-b px-6 ${
                        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                      }`}>
                        {tabs.map((tab) => (
                          <Tab
                            key={tab.name}
                            className={({ selected }) =>
                              `border-b-2 px-4 py-2 text-sm font-medium ${
                                selected
                                  ? theme === 'dark'
                                    ? 'border-blue-400 text-blue-400'
                                    : 'border-blue-500 text-blue-600'
                                  : theme === 'dark'
                                    ? 'border-transparent text-gray-400 hover:border-gray-600 hover:text-gray-300'
                                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                              }`
                            }
                          >
                            {tab.name}
                          </Tab>
                        ))}
                      </Tab.List>
                      <Tab.Panels className="px-6 py-4">
                        {tabs.map((tab) => (
                          <Tab.Panel
                            key={tab.name}
                            className="focus:outline-none"
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
