import React, { useState, useEffect } from "react";
import { FlatList, Text, View, Button, StyleSheet, Animated, ActivityIndicator, TouchableOpacity } from "react-native";
import axios from "axios";

function WordList() {
  const [wordList, setWordList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const spinValue = new Animated.Value(0);

  const fetchWords = async () => {
    try {
      const response = await axios.get('https://api.datamuse.com/words', {
        params: {
          rel_syn: 'angry', 
          max: 18              
        }
      })
      const updatedWordList = response.data.map((word) => {
        const firstLetter = word.word.charAt(0).toUpperCase();
        const restOfWord = word.word.slice(1);
        const modifiedWord = firstLetter + restOfWord;
        return { ...word, word: modifiedWord };
      });
      setWordList(updatedWordList);
      setIsLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error("Error fetching words:", error);
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWords();
  }, [refreshCounter]);


  const renderWordItem = ({ item }) => (
    <View style={styles.wordItem}>
      <Text style={styles.wordText}>{item.word}</Text>
    </View>
  );

  const handleRefresh = () => {
    setRefreshing(true);
    animateButtonRotation();
    setRefreshCounter((prevCounter) => prevCounter + 1);
  };


  const animateButtonRotation = () => {
    spinValue.setValue(0);
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };



  return (
    <View style={styles.container}>
     <View style={styles.appNamebar}>
        <Text style={styles.name}>WORDS APP</Text>
      </View>
      <View style= {styles.appContent}>
      {isLoading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={wordList}
          renderItem={renderWordItem}
          keyExtractor={(item, index) => index.toString()}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
       <Button
        title="Refresh"
        onPress={handleRefresh}
        disabled={refreshing}
        style={styles.refresh}
        color="black"
        backgroundColor="DE5F"
      />
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "green",
  },
  appContent: {
    flex: 1,
    bottom: 1,
    marginTop: 60,
  },
  refresh:{
    backgroundColor: "yellow",
    transform:  {rotate: "spin"}
  },
  appNamebar: {
    position: "absolute",
    backgroundColor: "#9DCC60",
    padding: 10,
    height: 60,
    width: 500,
    top: 10,
    marginBottom: 10
  },
  name: {
    fontSize: 36,
    color: "#fff",
    textAlign: "left",
  },
  wordItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#red",
    backgroundColor: "#DE5F",
    borderRadius: 5,
    marginBottom: 10,
  },
  wordText: {
    fontSize: 16,
    color: "grey",
  },
  loader: {
    marginVertical: 20,
  },

});

export default WordList;