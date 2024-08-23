'use client';

import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Grid, Card, CardContent, CardActionArea } from '@mui/material';

export default function Generate() {
  const [text, setText] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});  // Track which cards are flipped

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert('Please enter some text to generate flashcards.');
      return;
    }

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: text,
      });

      if (!response.ok) {
        throw new Error('Failed to generate flashcards');
      }

      const data = await response.json();
      setFlashcards(data);
      setFlipped({});  // Reset flipped state when new cards are generated
    } catch (error) {
      console.error('Error generating flashcards:', error);
      alert('An error occurred while generating flashcards. Please try again.');
    }
  };

  const handleCardClick = (index) => {
    setFlipped(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          sx={{ 
            background: 'linear-gradient(to right, #ff00cc, #333399)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent' 
          }}
        >
          Generate Flashcards
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ color: 'gray', mb: 4 }}
        >
          Paste your text below and click "Generate Flashcards" to create your personalized flashcards.
        </Typography>
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text here..."
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          sx={{
            backgroundColor: '#fff',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#ccc',
              },
              '&:hover fieldset': {
                borderColor: '#888',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#333399',
              },
            },
          }}
        />
        <Button 
          variant="contained" 
          sx={{ mt: 3, backgroundColor: '#ff0077', '&:hover': { backgroundColor: '#e6006e' }, color: '#fff' }} 
          onClick={handleSubmit}
          size="large"
        >
          GENERATE FLASHCARDS
        </Button>
      </Box>

      {flashcards.length > 0 && (
        <Grid container spacing={2} sx={{ mt: 4 }}>
          {flashcards.map((flashcard, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                sx={{ 
                  backgroundColor: '#800080', 
                  color: 'white', 
                  cursor: 'pointer', 
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.6s', 
                  height: '200px', 
                  perspective: '1000px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }} 
                onClick={() => handleCardClick(index)}
              >
                <div 
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    textAlign: 'center',
                    transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.6s',
                  }}
                >
                  <div 
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      backfaceVisibility: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#800080',
                      color: 'white',
                      padding: '10px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <Typography variant="h6" align="center">
                      Question: {flashcard.front}
                    </Typography>
                  </div>
                  <div 
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      backfaceVisibility: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#800080',
                      color: 'white',
                      padding: '10px',
                      boxSizing: 'border-box',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    <Typography variant="h6" align="center">
                      Answer: {flashcard.back}
                    </Typography>
                  </div>
                </div>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
