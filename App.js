import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Platform,
  ScrollView,
  FlatList,
  // TextInput,
  // Button,
  KeyboardAvoidingView,
  ToastAndroid,
  AsyncStorage,
  TouchableOpacity,
} from 'react-native';

import {
  SearchBar,Input,Button,ListItem
} from 'react-native-elements'

import Icon from 'react-native-vector-icons/Feather'
import Icon2 from 'react-native-vector-icons/MaterialIcons'

//嫌いな書き方なので要修正
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;
// const STATUSBAR_HEIGHT = 0;

const TODO = "@todoapp.todo";

const TodoItem = (props)=>{
  // let textStyle = styles.todoItem;
  let icon = null;
  if(props.done === true){
    // textStyle = styles.todoItemDone
    icon = <Icon2 name="done" />
  }
  return(
      <TouchableOpacity onPress={props.onTapTodoItem}>
        {/*<Text style={textStyle}>{props.title}</Text>*/}
        <ListItem
          title={props.title}
          rightIcon={icon}
          bottomDivider
        />
      </TouchableOpacity>
  )
};

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todo: [],
      currentIndex: 0,
      inputText: "",
      filterText: "",
    }
  }

  componentDidMount() {
    this.loadTodo();
  }

  loadTodo = async () => {
    try{
      const todoString = await AsyncStorage.getItem(TODO);
      if (todoString) {
        const todo = JSON.parse(todoString);
        const currentIndex = todo.length;
        this.setState({todo: todo, currentIndex: currentIndex})
      }
    }catch (e) {
      console.log('##### ERR #####');
      console.log(e);
    }
  };

  saveTodo = async (todo) => {
    try {
      const todoString = JSON.stringify(todo);
      await AsyncStorage.setItem(TODO, todoString)
    }catch (e) {
      console.log('##### ERR #####');
      console.log(e);
    }
  };

  onAddItem = () => {
    const title = this.state.inputText;
    if (title === ""){
      return;
    }
    const index = this.state.currentIndex +1;
    const newTodo = {index: index, title: title, done: false};
    const todo =[...this.state.todo, newTodo];
    this.setState({
      todo: todo,
      currentIndex: index,
      inputText: ""
    });
    ToastAndroid.show('added TODO!', ToastAndroid.SHORT);
    this.saveTodo(todo);
  };

  onTapTodoItem = (todoItem) => {
    const todo = this.state.todo;
    const index = todo.indexOf(todoItem);
    todoItem.done = !todoItem.done;
    todo[index] = todoItem;
    this.setState({todo:todo});
    this.saveTodo(todo);
  };

  render() {
    //フィルタ機能
    const filterText = this.state.filterText;
    let todo = this.state.todo;
    if(filterText!==""){
      todo = todo.filter(t=>t.title.includes(filterText))
    }
    //platform設定
    const platform = Platform.OS === 'ios' ? 'ios' : 'android';

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          {/*検索部分*/}
          <SearchBar
              platform={platform}
              cancelButtonTitle="Cancel"
              onChangeText={(text) => this.setState({filterText: text})}
              onClear={()=>this.setState({filterText:""})}
              value={this.state.fillText}
              placeholder="検索..."
          />

          {/*todolist表示部分*/}
          <ScrollView style={styles.todolist}>
            <FlatList
                data={todo}
                extraData={this.state}
                renderItem={({item}) =>
                    <TodoItem
                        title={item.title}
                        done={item.done}
                        onTapTodoItem={() => this.onTapTodoItem(item)}
                    />
                }
                keyExtractor={(item, index) => "todo_" + item.index}
            />
          </ScrollView>
          {/*入力スペース*/}
          <View style={styles.input}>
            <Input
                onChangeText={(text) => this.setState({inputText: text})}
                value={this.state.inputText}
                containerStyle={styles.inputText}
            />
            {/*<View style={styles.inputButton}>*/}
              <Button
                  icon={
                    <Icon
                    name='plus'
                    size={30}
                    color='white'
                    />
                  }
                  title=""
                  onPress={this.onAddItem}
                  buttonStyle={styles.inputButton}
              />
            {/*</View>*/}
          </View>
        </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: STATUSBAR_HEIGHT,
    // marginBottom:50
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  // filter: {
  //   height: 30,
  //   borderBottomWidth:1
  //   // flexDirection: 'row'
  // },
  todolist: {
    flex: 1,
    // color: '#fff'
  },
  input: {
    height: 50,
    flexDirection: 'row',
    paddingRight: 10,
    // backgroundColor: '#ebebeb',
  },
  inputText: {
    paddingRight: 10,
    paddingLeft: 10,
    flex: 1,
    // color: '#fa0800',
  },
  inputButton: {
    // color: '#0000ff',
    width: 48,
    height: 48,
    borderWidth: 0,
    borderColor: 'transparent',
    borderRadius: 48,
    backgroundColor: '#ff6347'
  },
  todoItem:{
    fontSize:20,
    backgroundColor:"white"
  },
  todoItemDone:{
    fontSize: 20,
    backgroundColor:"red"
  }
});
