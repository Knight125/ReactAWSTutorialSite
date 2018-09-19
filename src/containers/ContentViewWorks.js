import React, { Component } from "react";
import { API } from "aws-amplify";
import {
  PageHeader,
  ListGroup,
  ListGroupItem,
  FormGroup,
  FormControl,
  Label
} from "react-bootstrap";
import "./Home.css";

export default class ContentView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      notes: []
    };
  }

  async componentDidMount() {
    if (!this.props.isAuthenticated) {
      return;
    }

    try {
      const notes = await this.notes();
      this.setState({ notes });
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  notes() {
    return API.get("site", "/site/allnotes");
  }

  handleNoteClick = event => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute("href"));
  };

  renderNotesList(notes) {
    return [{}].concat(notes).map((note, i) => {
      if (i !== 0) {
        if (this.props.match.params.id === note.uploadId) {
          return (
            <Label key={i}>
              {/** need unique key prop else warning **/}
              {note.content}
            </Label>
          );
        }
      }
    });
  }

  renderLander() {
    return (
      <div className="lander">
        <h1>Scratch</h1>
        <p>A simple note taking app</p>
      </div>
    );
  }

  renderNotes() {
    return (
      <div className="notes">
        <PageHeader>Content View</PageHeader>
        <ListGroup>
          {!this.state.isLoading && this.renderNotesList(this.state.notes)}
        </ListGroup>
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        {this.props.isAuthenticated ? this.renderNotes() : this.renderLander()}
      </div>
    );
  }
}
