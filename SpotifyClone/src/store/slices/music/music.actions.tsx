import {createAsyncThunk} from '@reduxjs/toolkit';
import {musicService} from '../../../api/services/music.service';

// Get all top artists
export const fetchTopArtists = createAsyncThunk(
  'music/fetchTopArtists',
  async (_, {rejectWithValue}) => {
    try {
      const response = await musicService.getTopArtists();
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  },
);

// Get top tracks
export const fetchTopTracks = createAsyncThunk(
  'music/fetchTopTracks',
  async (_, {rejectWithValue}) => {
    try {
      const response = await musicService.getTopTracks();
      return response;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error);
    }
  },
);

// Search based on a query
export const searchTracks = createAsyncThunk(
  'music/searchTracks',
  async (query: string, {rejectWithValue}) => {
    try {
      const response = await musicService.searchTracks(query);
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  },
);
