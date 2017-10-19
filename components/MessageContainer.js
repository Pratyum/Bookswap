import React from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import firebase from 'firebase';
export default class MessageContainer extends React.Component {
  constructor(props){
      super(props);
      const user = firebase.auth().currentUser;
      this._messagesRef = firebase.database().ref("messages").child('PandP');
      this._messages = [];
      this.state = {
        messages: [],
      };
  }
  

  componentWillMount() {
    // console.log("Messages",this.state.messages);
    console.log("Current User",firebase.auth().currentUser);
    this._messagesRef.on('child_added', (child) => {
        console.log("Child",child,"Child Val",child.val());
        this.handleReceive(child.val());
    });
    // this.setState({
    //   messages: [
    //     {
    //       _id: 1,
    //       text: 'Hello developer',
    //       createdAt: new Date(),
    //       user: {
    //         _id: '3abc',
    //         name: 'React Native',
    //         avatar: 'https://facebook.github.io/react/img/logo_og.png',
    //       },
    //     },
    //     {
    //         _id: 2,
    //         text: 'Hello developer',
    //         createdAt: new Date(),
    //         user: {
    //           _id: '1def',
    //           name: 'React Native',
    //           avatar: 'https://facebook.github.io/react/img/logo_og.png',
    //         },
    //       },
    //       {
    //         _id: 3,
    //         text: 'Hello developer',
    //         createdAt: new Date(),
    //         user: {
    //           _id: '3abc',
    //           name: 'React Native',
    //           avatar: 'https://facebook.github.io/react/img/logo_og.png',
    //         },
    //       },
    //   ],
    // });
  }

  setMessages(messages) {
    this._messages = messages;
    // this.setState((previousState) => ({ 
    //   messages: GiftedChat.append(previousState.messages, messages),
    // }));
    this.setState({
      messages: messages,
    });
  }

  handleSend(message = {}) {
    
  }

  handleReceive(message = {}) {
    let flag = true;
    this._messages.map((msg)=>{
        console.log("msg",msg);

        if(msg._id===message._id){
            flag = false;
        }
    });
    console.log("Flag", flag);
    if(flag){
        this.setMessages(this._messages.concat(message));
    }
  }

  onSend(messages = []) {
    // console.log("Messages",messages);
    messages.map((msg)=>{
        this._messagesRef.push(msg);
    });
    // this.setState((previousState) => ({ 
    //   messages: GiftedChat.append(previousState.messages, messages),
    // }));
  }

  render() {
    // console.log("Messages",this.state.messages);
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={(messages) => this.onSend(messages)}
        user={{
          _id: firebase.auth().currentUser.uid,
        }}
      />
    );
  }

}