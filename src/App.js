import React from 'react';
import config from './config';
import io from 'socket.io-client';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import BottomBar from './BottomBar';
import './App.css';



class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      chat: [],
      content:'',
      name:'',
    };
  };

  componentDidMount(){
    this.socket = io(config[process.env.NODE_ENV].endpoint);

    this.socket.on('init',(msg)=>{
      this.setState((state)=>({
        chat: [...state.chat,...msg.reverse()],
      }),this.scrollToBottom);
    });

    this.socket.on('push',(msg)=>{
      this.setState((state)=>({
        chat:[...state.chat,msg],
      }),this.scrollToBottom);
    });
  }

  handleContent(event){
    this.setState({
      content:event.target.value,
    });
  }

  handleName(evemt){
    this.setState({
      name:event.target.value,
    });
  }

  handleSubmit(event){
    console.log(event);

    event.preventDefault();

    this.setState((state)=>{
      console.log(state);
      console.log('this', this.socket);

      this.socket.emit('message',{
        name:state.name,
        content:state.content,
      });
      
      return{
        chat: [...state.chat, {
          name:state.name,
          content:state.content,
        }],
        content:'',
      };
    },this.scrollToBottom);
  }

  scrollToBottom(){
    const chat = document.getElementById('chat');
    chat.scrollTop = chat.scrollHeight;
  }

  render(){
    return(
      <div className="App">
        <Paper id="chat" elevation={3}>
          {this.state.chat.map((el,index)=>{
            return (
              <div key={index}>
                <Typography variant="caption" className="name">
                  {el.name}
                </Typography>
                <Typography variant="body1" className="content">
                  {el.content}
                </Typography>
              </div>
            );
          })}
        </Paper>
        <BottomBar
          content={this.state.content}
          handleContent={this.handleContent.bind(this)}
          handleName={this.handleName.bind(this)}
          handleSubmit={this.handleSubmit.bind(this)}
          name={this.state.name}
        />
      </div>
    );
  }
};



export default App;
