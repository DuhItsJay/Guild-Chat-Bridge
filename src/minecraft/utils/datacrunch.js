const abbreviateNumber = function (value) {
	let newValue = value
	const suffixes = ['', 'K', 'M', 'B', 'T']
	let suffixNum = 0
	while (newValue >= 1000) {
		newValue /= 1000
		suffixNum++
	}

	newValue = newValue.toPrecision(3)

	newValue += suffixes[suffixNum]
	return newValue
}

const numberWithCommas = function (x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const capitalizeFirstLetter = function (string) {
	return string.charAt(0).toUpperCase() + string.slice(1)
}

const getAverage = function (arr) {
	const average = arr.reduce((a, b) => a + b, 0) / arr.length

	if (!average) {
		return 0
	}

	return average
}

const getMedian = function (values) {
	if (!values.length) return 0

	values.sort((a, b) => a - b)

	const half = Math.floor(values.length / 2)

	if (values.length % 2) {
		return values[half]
	}

	return (values[half - 1] + values[half]) / 2.0
}

const getMean = function (numbers) {
	let total = 0

	for (let i = 0; i < numbers.length; i += 1) {
		total += numbers[i]
	}

	return total / numbers.length
}

const getMode = function (numbers) {
	numbers.sort((x, y) => x - y)

	let bestStreak = 1
	let bestElem = numbers[0]
	let currentStreak = 1
	let currentElem = numbers[0]

	for (let i = 1; i < numbers.length; i++) {
		if (numbers[i - 1] !== numbers[i]) {
			if (currentStreak > bestStreak) {
				bestStreak = currentStreak
				bestElem = currentElem
			}

			currentStreak = 0
			currentElem = numbers[i]
		}

		currentStreak++
	}

	return currentStreak > bestStreak ? currentElem : bestElem
}

module.exports = {
	abbreviateNumber,
	numberWithCommas,
	capitalizeFirstLetter,
	getAverage,
	getMedian,
	getMean,
	getMode,
}
