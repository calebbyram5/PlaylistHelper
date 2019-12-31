

import React, { Component } from 'react';
import './App.css';
import {Bootstrap, Grid, Row, Col, Container} from 'react-bootstrap';
import SpotifyWebApi from 'spotify-web-api-js';
import 'bootstrap/dist/css/bootstrap.min.css';
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

    searchResults = spotifyApi.searchTracks(searchString)
      .then((response) => {
        response.tracks.items.forEach(e => console.log(e.name, e. artists[0].name))
        console.log(response.tracks.items);
        response.tracks.items.forEach(e =>         
          this.setState({
          searchResults: this.state.searchResults.concat({song: e.name, artist: e.artists[0].name})
          //searchResults: this.state.searchResults({song: e.name, artist: e.artists[0].name})
        }))
      })
      .catch(err => alert(err + "No Song Playing"))
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

  renderBodyHTML(){
    if(this.state.loggedIn){
      return(
        <div>
          <Container>
            <Row>
              <Col>
                <div>
                  <input name = "searchTerm" value = {this.state.searchTerm} onChange = {this.handleChange} placeholder = "Search for artist, song, album..."/>
                  <button onClick={() => this.getSearchResults(this.state.searchTerm)}>
                  Search
                  </button>  
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div>
                  <h3>Search Results:</h3>
                  <table class = "table table-dark">
                    <tbody>
                      {this.renderTableData()}
                    </tbody>
                  </table>
                </div>
              </Col>
              <Col> 
                <div>
                  Now Playing: { this.state.nowPlaying.name }
                </div>
                <div>
                  <img src={this.state.nowPlaying.albumArt} style={{ height: 300 }}/>
                </div>
                <button onClick={() => this.getNowPlaying()}>
                  Check Now Playing
                </button>
              </Col>
            </Row>
          </Container>
        </div>
      );
    }else{
      return(
        <button className = "login">
          <a href='http://localhost:8888' > Login to Spotify </a>
        </button>
      );
    }
  }

  render() {
    return (
      <div className="App">
        {this.renderBodyHTML()}
      </div>
    );
  }
}

export default App;
