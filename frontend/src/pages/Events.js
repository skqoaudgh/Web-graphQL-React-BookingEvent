import React, { Component } from 'react';

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import EventList from '../components/Events/EventList/EventList';
import Spinner from '../components/Spinner/Spinner';
import AuthContext from '../context/auth-context';

import './Events.css';

class EventsPage extends Component {
    state = {
        creating: false,
        events: [],
        isLoading: false,
        selectedEvent: null
    };
    isActive = true;

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.titleEl = React.createRef();
        this.priceEl = React.createRef();
        this.dateEl = React.createRef();
        this.descriptionEl = React.createRef();
    }

    componentDidMount() {
        this.fetchEvents();
    }

    startCreateEventHandelr = () => {
        this.setState({creating: true});
    }

    modalCancelHandler = () => {
        this.setState({creating: false, selectedEvent: null});
    };

    refreshEventHandler = () => {
        this.setState({isLoading: true});
        this.fetchEvents();
    };

    fetchEvents() {
        this.setState({isLoading: true});
        const requestBody = {
            query: `
                query {
                    events {
                        _id
                        title
                        description
                        date
                        price
                        bookingCount
                        creator {
                            _id
                            email
                        }
                    }
                }
            `
        };

        fetch('http://localhost:8000/api', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-type': 'application/json'
            }
        }).then(res => {
            if(res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            return res.json();
        })
        .then(resData => {
            const events = resData.data.events;
            if(this.isActive) {
                this.setState({events: events, isLoading: false});
            }
        })
        .catch(err => {
            console.log(err);
            if(this.isActive) {
                this.setState({isLoading: false});
            }
        });
    }

    modalConfirmHandler = () => {
        this.setState({creating: false});
        const title = this.titleEl.current.value;
        const price = +this.priceEl.current.value;
        const date = this.dateEl.current.value;
        const description = this.descriptionEl.current.value;

        if(title.trim().length === 0 || price <= 0 || date.trim().length === 0 || description.trim().length === 0) {
            return;
        }

        const event = {title, price, date, description};
        console.log(event);

        const requestBody = {
            query: `
                mutation CreateEvent($title: String!, $description: String!, $price: Int!, $date: String!) {
                    createEvent(eventInput: {title: $title, description: $description, price: $price, date: $date}) {
                        _id
                        title
                        description
                        date
                        price
                    }
                }
            `,
            variables: {
                title: title,
                description: description,
                price: price,
                date: date
            }
        };
    
        const token = this.context.token;

        fetch('http://localhost:8000/api', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then(res => {
            if(res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            return res.json();
        })
        .then(resData => {
            this.setState(prevState => {
                const updatedEvents = [...prevState.events];
                updatedEvents.push({
                    _id: resData.data.createEvent._id,
                    title: resData.data.createEvent.title,
                    description: resData.data.createEvent.description,
                    date: resData.data.createEvent.date,
                    price: resData.data.createEvent.price,
                    creator: {
                        _id: this.context.userId
                    }
                });
                return {events: updatedEvents};
            });
        })
        .catch(err => {
            console.log(err);
        });
    };

    showDetailHandler = eventId => {
        this.setState(prevState => {
            const selectedEvent = prevState.events.find(e => e._id === eventId);
            return {selectedEvent: selectedEvent};
        });
    };

    bookEventHandler = () => {
        if(!this.context.token) {
            this.setState({selectedEvent: null});
        }
        const requestBody = {
            query: `
                mutation BookEvent($id: ID!) {
                    bookEvent(eventId: $id) {
                        _id
                        createdAt
                        updatedAt
                    }
                }
            `,
            variables: {
                id: this.state.selectedEvent._id
            }
        };

        fetch('http://localhost:8000/api', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token
            }
        }).then(res => {
            if(res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            return res.json();
        })
        .then(resData => {            
            this.setState({selectedEvent: null});
        })
        .catch(err => {
            console.log(err);
        });
    }

    componentWillUnmount() {
        this.isActive = false;
    }

    render() {
        return (
            <React.Fragment>
                {(this.state.creating  || this.state.selectedEvent) && <Backdrop />}
                {this.state.creating && <Modal title="Add Event" 
                    canCancel 
                    canConfirm 
                    onCancel={this.modalCancelHandler} 
                    onConfirm={this.modalConfirmHandler}
                    confirmText="Confirm"
                >
                    <form>
                        <div className="form-control">
                            <label htmlFor="title">Title</label>
                            <input type="text" id="title" ref={this.titleEl}></input>
                        </div>
                        <div className="form-control">
                            <label htmlFor="price">Price</label>
                            <input type="number" id="price" ref={this.priceEl}></input>
                        </div>
                        <div className="form-control">
                            <label htmlFor="date">Date</label>
                            <input type="datetime-local" id="date" defaultValue={new Date().toISOString().slice(0,16)} ref={this.dateEl}></input>
                        </div>
                        <div className="form-control">
                            <label htmlFor="description">Description</label>
                            <textarea id="description" rows="4" ref={this.descriptionEl}></textarea>
                        </div>                                                                    
                    </form>
                </Modal>}
                {this.state.selectedEvent && <Modal 
                    title={this.state.selectedEvent.title} 
                    canCancel 
                    canConfirm 
                    onCancel={this.modalCancelHandler} 
                    onConfirm={this.bookEventHandler}
                    confirmText={this.context.token ? 'Book' : 'Confirm'}
                >
                    <h1>{this.state.selectedEvent.title}</h1>
                    <h2>{this.state.selectedEvent.price}\ - {new Date(this.state.selectedEvent.date).toLocaleDateString()}</h2>
                    <p>{this.state.selectedEvent.description}</p>
                    <p>{this.state.selectedEvent.bookingCount} is booking this event.</p>
                </Modal>}
                {this.context.token && (<div className="events-control">
                    <p>Share your own Events!</p>
                    <button className="btn" onClick={this.startCreateEventHandelr}>Create Event</button>
                </div>
                )}
                {this.state.isLoading 
                    ? (<Spinner />)
                    : (<EventList 
                        events={this.state.events} 
                        authUserId={this.context.userId}
                        onViewDetail={this.showDetailHandler}
                    />)
                }
            </React.Fragment>
        );
    }
}

export default EventsPage;