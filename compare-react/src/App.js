import React, { Component } from 'react';
import fire from './fire';
import './App.css';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';


class App extends Component {
  constructor() {
      super();
      this.state = {
          id: "",
          by: "",
          innbyggere: ""
      };
  }
  componentDidMount() {
      const db = fire.firestore();
      db.settings({ timestampsInSnapshots: true });

      db.collection("norwegianCities").orderBy("id").get().then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              console.log(doc.data().id);
              console.log(doc.data().by);
              console.log(doc.data().innbyggere);
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
    return (
        <form onSubmit={ this.addCity }>
          <input type="text" name="id" placeholder="id" onChange={this.updateInput} value={this.state.id} />
          <input type="text" name="by" placeholder="by" onChange={this.updateInput} value={this.state.by} />
          <input type="text" name="innbyggere" placeholder="innbyggere" onChange={this.updateInput} value={this.state.innbyggere} />
          <br />
          <button type="submit">Submit</button>
          <button onClick={this.deleteAllDocuments}>Delete all cities</button>
        </form>

    );
  }
}

export default App;
