'use client';

import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, TextField, Button, Grid, Card, Dialog, DialogActions, DialogContent, DialogTitle, Select, MenuItem, LinearProgress } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useRouter } from 'next/navigation';
import { SignedIn, UserButton } from '@clerk/nextjs';

export default function Generate() {
  const [text, setText] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [reviewSheet, setReviewSheet] = useState('');
  const [flipped, setFlipped] = useState({});
  const [open, setOpen] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [folders, setFolders] = useState([]);
  const [reviewFolders, setReviewFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [flashcardCount, setFlashcardCount] = useState(10); // Default value

  const router = useRouter();

  useEffect(() => {
    const storedFolders = JSON.parse(localStorage.getItem('folders')) || {};
    const storedReviewFolders = JSON.parse(localStorage.getItem('reviewFolders')) || {};
    setFolders(storedFolders);
    setReviewFolders(storedReviewFolders);
  }, []);

  const handleSubmit = async (generateReviewSheet = false) => {
    if (!text.trim()) {
      alert('Please enter some text to generate flashcards.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ text, generateReviewSheet, flashcardCount }), // Include flashcard count
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate flashcards');
      }

      const data = await response.json();
      setFlashcards(data.flashcards);

      if (generateReviewSheet) {
        setReviewSheet(data.reviewSheet);
      }

      setFlipped({});
    } catch (error) {
      console.error('Error generating flashcards:', error);
      setError('An error occurred while generating flashcards. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (index) => {
    setFlipped(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleSave = () => {
    setOpen(true);
  };

  const handleSaveToFolder = () => {
    if (!folderName && !selectedFolder) {
      alert('Please select or create a folder.');
      return;
    }

    const folder = folderName || selectedFolder;
    let updatedFolders = JSON.parse(localStorage.getItem('folders')) || {};
    let updatedReviewFolders = JSON.parse(localStorage.getItem('reviewFolders')) || {};

    // Save flashcards
    if (flashcards.length > 0) {
      if (!updatedFolders[folder]) {
        updatedFolders[folder] = [];
      }
      updatedFolders[folder] = [...updatedFolders[folder], ...flashcards];
      localStorage.setItem('folders', JSON.stringify(updatedFolders));
      setFolders(updatedFolders);
    }

    // Save review sheet
    if (reviewSheet) {
      if (!updatedReviewFolders[folder]) {
        updatedReviewFolders[folder] = [];
      }
      updatedReviewFolders[folder] = [...updatedReviewFolders[folder], reviewSheet];
      localStorage.setItem('reviewFolders', JSON.stringify(updatedReviewFolders));
      setReviewFolders(updatedReviewFolders);
    }

    setOpen(false);
    alert('Saved successfully!');
  };

  return (
    <>
      <AppBar position="fixed" sx={{ background: 'black' }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => router.push('/')}>
            Flashcard SaaS
          </Typography>
          <Button color="inherit" onClick={() => router.push('/dashboard')} sx={{ mr: 2 }}>
            Dashboard
          </Button>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Toolbar />

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
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" sx={{ color: 'gray', mb: 1 }}>
              Number of Flashcards:
            </Typography>
            <Select
              value={flashcardCount}
              onChange={(e) => setFlashcardCount(e.target.value)}
              sx={{ width: '100px' }}
            >
              {Array.from({ length: 25 }, (_, i) => i + 1).map((number) => (
                <MenuItem key={number} value={number}>
                  {number}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Button 
            variant="contained" 
            sx={{ mt: 3, backgroundColor: '#ff0077', '&:hover': { backgroundColor: '#e6006e' }, color: '#fff' }} 
            onClick={() => handleSubmit(false)}
            size="large"
            disabled={loading}
          >
            GENERATE FLASHCARDS
          </Button>
          <Button 
            variant="contained" 
            sx={{ mt: 2, backgroundColor: '#0077ff', '&:hover': { backgroundColor: '#0066e6' }, color: '#fff' }} 
            onClick={() => handleSubmit(true)}
            size="large"
            disabled={loading}
          >
            GENERATE FLASHCARDS AND TOPIC REVIEW
          </Button>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button 
              variant="contained" 
              sx={{ 
                background: 'linear-gradient(to right, #ff0077, #ff00cc)', 
                '&:hover': { background: 'linear-gradient(to right, #e6006e, #d600b2)' }, 
                color: '#fff', 
                width: '48%' 
              }} 
              onClick={() => handleSubmit(false)}
              size="large"
              disabled={loading}
            >
              GENERATE FLASHCARDS
            </Button>
            <Button 
              variant="contained" 
              sx={{ 
                background: 'linear-gradient(to right, #333399, #ff00cc)', 
                '&:hover': { background: 'linear-gradient(to right, #2e3192, #d600b2)' }, 
                color: '#fff', 
                width: '48%' 
              }} 
              onClick={() => handleSubmit(true)}
              size="large"
              disabled={loading}
            >
              GENERATE FLASHCARDS AND TOPIC REVIEW
            </Button>
          </Box>
          {loading && <LinearProgress sx={{ mt: 2 }} />}
        </Box>

        {error && (
          <Typography color="error" variant="body1" sx={{ mb: 4, textAlign: 'center' }}>
            {error}
          </Typography>
        )}

        {flashcards.length > 0 && (
          <>
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
                      height: 'auto', 
                      perspective: '1000px',
                      padding: '20px', 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: '150px',
                      boxSizing: 'border-box',
                      wordWrap: 'break-word', // Ensure text does not get cut off
                      whiteSpace: 'pre-wrap', // Ensure new lines are preserved
                    }} 
                    onClick={() => handleCardClick(index)}
                  >
                    <div 
                      style={{
                        position: 'relative',
                        width: '100%',
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
                          padding: '10px 15px', 
                          boxSizing: 'border-box',
                          wordWrap: 'break-word',
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
                          padding: '10px 15px', 
                          boxSizing: 'border-box',
                          transform: 'rotateY(180deg)',
                          wordWrap: 'break-word',
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
            <Button
              variant="contained"
              sx={{ 
                mt: 3, 
                background: 'linear-gradient(to right, #ff0077, #ff00cc)', 
                '&:hover': { background: 'linear-gradient(to right, #e6006e, #d600b2)' }, 
                color: '#fff',
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                mx: 'auto', 
                width: 'fit-content' 
              }}
              onClick={handleSave}
              size="large"
            >
              SAVE FLASHCARDS
            </Button>
          </>
        )}

        {reviewSheet && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Practice Sheet
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {reviewSheet}
            </Typography>
            <Button
              variant="contained"
              sx={{ 
                mt: 3, 
                background: 'linear-gradient(to right, #333399, #ff00cc)', 
                '&:hover': { background: 'linear-gradient(to right, #2e3192, #d600b2)' }, 
                color: '#fff',
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                mx: 'auto', 
                width: 'fit-content' 
              }}
              onClick={handleSave}
              size="large"
            >
              SAVE REVIEW SHEET
            </Button>
          </Box>
        )}

        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Save Flashcards/Review Sheet</DialogTitle>
          <DialogContent>
            <Typography>Choose a folder or create a new one:</Typography>
            <Select
              fullWidth
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              displayEmpty
              sx={{ mt: 2 }}
            >
              <MenuItem value="">None</MenuItem>
              {Object.keys(folders).map((folder, index) => (
                <MenuItem key={index} value={folder}>
                  {folder}
                </MenuItem>
              ))}
              {Object.keys(reviewFolders).map((folder, index) => (
                <MenuItem key={index} value={folder}>
                  {folder} (Review Sheet)
                </MenuItem>
              ))}
            </Select>
            <TextField
              fullWidth
              label="New Folder Name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSaveToFolder} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}

