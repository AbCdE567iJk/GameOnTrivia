import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
const HomeScreen = () => {
    return (
        <View style={styles.container}>
            <Text style = {styles.title}>GameOn Trivia</Text>
            <Text style = {styles.description}>Test your knowledge of the gaming world!</Text>

            <Link href="/quiz" asChild>
            <TouchableOpacity style = {styles.button}>
                <Text style={styles.buttonText}>Start Quiz</Text>
            </TouchableOpacity>
            </Link>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#1C1C1E', // A dark background
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    color: '#AEAEB2', // A light grey color
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#007AFF', // A vibrant blue
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 15,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
export default HomeScreen;