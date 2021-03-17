import React, {DragEvent, useState, MouseEvent} from 'react';
import ReactFlow, {
    addEdge,
    Background,
    Elements,FlowElement,
    removeElements,
    Edge,
    Connection,
    Controls,
    OnLoadParams,
    ElementId,
    Node,
} from 'react-flow-renderer';

import "./App.css"
import './DragNDrop/dnd.css'

type SceneProps = {
    elements: Elements
    setElements: Function
    reactFlowInstance: OnLoadParams | undefined
    setReactFlowInstance: Function
}

let id = 0;
const getId = (): ElementId => `dndnode_${id++}`;



const Scene: React.FC<SceneProps> = ({elements, setElements, reactFlowInstance, setReactFlowInstance}) => {
    const [captureElementClick, setCaptureElementClick] = useState<boolean>(true);
    const onDragOver = (event: DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    };


    const onElementsRemove = (elementsToRemove: Elements): void => {
        setElements((elements: Elements) => removeElements(elementsToRemove, elements));
        console.log('elements:', elements);
    }
    const onLoad = (_reactFlowInstance: OnLoadParams) => setReactFlowInstance(_reactFlowInstance);

    const onConnect = (edgeParas: Edge | Connection): void => {
        setElements((elements: Elements) => addEdge(edgeParas, elements));
        console.log('elements:', elements);
    }
    const onElementClick = (_: MouseEvent, element: FlowElement) => console.log('click', element);
    const onDrop = (event: DragEvent) => {

        event.preventDefault();
        if (reactFlowInstance) {
            const type = event.dataTransfer.getData('application/reactflow');
            const position = reactFlowInstance.project({x: event.clientX, y: event.clientY - 40});
            const newNode: Node = {
                id: getId(),
                type,
                position,
                data: {label: `${type} node`},
            };

            setElements((es: Elements) => es.concat(newNode));
        }

    };
    return (
        <div className="Scene">
            <ReactFlow
                elements={elements}
                onElementsRemove={onElementsRemove}
                onLoad={onLoad}
                onConnect={onConnect}
                deleteKeyCode={46}
                snapToGrid={true}
                snapGrid={[25, 25]}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onElementClick={captureElementClick ? onElementClick : undefined}
            >
                <Controls/>
                <Background>
                    gap={25}
                    size={1}
                </Background>
            </ReactFlow>
        </div>
    );
};
export default Scene;