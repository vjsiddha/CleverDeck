'use client';

import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Grid, Card, CardContent, AppBar, Toolbar, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { SignedIn, UserButton } from '@clerk/nextjs';

export default function FolderPage() {
  const router = useRouter();
  const { folderName } = useParams();  // Get the folder name from the URL
  const [flashcards, setFlashcards] = useState([]);

  useEffect(() => {
    // Fetch the flashcards for the specific folder from localStorage
    const savedFolders = JSON.parse(localStorage.getItem('folders')) || {};
    const flashcardsInFolder = savedFolders[folderName] || [];
    setFlashcards(flashcardsInFolder);
  }, [folderName]);

  return (
    <>
      {/* Fixed Header with Title on the Left and Dashboard on the Right */}
      <AppBar position="fixed" sx={{ background: 'black' }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => router.push('/dashboard')}>
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
          <Typography variant="h4" component="h1" gutterBottom>
            {folderName}
          </Typography>
          {flashcards.length === 0 ? (
            <Typography variant="body2">This folder has no flashcards yet.</Typography>
          ) : (
            <Grid container spacing={2}>
              {flashcards.map((flashcard, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ backgroundColor: '#333399', color: 'white', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 2 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Question:</Typography>
                      <Typography variant="body1">{flashcard.front}</Typography>
                      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Answer:</Typography>
                      <Typography variant="body1">{flashcard.back}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Container>
    </>
  );
}
