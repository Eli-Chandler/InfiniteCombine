-- Create the 'words' table
CREATE TABLE IF NOT EXISTS words (
    id SERIAL PRIMARY KEY,
    word VARCHAR(255) UNIQUE NOT NULL,
    emoji VARCHAR(255) NOT NULL
);

-- Create the 'word_combinations' table
CREATE TABLE IF NOT EXISTS word_combinations (
    id SERIAL PRIMARY KEY,
    word1_id INTEGER NOT NULL,
    word2_id INTEGER NOT NULL,
    combination_word_id INTEGER NOT NULL,
    UNIQUE(word1_id, word2_id),
    FOREIGN KEY (word1_id) REFERENCES words (id) ON DELETE CASCADE,
    FOREIGN KEY (word2_id) REFERENCES words (id) ON DELETE CASCADE,
    FOREIGN KEY (combination_word_id) REFERENCES words (id) ON DELETE CASCADE
);

-- Optional: Index for faster lookups on the 'words' table
CREATE INDEX IF NOT EXISTS idx_words_word ON words(word);

-- Optional: Index for faster lookups on the 'word_combinations' table
CREATE INDEX IF NOT EXISTS idx_word_combinations_word1_id_word2_id ON word_combinations(word1_id, word2_id);
