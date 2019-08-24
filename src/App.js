import React, {Component} from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation.js';
import Logo from './components/Logo/Logo.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/Rank/Rank.js';
import Clarifai from 'clarifai';
import './App.css';


const app = new Clarifai.App({
 apiKey: '459c1054278d4c6fa4fd9b5011de32b5',
});

const particlesOptions = {
    particles: {
        number: {
          value: 80,
          density: {
            enable: true,
            value_area: 800
          }
        }
    }
  }

class App extends Component {

  constructor(){
    super();
    this.state={
      input: '',
    }
  }

  onInputChange=(event)=>{
    console.log(event.target.value);
  }

  onSubmit=()=>{
    console.log("click");
    app.models.predict("a403429f2ddf4b49b307e318f00e528b", "https://samples.clarifai.com/face-det.jpg").then(
      function(response) {
        console.log(response)
      },
      function(err) {
        // there was an error
      }
    );
  }


  render(){
    return (
      <div className="App">
        <Particles className="particles"
          params={particlesOptions}
        />
        <Navigation/>
        <Logo />
        <Rank/>
        <ImageLinkForm onInputChanged={this.onInputChange} onButtonSubmit={this.onSubmit}/>
      </div>
    );
  }
  
}

export default App;
