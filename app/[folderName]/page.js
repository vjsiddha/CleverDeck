'use client';
import { db } from '../../firebase'; // Ensure this matches the export in firebase.js

import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Grid, Card, CardContent, AppBar, Toolbar, Button } from '@mui/material';
import { useRouter, useParams } from 'next/navigation';
import { SignedIn, UserButton } from '@clerk/nextjs';

export default function FolderPage() {
  const router = useRouter();
  const { folderName } = useParams();
  const [flashcards, setFlashcards] = useState([]);
  const [isClient, setIsClient] = useState(false);

  // Ensure this code runs only on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      console.log("Fetching flashcards for folder:", folderName);
      const savedFolders = JSON.parse(localStorage.getItem('folders')) || {};
      console.log("Saved folders in localStorage:", savedFolders);
      const flashcardsInFolder = savedFolders[folderName] || [];
      console.log("Flashcards in this folder:", flashcardsInFolder);
      setFlashcards(flashcardsInFolder);
    }
  }, [folderName, isClient]);

  if (!isClient) {
    return null; // Avoid rendering until we're on the client
  }

  return (
    <>
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
                  <Card
                    sx={{ 
                      backgroundColor: '#333399', 
                      color: 'white', 
                      height: '100%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      padding: 2 
                    }}
                  >
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
