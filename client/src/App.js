

import React, { Component } from 'react';
import './App.css';
import {Bootstrap, Grid, Row, Col, Container, Card, Button, CardDeck, CardColumns} from 'react-bootstrap';
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
      nowPlaying: { name: 'No Song Currently Playing', albumArt: '' },
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
        console.log(response);
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
        response.tracks.items.forEach(e => console.log(e.name, e. artists[0].name, e.album.images[0]))
        console.log(response);
        response.tracks.items.forEach(e =>         
          this.setState({
          searchResults: this.state.searchResults.concat({song: e.name, artist: e.artists[0].name, albumArt: e.album.images[0].url, trackId: e.uri})
          //searchResults: this.state.searchResults({song: e.name, artist: e.artists[0].name})
        }))
        console.log(this.state.searchResults);
      })
      .catch(err => alert(err + "No Song Playing"))
  }

  //This handles the changing input values in the search box
  handleChange = event => {
    this.setState({ searchTerm: event.target.value });
  };

  //add clicked song to playlist
  addTrack = event => {
    var playlistId = '';
    var trackId = [];
    //gets id of track
    trackId.push(event.currentTarget.id);
    //gets playlist id from logged in user

    spotifyApi.getPlaylistTracks("/me", "4YwThRIhvacUWlZ4gn7wPT")
    .then((response) => console.log(response));

    spotifyApi.getUserPlaylists()
    .then((response) => {
      playlistId = response.items[0].id;
      spotifyApi.addTracksToPlaylist("/me",playlistId, trackId);
      console.log(playlistId);
      console.log(trackId);

      this.setState({
        searchTerm: '',
        searchResults: []
      })

    });
  }

  renderTableData(){
    return this.state.searchResults.map((entry, index) => {
      const {song, artist, albumArt, trackId} = entry
      return (
        <tr key = {trackId} id = {trackId}>
          <td><img src = {albumArt} style={{ height: 65 }}/></td>
          <td>{song}</td>
          <td>{artist}</td>
          <td><button id = 'hideButton' onClick = {this.addTrack} class = "button">+</button></td>
        </tr>
      )
    })
  }

  renderCardData(){
    return this.state.searchResults.map((entry, index) => {
      const {song, artist, albumArt, trackId} = entry
      return (
      <Card className="bg-dark text-white button" style={{ width: '10rem' }}>
        <Card.Img variant="top" src= {albumArt}/>
        <Card.Body>
          <Card.Title>{artist}</Card.Title>
          <Card.Text>{song}</Card.Text>
          <Button variant="primary" onClick = {this.addTrack}  id = {trackId}>Add</Button>
        </Card.Body>
      </Card>
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
                  <button className = "grow" onClick={() => this.getSearchResults(this.state.searchTerm)}>
                  Search
                  </button>  
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div>
                  <h3>Click a song to add it to a playlist</h3>
                  <table id = 'mytableofrows' class = "table table-dark">
                    <tbody>
                      {this.renderTableData()}
                    </tbody>
                  </table>
                </div>
                <div>
                  <CardColumns>
                    {/* {this.renderCardData()} */}
                  </CardColumns>
                </div>
              </Col>
              <Col> 
                <div>
                  Now Playing: { this.state.nowPlaying.name }
                </div>
                <div>
                  <img src={this.state.nowPlaying.albumArt} style={{ height: 300 }}/>
                </div>
                <button className = "grow" onClick={() => this.getNowPlaying()}>
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
