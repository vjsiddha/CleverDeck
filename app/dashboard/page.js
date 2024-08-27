'use client';

import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Grid, Card, CardContent, Button, AppBar, Toolbar, List, ListItem, ListItemText } from '@mui/material';
import { useRouter } from 'next/navigation';
import { SignedIn, UserButton } from '@clerk/nextjs';

export default function Dashboard() {
  const router = useRouter();
  const [flashcards, setFlashcards] = useState([]);
  const [folders, setFolders] = useState({});
  const [reviewSheets, setReviewSheets] = useState({});
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedReviewSheet, setSelectedReviewSheet] = useState(null);

  useEffect(() => {
    const savedFolders = JSON.parse(localStorage.getItem('folders')) || {};
    const savedReviewSheets = JSON.parse(localStorage.getItem('reviewSheets')) || {};
    setFolders(savedFolders);
    setReviewSheets(savedReviewSheets);
  }, []);

  const handleFolderClick = (folderName) => {
    setSelectedFolder(folderName);
    setFlashcards(folders[folderName]);
    setSelectedReviewSheet(null);
  };

  const handleReviewSheetClick = (sheetName) => {
    setSelectedReviewSheet(sheetName);
    setSelectedFolder(null);
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

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          {/* View Saved Flashcards */}
          <Grid item xs={12} md={6}>
            <Card sx={{ backgroundColor: '#1a1a1a', color: '#fff', borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>View Saved Flashcards</Typography>
                {Object.keys(folders).length === 0 ? (
                  <Typography variant="body2">There are no flashcard sets yet.</Typography>
                ) : (
                  <>
                    <List>
                      {Object.keys(folders).map((folderName) => (
                        <ListItem button key={folderName} onClick={() => handleFolderClick(folderName)}>
                          <ListItemText primary={folderName} />
                        </ListItem>
                      ))}
                    </List>
                    {selectedFolder && (
                      <>
                        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                          Flashcards in "{selectedFolder}"
                        </Typography>
                        <Grid container spacing={2}>
                          {flashcards.map((flashcard, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                              <Card sx={{
                                backgroundColor: '#333399',
                                color: 'white',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 2
                              }}>
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
                      </>
                    )}
                  </>
                )}
                <Button variant="contained" sx={{ mt: 2, backgroundColor: '#ff0077', color: 'white', '&:hover': { backgroundColor: '#e6006e' } }}>
                  Create New Group
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* View Saved Review Sheets */}
          <Grid item xs={12} md={6}>
            <Card sx={{ backgroundColor: '#1a1a1a', color: '#fff', borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>View Saved Review Sheets</Typography>
                {Object.keys(reviewSheets).length === 0 ? (
                  <Typography variant="body2">There are no review sheets yet.</Typography>
                ) : (
                  <>
                    <List>
                      {Object.keys(reviewSheets).map((sheetName) => (
                        <ListItem button key={sheetName} onClick={() => handleReviewSheetClick(sheetName)}>
                          <ListItemText primary={sheetName} />
                        </ListItem>
                      ))}
                    </List>
                    {selectedReviewSheet && (
                      <>
                        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                          Review Sheet: "{selectedReviewSheet}"
                        </Typography>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                          {reviewSheets[selectedReviewSheet]}
                        </Typography>
                      </>
                    )}
                  </>
                )}
                <Button variant="contained" sx={{ mt: 2, backgroundColor: '#ff0077', color: 'white', '&:hover': { backgroundColor: '#e6006e' } }}>
                  Create New Review Sheet
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Generated Flashcards */}
          <Grid item xs={12} md={6}>
            <Card sx={{ backgroundColor: '#1a1a1a', color: '#fff', borderRadius: 2, boxShadow: 3, height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Generated Flashcards</Typography>
                <Typography variant="h4" sx={{ color: '#ff00cc' }}>{flashcards.length}/100</Typography>
                <Typography variant="body2">Not bad</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Completed Flashcards */}
          <Grid item xs={12} md={6}>
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
