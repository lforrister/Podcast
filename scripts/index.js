window.onload = function() {
    
    // First, I'll declare any global variables I'd like to have access to
    const episodesUrl = 'http://localhost:1337/episodes'
    const playButton = document.getElementById('play')
    const pauseButton = document.getElementById('pause')
    const seekForwardButton = document.getElementById('seekforward')
    const seekBackButton = document.getElementById('seekback')



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
        let audio = new Audio('http://localhost:1337' + data[0].audio)

        //Event Listeners
        playButton.addEventListener('click', playAudio.bind(this, audio))
        pauseButton.addEventListener('click', pauseAudio.bind(this, audio))
        seekForwardButton.addEventListener('click', sfAudio.bind(this, audio))
        seekBackButton.addEventListener('click', sbAudio.bind(this, audio))
    }

    function playAudio(audio) {
        audio.play()
    }

    function pauseAudio(audio) {
        audio.pause()
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

