import React, { useRef, useState, } from 'react'

import { useDrag, useDragLayer, useDrop } from "react-dnd"
import { getEmptyImage } from 'react-dnd-html5-backend'

import Xarrow from "react-xarrows";


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


const ConnectPointsWrapper = ({ blockProps, handler, }) => {

    const boxId = blockProps.id;

    const connectPointStyle = {
        position: "absolute",
        width: 15,
        height: 15,
        borderRadius: "50%",
        background: "black"
    };
    const connectPointOffset = {
        left: { left: 0, top: "50%", transform: "translate(-50%, -50%)" },
        right: { left: "100%", top: "50%", transform: "translate(-50%, -50%)" },
        top: { left: "50%", top: 0, transform: "translate(-50%, -50%)" },
        bottom: { left: "50%", top: "100%", transform: "translate(-50%, -50%)" }
    };

    // const [position, setPosition] = useState({});
    // const [beingDragged, setBeingDragged] = useState(false);

    // Drag event handler 
    const [{ isDragging }, drag, preview] = useDrag(() => ({
        type: "connector",
        item: blockProps,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        })
    }))

    const ref1 = useRef()

    return (
        <React.Fragment>
            <div
                ref={drag}
                className="connectPoint"
                style={{
                    ...connectPointStyle,
                    ...connectPointOffset[handler],
                    // ...position
                }}
                draggable
                onMouseDown={e => e.stopPropagation()}
                onDragStart={e => {
                    console.log("Dragging connector", handler, boxId)
                    // setBeingDragged(true);
                    e.dataTransfer.setData("arrow", boxId);

                }}
                // onDrag={e => {
                //     setPosition({
                //         position: "fixed",
                //         left: e.clientX,
                //         top: e.clientY,
                //         transform: "none",
                //         opacity: 0
                //     });
                //     console.log("onDrag")
                // }}
                onDragEnd={e => {
                    console.log("onDragEnd")
                    // setPosition({});
                    // setBeingDragged(false);
                }}
            />
            {/* {isDragging ? <Xarrow start={boxId} end={ref1} /> : null} */}
        </React.Fragment>
    );
};


function BoardBlock({ blockProps, board, setBoard, addArrow, setArrows }) {

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

    // Track dragged coordinates
    const { itemType, item, sourceClientOffset } =
        useDragLayer((monitor) => ({
            item: monitor.getItem(),
            itemType: monitor.getItemType(),
            sourceClientOffset: monitor.getSourceClientOffset(),
        }))

    // Edit block coordinates based on drag
    React.useEffect(() => {
        if (isDragging) {
            const { x, y } = sourceClientOffset;
            const draggedBlock = (board.filter((block, index) => (block.id === blockProps.id)))[0];
            const draggedBlockIndex = board.indexOf(draggedBlock)
            board[draggedBlockIndex]["x"] = x;
            board[draggedBlockIndex]["y"] = y;
            setBoard([...board])
        }
    }, [sourceClientOffset, isDragging]);

    // Drop event handler 
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "connector",
        drop: (item, monitor) => {
            console.log(item)
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));


    return (
        <>
            <div
                ref={drop}
            >

                <div
                    id={blockProps.id}
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
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => {
                        console.log("DROP")
                        if (e.dataTransfer.getData("arrow") === blockProps.id) {
                            console.log(e.dataTransfer.getData("arrow"), blockProps.id);
                        } else {
                            const refs = { start: e.dataTransfer.getData("arrow"), end: blockProps.id };
                            addArrow(refs);
                            console.log("refs", refs);
                        }
                    }}

                >

                    {blockProps.id}


                    <div>
                        {blockProps.x}, {blockProps.y}
                    </div>


                    <ConnectPointsWrapper key={blockProps.id} blockProps={blockProps} handler={"right"} />
                </div>
            </div>
        </>
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
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "new-block",
        drop: (item, monitor) => {
            const sourceClientOffset = monitor.getSourceClientOffset()
            let left = Math.round(sourceClientOffset.x)
            let top = Math.round(sourceClientOffset.y)
            addBlockToBoard(item, { x: left, y: top })
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));



    const [arrows, setArrows] = useState([]);
    const addArrow = ({ start, end }) => {
        setArrows([...arrows, { start, end }]);
    };


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
                            key={`b-${index}-${blockProps.id}`}
                            board={board}
                            setBoard={setBoard}
                            blockProps={blockProps}
                            addArrow={addArrow}
                            setArrows={setArrows}
                        />;
                    })}

                    {arrows.map(ar => (
                        <Xarrow
                            start={ar.start}
                            end={ar.end}
                            key={ar.start + "-." + ar.start}
                        />
                    ))}
                </div>





            </div>




        </>
    )
}

export default DnD