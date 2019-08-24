import React from 'react';

const FaceRecognition = ({imageUrl})=>{
	return(
		<div>
			<div className="center">
				<img alt= '' src={imageUrl}/>
			</div>
		</div>		
	);
}
export default FaceRecognition;