'use client';

import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, TextField, Button, Grid, Card, Dialog, DialogActions, DialogContent, DialogTitle, Select, MenuItem } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { useRouter } from 'next/navigation';
import { SignedIn, UserButton } from '@clerk/nextjs';

export default function Generate() {
  const [text, setText] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});
  const [open, setOpen] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [folders, setFolders] = useState([]);

  const router = useRouter();

  useEffect(() => {
    // This will run on the client side
    const storedFolders = JSON.parse(localStorage.getItem('folders')) || {};
    setFolders(storedFolders);
  }, []);

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
      setFlipped({});
    } catch (error) {
      console.error('Error generating flashcards:', error);
      alert('An error occurred while generating flashcards. Please try again.');
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

    // Check if the folder already exists
    if (!updatedFolders[folder]) {
      updatedFolders[folder] = []; // Create the folder if it doesn't exist
    }

    // Add the flashcards to the folder
    updatedFolders[folder] = [...updatedFolders[folder], ...flashcards];

    // Save the updated folders back to local storage
    localStorage.setItem('folders', JSON.stringify(updatedFolders));
    
    // Update the state to reflect the changes
    setFolders(updatedFolders);
    setOpen(false);
    alert('Flashcards saved successfully!');
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

      {/* Adding padding to prevent content from being hidden behind the AppBar */}
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
                      padding: '20px', // Increase padding for better spacing
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: '150px',
                      boxSizing: 'border-box' // Ensure padding is included in the element's dimensions
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
                          padding: '10px 15px', // Ensure padding on all sides
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
                          padding: '10px 15px', // Ensure padding on all sides
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
                backgroundColor: '#ff0077', 
                '&:hover': { backgroundColor: '#e6006e' }, 
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

        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Save Flashcards</DialogTitle>
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

