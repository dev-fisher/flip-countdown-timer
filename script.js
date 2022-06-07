let initialNumbers = {
	days: 100,
	hours: 60,
	minutes: 60,
	seconds: 60,
};

function timeBreakdown(timeBetween) {
	const total_hours = Math.floor(timeBetween / 3600);

	return {
		days: Math.floor(total_hours / 24),
		hours: Math.floor(total_hours % 24),
		minutes: Math.floor(timeBetween / 60) % 60,
		seconds: timeBetween % 60,
	};
}

function calculateTimeDiff(fromDate, toDate) {
	if (toDate === 'now') toDate = new Date();
	return Math.ceil((fromDate - toDate) / 1000);
}

function calculateCounterVals(timeStr) {
	const countToDate = new Date(timeStr);
	const currentDate = new Date().setSeconds(new Date().getSeconds() + 1);
	return timeBreakdown(calculateTimeDiff(countToDate, currentDate));
}

function startCountdown(endTime) {
	const countToDate = new Date(endTime);
	let prevTimeBetweenDates;
	setInterval(() => {
		const currentDate = new Date();
		const timeBetweenDates = calculateTimeDiff(countToDate, 'now');
		flipCards(timeBetweenDates);

		prevTimeBetweenDates = timeBetweenDates;
	}, 500);
}

function flipCards(timeBetween) {
	const time = timeBreakdown(timeBetween);

	flipCard(document.querySelector('[data-days]'), formatCardNumber(time.days));
	flipCard(
		document.querySelector('[data-hours]'),
		formatCardNumber(time.hours)
	);
	flipCard(
		document.querySelector('[data-minutes]'),
		formatCardNumber(time.minutes)
	);
	flipCard(
		document.querySelector('[data-seconds]'),
		formatCardNumber(time.seconds)
	);
}

const units = ['seconds', 'minutes', 'hours', 'days'];

function resetCards(endTime) {
	const openingValues = calculateCounterVals(endTime);
	setCardsNumbers(initialNumbers);
	const resetTimer = setInterval(() => {
		for (let i = 0; i < units.length; i++) {
			if (initialNumbers[units[i]] > openingValues[units[i]]) {
				updateFlip(units[i], --initialNumbers[units[i]], true);
			}
		}
	}, 20);
}

function formatCardNumber(num) {
	if (num < 10) {
		return '0' + num.toString();
	} else return num.toString();
}

function updateFlip(elem, val, fast = 0) {
	flipCard(
		document.querySelector('[data-' + elem + ']'),
		formatCardNumber(val),
		fast
	);
}

function setCardsNumbers(numbersObj) {
	for (let i = 0; i < units.length; i++) {
		updateFlip(units[i], numbersObj[units[i]], true);
	}
}

function flipCard(card, newNumber, fast = 0) {
	const topHalf = card.querySelector('.top');
	const startNumber = topHalf.textContent;
	if (newNumber === startNumber) return;

	const bottomHalf = card.querySelector('.bottom');

	const topFlip = document.createElement('div');
	if (fast) topFlip.classList.add('fast');
	topFlip.classList.add('top-flip');

	const bottomFlip = document.createElement('div');
	if (fast) bottomFlip.classList.add('fast');
	bottomFlip.classList.add('bottom-flip');

	top.textContent = startNumber;
	bottomHalf.textContent = startNumber;
	topFlip.textContent = startNumber;
	bottomFlip.textContent = newNumber;

	topFlip.addEventListener('animationstart', (event) => {
		topHalf.textContent = newNumber;
	});
	topFlip.addEventListener('animationend', (event) => {
		topFlip.remove();
	});
	bottomFlip.addEventListener('animationend', (event) => {
		bottomHalf.textContent = newNumber;
		bottomFlip.remove();
	});
	card.append(topFlip, bottomFlip);
}

function triggerCountdown(endTime) {
	resetCards(endTime);
	setTimeout(() => startCountdown(endTime), 1000);
}

triggerCountdown('2022-06-30T09:35:41.000Z');
