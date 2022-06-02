import React from 'react'

import { useDrag, useDrop } from "react-dnd"


function NewBlock({ blockProps }) {

    // Drag event handler 
    const [{ isDragging }, drag] = useDrag(() => ({
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
                borderColor: isDragging ? blockProps?.draggingBorderColor : blockProps?.staticBorderColor,
                borderWidth: 1, borderStyle: "solid",

                padding: 10,
                width: 50, height: 50,

                display: 'flex', flex: 1 

            }}
        >
            <p>
                {blockProps?.id}
            </p>
        </div>
    )
}

function BoardBlock({ blockProps }) {

    // Drag event handler 
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "board-block",
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        })
    }))


    return (
        <div
            ref={drag}
            style={{
                borderColor: isDragging ? blockProps?.draggingBorderColor : blockProps?.staticBorderColor,
                borderWidth: 1, borderStyle: "solid",

                padding: 10,
                width: 50, height: 50,

                display: 'flex', flex: 1 

            }}
        >
            <p>
                {blockProps?.id}
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

    const addBlockToBoard = (blockProps) => {
        board.push(blockProps)
        setBoard([...board])

    };


    // Drop event handler 
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "new-block",
        drop: (item, monitor) => {
            addBlockToBoard(item)
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
                            blockProps={blockProps} />;
                    })}
                </div>





            </div>




        </>
    )
}

export default DnD