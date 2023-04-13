export default function loadLinks(linkSources) {
	document.querySelector('#show').textContent = "Loading..."
	document.querySelector('#show').style.cursor = "not-allowed"
	const promises = [];

	for (let i = 0; i < linkSources.length; i++) {
		const promise = fetch(linkSources[i])
			.then(response => {
				return response.json()
			}).then((data) => {
				return data.data[0]
			});
		promises.push(promise);
	}

	return Promise.all(promises);
}

const animes = ['Fate', 'Naruto', 'sword-art-online', 'Inuyasha', 'Tokyo-Ghoul', 'Chainsaw-Man', 'Bleach', 'My-Hero-Academia', 'Steins-Gate', 'OreGairu:-My-Teen-Romantic-Comedy-SNAFU', "Fullmetal Alchemist: Brotherhood", "Hunter x Hunter", "Gintama ", "Legend of the Galactic Heroes", "Your Name", "Attack on Titan,Your Lie in April", 'Haikyu!!', 'Death Note', 'One Piece', 'Dragon Ball Z']

function shuffleArray(array) {
	const shuffledArray = [...array];

	for (let i = shuffledArray.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
	}

	let links = []

	for (let i = 0; i < shuffledArray.length; i++) {
		links.push(`https://kitsu.io/api/edge/anime?filter[text]=${shuffledArray[i]}`)
	}

	return links;
}

const shuffledArray = shuffleArray(animes);

loadLinks(shuffledArray).then((res) => {
	document.querySelector('#show').textContent = "Start a test"
	document.querySelector('#show').style.cursor = "pointer"
	let elements = ''
	let btnCounter = 0;
	let counterPrecent = 0;
	let rightAnswer
	document.querySelector('#show').addEventListener('click', () => {
		document.querySelector('#show').style.display = 'none'
		document.querySelector('#submitTheAnswer').style.display = 'flex'
		btnCounter += 1
		putItem(btnCounter)
	})

	function putItem(btnCounter) {
		if (btnCounter > res.length) {
			let message = `
			<p class="show__message">You have got ${CountYourScore()}</p>
			`

			function CountYourScore() {

				if (counterPrecent <= 5) {
					return `${counterPrecent}! Try this again!`
				}
				if (counterPrecent <= 10) {
					return `${counterPrecent}! Not bad but I believe that you can try better!`
				}
				if (counterPrecent <= 15) {
					return `${counterPrecent}! Pretty good!`
				}
				if (counterPrecent <= 15) {
					return `${counterPrecent}! WOW you are incredable`
				}

			}
			document.querySelector('.show__items').insertAdjacentHTML('afterbegin', message)
			document.querySelector('#submitTheAnswer').style.display = 'none'
			document.querySelector('#show').style.display = 'flex'
			document.querySelector('#show').textContent = 'Restart'
			document.querySelector('#show').addEventListener('click', () => {
				window.location.reload();
			})

			return
		}
		for (let i = btnCounter - 1; i < btnCounter; i++) {
			rightAnswer = res[i].attributes.titles.en.toLowerCase()
			elements = `
			<div class="show__item">
				<img class="show__img" src="${res[i].attributes.posterImage.original}" />
				<input class="show__input" type="text"/>
			<div>
			`
			document.querySelector('.show__items').insertAdjacentHTML('afterbegin', elements)
		}
	}


	document.querySelector('#submitTheAnswer').addEventListener('click', () => {
		let input = document.querySelector('.show__input').value
		input = input.toLowerCase()
		if (rightAnswer == input || (rightAnswer.includes(input) && input !== '')) {
			counterPrecent += 1
		}

		document.querySelector('.show__item').remove()
		btnCounter += 1
		putItem(btnCounter)
	})
}).catch((err) => {
	console.log(err)
})