import { Node, Edge } from '@xyflow/react'; // Adjust the import path as necessary
import { CustomNodeData } from './FlowCanvas';

export const initialNodes: Node<CustomNodeData>[] = [
    // Main source
    {
        id: '1',
        type: 'transformNode',
        position: { x: 100, y: 200 },
        data: {
            label: 'Source',
            type: 'source',
            id: '1',
            position: { x: 100, y: 200 },
            data: {
                name: 'Main Source',
                tempTableName: 'node_1',
                description: 'This is the main source of data',
                metadata: {
                    sql: 'SELECT * FROM users union all select * from employees',
                }
            }
        }
    },
    // First branch
    {
        id: '2',
        type: 'transformNode',
        position: { x: 300, y: 100 },
        data: {
            label: 'Transform',
            type: 'transform',
            id: '2',
            position: { x: 300, y: 100 },
            data: {
                name: 'Transform A-1',
                description: 'Filter users by age and add full name',
                tempTableName: 'node_2',
                metadata: {
                    sql: `SELECT *, concat(first_name, ' ', last_name) as full_name FROM node_1
                    WHERE age > 30;`,
                }
            }
        },
    },
    {
        id: '3',
        type: 'transformNode',
        position: { x: 500, y: 100 },
        data: {
            label: 'Transform',
            type: 'transform',
            id: '3',
            position: { x: 500, y: 100 },
            data: {
                name: 'Transform A-2',
                description: 'This is the second transform of data',
                tempTableName: 'node_3',
                metadata: {
                    sql: 'SELECT * FROM node_2 WHERE age > 40',
                }
            }
        },
    },
    {
        id: '4',
        type: 'transformNode',
        position: { x: 700, y: 100 },
        data: {
            label: 'Target',
            type: 'target',
            id: '4',
            position: { x: 700, y: 100 },
            data: {
                name: 'Target A',
                description: 'This is the target of data',
                tempTableName: 'node_4',
                metadata: {
                    sql: 'SELECT * FROM node_3 WHERE city = "New York"',
                }
            }
        },
    },
    // Second branch
    {
        id: '5',
        type: 'transformNode',
        position: { x: 300, y: 300 },
        data: {
            label: 'Transform',
            type: 'transform',
            id: '5',
            position: { x: 300, y: 300 },
            data: {
                name: 'Transform B-1',
                description: 'This is the first transform of data',
                tempTableName: 'node_5',
                metadata: {
                    sql: 'SELECT * FROM users WHERE age > 60',
                }
            }
        }
    },
    {
        id: '6',
        type: 'transformNode',
        position: { x: 500, y: 300 },
        data: {
            label: 'Target',
            type: 'target',
            id: '6',
            position: { x: 500, y: 300 },
            data: {
                name: 'Target B',
                description: 'This is the target of data',
                tempTableName: 'node_6',
                metadata: {
                    sql: 'SELECT * FROM users WHERE age > 70',
                }
            }
        }
    },
    // Third branch (from node 5)
    {
        id: '7',
        type: 'transformNode',
        position: { x: 500, y: 400 },
        data: {
            label: 'Transform',
            type: 'transform',
            id: '7',
            position: { x: 500, y: 400 },
            data: {
                name: 'Transform C-1',
                description: 'This is the first transform of data',
                tempTableName: 'node_7',
                metadata: {
                    sql: 'SELECT * FROM users WHERE age > 80',
                }
            }
        }
    },
    {
        id: '8',
        type: 'transformNode',
        position: { x: 700, y: 400 },
        data: {
            label: 'Target',
            type: 'target',
            id: '8',
            position: { x: 700, y: 400 },
            data: {
                name: 'Target C',
                description: 'This is the target of data',
                tempTableName: 'node_8',
                metadata: {
                    sql: 'SELECT * FROM users WHERE age > 90',
                }
            }
        }
    },
];

export const initialEdges: Edge[] = [
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