import React from 'react';

const Result = ({name,value}) => {
	return (
		<div>
			Ingredient: {name}, Probability: {value} 
		</div>
	);
}

export default Result;