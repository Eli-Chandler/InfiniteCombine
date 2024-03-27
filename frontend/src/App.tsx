import React, { Component } from 'react';
import axios from 'axios';

class Word {
    constructor(public word: string, public emoji: string, public id: number) {}

    static fromJson(json: any): Word {
        return new Word(json.word, json.emoji, json.id);
    }
}

class App extends Component {
    state = {
        words: [] as Word[]
    }

    async componentDidMount() {
        const response = await axios.get('http://localhost:3000/words/initial');
        this.setState({ words: response.data.map(Word.fromJson) });
    }

    async addWord(word: Word) {
        if (this.state.words.includes(word)) {
            return; // don't add duplicates
        }
        this.setState({ words: [...this.state.words, word] });
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <WordList words={this.state.words}/>
                    <WordForm addWord={this.addWord.bind(this)}/>
                </header>
            </div>
        );
    }
}

interface WordListProps {
    words: Word[];
}

class WordList extends Component<WordListProps> {
    render() {
        const words = this.props.words;

        return (
            <div>
                {words.map((word) => (
                    <div key={word.id}>
                        {word.word} - {word.emoji}
                    </div>
                ))}
            </div>
        );
    }
}

interface WordFormProps {
    addWord: (word: Word) => void;
}

class WordForm extends Component<WordFormProps> {
    handleSubmit = async (event: any) => {
        event.preventDefault();
        const word1: string = event.target.word1.value;
        const word2: string = event.target.word2.value;

        const response = await axios.get(`http://localhost:3000/words/combine?word1=${word1}&word2=${word2}`);
        const word = Word.fromJson(response.data);

        this.props.addWord(word);
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Word 1:
                    <input type="text" name="word1" />
                </label>
                <label>
                    Word 2:
                    <input type="text" name="word2" />
                </label>
                <button type="submit">Combine</button>
            </form>
        );
    }
}

export default App;