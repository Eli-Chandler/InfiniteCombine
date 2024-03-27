import React, { useState, useEffect } from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { fetchInitialWords } from './api/wordsApi';
import { WordDTO } from "./props/Word";
import { WordList } from "./components/WordList";
import { WordForm } from "./components/WordForm";

const App: React.FC = () => {
    const [words, setWords] = useState<WordDTO[]>([]);

    useEffect(() => {
        const loadInitialWords = async () => {
            const initialWords = await fetchInitialWords();
            setWords(initialWords);
        };

        loadInitialWords();
    }, []);

    const addWord = (newWord: WordDTO) => {
        setWords(prevWords => {
            // First, mark all existing words as not new
            const updatedWords = prevWords.map(word => ({ ...word, isNew: false }));

            // Check if the newWord exists in the array
            const wordIndex = updatedWords.findIndex(word => word.id === newWord.id);

            if (wordIndex !== -1) {
                // Replace the existing word with newWord
                updatedWords[wordIndex] = { ...newWord, isNew: true };
            } else {
                // Append newWord to the array
                updatedWords.push({ ...newWord, isNew: true });
            }

            // Return the updated state
            return updatedWords;
        });
    }

    return (
        <ChakraProvider>
            <Box p={4}>
                <WordList words={words} addWord={addWord}/>
            </Box>
        </ChakraProvider>
    );
}

export default App;
