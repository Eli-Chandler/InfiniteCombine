import React from "react";
import {WordListProp, WordDTO, WordFormProp} from "../props/Word";
import {Badge, Button, Stack, FormLabel, FormControl, VStack, Input } from "@chakra-ui/react";
import { combineWords } from "../api/wordsApi";



export const WordForm: React.FC<WordFormProp> = ({ addWord }) => {
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const target = event.target as typeof event.target & {
            word1: { value: number };
            word2: { value: number };
        };
        const word1 = target.word1.value;
        const word2 = target.word2.value;

        const word = await combineWords(word1, word2);
        addWord(word);
    };

    return (
        <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
                <FormControl>
                    <FormLabel htmlFor="word1">Word 1:</FormLabel>
                    <Input id="word1" name="word1" />
                </FormControl>
                <FormControl>
                    <FormLabel htmlFor="word2">Word 2:</FormLabel>
                    <Input id="word2" name="word2" />
                </FormControl>
                <Button type="submit" colorScheme="blue">Combine</Button>
            </VStack>
        </form>
    );
};
