import React from "react";
import {WordListProp, WordDTO} from "../props/Word";
import {Badge, list, Stack, useMergeRefs} from "@chakra-ui/react";
import {DndContext} from '@dnd-kit/core';
import {useDraggable} from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities';
import {useDroppable} from '@dnd-kit/core';
import {type} from "node:os";
import {combineWords} from "../api/wordsApi";


const Word: React.FC<WordDTO> = ({ emoji, word, isNew }) => {

    // Make draggable
    const {attributes, listeners, setNodeRef: setNodeDraggableRef, transform} = useDraggable({
        id: word,
    });
    // Make droppable
    const {isOver, setNodeRef: setDroppableNodeRef} = useDroppable({
        id: word,
    });
    const refs = useMergeRefs(setNodeDraggableRef, setDroppableNodeRef);
    const style = {
        // Outputs `translate3d(x, y, 0)`
        transform: CSS.Translate.toString(transform),
    };


    let color = isNew ? "green" : "gray";
    return (
        <Badge colorScheme={color} p={2} m={1} display={"inline-flex"} ref={refs} style={style} {...listeners} {...attributes}>
            {emoji} {word}
        </Badge>
    )
}

export const WordList: React.FC<WordListProp> = ({ words, addWord }) => {
    async function handleDragEnd(event: any) {
        const {active, over} = event;

        const word1 = active.id;
        const word2 = over.id;
        const word = await combineWords(word1, word2);
        addWord(word);
    }

    return (
        // <Stack >
        <DndContext onDragEnd={handleDragEnd}>
            {words.map((word) =>
                (
                    <Word word={word.word} emoji={word.emoji} id={word.id} isNew={word.isNew}/>
                )
            )}
        </DndContext>
        // </Stack>
    )
}

