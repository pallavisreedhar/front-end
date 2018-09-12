import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FoodRecognition from './components/FoodRecognition/FoodRecognition';
import './App.css';

const app = new Clarifai.App({
 apiKey: 'e9f101adace1466883f784806f3e98bb'
});

const particlesOptions = {
  particles: {
    number: {
      value: 60,
      density: {
        enable:true,
        value_area: 800
      }
    }
  }
} /*partical configuration*/

const initialState = {
    input:'', /*state of the input can change*/
    imageUrl:'',
    //box:{},
    ingred:[],
    route:'signin',
    isSignedin: false,
    user: {
      id:'',
      name:'',
      email:'',
      entries:0,
      joined: ''
    }
}

class App extends Component {
  constructor(){
    super();
    this.state= initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
        id:data.id,
        name:data.name,
        email:data.email,
        entries:data.entries,
        joined: data.joined
    }})
  }

  calculateFood = (data) => {
      const foodList= data.outputs[0].data.concepts.length;
      var ingred = [];
      for (var i = 0; i < foodList; i++) {
          ingred.push(data.outputs[0].data.concepts[i].name);
          ingred.push(Math.floor(data.outputs[0].data.concepts[i].value*100) + '%');
      }
      return ingred
  }

  displayIngredients = (ingred) => { 
    this.setState({ingred:ingred})
  }

  onInputChange = (event) => {
    this.setState({input:event.target.value});
  } /*function is listening for an event
  logs the change when an event occurs (for testing)*/

  onButtonSubmit = () => {
    this.setState({imageUrl:this.state.input});
    /*set the state of imageUrl to the current state of input*/
    app.models
      .predict(
        Clarifai.FOOD_MODEL, 
        this.state.input)
    .then(response => {
      if(response) {
        fetch('http://localhost:3000/image',{
          method:'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(response=> response.json())
        .catch(console.log('could not get entries 1'))
        .then(count => {
          this.setState(Object.assign(this.state.user, {entries: count}))
        })
        .catch(console.log('could not get entries 2'))
        this.calculateFood(response)
        this.displayIngredients(this.calculateFood(response))
      }
    })
    .catch(err => console.log(err));
    /*this is the code that clarifai gave us to connect to the API*/
  }

  onRouteChange = (route) => {
    if (route === 'signout'){
      this.setState(initialState)
    } 
    else if (route === 'home'){
      this.setState({isSignedin:true})
    }
    this.setState({route:route});
  }

  render() {
    const { isSignedin, imageUrl, route,ingred } = this.state;
    return (
      <div className="App">
        <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation isSignedin={isSignedin} onRouteChange={this.onRouteChange}/>
        {route === 'home'
          ? <div>
              <Logo/>
              <Rank name={this.state.user.name} entries= {this.state.user.entries}/>
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit}
              /> 
              {/*passes the property "onInputChange" to the 
              ImageLinkForm and feeds in the current state*/}
              <FoodRecognition imageUrl={imageUrl} ingred={ingred}/>
            </div>

          : (
              route === 'signin' 
              ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
              : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )        
        }
      </div>
    );
  }
}

export default App;
