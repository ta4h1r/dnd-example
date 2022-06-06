import React from 'react'

import { useDrag, useDragLayer, useDrop } from "react-dnd"
import { getEmptyImage } from 'react-dnd-html5-backend'

function NewBlock({ blockProps }) {

    // Drag event handler 
    const [{ isDragging, coordinates }, drag] = useDrag(() => ({
        type: "new-block",
        item: blockProps,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        })
    }))

    return (
        <div
            ref={drag}
            style={{
                borderColor: isDragging ? blockProps.draggingBorderColor : blockProps.staticBorderColor,
                borderWidth: 1, borderStyle: "solid",

                padding: 10,
                width: 50, height: 50,

                display: 'flex', flex: 1,
            }}
        >
            <p>
                {blockProps.id}
            </p>
        </div>
    )
}

function BoardBlock({ blockProps, board, setBoard }) {

    // Drag event handler 
    const [{ isDragging }, drag, preview] = useDrag(() => ({
        type: "board-block",
        item: blockProps,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        })
    }))

    // Remove drag preview image
    React.useEffect(() => {
        preview(getEmptyImage(), { captureDraggingState: true })
    }, [])

    // Track coordinates
    const { itemType, item, sourceClientOffset } =
        useDragLayer((monitor) => ({
            item: monitor.getItem(),
            itemType: monitor.getItemType(),
            sourceClientOffset: monitor.getSourceClientOffset(),
        }))

    React.useEffect(() => {
        if (sourceClientOffset && isDragging) {
            const { x, y } = sourceClientOffset;
            const draggedBlock = (board.filter((block, index) => (block.id === blockProps.id)))[0];
            console.log(draggedBlock.id)
            const draggedBlockIndex = board.indexOf(draggedBlock)
            board[draggedBlockIndex]["x"] = x;
            board[draggedBlockIndex]["y"] = y;
            setBoard([...board])
        }
    }, [sourceClientOffset, isDragging])

    return (
        <div
            ref={drag}
            style={{
                borderColor: isDragging ? blockProps.draggingBorderColor : blockProps.staticBorderColor,
                borderWidth: 1, borderStyle: "solid",

                padding: 10,
                width: 50, height: 50,

                position: 'fixed',
                top: blockProps.y,
                left: blockProps.x

            }}
        >
            <text>
                {blockProps.id}
            </text>
            <p>
                {blockProps.x}, {blockProps.y}
            </p>
            <p>

            </p>
        </div>
    )
}


function DnD() {

    const [board, setBoard] = React.useState([]);
    const blocksList = [
        {
            id: 1,
            draggingBorderColor: "blue",
            staticBorderColor: "red",
        },
        {
            id: 2,
            draggingBorderColor: "blue",
            staticBorderColor: "red",
        },
        {
            id: 3,
            draggingBorderColor: "blue",
            staticBorderColor: "red",
        },
    ];

    function makeid(length) {
        var result = '';
        var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    const addBlockToBoard = (blockProps, coordinates) => {
        board.push({
            ...blockProps,
            ...coordinates,
            id: makeid(6),
        })
        setBoard([...board])
    };


    // Drop event handler 
    const [{ isOver, coordinates }, drop] = useDrop(() => ({
        accept: "new-block",
        drop: (item, monitor) => {
            const delta = monitor.getDifferenceFromInitialOffset()
            const clientOffset = monitor.getClientOffset();
            const initialSourceOffset = monitor.getInitialSourceClientOffset(); 
            const dropResult = monitor.getDropResult()
            const sourceClientOffset = monitor.getSourceClientOffset()
            // console.log("DELTA", delta)
            // console.log("CLIENT OFFSET", clientOffset)
            // console.log("INITIAL SOURCE OFFSET", initialSourceOffset)
            // console.log("DROP RESULT", dropResult)
            // console.log("SOURCE CLIENT OFFSET",sourceClientOffset)
            let left = Math.round(sourceClientOffset.x)
            let top = Math.round(sourceClientOffset.y)
            addBlockToBoard(item, {x: left, y: top})
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));


    return (
        <>




            <div
                style={{
                    borderColor: "black",
                    borderWidth: 1, borderStyle: "solid",

                    display: 'flex', flex: 1, flexDirection: "horizontal",

                }}

            >

                <div className="Blocks"

                    style={{
                        borderColor: "black",
                        borderWidth: 1, borderStyle: "dashed",

                        minWidth: 100, height: 400,
                        flex: 0,

                    }}

                >
                    {blocksList.map((blockProps, index) => {
                        return <NewBlock
                            key={`a-${index}`}
                            blockProps={blockProps} />;
                    })}
                </div>



                <div className="Board" ref={drop}
                    style={{
                        borderColor: "black",
                        borderWidth: 1, borderStyle: "dashed",

                        height: 400,
                        display: 'flex', flex: 1
                    }}
                >
                    {board.map((blockProps, index) => {
                        return <BoardBlock
                            key={`b-${index}`}
                            board={board}
                            setBoard={setBoard}
                            blockProps={blockProps} />;
                    })}
                </div>





            </div>




        </>
    )
}

export default DnD