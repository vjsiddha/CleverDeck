'use client';

import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Grid, Card, CardContent, Button, Chip, AppBar, Toolbar } from '@mui/material';
import { useRouter } from 'next/navigation';
import { SignedIn, UserButton } from '@clerk/nextjs';

export default function Dashboard() {
  const router = useRouter();
  const [flashcards, setFlashcards] = useState([]);
  const [generatedCount, setGeneratedCount] = useState(0);

  useEffect(() => {
    // Fetch saved folders and flashcards from localStorage
    const savedFolders = JSON.parse(localStorage.getItem('folders')) || {};

    // Convert savedFolders object to an array of folder data
    const savedFlashcards = Object.keys(savedFolders).map(folder => ({
      folderName: folder,
      flashcards: savedFolders[folder]
    }));

    setFlashcards(savedFlashcards);
    setGeneratedCount(savedFlashcards.reduce((acc, set) => acc + set.flashcards.length, 0));
  }, []);

  const handleFolderClick = (folderName) => {
    router.push(`/folder/${encodeURIComponent(folderName)}`);
  };

  return (
    <>
      {/* Fixed Header with Title on the Left and Dashboard on the Right */}
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

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          {/* View Saved Flashcards */}
          <Grid item xs={12} md={8}>
            <Card sx={{ backgroundColor: '#1a1a1a', color: '#fff', borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>View Saved Flashcards</Typography>
                {flashcards.length === 0 ? (
                  <Typography variant="body2">There are no flashcard sets yet.</Typography>
                ) : (
                  flashcards.map((set, index) => (
                    <Box key={index} sx={{ my: 2, cursor: 'pointer' }} onClick={() => handleFolderClick(set.folderName)}>
                      <Typography variant="h6">{set.folderName}</Typography>
                      <Typography variant="body2">{`${set.flashcards.length} flashcards`}</Typography>
                    </Box>
                  ))
                )}
                <Button variant="contained" sx={{ mt: 2, backgroundColor: '#ff0077', color: 'white', '&:hover': { backgroundColor: '#e6006e' } }}>
                  Create New Group
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Generated Flashcards */}
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: '#1a1a1a', color: '#fff', borderRadius: 2, boxShadow: 3, height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Generated Flashcards</Typography>
                <Typography variant="h4" sx={{ color: '#ff00cc' }}>{generatedCount}/100</Typography>
                <Typography variant="body2">Not bad</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Flashcards */}
          <Grid item xs={12} md={8}>
            <Card sx={{ backgroundColor: '#1a1a1a', color: '#fff', borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Recent Flashcards</Typography>
                {flashcards.length === 0 ? (
                  <Typography variant="body2">There are no flashcard sets yet.</Typography>
                ) : (
                  flashcards.slice(-3).map((set, index) => (
                    <Box key={index} sx={{ my: 2, cursor: 'pointer' }} onClick={() => handleFolderClick(set.folderName)}>
                      <Chip label={set.folderName} color="primary" />
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {set.flashcards.length} flashcards
                      </Typography>
                    </Box>
                  ))
                )}
                <Button variant="contained" sx={{ mt: 2, backgroundColor: '#ff0077', color: 'white', '&:hover': { backgroundColor: '#e6006e' } }}>
                  Create a Group
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Completed Flashcards */}
          <Grid item xs={12} md={4}>
            <Card sx={{ backgroundColor: '#1a1a1a', color: '#fff', borderRadius: 2, boxShadow: 3, height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Completed Flashcards</Typography>
                <Typography variant="h4" sx={{ color: '#ff00cc' }}>0</Typography>
                <Typography variant="body2">You need to do better!</Typography>
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </Container>
    </>
  );
}
