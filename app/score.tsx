import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ScoreScreen = () => {
  const { score, total } = useLocalSearchParams();
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const updateHighScore = async () => {
      try {
        const storedHighScore = await AsyncStorage.getItem('highScore');
        const currentHighScore = storedHighScore ? parseInt(storedHighScore, 10) : 0;
        
        const numericScore = parseInt(score as string, 10);
        if (numericScore > currentHighScore) {
          await AsyncStorage.setItem('highScore', numericScore.toString());
          setHighScore(numericScore);
        } else {
          setHighScore(currentHighScore);
        }
      } catch (e) {
        console.error("Failed to update high score.", e);
      }
    };
    
    updateHighScore();
  }, [score]);

  return (
    <View style={styles.container}>
      <Text style={styles.highScoreText}>High Score: {highScore}</Text>
      
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>You Scored</Text>
        <Text style={styles.scoreValue}>{score} / {total}</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <Link href="/quiz" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Play Again</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/" asChild>
          <TouchableOpacity style={[styles.button, styles.homeButton]}>
            <Text style={styles.buttonText}>Go to Home</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  highScoreText: {
    position: 'absolute',
    top: 60,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD60A', // Gold color for high score
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  scoreText: {
    fontSize: 24,
    color: '#AEAEB2',
    marginBottom: 10,
  },
  scoreValue: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  buttonsContainer: {
    width: '100%',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  homeButton: {
    backgroundColor: '#3A3A3C',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default ScoreScreen;