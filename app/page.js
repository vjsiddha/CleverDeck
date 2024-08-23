'use client';

import React from 'react';
import { Container, Box, Typography, AppBar, Toolbar, Button, Grid, Card, CardContent, CardActions } from '@mui/material';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import UpdateIcon from '@mui/icons-material/Update';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleStartLearning = () => {
    router.push('/generate');
  };

  return (
    <>
      <AppBar position="static" sx={{ background: 'black' }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Flashcard SaaS
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/login">Login</Button>
            <Button color="inherit" href="/signup">Sign Up</Button>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ background: 'linear-gradient(to right, #ff00cc, #333399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Welcome to Flashcard SaaS
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            The easiest way to create flashcards from your text.
          </Typography>
          <Button variant="contained" sx={{ mt: 2, background: '#ff0077', '&:hover': { background: '#e6006e' } }} onClick={handleStartLearning}>
            Let the Learning Begin
          </Button>
        </Box>
      </Container>

      <Container maxWidth="md" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }} id="features">
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ background: 'linear-gradient(to right, #ff00cc, #333399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Features
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <Card sx={{ background: '#333', color: 'white', minHeight: 200 }}>
                <CardContent>
                  <AutoAwesomeIcon sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="h5">Automatic Generation</Typography>
                  <Typography variant="body1">
                    Just paste your text and we’ll create flashcards for you.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ background: '#333', color: 'white', minHeight: 200 }}>
                <CardContent>
                  <AccessTimeIcon sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="h5">Quick Learning</Typography>
                  <Typography variant="body1">
                    Efficient spaced repetition system for faster memorization.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ background: '#333', color: 'white', minHeight: 200 }}>
                <CardContent>
                  <UpdateIcon sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="h5">Updated Information</Typography>
                  <Typography variant="body1">
                    Access your flashcards from any device, anytime.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>

      <Container maxWidth="md" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }} id="pricing">
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ background: 'linear-gradient(to right, #ff00cc, #333399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Pricing
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6} md={5}>
              <Card sx={{ minHeight: 250, background: 'white', color: 'black' }}>
                <CardContent>
                  <Typography variant="h5">Basic</Typography>
                  <Typography variant="body1">$0/month</Typography>
                  <Typography variant="body2" component="div">
                    For individuals just getting started.
                  </Typography>
                  <ul style={{ margin: 0 }}>
                    <li>Unlimited flashcards</li>
                    <li>Basic AI flashcard creation</li>
                    <li>Limited support and features</li>
                  </ul>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center' }}>
                  <Button variant="contained" sx={{ background: '#ff0077', '&:hover': { background: '#e6006e' } }}>
                    Get Started
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={5}>
              <Card sx={{ minHeight: 250, background: 'white', color: 'black' }}>
                <CardContent>
                  <Typography variant="h5">Pro Plan - $10/month</Typography>
      
                  <Typography variant="body2" component="div">
                    For power users who need more.
                  </Typography>
                  <ul style={{ margin: 0 }}>
                    <li>All Basic features</li>
                    <li>Access on any device</li>
                    <li>Priority support and updates</li>
                  </ul>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center' }}>
                  <Button variant="contained" sx={{ background: '#ff0077', '&:hover': { background: '#e6006e' } }}>
                    Subscribe
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}
