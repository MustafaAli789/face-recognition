import React from 'react';
import './Profile.css'

const Profile = ({isProfileOpen, toggleModal, user}) => {
    return (
        <div className='profile-modal'>
            <article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center bg-white">
				<main className="pa4 black-80 w-80">
                    <div className='header' style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <img
                            src="http://tachyons.io/img/logo.jpg"
                            className="br-100 h3 w3 dib" alt="avatar" />
                        <div className='modal-close' onClick={toggleModal}>&times;</div>	
                    </div>
                    <h1>{user.name}</h1>
                    <h4>{`Image Submitted: ${user.entries}`}</h4>
                    <p>{`Member since: ${new Date(user.joined).toLocaleDateString()}`}</p>
                    <hr />
                    <label className="mt2 fw6" htmlFor="user-name">Name: </label>
                    <input onChange={()=>{}} className="pa2 w-100 ba" type="text" placeholder={user.name} name="user-name"  id="user-name"/>
                    <label className="mt2 fw6" htmlFor="user-age">Age: </label>
                    <input onChange={()=>{}} className="pa2 w-100 ba" type="text" placeholder={user.age} name="user-age"  id="age"/>
                    <label className="mt2 fw6" htmlFor="user-pet">Pet:</label>
                    <input onChange={()=>{}} className="pa2 w-100 ba" type="text" placeholder={user.pet} name="user-pet"  id="pet"/>
                    <div className='mt4' style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                        <button className='b pa2 grow pointer hover-white w-40 bg-light-blue b--black-20'>Save</button>
                        <button className='b pa2 grow pointer hover-white w-40 bg-light-red b--black-20' onClick={toggleModal}>Cancel</button>
                    </div>
                </main>	
			</article>  
        </div>
    )
}

export default Profile;