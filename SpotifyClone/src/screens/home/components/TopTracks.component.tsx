import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  Modal,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {fetchTopTracks} from '../../../store/slices/music/music.actions';
import {RootState, AppDispatch} from '../../../store/store';
import Icon from 'react-native-vector-icons/Feather';
import {theme} from '../../../styles/theme';
import InteractivePlayButton from '../../../components/PlayButton.component';
import {useAudioPlayerContext} from '../../../api/services/audio.context';
import {useNavigation} from '@react-navigation/native';
import {authService} from '../../../api/services/auth.service';
import {logout} from '../../../store/slices/auth/auth.actions';
import toastService from '../../../ui/toast.service';

interface TopTracksProps {}

const TopTracks: React.FC<TopTracksProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {topTracks, status} = useSelector((state: RootState) => state.music);
  const {currentSong, playSong, pauseSong, isPlaying} = useAudioPlayerContext();
  const navigation = useNavigation();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchTopTracks());
  }, [dispatch]);

  const handlePlay = (item: any) => {
    if (isPlaying) {
      pauseSong();
    } else {
      playSong(item);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      const resultAction = await dispatch(logout());
  
      if (resultAction.type === logout.fulfilled.type) {
        toastService.success('Logout successfully');
        // Reset navigation stack and navigate to Login
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      } else {
        toastService.error('Logout failed', 'Registration Failed');
      }
    } catch (error) {
      console.error(error);
    }
    setIsDropdownVisible(false);
  };
  

  const renderTrackItem = useCallback(
    ({item}: {item: any}) => (
      <View style={styles.gridItem}>
        <Image
          source={{uri: item.image || 'https://picsum.photos/200'}}
          style={styles.gridAlbumCover}
        />
        <Text style={styles.gridTrackName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.gridArtistName} numberOfLines={1}>
          {item.artist}
        </Text>
        <InteractivePlayButton
          onPress={() => handlePlay(item)}
          size={36}
          isPlaying={currentSong === item && isPlaying}
        />
      </View>
    ),
    [currentSong, handlePlay],
  );

  if (status === 'loading') {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (status === 'failed') {
    return (
      <View style={styles.centerContainer}>
        <Icon name="alert-circle" size={50} color={theme.colors.error} />
        <Text style={styles.errorText}>Failed to load top tracks</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Spotify</Text>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => setIsDropdownVisible(true)}>
          <Text style={styles.profileName}>Menu</Text>
          <Icon
            name="chevron-down"
            size={20}
            color={theme.colors.textPrimary}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={topTracks}
        keyExtractor={item => item.id || item.name}
        renderItem={renderTrackItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.gridContent}
        ListHeaderComponent={<Text style={styles.sectionTitle}>Home</Text>}
      />
      <Modal
        visible={isDropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsDropdownVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsDropdownVisible(false)}>
          <View style={styles.dropdown}>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={handleLogout}>
              <Icon name="log-out" size={20} color={theme.colors.textPrimary} />
              <Text style={styles.dropdownText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.small,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: theme.spacing.small,
  },
  headerTitle: {
    fontSize: theme.fontSizes.header,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.textPrimary,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileName: {
    color: theme.colors.textPrimary,
    marginRight: theme.spacing.xsmall,
    fontSize: theme.fontSizes.regular,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.header,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.medium,
    paddingHorizontal: theme.spacing.medium,
  },
  gridContent: {
    paddingTop: theme.spacing.medium,
  },
  row: {
    flex: 1,
    justifyContent: 'space-around',
  },
  gridItem: {
    width: Dimensions.get('window').width / 2 - theme.spacing.medium * 2,
    marginBottom: theme.spacing.medium,
    alignItems: 'center',
    position: 'relative',
  },
  gridAlbumCover: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: theme.borderRadius.small,
    marginBottom: theme.spacing.xsmall,
  },
  gridTrackName: {
    fontSize: theme.fontSizes.sectionTitle,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  gridArtistName: {
    fontSize: theme.fontSizes.regular,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  errorText: {
    marginTop: theme.spacing.small,
    fontSize: theme.fontSizes.regular,
    color: theme.colors.error,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  dropdown: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.small,
    marginTop: 40,
    marginRight: theme.spacing.medium,
    padding: theme.spacing.small,
    minWidth: 150,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.small,
  },
  dropdownText: {
    color: theme.colors.textPrimary,
    marginLeft: theme.spacing.small,
    fontSize: theme.fontSizes.regular,
  },
});

export default TopTracks;
