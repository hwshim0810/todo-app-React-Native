import React from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, Dimensions, Platform, ScrollView } from 'react-native';
import { AppLoding, AppLoading } from 'expo';
import uuidv1 from 'uuid/v1';

import Todo from './Todo';


const { height ,width } = Dimensions.get("window");

export default class App extends React.Component {

  state = {
    newTodo: '',
    loadedToDos: false,
    toDos: {}
  }

  componentDidMount = () => {
    this._loadToDos();
  }

  render() {
    
    const { newTodo, loadedToDos, toDos } = this.state;
    
    if (!loadedToDos) {
      return <AppLoading />;
    }

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}>What To Do</Text>
        <View style={styles.card}>
          <TextInput 
            style={styles.input} 
            placeholder={"New To Do"}
            value={newTodo} 
            onChangeText={this._controlNewTodo}
            placeholderTextColor={"#999"}
            returnKeyType={"done"}
            autoCorrect={false}
            onSubmitEditing={this._addTodo}
            underlineColorAndroid="transparent"
          />
          <ScrollView contentContainerStyle={styles.toDos}>
            {Object.values(toDos).map(toDo => (
              <Todo 
                key={toDo.id} 
                deleteTodo={this._deleteTodo} 
                uncompleteToDo={this._uncompleteToDo}
                completeToDo={this._completeToDo}
                updateToDo={this._updateToDo}
                {...toDo} 
              />
            ))}
          </ScrollView>
        </View>
      </View>
    );
  }

  _controlNewTodo = text => {
    this.setState({
      newTodo: text
    });
  };

  _loadToDos = () => {
    this.setState({
      loadedToDos: true
    });
  };

  _addTodo = () => {
    const { newTodo } = this.state;
    
    if (newTodo !== '') {
      this.setState(prevState => {
        const ID = uuidv1();
        const newTodoObject = {
          [ID]: {
            id: ID,
            isCompleted: false,
            text: newTodo,
            createdAt: Date.now()
          }
        };
        const newState = {
          ...prevState,
          newTodo: '',
          toDos: {
            ...prevState.toDos,
            ...newTodoObject
          }
        };
        return { ...newState };
      });
    }
  };

  _deleteTodo = id => {
    this.setState(prevState => {
        const toDos = prevState.toDos;
        delete toDos[id];
        const newState = {
          ...prevState,
          ...toDos
        };
        return {...newState};
    });
  };

  _uncompleteToDo = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: false
          }
        }
      };
      return {...newState};
    });
  };

  _completeToDo = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: true
          }
        }
      };
      return {...newState};
    });
  };

  _updateToDo = (id, text) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            text: text
          }
        }
      };
      return {...newState};
    });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F23657',
    alignItems: 'center'
  },
  title : {
    color: "white",
    fontSize: 30,
    marginTop: 50,
    marginBottom: 30,
    fontWeight: "200"
  },
  card: {
    backgroundColor: "white",
    flex: 1,
    width: width - 25,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: "rgba(50,50,50)",
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
          height: -1, // Top
          width: 0 // Bottom
        }
      },
      android: {
        elevation: 3
      }
    })
  },
  input: {
    padding: 20,
    borderBottomColor: "#bbb",
    borderBottomWidth: 1,
    fontSize: 25
  },
  toDos: {
    alignItems: "center"
  }
});
