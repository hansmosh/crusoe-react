import React, { Component } from 'react';
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
      favorites: []
    };
    this.logChange = this.logChange.bind(this);
    this.removeFavorite = this.removeFavorite.bind(this);
  }

  logChange(val) {
    let label = val["label"]
    if (this.state.favorites.length >=3 ) {
      let new_favorites = this.state.favorites.slice();
      new_favorites[2] = label;
      this.setState({favorites: new_favorites});
    } else {
      this.setState({favorites: this.state.favorites.concat([label])});
    }
  }

  removeFavorite(index) {
    let new_favorites = this.state.favorites.slice();
    new_favorites.splice(index, 1);
    this.setState({favorites: new_favorites});
  }

  render() {
    var options = [
      {value: 'one', label: 'One'},
      {value: 'two', label: 'Two'}
    ];
    return (!this.props.isLoggedIn ? null : 
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