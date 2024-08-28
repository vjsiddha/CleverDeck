"use client";

import { useEffect, useState } from 'react';
import { Container, Grid, Card, CardContent, Typography, CardActionArea, Box } from '@mui/material';
import { useUser } from '@clerk/nextjs';
import { doc, collection, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import db from '../../firebase';

export default function FlashcardsPage() {
  console.log("FlashcardsPage Loaded");

  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});  // Track which cards are flipped
  const router = useRouter();

  useEffect(() => {
    async function getFlashcards() {
      if (!user) return;
      const docRef = doc(collection(db, 'users'), user.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const collections = docSnap.data().flashcards || [];
        setFlashcards(collections);
      } else {
        await setDoc(docRef, { flashcards: [] });
      }
    }
    getFlashcards();
  }, [user]);

  const handleCardClick = (index) => {
    setFlipped(prev => ({ ...prev, [index]: !prev[index] }));  // Flip the clicked card
  };

  return (
    <Container maxWidth="md">
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {flashcards.map((flashcard, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ 
              transformStyle: 'preserve-3d',
              transition: 'transform 0.6s',
              transform: flipped[index] ? 'rotateY(180deg)' : 'none',
              cursor: 'pointer',
              backgroundColor: '#2c2c2c', // Card background color to match theme
              color: '#fff' // Text color for contrast
            }} onClick={() => handleCardClick(index)}>
              <CardContent sx={{
                position: 'relative',
                transformStyle: 'preserve-3d',
                height: '150px'
              }}>
                <Box sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Typography variant="h5" component="div">
                    {flashcard.question} {/* Changed from 'front' to 'question' */}
                  </Typography>
                </Box>
                <Box sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'rotateY(180deg)'
                }}>
                  <Typography variant="h5" component="div">
                    {flashcard.answer} {/* Changed from 'back' to 'answer' */}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
