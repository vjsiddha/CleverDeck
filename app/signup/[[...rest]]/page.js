'use client';

import React from 'react';
import { Container, Box, Typography, Paper, Divider } from '@mui/material';
import { SignUp } from '@clerk/nextjs';
import { db } from '../../../firebase'; // Ensure this matches the export in firebase.js

export default function Signup() {
  return (
    <Container maxWidth="xs" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ p: 4, background: 'linear-gradient(to bottom, #000000, #333399)', color: 'white' }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', background: 'linear-gradient(to right, #ff00cc, #333399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Sign Up to CleverDeck
        </Typography>
        <Divider sx={{ my: 3, backgroundColor: 'white' }} />
        <SignUp 
          path="/signup" 
          routing="path" 
          signInUrl="/login"
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
              footerActionLink: { color: '#ff0077' },
            }
          }}
          additionalFields={[
            {
              name: 'confirmPassword',
              type: 'password',
              label: 'Confirm Password',
              placeholder: 'Confirm your password',
            },
          ]}
        />
      </Paper>
    </Container>
  );
}
