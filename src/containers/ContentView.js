import React, { Component } from "react";
import { API } from "aws-amplify";
import {
  PageHeader,
  ListGroup,
  ListGroupItem,
  FormGroup,
  FormControl,
  Label,
  ControlLabel
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

  async getAttachment(note) {
    try {
      var attachmentURL = await Storage.vault.get(note.attachment);
      return attachmentURL;
    } catch (e) {}
  }

  renderNotesList(notes) {
    return [{}].concat(notes).map((note, i) => {
      if (i !== 0) {
        if (this.props.match.params.id === note.uploadId) {
          if (note.attachment) {
            var attachmentURL = this.getAttachment(note);
          } else {
            var attachmentURL = null;
          }
          return (
            <div>
              <Label key={i}>
                {/** need unique key prop else warning **/}
                {note.content}
              </Label>
              <FormGroup>
                <ControlLabel>Attachment</ControlLabel>
                <FormControl.Static>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={attachmentURL}
                  >
                    {this.formatFilename(note.attachment)}
                  </a>
                </FormControl.Static>
              </FormGroup>
            </div>
          );
        }
      }
    });
  }

  formatFilename(str) {
    return str.replace(/^\w+-/, "");
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
