import React, { Component } from 'react';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop'
import './Events.css';

class EventsPage extends Component {
    state = {
        creating: false
    };

    startCreateEventHandelr = () => {
        this.setState({creating: true});
    }

    modalCancelHandler = () => {
        this.setState({creating: false});
    };

    modalConfirmHandler = () => {
        this.setState({creating: false});
    };

    render() {
        return (
            <React.Fragment>
                {this.state.creating && <Backdrop />}
                {this.state.creating && <Modal title="Add Event" canCancel canConfirm onCancel={this.modalCancelHandler} onConfirm={this.modalConfirmHandler}>
                    <p>Modal Text</p>
                </Modal>}
                <div className="events-control">
                    <p>Share your own Events!</p>
                    <button className="btn" onClick={this.startCreateEventHandelr}>Create Event</button>
                </div>
            </React.Fragment>
        );
    }
}

export default EventsPage;