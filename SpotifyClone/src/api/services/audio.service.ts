import Sound from 'react-native-sound';

class AudioService {
  private sound: Sound | null = null;
  private isPlaying = false;
  private duration = 0;

  constructor() {
    Sound.setCategory('Playback');
  }

  loadSound(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.sound = new Sound(url, '', error => {
        if (error) {
          reject(error);
        } else {
          console.log("Worked")
          this.duration = this.sound!.getDuration();
          resolve();
        }
      });
    });
  }

  play(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.sound) {
        reject(new Error('No sound loaded'));
        return;
      }

      this.sound.play(success => {
        if (success) {
          this.isPlaying = true;
          resolve();
        } else {
          reject(new Error('Playback failed'));
        }
      });
    });
  }

  pause(): void {
    if (this.sound) {
      this.sound.pause();
      this.isPlaying = false;
    }
  }

  stop(): void {
    if (this.sound) {
      this.sound.stop();
      this.isPlaying = false;
    }
  }

  release(): void {
    if (this.sound) {
      this.sound.release();
      this.sound = null;
      this.isPlaying = false;
    }
  }

  isCurrentlyPlaying(): boolean {
    return this.isPlaying;
  }

  getCurrentTime(): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!this.sound) {
        reject(new Error('No sound loaded'));
        return;
      }
      this.sound.getCurrentTime(resolve);
    });
  }

  getDuration(): number {
    return this.duration;
  }
}

export default new AudioService();