import React from 'react';
import './FoodRecognition.css';

const FoodRecognition = ({imageUrl,ingred}) => {
		return (
		<div>
			<img id='inputimage' alt=' ' src={imageUrl} width='500px' height='500px' className='absolute mt2 ma4 center pa4'/>
			<div className='white ma4' align="right" > 
				{ingred.map(ingred => <p>{ingred}</p>)}
			</div>
		</div>
		);
	//}
}

export default FoodRecognition;