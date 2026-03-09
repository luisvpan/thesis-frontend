import { useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
  type Node,
  Panel,
  Controls,
  Background,
  type NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { NumberFlowNode, OperatorFlowNode } from '@/components/dataflow';
import type { NumberFlowNodeData, OperatorFlowNodeData } from '@/components/dataflow';
import type { MathOperatorType } from '@/types/card-types';
import { ArrowLeft, Plus, Minus } from 'lucide-react';

type DataflowNode = Node<NumberFlowNodeData, 'number'> | Node<OperatorFlowNodeData, 'operator'>;

const nodeTypes: NodeTypes = {
  number: NumberFlowNode,
  operator: OperatorFlowNode,
};

/** Valor de salida de un nodo: número tiene value, operador tiene value (resultado) */
function getNodeValue(node: DataflowNode | null | undefined): number | undefined {
  if (!node?.data) return undefined;
  const d = node.data as NumberFlowNodeData & OperatorFlowNodeData;
  return d.value ?? d.result;
}

function computeOperatorResult(
  operatorId: string,
  nodes: DataflowNode[],
  edges: Edge[]
): number | undefined {
  const edgesToOperator = edges.filter((e) => e.target === operatorId);
  const edgeA = edgesToOperator.find((e) => e.targetHandle === 'a');
  const edgeB = edgesToOperator.find((e) => e.targetHandle === 'b');
  const nodeA = edgeA ? nodes.find((n) => n.id === edgeA.source) : null;
  const nodeB = edgeB ? nodes.find((n) => n.id === edgeB.source) : null;
  const valA = getNodeValue(nodeA);
  const valB = getNodeValue(nodeB);
  if (typeof valA !== 'number' || typeof valB !== 'number') return undefined;
  const operator = (nodes.find((n) => n.id === operatorId)?.data as OperatorFlowNodeData | undefined)?.operator;
  if (operator === 'adicion') return valA + valB;
  if (operator === 'sustraccion') return valA - valB;
  return undefined;
}

const initialNodes: DataflowNode[] = [
  {
    id: 'num-3',
    type: 'number',
    position: { x: 80, y: 80 },
    data: { value: 3 },
  },
  {
    id: 'num-5',
    type: 'number',
    position: { x: 80, y: 200 },
    data: { value: 5 },
  },
  {
    id: 'op-sum',
    type: 'operator',
    position: { x: 320, y: 120 },
    data: { operator: 'adicion' },
  },
];

const initialEdges: Edge[] = [];

export default function DataflowPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  // Calcular resultados de operadores (varios pasos para cadenas op1 → op2)
  useEffect(() => {
    setNodes((nds) => {
      let current = nds;
      for (let pass = 0; pass < 10; pass++) {
        let changed = false;
        current = current.map((node) => {
          if (node.type !== 'operator') return node;
          const result = computeOperatorResult(node.id, current, edges);
          const prev = (node.data as OperatorFlowNodeData).result;
          if (result !== prev) changed = true;
          return {
            ...node,
            data: { ...node.data, result, value: result },
          };
        });
        if (!changed) break;
      }
      return current;
    });
  }, [edges, setNodes]);

  const addNumberNode = useCallback(
    (value: number) => {
      const id = `num-${value}-${Date.now()}`;
      setNodes((nds) => [
        ...nds,
        {
          id,
          type: 'number',
          position: { x: 100 + (nds.length % 3) * 60, y: 80 + Math.floor(nds.length / 3) * 100 },
          data: { value },
        },
      ]);
    },
    [setNodes]
  );

  const addOperatorNode = useCallback(
    (operator: MathOperatorType) => {
      const id = `op-${operator}-${Date.now()}`;
      setNodes((nds) => [
        ...nds,
        {
          id,
          type: 'operator',
          position: { x: 320 + (nds.filter((n) => n.type === 'operator').length % 2) * 200, y: 120 },
          data: { operator },
        },
      ]);
    },
    [setNodes]
  );

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-900">
      <header className="flex items-center justify-between px-4 py-3 bg-slate-800/80 border-b border-slate-700 shrink-0">
        <Link
          to="/"
          className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver
        </Link>
        <h1 className="text-lg font-bold text-white">Dataflow: sumas y restas</h1>
        <div className="w-24" />
      </header>

      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-slate-900"
          minZoom={0.3}
          maxZoom={1.5}
        >
          <Background color="#475569" gap={16} size={0.5} />
          <Controls className="!bg-slate-800 !border-slate-600 !rounded-xl" />

          <Panel position="top-left" className="m-4 flex flex-col gap-3">
            <div className="bg-slate-800/95 rounded-xl p-3 border border-slate-600 shadow-xl">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Añadir número
              </p>
              <div className="flex flex-wrap gap-1">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => addNumberNode(n)}
                    className="w-9 h-9 rounded-lg bg-slate-700 hover:bg-blue-600 text-white font-bold text-sm transition-colors"
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-slate-800/95 rounded-xl p-3 border border-slate-600 shadow-xl">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Añadir operador
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => addOperatorNode('adicion')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Suma
                </button>
                <button
                  type="button"
                  onClick={() => addOperatorNode('sustraccion')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors"
                >
                  <Minus className="w-4 h-4" />
                  Resta
                </button>
              </div>
            </div>
            <p className="text-slate-500 text-xs max-w-[200px]">
              Conecta números o resultados de operadores (salida derecha) a los operadores (entradas izquierda). El resultado se muestra debajo y puede usarse en otro operador.
            </p>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}
