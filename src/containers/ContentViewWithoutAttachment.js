import React, { Component } from "react";
import { API, Storage } from "aws-amplify";
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./Notes.css";

export default class ContentView extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      note: null,
      content: ""
    };
  }

  async componentDidMount() {
    try {
      const note = await this.getNote();
      const { content } = note;

      this.setState({
        note,
        content
      });
    } catch (e) {}
  }

  getNote() {
    return API.get("site", `/site/allnotes/${this.props.match.params.id}`);
  }

  render() {
    return (
      <div className="ContentViewHello">
        {this.state.note && (
          <form onSubmit={this.handleSubmit}>
            <FormGroup controlId="content">
              <FormControl
                onChange={this.handleChange}
                value={this.state.content}
                componentClass="textarea"
                readOnly
              />
            </FormGroup>
          </form>
        )}
      </div>
    );
  }
}
