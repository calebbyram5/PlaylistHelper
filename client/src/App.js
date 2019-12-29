

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
      searchResult: [{ song: 'N/A', artist: 'N/A'},{ song: 'N/A', artist: 'N/A'},{ song: 'N/A', artist: 'N/A'}],
      testObject : []
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
    var searchResult = null;
    console.log(searchString);
    searchResult = spotifyApi.searchTracks(searchString, {limit: 10})
      .then((response) => {
        this.setState({testObject: response})
        /*this.setState({
          searchResult: {
            song: response.tracks.items[0].name,
            artist: response.tracks.items[0].artists[0].name
          }
        })*/
        response.tracks.items.forEach(e => console.log(e.name, e. artists[0].name))
        console.log(response.tracks.items)
      })
      .catch(err => alert(err))
  }

  //This handles the changing input values in the search box
  handleChange = event => {
    this.setState({ searchTerm: event.target.value });
  };

  renderTableData(){
    return this.state.searchResult.map((entry, index) => {
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
          <img src={this.state.nowPlaying.albumArt} style={{ height: 600 }}/>
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
          <p>{JSON.stringify(this.state.testObject)}</p>
          <table>
            <tbody>
              
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default App;
