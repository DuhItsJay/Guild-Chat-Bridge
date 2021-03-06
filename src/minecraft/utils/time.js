/**
 * Formats a given amount of seconds into a humanized string representing the given amount of seconds.
 *
 * Example:
 *  5 seconds
 *  8 minutes and 2 seconds
 *  a hour, 23 minutes and 58 seconds
 *  13 hours, 53 minutes and 27 seconds
 *  a day, 3 hours, 46 minutes and 39 seconds
 *
 * @param time The time in seconds that should for humanized
 */
exports.humanizeTime = function (time) {
	const seconds = Math.floor(time >= 60 ? time % 60 : time)
	const minutes = Math.floor((time = time / 60) >= 60 ? time % 60 : time)
	const hours = Math.floor((time = time / 60) >= 24 ? time % 24 : time)
	const days = Math.floor((time = time / 24) >= 30 ? time % 30 : time)
	const months = Math.floor((time = time / 30) >= 12 ? time % 12 : time)
	const years = Math.floor(time / 12)

	let humanizedTime = []

	if (years > 0) {
		humanizedTime.push(years == 1 ? 'a year' : `${years} years`)
	}

	if (months > 0) {
		humanizedTime.push(months == 1 ? 'a month' : `${months} months`)
	}

	if (days > 0) {
		humanizedTime.push(days == 1 ? 'a day' : `${days} days`)
	}

	if (hours > 0) {
		humanizedTime.push(hours == 1 ? 'a hour' : `${hours} hours`)
	}

	if (minutes > 0) {
		humanizedTime.push(minutes == 1 ? 'a minute' : `${minutes} minutes`)
	}

	if (seconds > 0) {
		humanizedTime.push(seconds == 1 ? 'a second' : `${seconds} seconds`)
	}

	if (humanizedTime.length < 2) {
		return humanizedTime.join(', ')
	}

	const lastElement = humanizedTime.pop()

	return humanizedTime.join(', ') + `, ${lastElement}`
}

exports.dateDiff = function (startingDate, endingDate) {
	var startDate = new Date(new Date(startingDate).toISOString().substr(0, 10))
	if (!endingDate) {
		endingDate = new Date().toISOString().substr(0, 10) // need date in YYYY-MM-DD format
	}
	var endDate = new Date(endingDate)
	if (startDate > endDate) {
		var swap = startDate
		startDate = endDate
		endDate = swap
	}
	var startYear = startDate.getFullYear()
	var february = (startYear % 4 === 0 && startYear % 100 !== 0) || startYear % 400 === 0 ? 29 : 28
	var daysInMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

	var yearDiff = endDate.getFullYear() - startYear
	var monthDiff = endDate.getMonth() - startDate.getMonth()
	if (monthDiff < 0) {
		yearDiff--
		monthDiff += 12
	}
	var dayDiff = endDate.getDate() - startDate.getDate()
	if (dayDiff < 0) {
		if (monthDiff > 0) {
			monthDiff--
		} else {
			yearDiff--
			monthDiff = 11
		}
		dayDiff += daysInMonth[startDate.getMonth()]
	}

	return yearDiff + ' years, ' + monthDiff + ' months, ' + dayDiff + ' days'
}
