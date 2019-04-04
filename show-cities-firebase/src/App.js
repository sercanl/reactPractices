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
                  by: "",
                  innbyggere: ""
              }
          ]
      };
      this.loadCities.bind(this);
      this.deleteCity.bind(this);
  }

  componentDidMount() {
      this.loadCities();
  }

  returnCollection(collectionName) {
      const db = fire.firestore();
      return db.collection(collectionName);
  }

  loadCities = () =>  {
      let dbCollection = this.returnCollection(collectionName);
      let arrEl = [];
      let that = this;
      dbCollection.orderBy("innbyggere").get().then(function(querySnapshot) {
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
                    console.log("City '" + doc.data().by + "' deleted.");
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
    dbCollection.add({
        id: this.state.id,
        by: this.state.by,
        innbyggere: this.state.innbyggere
    });
    this.loadCities();
  };

  render() {
    return (
        <div className="App">
            <div className="citiesTable">
                    {
                        this.state.cities.map(
                            city => (
                                <div key={city.id} className="citiesDiv">
                                    <div className="deleteButtonDiv" onClick={this.deleteCity(city.id)} value={city.id}>
                                        <img src={deleteLogo} className="deleteLogo" alt="Delete City"/>
                                    </div>
                                    <div className="cityDiv">{city.by}</div>
                                    <div className="innbyggereDiv">{city.innbyggere}</div>
                                </div>
                            )
                        )
                    }
            </div>
            <div className="formTable">
                <form onSubmit={ this.addCity }>
                    <input type="text" name="id" placeholder="id" onChange={this.updateInput} value={this.state.id} />
                    <input type="text" name="by" placeholder="by" onChange={this.updateInput} value={this.state.by} />
                    <input type="text" name="innbyggere" placeholder="innbyggere" onChange={this.updateInput} value={this.state.innbyggere} />
                    <br />
                    <button type="submit">Submit</button>

                </form>
                <button onClick={this.deleteAllDocuments}>Delete all</button>
                <button onClick={this.loadCities}>Show</button>
            </div>
        </div>
    );
  }
}

export default App;
