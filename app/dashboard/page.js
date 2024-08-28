'use client';

import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, AppBar, Toolbar, List, ListItem, ListItemText, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { SignedIn, UserButton } from '@clerk/nextjs';
import jsPDF from 'jspdf';

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
    if (selectedFolder === folderName) {
      setSelectedFolder(null);
      setFlashcards([]);
    } else {
      setSelectedFolder(folderName);
      setFlashcards(folders[folderName]);
      setSelectedReviewSheet(null);
    }
  };

  const handleReviewSheetClick = (sheetName) => {
    if (selectedReviewSheet === sheetName) {
      setSelectedReviewSheet(null);
    } else {
      setSelectedReviewSheet(sheetName);
      setSelectedFolder(null);
    }
  };

  const handleGenerateTest = async (testFolder) => {
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: `Flashcards: ${JSON.stringify(folders[testFolder])}, Review Sheet: ${reviewSheets[testFolder] || ""}`,
          generateTest: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate test');
      }

      const { testQuestions } = await response.json();

      if (testQuestions.length === 0) {
        throw new Error('No test questions generated');
      }

      const doc = new jsPDF();
      let startY = 20;
      const lineHeight = 10;
      const margin = 10;
      const pageWidth = doc.internal.pageSize.width;
      const textWidth = pageWidth - margin * 2;
      const pageHeight = doc.internal.pageSize.height;

      doc.setFontSize(20);
      doc.text(`Test for ${testFolder}`, margin, startY);
      startY += lineHeight + 10;

      doc.setFontSize(16);
      doc.text("Test Questions:", margin, startY);
      startY += lineHeight;

      testQuestions.forEach((q, index) => {
        if (startY + 2 * lineHeight > pageHeight) {
          doc.addPage();
          startY = margin;
        }
        const questionLines = doc.splitTextToSize(`${index + 1}. ${q.question}`, textWidth);
        questionLines.forEach(line => {
          doc.text(line, margin, startY);
          startY += lineHeight;
        });

        const answerLines = doc.splitTextToSize(`Answer: ${q.answer}`, textWidth);
        answerLines.forEach(line => {
          doc.text(line, margin, startY);
          startY += lineHeight;
        });

        startY += 5;
      });

      doc.save(`${testFolder}_Test.pdf`);

    } catch (error) {
      console.error("Error generating test:", error.message);
      alert(`Error generating test: ${error.message}`);
    }
  };

  const getTotalFlashcards = () => {
    return Object.values(folders).reduce((acc, folder) => acc + folder.length, 0);
  };

  const getTotalReviewSheets = () => {
    return Object.values(reviewSheets).reduce((acc, folder) => acc + folder.length, 0);
  };

  return (
    <>
      <AppBar position="fixed" sx={{ background: 'black' }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => router.push('/')}>
            CleverDeck
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
                      {Object.keys(folders).map((folderName, index) => (
                        <ListItem button key={index} onClick={() => handleFolderClick(folderName)} sx={{ borderBottom: '1px solid #444', paddingY: 1 }}>
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
                      {Object.keys(reviewSheets).map((sheetName, index) => (
                        <ListItem button key={index} onClick={() => handleReviewSheetClick(sheetName)} sx={{ borderBottom: '1px solid #444', paddingY: 1 }}>
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

          {/* Test Yourself */}
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
                  Test Yourself
                </Typography>
                <Typography variant="body2" sx={{ color: 'gray', mb: 2 }}>
                  Please select a folder to test yourself on. The test will be generated in PDF format.
                </Typography>
                {Object.keys(folders).length === 0 && Object.keys(reviewSheets).length === 0 ? (
                  <Typography variant="body2">There are no flashcards or review sheets available for testing.</Typography>
                ) : (
                  <>
                    <List>
                      {[...new Set([...Object.keys(folders), ...Object.keys(reviewSheets)])].map((folderName, index) => (
                        <ListItem button key={index} onClick={() => handleGenerateTest(folderName)} sx={{ borderBottom: '1px solid #444', paddingY: 1 }}>
                          <ListItemText primary={`Test: ${folderName}`} />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Creations */}
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
      Creations
    </Typography>
    <Typography variant="body1" sx={{ color: '#fff' }}>
      - Flashcards: 74
    </Typography>
    <Typography variant="body1" sx={{ color: '#fff', mt: 1 }}>
      - Review Sheets: 5
    </Typography>
  </CardContent>
</Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
