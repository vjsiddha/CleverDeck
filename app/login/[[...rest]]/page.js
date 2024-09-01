'use client'; // This line ensures that the component is run on the client side only

import React, { useEffect } from 'react';
import { Container, Box, Typography, Paper, Divider } from '@mui/material';
import { SignIn } from '@clerk/nextjs';

export default function Login() {
  // Optional: Use this effect if you need to interact with db or analytics when the component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Any client-side only code can go here
    }
  }, []);

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          background: 'linear-gradient(to bottom, #000000, #333399)',
          color: 'white',
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #ff00cc, #333399)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Sign In to Flashcard SaaS
        </Typography>
        <Divider sx={{ my: 3, backgroundColor: 'white' }} />
        <SignIn
          path="/login"
          routing="path"
          signUpUrl="/signup"
          appearance={{
            variables: {
              colorPrimary: '#ff0077',
              colorBackground: '#333399',
              colorText: 'white',
              fontFamily: 'inherit',
            },
            layout: {
              socialButtonsPlacement: 'top',
              logoPlacement: 'none',
            },
            elements: {
              card: { background: 'transparent' },
            },
          }}
        />
      </Paper>
    </Container>
  );
}
