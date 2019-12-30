

import React, { Component } from 'react';
import './App.css';

import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

class App extends Component {
  constructor(){
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: { name: 'Not Checked', albumArt: '' },
      searchTerm: '',
      searchResults : []
    }
  }
  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }

  getNowPlaying(){
    spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {
        this.setState({
          nowPlaying: { 
              name: response.item.name, 
              albumArt: response.item.album.images[0].url
            }
        });
      })
      .catch(err => alert(err))
  }
  
  getSearchResults(searchString){
    var searchResults = null;

    //reset the array when another search is called
    this.setState({
      searchResults: []
    })

    searchResults = spotifyApi.searchTracks(searchString, {limit: 10})
      .then((response) => {
        response.tracks.items.forEach(e => console.log(e.name, e. artists[0].name))
        response.tracks.items.forEach(e =>         
          this.setState({
          searchResults: this.state.searchResults.concat({song: e.name, artist: e.artists[0].name})
          //searchResults: this.state.searchResults({song: e.name, artist: e.artists[0].name})
        }))
      })
      .catch(err => alert(err))
  }

  //This handles the changing input values in the search box
  handleChange = event => {
    this.setState({ searchTerm: event.target.value });
  };

  renderTableData(){
    return this.state.searchResults.map((entry, index) => {
      const {song, artist} = entry
      return (
        <tr>
          <td>{song}</td>
          <td>{artist}</td>
        </tr>
      )
    })
  }

  render() {
    return (
      <div className="App">
        <a href='http://localhost:8888' > Login to Spotify </a>
        <div>
          Now Playing: { this.state.nowPlaying.name }
        </div>
        <div>
          <img src={this.state.nowPlaying.albumArt} style={{ height: 300 }}/>
        </div>
        { this.state.loggedIn &&
          <button onClick={() => this.getNowPlaying()}>
            Check Now Playing
          </button>
        }
        <div>
          <label htmlFor="searchTerm">Search Field</label>
          <input name = "searchTerm" value = {this.state.searchTerm} onChange = {this.handleChange}/>
          <button onClick={() => this.getSearchResults(this.state.searchTerm)}>
            Log Results
          </button>
        </div>
        <div>
          Search Results: 
          <table>
            <tbody>
              {this.renderTableData()}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default App;
