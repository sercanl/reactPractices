import React, { Component } from 'react';
import fire from './fire';
import './App.css';
import './stylesheets/app.scss';
import deleteLogo from './images/delete.svg';

const collectionName = "norwegianCities";

class App extends Component {
  constructor(props) {
      super(props);
      this.state = {
          cities: [
              {
                  id: "",
                  city: "",
                  population: ""
              }
          ],
          sortASC: true,
          maxID: -1
      };
      this.loadCities.bind(this);
      this.deleteCity.bind(this);
  }

  componentDidMount() {
      this.loadCities();
      this.updateMaxID();
  }

  returnCollection(collectionName) {
      const db = fire.firestore();
      return db.collection(collectionName);
  }

  updateMaxID() {
    let dbCollection = this.returnCollection(collectionName);
    let maxIdItem = dbCollection.orderBy("id", "desc").limit(1);
    let max = -1;
    let that = this;
    maxIdItem.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            max = doc.data().id;
        });
    }).then(function() {
        that.setState({
            maxID: max
        });
    });
  };

  loadCities = () =>  {
      let dbCollection = this.returnCollection(collectionName);
      let arrEl = [];
      let that = this;

      dbCollection.orderBy("population", "asc").get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              console.log(doc.data());
              arrEl.push(doc.data());
          });
      }).then(function() {
        that.setState({
            cities: arrEl
        });
    });
  };

  updateInput = e => {
    this.setState({[e.target.name]: e.target.value });
  };

  deleteAllDocuments = () => {
    let dbCollection = this.returnCollection(collectionName);
    let that = this;
    dbCollection.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            dbCollection.doc(doc.id).delete().then(function() {
                console.log("Document successfully deleted!");
            }).catch(function(error) {
                console.error("Error removing document: ", error);
            });
        });
    }).then(function() {
        that.loadCities();
    });
  };

  deleteCity = (cityID) => e => {
    let dbCollection = this.returnCollection(collectionName);
    let that = this;
    dbCollection.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            if (cityID === doc.data().id) {
                dbCollection.doc(doc.id).delete().then(function() {
                    console.log("City '" + doc.data().city + "' deleted.");
                }).catch(function(error) {
                    console.error("Error removing document: ", error);
                });
            }
        });
    }).then(function() {
        that.loadCities();
    });
  };

  addCity = e => {
    e.preventDefault();

    let dbCollection = this.returnCollection(collectionName);
    let population_int = parseInt(this.state.population);
    console.log("burada", this.state.maxID);
    let id_int = parseInt(this.state.maxID+1);
    dbCollection.add({
        id: id_int,
        city: this.state.city,
        population: population_int
    });
    this.loadCities();
    this.updateMaxID();
  };

  toggleSort() {
    this.setState({
        sortASC: !this.state.sortASC
    });
  }

  createCitiesTable() {
      let cities = [];

      if (this.state.sortASC) {
          for (let i = 0; i < this.state.cities.length; i++) {
              let city = this.state.cities[i];
              cities.push(
                  <div key={city.id} className="citiesDiv">
                      <div className="deleteButtonDiv" onClick={this.deleteCity(city.id)} value={city.id}>
                          <img src={deleteLogo} className="deleteLogo" alt="Delete City"/>
                      </div>
                      <div className="cityDiv">{city.city}</div>
                      <div className="innbyggereDiv">{city.population}</div>
                  </div>
              )
          }
      }
      else {
          for (let i = this.state.cities.length - 1; i > -1; i--) {
              let city = this.state.cities[i];
              cities.push(
                  <div key={city.id} className="citiesDiv">
                      <div className="deleteButtonDiv" onClick={this.deleteCity(city.id)} value={city.id}>
                          <img src={deleteLogo} className="deleteLogo" alt="Delete City"/>
                      </div>
                      <div className="cityDiv">{city.city}</div>
                      <div className="innbyggereDiv">{city.population}</div>
                  </div>
              )
          }
      }
      return cities;
  }

  render() {

    let sortButton = "";
    if (this.state.sortASC) {
        sortButton = <button onClick={() => this.toggleSort()}>&darr;</button>;
    }
    else {
        sortButton = <button onClick={() => this.toggleSort()}>&uarr;</button>;
    }

    return (
        <div className="App">
            <div className="formTable">
                <form onSubmit={ this.addCity }>
                    <input type="text" name="city" placeholder="city" onChange={this.updateInput} value={this.state.city || ''} />
                    <input type="text" name="population" placeholder="population" onChange={this.updateInput} value={this.state.population || ''} />
                    <br />
                    <button onClick={this.deleteAllDocuments}>Delete all</button>
                    <button type="submit">Submit</button>

                </form>
                {sortButton}
            </div>
            <div className="citiesTable">
                {this.createCitiesTable()}
            </div>
        </div>
    );
  }
}

export default App;
