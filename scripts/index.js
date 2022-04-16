window.onload = function() {

    // First, I'll declare any global variables I'd like to have access to
    const episodesUrl = 'http://localhost:1337/episodes'
    const mainHeadline = document.getElementById('mainHeadline')
    const playButton = document.getElementById('play')
    const pauseButton = document.getElementById('pause')
    const seekForwardButton = document.getElementById('seekforward')
    const seekBackButton = document.getElementById('seekback')
    const sliderContainer = document.getElementById('rangeSlider')
    const innerBar = document.getElementById('innerBar')
    const contentHeadline = document.getElementById('contentHeadline')
    const contentLink = document.getElementById('contentLink')
    const contentImage = document.getElementById('contentImage')
    const nextAudio = document.getElementById('nextAudio')

    class Podcast {
        constructor(data, fullData) {
            this.data = data
            this.fullData = fullData
            this.audio = new Audio('http://localhost:1337' + data.audio)
            this.index = fullData.indexOf(data)
            this.prev = fullData[this.index - 1] ? fullData[this.index - 1] : null
            this.next = fullData[this.index + 1] ? fullData[this.index + 1] : null 

            this.setUp()
        }
        
        setUp() {
            mainHeadline.innerHTML = this.data.name
            
            //Event Listeners
            this.audio.addEventListener('timeupdate', this.audioCheck.bind(this, this.audio, this.data))
            playButton.addEventListener('click', this.playAudio.bind(this, this.audio))
            pauseButton.addEventListener('click', this.pauseAudio.bind(this, this.audio))
            seekForwardButton.addEventListener('click', this.sfAudio.bind(this, this.audio))
            seekBackButton.addEventListener('click', this.sbAudio.bind(this, this.audio))
            sliderContainer.addEventListener('click', this.rangeSlider.bind(this, this.audio))
        }

       audioCheck(audio, data) {    
            //have the slider continuously update
            this.rangeSlider(audio)
    
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
                    this.displayMarker(display[0])
                }
            })
    
            // Set pause button back to play at the end 
            if (audio.currentTime === audio.duration) {
                playButton.classList.remove('hidden')
                pauseButton.classList.add('hidden')
            }
        }

        playAudio(audio) {
            audio.play()
            playButton.classList.add('hidden')
            pauseButton.classList.remove('hidden')
        }

        pauseAudio(audio) {
            audio.pause()
            pauseButton.classList.add('hidden')
            playButton.classList.remove('hidden')
        }

        sfAudio(audio) {
            audio.currentTime = audio.currentTime + 5
            this.playAudio(audio)
        }

        sbAudio(audio) {
            let newTime = audio.currentTime - 5
    
            if (newTime < 0) {
                newTime = 0
            }
            audio.currentTime = newTime
            this.playAudio(audio)
    
        }

        rangeSlider(audio, event) {
            //to make the slider, I need to track what percentage of the width the user clicked.
            // From there, I can use that percentage to find where it would be in the audio, and play.
            if(event) {
                let percentage = event.offsetX / 350
                let newTime = audio.duration * percentage
    
                // show the width at the current spot 
                innerBar.style.setProperty('right', 100 - (percentage * 100) + '%')
    
                audio.currentTime = newTime
                this.playAudio(audio)
            } else {
                // This is for the continuous update of the slider, not from a click event
                let percentage = audio.currentTime / audio.duration
                innerBar.style.setProperty('right', 100 - (percentage * 100) + '%')
            }
        }

        displayMarker(marker) {
            if (marker.content) {
                if (marker.type === 'text') {
                    if (!contentHeadline.innerHTML) {
                        contentHeadline.innerHTML = marker.content
                    }
                } else {
                    contentHeadline.innerHTML = ''
                }
    
                if (marker.type === 'ad') {
                    if (!contentImage.innerHTML) {
                        contentLink.innerHTML = '<a href="' + marker.link + '" target="_blank">' + marker.content + '</a>'
                    }
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
    }

    // Then, I'll make a class 'Podcast' that we can use to initialize each instance of our podcast player
    // class Podcast {
    //     constructor(data, fullData, audio) {
    //         this.current = data
    //         this.fullData = fullData
    //         this.audio = audio
    //     }

    //         //let's clear everything out
    //         // contentHeadline.innerHTML = ''
    //         // contentLink.innerHTML = ''
    //         // contentImage.innerHTML = ''
            
    //         // const index = fullData.indexOf(data)
    //         // const prev = fullData[index - 1] ? fullData[index - 1] : null
    //         // const next = fullData[index + 1] ? fullData[index + 1] : null

            
    //         //Is there a next item?
    //         // if (next) {
    //         //     console.log('next', next)
    //         //     nextAudio.classList.remove('hidden')
    //         //     nextAudio.addEventListener('click', () => {
    //         //         console.log('clicked')
    //         //         audio.src = 'http://localhost:1337' + next.audio 
    //         //         new Podcast(next, fullData, audio)
    //         //     })
    //         // } else {
    //         //     nextAudio.classList.add()
    //         // }

    //     }
    // }


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
        // Call the first/initial instance
        new Podcast(data[0], data)
    } 
}

