'use client';

import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Grid, Card, CardContent, AppBar, Toolbar, List, ListItem, ListItemText, Button } from '@mui/material'; // Ensure Button is imported
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
            <Card sx={{ backgroundColor: '#2a2a2a', color: '#fff', borderRadius: 2, boxShadow: 4, padding: 3 }}>
              <CardContent>
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    borderBottom: '1px solid #ff0077', 
                    paddingBottom: 1, 
                    marginBottom: 2, 
                    background: 'linear-gradient(to right, #ff00cc, #333399)', 
                    WebkitBackgroundClip: 'text', 
                    WebkitTextFillColor: 'transparent' 
                  }}
                >
                  View Saved Flashcards
                </Typography>
                {Object.keys(folders).length === 0 ? (
                  <Typography variant="body2">There are no flashcard sets yet.</Typography>
                ) : (
                  <>
                    <List>
                      {Object.keys(folders).map((folderName) => (
                        <ListItem button key={folderName} onClick={() => handleFolderClick(folderName)} sx={{ borderBottom: '1px solid #444', paddingY: 1 }}>
                          <ListItemText primary={folderName} />
                        </ListItem>
                      ))}
                    </List>
                    {selectedFolder && (
                      <>
                        <Typography variant="h6" sx={{ mt: 4, mb: 2, color: '#ff0077' }}>
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
                                padding: 2,
                                boxShadow: 3,
                                borderRadius: 2
                              }}>
                                <CardContent>
                                  <Typography variant="body1" gutterBottom>Question:</Typography>
                                  <Typography variant="body2">{flashcard.front}</Typography>
                                  <Typography variant="body1" gutterBottom sx={{ mt: 2 }}>Answer:</Typography>
                                  <Typography variant="body2">{flashcard.back}</Typography>
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      </>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* View Saved Review Sheets */}
          <Grid item xs={12} md={6}>
            <Card sx={{ backgroundColor: '#2a2a2a', color: '#fff', borderRadius: 2, boxShadow: 4, padding: 3 }}>
              <CardContent>
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    borderBottom: '1px solid #ff0077', 
                    paddingBottom: 1, 
                    marginBottom: 2, 
                    background: 'linear-gradient(to right, #ff00cc, #333399)', 
                    WebkitBackgroundClip: 'text', 
                    WebkitTextFillColor: 'transparent' 
                  }}
                >
                  View Saved Review Sheets
                </Typography>
                {Object.keys(reviewSheets).length === 0 ? (
                  <Typography variant="body2">There are no review sheets yet.</Typography>
                ) : (
                  <>
                    <List>
                      {Object.keys(reviewSheets).map((sheetName) => (
                        <ListItem button key={sheetName} onClick={() => handleReviewSheetClick(sheetName)} sx={{ borderBottom: '1px solid #444', paddingY: 1 }}>
                          <ListItemText primary={sheetName} />
                        </ListItem>
                      ))}
                    </List>
                    {selectedReviewSheet && (
                      <>
                        <Typography variant="h6" sx={{ mt: 4, mb: 2, color: '#ff0077' }}>
                          Review Sheet: "{selectedReviewSheet}"
                        </Typography>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                          {reviewSheets[selectedReviewSheet]}
                        </Typography>
                      </>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Generated Flashcards */}
          <Grid item xs={12} md={6}>
            <Card sx={{ backgroundColor: '#2a2a2a', color: '#fff', borderRadius: 2, boxShadow: 4, height: '100%', padding: 3 }}>
              <CardContent>
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    background: 'linear-gradient(to right, #ff00cc, #333399)', 
                    WebkitBackgroundClip: 'text', 
                    WebkitTextFillColor: 'transparent' 
                  }}
                >
                  Generated Flashcards
                </Typography>
                <Typography variant="h4" sx={{ color: '#ff00cc' }}>{flashcards.length}/100</Typography>
                <Typography variant="body2">Not bad</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Completed Flashcards */}
          <Grid item xs={12} md={6}>
            <Card sx={{ backgroundColor: '#2a2a2a', color: '#fff', borderRadius: 2, boxShadow: 4, height: '100%', padding: 3 }}>
              <CardContent>
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    background: 'linear-gradient(to right, #ff00cc, #333399)', 
                    WebkitBackgroundClip: 'text', 
                    WebkitTextFillColor: 'transparent' 
                  }}
                >
                  Completed Flashcards
                </Typography>
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
