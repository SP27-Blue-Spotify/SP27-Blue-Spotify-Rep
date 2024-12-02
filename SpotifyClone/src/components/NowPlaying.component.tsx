import React, {useState, useEffect} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {theme} from '../styles/theme';
import {useAudioPlayerContext} from '../api/services/audio.context';

interface NowPlayingBarProps {
  onNext: () => void;
}

const NowPlayingBar: React.FC<NowPlayingBarProps> = ({onNext}) => {
  const [progress, setProgress] = useState(0);
  const {currentSong, isPlaying, playSong, pauseSong} = useAudioPlayerContext();

  /* useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const updateProgress = async () => {
      if (AudioService.isCurrentlyPlaying() && currentSong) {
        const currentTime = await AudioService.getCurrentTime();
        const duration = AudioService.getDuration();
        setProgress(currentTime / duration);
      }
    };

    if (isPlaying) {
      intervalId = setInterval(updateProgress, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying, currentSong]); */

  /*  useEffect(() => {
    console.log('Progress', progress);
  }, [progress]); */

  const handlePlayPause = () => {
    if (currentSong) {
      if (isPlaying) {
        pauseSong();
      } else {
        playSong(currentSong);
      }
    }
  };

  if (!currentSong) return null;

  return (
    <View style={styles.container}>
      <Image source={{uri: currentSong.image}} style={styles.albumCover} />
      <View style={styles.songInfo}>
        <Text style={styles.songTitle} numberOfLines={1}>
          {currentSong.name}
        </Text>
        <Text style={styles.artistName} numberOfLines={1}>
          {currentSong.artist}
        </Text>
        {/* <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, {width: `${progress * 100}%`}]} />
        </View> */}
      </View>
      <View style={styles.controls}>
        <TouchableOpacity
          onPress={handlePlayPause}
          style={styles.controlButton}>
          <Icon
            name={isPlaying ? 'pause' : 'play'}
            size={24}
            color={theme.colors.textPrimary}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onNext} style={styles.controlButton}>
          <Icon
            name="skip-forward"
            size={24}
            color={theme.colors.textPrimary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.secondary,
    padding: theme.spacing.small,
    paddingHorizontal: theme.spacing.small,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    position: 'absolute',
    bottom: 60,
    zIndex: 1000,
    width: '100%',
  },
  albumCover: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.small,
  },
  songInfo: {
    flex: 1,
    marginLeft: theme.spacing.small,
  },
  songTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSizes.regular,
    fontWeight: 'bold',
  },
  artistName: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.small,
  },
  controls: {
    flexDirection: 'row',
  },
  controlButton: {
    padding: theme.spacing.xsmall,
    marginLeft: theme.spacing.small,
  },
  progressBarContainer: {
    height: 2,
    backgroundColor: theme.colors.border,
    marginTop: theme.spacing.xsmall,
  },
  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
});

export default NowPlayingBar;
