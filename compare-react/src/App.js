import React, { Component } from 'react';
import fire from './fire';
import './App.css';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';


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
      this.deleteCity.bind(this)
  }
  componentDidMount() {

  }

  loadCities = () =>  {
      const db = fire.firestore();
      db.settings({ timestampsInSnapshots: true });
      var arrEl = [];
      var that = this;
      db.collection("norwegianCities").orderBy("innbyggere").get().then(function(querySnapshot) {

          querySnapshot.forEach(function(doc) {
              console.log(doc.data());
              arrEl.push(doc.data())
              //console.log(doc.data().innbyggere);
          });
      }).then(function() {
        that.setState({
            cities:arrEl
        });
    });
  }

  updateInput = e => {
    this.setState({[e.target.name]: e.target.value });
  }
  deleteAllDocuments = e => {
    const db = fire.firestore();
    db.settings({ timestampsInSnapshots: true });

    db.collection("norwegianCities").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            db.collection("norwegianCities").doc(doc.id).delete().then(function() {
                console.log("Document successfully deleted!");
            }).catch(function(error) {
                console.error("Error removing document: ", error);
            });
        });
    });
  }
  deleteCity = e =>  {
    const db = fire.firestore();
    db.settings({ timestampsInSnapshots: true });
    console.log(e.target.value );
    /*
    db.collection("norwegianCities").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            db.collection("norwegianCities").doc(doc.id).delete().then(function() {
                console.log("Document successfully deleted!");
            }).catch(function(error) {
                console.error("Error removing document: ", error);
            });
        });
    });
    */
  }
  addCity = e => {
    e.preventDefault();
    const db = fire.firestore();
    db.settings({ timestampsInSnapshots: true });
    const userRef = db.collection("norwegianCities").add({
        id: this.state.id,
        by: this.state.by,
        innbyggere: this.state.innbyggere
    });
    this.state = {
        id: "",
        by: "",
        innbyggere: ""
    };
  }
  render() {
    this.loadCities();
    return (
        <div className="App">

            <table>
                {
                    this.state.cities.map(
                        city => (
                            <tr  key={city.id}>
                                <td onClick={this.deleteCity} value={city.id}>Delete </td>
                                <td> {city.by} </td>
                                <td> {city.innbyggere} </td>
                            </tr>
                        )
                    )
                }
            </table>

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
    );
  }
}

export default App;
