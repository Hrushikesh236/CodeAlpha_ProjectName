 class MusicPlayer {
            constructor() {
                this.audio = document.getElementById('audioPlayer');
                this.playBtn = document.getElementById('playBtn');
                this.prevBtn = document.getElementById('prevBtn');
                this.nextBtn = document.getElementById('nextBtn');
                this.progressBar = document.getElementById('progressBar');
                this.progress = document.getElementById('progress');
                this.currentTimeEl = document.getElementById('currentTime');
                this.totalTimeEl = document.getElementById('totalTime');
                this.volumeSlider = document.getElementById('volumeSlider');
                this.songTitle = document.getElementById('songTitle');
                this.songArtist = document.getElementById('songArtist');
                this.songDuration = document.getElementById('songDuration');
                this.albumArt = document.getElementById('albumArt');
                this.autoplayToggle = document.getElementById('autoplayToggle');
                this.playlistItems = document.querySelectorAll('.playlist-item');

                this.currentSongIndex = 0;
                this.isPlaying = false;
                this.autoplay = false;

                // Sample playlist data (in a real app, these would be actual audio files)
                this.playlist = [
                    {
                        title: 'Summer Vibes',
                        artist: 'Chill Artist',
                        duration: 180, // 3 minutes
                        emoji: '🌞'
                    },
                    {
                        title: 'Midnight Dreams',
                        artist: 'Dream Maker',
                        duration: 240, // 4 minutes
                        emoji: '🌙'
                    },
                    {
                        title: 'Electric Pulse',
                        artist: 'Synth Master',
                        duration: 200, // 3:20
                        emoji: '⚡'
                    },
                    {
                        title: 'Ocean Waves',
                        artist: 'Nature Sounds',
                        duration: 300, // 5 minutes
                        emoji: '🌊'
                    }
                ];

                this.init();
            }

            init() {
                this.loadSong(this.currentSongIndex);
                this.bindEvents();
                this.audio.volume = 0.5;
            }

            bindEvents() {
                this.playBtn.addEventListener('click', () => this.togglePlay());
                this.prevBtn.addEventListener('click', () => this.prevSong());
                this.nextBtn.addEventListener('click', () => this.nextSong());
                this.progressBar.addEventListener('click', (e) => this.setProgress(e));
                this.volumeSlider.addEventListener('input', (e) => this.setVolume(e));
                this.autoplayToggle.addEventListener('click', () => this.toggleAutoplay());

                this.audio.addEventListener('timeupdate', () => this.updateProgress());
                this.audio.addEventListener('ended', () => this.onSongEnd());
                this.audio.addEventListener('loadedmetadata', () => this.updateDuration());

                this.playlistItems.forEach((item, index) => {
                    item.addEventListener('click', () => this.selectSong(index));
                });
            }

            loadSong(index) {
                const song = this.playlist[index];
                
                // Since we don't have actual audio files, we'll simulate the player
                // In a real implementation, you would set: this.audio.src = song.src;
                
                this.songTitle.textContent = song.title;
                this.songArtist.textContent = song.artist;
                this.albumArt.textContent = song.emoji;
                
                this.updatePlaylistUI();
                this.simulateAudioDuration(song.duration);
            }

            simulateAudioDuration(duration) {
                // Simulate audio duration for demo purposes
                this.totalTimeEl.textContent = this.formatTime(duration);
                this.songDuration.textContent = `0:00 / ${this.formatTime(duration)}`;
            }

            togglePlay() {
                if (this.isPlaying) {
                    this.pause();
                } else {
                    this.play();
                }
            }

            play() {
                // In a real implementation: this.audio.play();
                this.isPlaying = true;
                this.playBtn.textContent = '⏸';
                this.albumArt.classList.add('playing');
                this.startProgressSimulation();
            }

            pause() {
                // In a real implementation: this.audio.pause();
                this.isPlaying = false;
                this.playBtn.textContent = '▶';
                this.albumArt.classList.remove('playing');
                this.stopProgressSimulation();
            }

            prevSong() {
                this.currentSongIndex = this.currentSongIndex > 0 ? this.currentSongIndex - 1 : this.playlist.length - 1;
                this.loadSong(this.currentSongIndex);
                if (this.isPlaying) {
                    this.play();
                }
            }

            nextSong() {
                this.currentSongIndex = this.currentSongIndex < this.playlist.length - 1 ? this.currentSongIndex + 1 : 0;
                this.loadSong(this.currentSongIndex);
                if (this.isPlaying) {
                    this.play();
                }
            }

            selectSong(index) {
                this.currentSongIndex = index;
                this.loadSong(index);
                if (this.isPlaying) {
                    this.play();
                }
            }

            setProgress(e) {
                const width = this.progressBar.clientWidth;
                const clickX = e.offsetX;
                const duration = this.playlist[this.currentSongIndex].duration;
                
                // In a real implementation: this.audio.currentTime = (clickX / width) * this.audio.duration;
                this.simulatedCurrentTime = (clickX / width) * duration;
                this.updateProgressBar();
            }

            setVolume(e) {
                const volume = e.target.value / 100;
                this.audio.volume = volume;
                
                // Update volume icon based on level
                const volumeIcon = document.querySelector('.volume-icon');
                if (volume === 0) {
                    volumeIcon.textContent = '🔇';
                } else if (volume < 0.5) {
                    volumeIcon.textContent = '🔉';
                } else {
                    volumeIcon.textContent = '🔊';
                }
            }

            toggleAutoplay() {
                this.autoplay = !this.autoplay;
                this.autoplayToggle.classList.toggle('active', this.autoplay);
            }

            updateProgress() {
                // In a real implementation, this would use this.audio.currentTime and this.audio.duration
                this.updateProgressBar();
            }

            updateProgressBar() {
                const duration = this.playlist[this.currentSongIndex].duration;
                const currentTime = this.simulatedCurrentTime || 0;
                
                const progressPercent = (currentTime / duration) * 100;
                this.progress.style.width = `${progressPercent}%`;
                
                this.currentTimeEl.textContent = this.formatTime(currentTime);
                this.songDuration.textContent = `${this.formatTime(currentTime)} / ${this.formatTime(duration)}`;
            }

            startProgressSimulation() {
                this.simulatedCurrentTime = this.simulatedCurrentTime || 0;
                this.progressInterval = setInterval(() => {
                    this.simulatedCurrentTime += 1;
                    this.updateProgressBar();
                    
                    if (this.simulatedCurrentTime >= this.playlist[this.currentSongIndex].duration) {
                        this.onSongEnd();
                    }
                }, 1000);
            }

            stopProgressSimulation() {
                if (this.progressInterval) {
                    clearInterval(this.progressInterval);
                }
            }

            onSongEnd() {
                this.simulatedCurrentTime = 0;
                this.stopProgressSimulation();
                
                if (this.autoplay) {
                    this.nextSong();
                } else {
                    this.pause();
                }
            }

            updateDuration() {
                // In a real implementation: this.totalTimeEl.textContent = this.formatTime(this.audio.duration);
            }

            updatePlaylistUI() {
                this.playlistItems.forEach((item, index) => {
                    item.classList.toggle('active', index === this.currentSongIndex);
                });
            }

            formatTime(seconds) {
                const minutes = Math.floor(seconds / 60);
                const remainingSeconds = Math.floor(seconds % 60);
                return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
            }
        }

        // Initialize the music player when the page loads
        document.addEventListener('DOMContentLoaded', () => {
            new MusicPlayer();
        });