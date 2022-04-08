window.onload = function() {

    // First, I'll declare any global variables I'd like to have access to
    const episodesUrl = 'http://localhost:1337/episodes'
    const playButton = document.getElementById('play')
    const pauseButton = document.getElementById('pause')
    const seekForwardButton = document.getElementById('seekforward')
    const seekBackButton = document.getElementById('seekback')
    const sliderContainer = document.getElementById('rangeSlider')
    const innerBar = document.getElementById('innerBar')
    const contentSection = document.getElementById('contentDisplay')
    const contentHeadline = document.getElementById('contentHeadline')

    const audioTest = document.getElementById('audioTest')



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
        //TO DO - right now I'm just grabbing the first audio info; come back to how to expand it
        let audioData = data[0]
        let audio = new Audio('http://localhost:1337' + data[0].audio)

        //Make the range slider 
        rangeSlider(audio)

        //Event Listeners
        playButton.addEventListener('click', playAudio.bind(this, audio))
        pauseButton.addEventListener('click', pauseAudio.bind(this, audio))
        seekForwardButton.addEventListener('click', sfAudio.bind(this, audio))
        seekBackButton.addEventListener('click', sbAudio.bind(this, audio))
        sliderContainer.addEventListener('click', rangeSlider.bind(this, audio))
        audio.addEventListener('timeupdate', audioCheck.bind(this, audio, audioData))

        // audioTest.addEventListener('timeupdate', function() {
        //     console.log('updating!!')
        // })

        // audio.addEventListener('timeupdate', function () {
        //     console.log('testing audio update')
        // })
    }

    function audioCheck(audio, data) {

        let display = []

        data.markers.forEach((marker) => {
            let markerEnd = marker.start + marker.duration

            if (audio.currentTime > marker.start && audio.currentTime < markerEnd) {
                //I need to display!
                console.log('I need to display!')
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
    }

    function displayMarker(marker, audio) {
        if (marker.content) {
            console.log('marker.content', marker.content)
            contentHeadline.innerHTML = marker.content
        }
    } 

    function rangeSlider(audio, event) {
        console.log('clicked!')
        //to make the slider, I need to track what percentage of the width the user clicked.
        // From there, I can use that percentage to find where it would be in the audio, and play.
        console.log('audio', audio)
        if(event) {
            let percentage = event.offsetX / 800
            let newTime = audio.duration * percentage

            // show the width at the current spot 
            innerBar.style.setProperty('right', 100 - (percentage * 100) + '%')

            audio.currentTime = newTime
            playAudio(audio)
        }
    }

    function playAudio(audio) {
        audio.play()
        playing = true
    }

    function pauseAudio(audio) {
        audio.pause()
        playing = false
    }

    function sfAudio(audio) {
        console.log('fast forward', audio.currentTime)
        audio.currentTime = audio.currentTime + 5
        console.log('new time', audio.currentTime)
        playAudio(audio)
    }

    function sbAudio(audio) {
        console.log('back', audio.currentTime)
        let newTime = audio.currentTime - 5

        if (newTime < 0) {
            newTime = 0
        }

        console.log('new time', newTime)
        audio.currentTime = newTime
        playAudio(audio)

    }
}

