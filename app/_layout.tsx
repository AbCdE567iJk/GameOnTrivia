import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

const RootLayout = () => {
  return (
    <>
    <Stack>
      {/* This line hides the header at the top of the screen */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </>
  );
};
export default RootLayout;