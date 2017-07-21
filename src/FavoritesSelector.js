import React, { Component } from 'react';
import AWS from 'aws-sdk/dist/aws-sdk-react-native'
import Select from 'react-select';
import 'react-select/dist/react-select.css';

class FavoritesItem extends Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.removeFavorite(this.props.index);
  }

  render() {
    return (
      <div>
        {this.props.label}
        <button onClick={this.handleClick}>X</button>
      </div>
    );
  }
}

class FavoritesList extends Component {

  render() {
    const listItems = this.props.favorites.map((label, index) =>
      <FavoritesItem key={index} index={index} label={label} removeFavorite={this.props.removeFavorite}/>
    );
    return (
      <ul>
        {listItems}
      </ul>
    );
  }
}

class FavoritesSelector extends Component {

  constructor(props) {
    super(props);
    this.state = {
      favorites: null
    };
    this.logChange = this.logChange.bind(this);
    this.removeFavorite = this.removeFavorite.bind(this);
    this.saveFavorites = this.saveFavorites.bind(this);
    this.fetchFavorites = this.fetchFavorites.bind(this);
  }

  logChange(val) {
    let label = val["label"]
    let new_favorites = []
    if (this.state.favorites.length >=3 ) {
      new_favorites = this.state.favorites.slice();
      new_favorites[2] = label;
    } else {
      new_favorites = this.state.favorites.concat([label])
    }
    this.setState({favorites: new_favorites}, function() {
      this.saveFavorites();
    });
  }

  removeFavorite(index) {
    let new_favorites = this.state.favorites.slice();
    new_favorites.splice(index, 1);
    this.setState({favorites: new_favorites}, function() {
      this.saveFavorites();
    });
  }

  sendDbRequest(req) {
    return new Promise(function (resolve, reject) {
      req.send(function (err, data) {
        if (err) { reject(err); }
        else { resolve(data); }
      });
    });
  }

  saveFavorites() {
    var db = new AWS.DynamoDB.DocumentClient();
    var item = {
      TableName: 'crusoeFavorites',
      Item: {
        userId: this.props.identity.id,
        favorites: this.state.favorites
      }
    };
    this.sendDbRequest(db.put(item)).then(data => {
      console.log("Updated favorites in database");
    })
    .catch(error => {
      console.log("Failed to save favorites to database");
      console.log(error);
    })
  }

  fetchFavorites() {
    // fetch favorites from db and set state.
    // if no favorites are found in the db, then init to an empty list
    var db = new AWS.DynamoDB.DocumentClient();
    var item = {
      TableName: 'crusoeFavorites',
      Key: {
        userId: this.props.identity.id
      }
    };
    this.sendDbRequest(db.get(item)).then(data => {
      if ('Item' in data && data.Item.favorites) {
        this.setState({favorites: data.Item.favorites});
      } else {
        this.setState({favorites: []});
      }
    })
    .catch(error => {
      this.setState({favorites: []});
      console.log("Failed to fetch favorites from database");
      console.log(error);
    })
  }

  render() {
    var options = [
      {value: 'one', label: 'One'},
      {value: 'two', label: 'Two'}
    ];
    // If logged in but we haven't fetched favorites yet, do that
    if (this.props.isLoggedIn && this.state.favorites == null) {
      this.fetchFavorites();
    }
    // Only render list if we're logged in and have fetched favorites
    return (!this.props.isLoggedIn || this.state.favorites == null ? null : 
      <div>
        <FavoritesList favorites={this.state.favorites} removeFavorite={this.removeFavorite}/>
        <Select
          options={options}
          onChange={this.logChange}
        />
      </div>
    );
  }
}

export default FavoritesSelector;
