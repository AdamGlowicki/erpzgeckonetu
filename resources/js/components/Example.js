import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Root from "./Root";
import 'bootstrap/dist/css/bootstrap.css';
import {BrowserRouter,} from 'react-router-dom'
import {Provider} from "react-redux";
import store from "./store";

export default class Example extends Component {
    render() {
        return (
            <Provider store={store}>
            <BrowserRouter>
                <Root/>
            </BrowserRouter>
            </Provider>
        );
    }
}

if (document.getElementById('example')) {
    ReactDOM.render(<Example/>, document.getElementById('example'));
}
