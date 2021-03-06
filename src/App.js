import React, {Component} from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation.js';
import Logo from './components/Logo/Logo.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/Rank/Rank.js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import SignIn from './components/SignIn/SignIn.js';
import Register from './components/Register/Register.js';
import Modal from './components/Modal/Modal'
import Profile from './components/Profile/Profile'
import './App.css';


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

const initalState = {
  input: '',
      imageUrl: '',
      boxes:[],
      route: 'signin',
      isSignedIn: false,
      isProfileOpen: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: '',
        pet: '',
        age: ''
      }
} 

class App extends Component {

  constructor(){
    super();
    this.state=initalState
  }

  componentDidMount(){
    const token = window.sessionStorage.getItem('token');
    if (token) {
      fetch('http://192.168.99.100:3000/signin', {
        method: 'post',
        headers: {
          'Content-Type':'application/json',
          'Authorization': token
        }
      })
      .then(res=>res.json())
      .then(data => {
        if (data && data.id){
          fetch(`http://192.168.99.100:3000/profile/${data.id}`, {
            method: 'get',
            headers: {
              'Content-Type':'application/json',
              'Authorization': token
            }
          })
          .then(resp=>resp.json())
          .then(user=>{
            if (user && user.email) {
              this.loadUser(user);
              this.onRouteChange('home')
            }
          })
        }
      })
      .catch(console.log)
    }
  }

  loadUser = (data)=>{
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
      pet: data.pet,
      age: data.age
    }})
  }


  calculateFaceLocations = (data)=>{

    if (!(data && data.outputs)) {
      return null
    }

    return data.outputs[0].data.regions.map(face=>{
      const clarifaiFace = face.region_info.bounding_box;
      const image = document.getElementById("inputImage");
      const width = Number(image.width);
      const height = Number(image.height);
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width-(clarifaiFace.right_col*width),
        bottomRow: height - (clarifaiFace.bottom_row*height),
      }
    })
    

  }

  displayFaceBoxes = (boxes)=>{
    if (!boxes)
      return
    this.setState({boxes: boxes});
  }

  onInputChange=(event)=>{
    this.setState({input: event.target.value})
  }

  onSubmit=()=>{
    this.setState({imageUrl: this.state.input})
    fetch('http://192.168.99.100:3000/imageurl', {
          method: 'post',
          headers: {'Content-Type':'application/json', 'Authorization': window.sessionStorage.getItem('token')},
          body: JSON.stringify({
            input: this.state.input
          })
        })
    .then(response=>response.json())
    .then(response => {
      if(response){
        fetch('http://192.168.99.100:3000/image', {
          method: 'put',
          headers: {'Content-Type':'application/json','Authorization': window.sessionStorage.getItem('token')},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(response=>response.json())
        .then(count=>{
          if (count !== 'Unauthorized')
            this.setState(Object.assign(this.state.user, {entries: count}))
        })
        .catch(console.log)
      }
      this.displayFaceBoxes(this.calculateFaceLocations(response))
    })
    .catch(err=>console.log(err))

  }

  onRouteChange = (route)=>{
    if(route==='signout'){
      fetch('http://192.168.99.100:3000/signout', {
        method: 'delete',
        headers: {'Content-Type':'application/json','Authorization': window.sessionStorage.getItem('token')},
      }).then(res=>{
        console.log('Response: ' + res)
        if (res.status===200 || res.status===304) {
          window.sessionStorage.removeItem('token');
          return this.setState(initalState);
        } else {
          console.log('Could not signout')
        }
      })
    } else if(route==='home'){
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }

  toggleModal = () => {
    this.setState(prevState => ({
      ...prevState,
      isProfileOpen: !prevState.isProfileOpen
    }))
  }

  render(){
    const {isSignedIn, imageUrl, route, boxes, isProfileOpen, user} = this.state;
    return (
      <div className="App">
        <Particles className="particles"
          params={particlesOptions}
        />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange} toggleModal={this.toggleModal}/>
        {isProfileOpen &&
        <Modal >
          <Profile isProfileOpen={isProfileOpen} toggleModal={this.toggleModal} user={user} loadUser={this.loadUser}/>
        </Modal>}
        {route==='home' ? 
            <div>
              <Logo/>
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>
              <ImageLinkForm onInputChanged={this.onInputChange} onButtonSubmit={this.onSubmit}/>
              <FaceRecognition imageUrl={imageUrl} boxes={boxes}/>
            </div>
          : (
              route==='signin' ?
              <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
              :
              <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>

            )
        }
        
      </div>
    );
  }
  
}

export default App;
