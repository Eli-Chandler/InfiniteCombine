import React from "react";
import {WordListProp, WordDTO} from "../props/Word";
import {Badge, Stack} from "@chakra-ui/react";

const Word: React.FC<WordDTO> = ({ emoji, word, isNew }) => {
    console.log(isNew)
    if (isNew) {
        return (
            <Badge colorScheme={"yellow"}>
                {emoji} {word}
            </Badge>
        )
    } else {
        return (
            <Badge colorScheme={"purple"}>
                {emoji} {word}
            </Badge>
        )
    }
}

export const WordList: React.FC<WordListProp> = ({ words }) => {
    return (
        <Stack direction="column">
            {words.map((word) =>
                (
                    <Word word={word.word} emoji={word.emoji} id={word.id} isNew={word.isNew}/>
                )
            )}
        </Stack>
    )
}
