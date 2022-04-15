window.onload = function() {

    // First, I'll declare any global variables I'd like to have access to
    const episodesUrl = 'http://localhost:1337/episodes'
    const playButton = document.getElementById('play')
    const pauseButton = document.getElementById('pause')
    const seekForwardButton = document.getElementById('seekforward')
    const seekBackButton = document.getElementById('seekback')
    const sliderContainer = document.getElementById('rangeSlider')
    const innerBar = document.getElementById('innerBar')
    const contentHeadline = document.getElementById('contentHeadline')
    const contentLink = document.getElementById('contentLink')
    const contentImage = document.getElementById('contentImage')


    // Here is a generic fetch data function that I can use to grab what I need from the server
    function fetchData(url, callback) {
        fetch(url)
        .then(response => {
            return response.json();
        })
        .then((data) => {
            console.log('data', data)
            callback(data)
        })
        .catch((err) => {
            console.log(err);
        });
    }

    // Now, I'll get the info I need from the episodes file and use that to pass appropriate data to my podcast player function
    fetchData(episodesUrl, podcastPlayer)

    function podcastPlayer(data) {
        //TODO - right now I'm just grabbing the first audio info; come back to how to expand it
        let audioData = data[0]
        let audio = new Audio('http://localhost:1337' + data[0].audio)

        //Event Listeners
        playButton.addEventListener('click', playAudio.bind(this, audio))
        pauseButton.addEventListener('click', pauseAudio.bind(this, audio))
        seekForwardButton.addEventListener('click', sfAudio.bind(this, audio))
        seekBackButton.addEventListener('click', sbAudio.bind(this, audio))
        sliderContainer.addEventListener('click', rangeSlider.bind(this, audio))
        audio.addEventListener('timeupdate', audioCheck.bind(this, audio, audioData))
    }

    function audioCheck(audio, data) {

        //have the slider continuously update
        rangeSlider(audio)

        // Handle the markers
        let display = []

        data.markers.forEach((marker) => {
            let markerEnd = marker.start + marker.duration

            if (audio.currentTime > marker.start && audio.currentTime < markerEnd) {
                //I need to display!
                display.push(marker)
            } else {
                if (display.includes(marker)) {
                    //take it out of the array
                    let index = display.indexOf(marker)
                    display.splice(index, 1)
                }
            }

            if (display.length) {
                //display the marker
                displayMarker(display[0], audio)
            }
        })

        // Set pause button back to play at the end
        if (audio.currentTime === audio.duration) {
            playButton.classList.remove('hidden')
            pauseButton.classList.add('hidden')
        }
    }

    function displayMarker(marker, audio) {
        if (marker.content) {
            if (marker.type === 'text') {
                contentHeadline.innerHTML = marker.content
            } else {
                contentHeadline.innerHTML = ''
            }

            if (marker.type === 'ad') {
                contentLink.innerHTML = '<a href="' + marker.link + '" target="_blank">' + marker.content + '</a>'
            } else {
                contentLink.innerHTML = ''
            }

            if (marker.type === 'image') {
                if (!contentImage.innerHTML) {
                    contentImage.innerHTML = '<img src="http://localhost:1337/' + marker.content + '" alt="Advertisement Image"></img>'
                }
            } else {
                contentImage.innerHTML = null
            }
        }
    } 

    function rangeSlider(audio, event) {
        //to make the slider, I need to track what percentage of the width the user clicked.
        // From there, I can use that percentage to find where it would be in the audio, and play.
        if(event) {
            let percentage = event.offsetX / 350
            let newTime = audio.duration * percentage

            // show the width at the current spot 
            innerBar.style.setProperty('right', 100 - (percentage * 100) + '%')

            audio.currentTime = newTime
            playAudio(audio)
        } else {
            // This is for the continuous update of the slider, not from a click event
            let percentage = audio.currentTime / audio.duration
            innerBar.style.setProperty('right', 100 - (percentage * 100) + '%')

            // TODO - make this more smooth visually (maybe through css animation/transition?)
        }
    }

    function playAudio(audio) {
        audio.play()
        playing = true
        playButton.classList.add('hidden')
        pauseButton.classList.remove('hidden')
    }

    function pauseAudio(audio) {
        audio.pause()
        playing = false
        pauseButton.classList.add('hidden')
        playButton.classList.remove('hidden')
    }

    function sfAudio(audio) {
        audio.currentTime = audio.currentTime + 5
        playAudio(audio)
    }

    function sbAudio(audio) {
        let newTime = audio.currentTime - 5

        if (newTime < 0) {
            newTime = 0
        }
        audio.currentTime = newTime
        playAudio(audio)

    }
}

