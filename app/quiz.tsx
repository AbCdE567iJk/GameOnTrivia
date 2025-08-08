import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, LayoutAnimation } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';

// Helper function to shuffle an array
const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const QuizScreen = () => {
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isOptionDisabled, setIsOptionDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://opentdb.com/api.php?amount=10&category=15&difficulty=medium&type=multiple');
      const data = await response.json();
      if (data.results) {
        // Format the questions to match our app's structure
        const formattedQuestions = data.results.map((q: any) => ({
          ...q,
          options: shuffleArray([...q.incorrect_answers, q.correct_answer]),
          correctAnswer: q.correct_answer,
        }));
        setQuestions(formattedQuestions);
      }
    } catch (e) {
      setError('Failed to fetch questions. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // useFocusEffect will refetch questions every time the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchQuestions();
      // Reset state when screen is re-focused for a new game
      setCurrentQuestionIndex(0);
      setScore(0);
      setSelectedOption(null);
      setIsOptionDisabled(false);
    }, [])
  );


  const handleOptionPress = (option: string) => {
    if (isOptionDisabled) return;
    setSelectedOption(option);
    setIsOptionDisabled(true);
    if (option === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextPress = () => {
    // Add animation for the next question
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsOptionDisabled(false);
    } else {
      router.push(`/score?score=${score}&total=${questions.length}`);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>Loading Questions...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.nextButton} onPress={fetchQuestions}>
          <Text style={styles.nextButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No questions available.</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <View style={styles.container}>
      <View style={styles.questionCounterContainer}>
        <Text style={styles.questionCounterText}>
          Question {currentQuestionIndex + 1}/{questions.length}
        </Text>
      </View>
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
      </View>
      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option: string) => {
          const isSelected = selectedOption === option;
          const isCorrect = option === currentQuestion.correctAnswer;
          let buttonStyle: any = [styles.optionButton];
          if (selectedOption) {
            if (isSelected) buttonStyle.push(isCorrect ? styles.correctOption : styles.incorrectOption);
            else if (isCorrect) buttonStyle.push(styles.correctOption);
          }
          return (
            <TouchableOpacity key={option} style={buttonStyle} onPress={() => handleOptionPress(option)} disabled={isOptionDisabled}>
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {selectedOption && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// ... keep all the same styles, but add these new ones for loading/error states
const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#FFFFFF',
    fontSize: 16,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  // ... Paste all the other styles from the previous step here
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    padding: 20,
    justifyContent: 'space-between',
  },
  questionCounterContainer: {
    alignItems: 'center',
    padding: 10,
    marginTop: 40,
  },
  questionCounterText: {
    color: '#AEAEB2',
    fontSize: 18,
    fontWeight: 'bold',
  },
  questionContainer: {
    backgroundColor: '#2C2C2E',
    borderRadius: 15,
    padding: 20,
    minHeight: 150,
    justifyContent: 'center',
    marginBottom: 20,
  },
  questionText: {
    color: '#FFFFFF',
    fontSize: 22,
    textAlign: 'center',
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  optionButton: {
    backgroundColor: '#3A3A3C',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  correctOption: {
    backgroundColor: '#34C759', // Green
    borderColor: '#FFFFFF',
  },
  incorrectOption: {
    backgroundColor: '#FF3B30', // Red
  },
  nextButton: {
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default QuizScreen;