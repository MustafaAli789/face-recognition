import React, {Component} from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation.js';
import Logo from './components/Logo/Logo.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/Rank/Rank.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
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
      imageUrl: '',
      box: {},
    }
  }

  calculateFaceLocation = (data)=>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputImage");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width-(clarifaiFace.right_col*width),
      bottomRow: height - (clarifaiFace.bottom_row*height),
    }

  }

  displayFaceBox = (box)=>{
    console.log(box)
    this.setState({box: box});
  }

  onInputChange=(event)=>{
    this.setState({input: event.target.value})
  }

  onSubmit=()=>{
    this.setState({imageUrl: this.state.input})
    app.models
    .predict(
    Clarifai.FACE_DETECT_MODEL,
        // URL
        this.state.input
    )
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err=>console.log(err))

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
        <FaceRecognition imageUrl={this.state.imageUrl}/>
      </div>
    );
  }
  
}

export default App;
