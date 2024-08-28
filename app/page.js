'use client';

import React from 'react';
import { Container, Box, Typography, AppBar, Toolbar, Button, Grid, Card, CardContent, CardActions } from '@mui/material';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import UpdateIcon from '@mui/icons-material/Update';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const { isSignedIn } = useUser();

  const handleStartLearning = () => {
    router.push('/generate');
  };

  const handleBasicPlan = () => {
    if (isSignedIn) {
      router.push('/generate');
    } else {
      router.push('/signup');
    }
  };

  const handleJoinWaitlist = () => {
    // Redirect to the Google Form
    window.location.href = "https://forms.gle/XvYCJ4jhQAVeQHic8";
  };

  const handleDashboardRedirect = () => {
    router.push('/dashboard');
  };

  return (
    <>
      <AppBar position="fixed" sx={{ background: 'black' }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            CleverDeck
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/login">Login</Button>
            <Button color="inherit" href="/signup">Sign Up</Button>
          </SignedOut>

          <SignedIn>
            <Button color="inherit" onClick={handleDashboardRedirect}>
              Dashboard
            </Button>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Toolbar />

      <Container maxWidth="md" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ background: 'linear-gradient(to right, #ff00cc, #333399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Welcome to CleverDeck
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            The easiest way to create flashcards from your text.
          </Typography>
          <Button variant="contained" sx={{ mt: 2, background: '#ff0077', '&:hover': { background: '#e6006e' } }} onClick={handleStartLearning}>
            Let the Learning Begin
          </Button>
        </Box>
      </Container>

      <Container maxWidth="md" sx={{ my: 8 }} id="features">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ background: 'linear-gradient(to right, #ff00cc, #333399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Features
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <Card sx={{ background: '#333', color: 'white', minHeight: 250, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <CardContent>
                  <AutoAwesomeIcon sx={{ fontSize: 40, mb: 2, color: '#ff00cc' }} />
                  <Typography variant="h5">Automatic Generation</Typography>
                  <Typography variant="body1">
                    Just paste your text and we’ll create flashcards for you.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ background: '#333', color: 'white', minHeight: 250, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <CardContent>
                  <AccessTimeIcon sx={{ fontSize: 40, mb: 2, color: '#ff00cc' }} />
                  <Typography variant="h5">Quick Learning</Typography>
                  <Typography variant="body1">
                    Efficient spaced repetition system for faster memorization.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ background: '#333', color: 'white', minHeight: 250, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <CardContent>
                  <UpdateIcon sx={{ fontSize: 40, mb: 2, color: '#ff00cc' }} />
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

      <Container maxWidth="md" sx={{ my: 8 }} id="pricing">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h2" component="h2" gutterBottom sx={{ background: 'linear-gradient(to right, #ff00cc, #333399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Pricing
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={20} sm={4} md={4}>
              <Card sx={{ background: '#333', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: '20px', minHeight: 350 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ color: '#ff00cc' }}>Basic</Typography>
                  <Typography variant="h6" sx={{ margin: '10px 0' }}>$0/month</Typography>
                  <Typography variant="body2" sx={{ marginBottom: '15px' }}>For individuals just getting started.</Typography>
                  <ul style={{ listStyleType: 'disc', paddingLeft: '20px', textAlign: 'left' }}>
                    <li>Unlimited flashcards</li>
                    <li>Basic AI flashcard creation</li>
                    <li>Limited support and features</li>
                  </ul>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', width: '100%' }}>
                  <Button variant="contained" sx={{ background: '#ff0077', '&:hover': { background: '#e6006e' }, width: '100%' }} onClick={handleBasicPlan}>
                    Get Started
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
              <Card sx={{ background: '#333', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: '20px', minHeight: 350 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ color: '#ff00cc' }}>Pro</Typography>
                  <Typography variant="h6" sx={{ margin: '10px 0' }}>Coming Soon</Typography>
                  <Typography variant="body2" sx={{ marginBottom: '15px' }}>PDF and YouTube video conversion features.</Typography>
                  <ul style={{ listStyleType: 'disc', paddingLeft: '20px', textAlign: 'left' }}>
                    <li>All Basic features</li>
                    <li>PDF to flashcard conversion</li>
                    <li>YouTube video to flashcard conversion</li>
                    
                  </ul>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', width: '100%' }}>
                  <Button variant="contained" sx={{ background: '#ff0077', '&:hover': { background: '#e6006e' }, width: '100%' }} onClick={handleJoinWaitlist}>
                    Join the Waitlist
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
              <Card sx={{ background: '#333', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: '20px', minHeight: 350 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ color: '#ff00cc' }}>Premium</Typography>
                  <Typography variant="h6" sx={{ margin: '10px 0' }}>Coming Soon</Typography>
                  <Typography variant="body2" sx={{ marginBottom: '15px' }}>Team collaboration, advanced analytics, and more.</Typography>
                  <ul style={{ listStyleType: 'disc', paddingLeft: '20px', textAlign: 'left' }}>
                    <li>All Pro features</li>
                    <li>Team collaboration tools</li>
                    <li>Advanced analytics and insights</li>
                    
                  </ul>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', width: '100%' }}>
                  <Button variant="contained" sx={{ background: '#ff0077', '&:hover': { background: '#e6006e' }, width: '100%' }} onClick={handleJoinWaitlist}>
                    Join the Waitlist
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
