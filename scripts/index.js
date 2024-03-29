window.onload = function() {

    // First, I'll declare any global variables I'd like to have access to
    const episodesUrl = 'http://localhost:1337/episodes'
    const mainHeadline = document.getElementById('mainHeadline')
    const playButton = document.getElementById('play')
    const pauseButton = document.getElementById('pause')
    const forwardButton = document.getElementById('seekforward')
    const backButton = document.getElementById('seekback')
    const sliderContainer = document.getElementById('rangeSlider')
    const sliderBar = document.getElementById('sliderBar')
    const innerBar = document.getElementById('innerBar')
    const contentHeadline = document.getElementById('contentHeadline')
    const contentLink = document.getElementById('contentLink')
    const contentImage = document.getElementById('contentImage')
    const nextAudio = document.getElementById('nextAudio')
    const prevAudio = document.getElementById('prevAudio')

    // Here is a generic fetch data function that I can use to grab what I need from the server
    function fetchData(url, callback) {
        fetch(url)
        .then(response => {
            return response.json();
        })
        .then((data) => {
            callback(data)
        })
        .catch((err) => {
            console.log(err);
        });
    }

    fetchData(episodesUrl, podcastPlayer)

    function podcastPlayer(data) {
        // For this use case, I am just starting with the first index
        new Podcast(data[0], data)
    } 

    // Here is my JS class "Podcast". In a larger/more complex project, I would move this into its own file and import it to use where I needed it.
    class Podcast {
        constructor(data, fullData) {
            this.audio = new Audio()
            this.createVars(data, fullData)
            this.setUp()
        }

        createVars(data, fullData) {
            this.data = data
            this.fullData = fullData
            this.audio.src = 'http://localhost:1337' + this.data.audio
            this.index = this.fullData.indexOf(this.data)
            this.prev = this.fullData[this.index - 1] ? this.fullData[this.index - 1] : null
            this.next = this.fullData[this.index + 1] ? this.fullData[this.index + 1] : null
        }
        
        setUp() {
            this.clearContent()

            mainHeadline.innerHTML = this.data.name
            
            // Event Listeners
            let audioListener = this.audioCheck.bind(this, this.audio, this.data)
            this.audio.addEventListener('timeupdate', audioListener)
            playButton.addEventListener('click', this.playAudio.bind(this, this.audio))
            pauseButton.addEventListener('click', this.pauseAudio.bind(this, this.audio))
            forwardButton.addEventListener('click', this.sfAudio.bind(this, this.audio))
            backButton.addEventListener('click', this.sbAudio.bind(this, this.audio))
            sliderContainer.addEventListener('click', this.rangeSlider.bind(this, this.audio))

            // Ability to toggle to prev/next audio
            if (this.prev) {
                let prevListener = this.changeAudio.bind(this, this.prev, this.fullData, this.audio, audioListener)
                prevAudio.classList.remove('hidden')
                prevAudio.removeEventListener('click', prevListener)
                prevAudio.addEventListener('click', prevListener)

            } else {
                prevAudio.classList.add('hidden')
            }

            if (this.next) {
                let nextListener = this.changeAudio.bind(this, this.next, this.fullData, this.audio, audioListener)
                nextAudio.classList.remove('hidden')
                nextAudio.removeEventListener('click', nextListener)
                nextAudio.addEventListener('click', nextListener)
            } else {
                nextAudio.classList.add('hidden')
            }

        }

        clearContent() {
            contentHeadline.innerHTML = ''
            contentLink.innerHTML = ''
            contentImage.innerHTML = ''
        }

        changeAudio(data, fullData, audio, listener) {
            audio.removeEventListener('timeupdate', listener)
            this.createVars(data, fullData)
            innerBar.style.setProperty('width', 0)
            this.toggleBtn(pauseButton, playButton)
            this.setUp()
        }

        toggleBtn(oldBtn, newBtn) {
            newBtn.classList.remove('hidden')
            oldBtn.classList.add('hidden')
        }

        playAudio(audio) {
            audio.play()
            this.toggleBtn(playButton, pauseButton)
        }

        pauseAudio(audio) {
            audio.pause()
            this.toggleBtn(pauseButton, playButton)
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

        audioCheck(audio, data) {
            // Have the slider continuously update
            this.rangeSlider(audio)
    
            this.handleMarkers(audio, data)
    
            // Set pause button back to play at the end 
            if (audio.currentTime === audio.duration) {
                this.toggleBtn(pauseButton, playButton)
            }
        }

        rangeSlider(audio, event) {
            // For a click event, find where they clicked & use that to calculate percentage of inner bar & audio
            if(event) {
                let percentage = event.offsetX / sliderBar.offsetWidth
                let newTime = audio.duration * percentage
                innerBar.style.setProperty('width',percentage * 100 + '%')
                audio.currentTime = newTime
                this.playAudio(audio)
            } else {
                // This is for the continuous update of the slider
                let percentage = audio.currentTime / audio.duration
                innerBar.style.setProperty('width', percentage * 100 + '%')
            }
        }

        handleMarkers(audio, data) {
            let display = []
    
            data.markers.forEach((marker) => {
                let markerEnd = marker.start + marker.duration
    
                if (audio.currentTime > marker.start && audio.currentTime < markerEnd) {
                    display.push(marker)
                } else {
                    if (display.includes(marker)) {
                        let index = display.indexOf(marker)
                        display.splice(index, 1)
                    }
                }
            })

            if (display.length) {
                this.displayMarker(display[0])
            } else {
                this.clearContent()
            }
        }

        displayMarker(marker) {
            if (marker.content) {
                switch(marker.type) {
                    case 'text':
                        contentLink.innerHTML = ''
                        contentImage.innerHTML = ''
                        if (!contentHeadline.innerHTML) {
                            contentHeadline.innerHTML = marker.content
                        }
                        break
                    case 'ad':
                        contentHeadline.innerHTML = ''
                        contentImage.innerHTML = ''
                        if (!contentImage.innerHTML) {
                            contentLink.innerHTML = '<a href="' + marker.link + '" target="_blank">' + marker.content + '</a>'
                        }
                        break
                    case 'image':
                        contentHeadline.innerHTML = ''
                        contentLink.innerHTML = ''
                        if (!contentImage.innerHTML) {
                            contentImage.innerHTML = '<img src="http://localhost:1337/' + marker.content + '" id="contentImg" alt="Advertisement Image"></img>'
                        } 
                        break
                    default:
                        this.clearContent()                 
                }
            }
        }
    }
}
