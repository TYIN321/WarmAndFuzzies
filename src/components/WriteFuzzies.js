import React from 'react';
import {Typeahead} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import "./WriteFuzzies.css";
import axios from 'axios';

export default class WriteFuzzies extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            sender: this.props.cookies.get('user'), // get this from redis session instead?? 
            recipients: [], // people we can write to, as tuples (userid, firstname, lastname)
            recipient: '',
            writtenTo: [],
            message: '',
            filter: 'all',
            filterText: 'Filter',
            anonymous: true
        };

        this.handleRecipientChange = this.handleRecipientChange.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateWrittenTo = this.updateWrittenTo.bind(this);
        this.handleAnonymousChange = this.handleAnonymousChange.bind(this);
    }

    componentDidMount(){
        axios.get('http://localhost:5000/users-all')
            .then(response => {
                this.setState({
                    recipients: response.data
                })
            })
            .catch(function (error){
                console.log(error);
            })

        // call another method to get a list of all users we've written to already
        
        axios.get("http://localhost:5000/notes/users-written-to", {params: {email: this.state.sender}})
            .then(response => {
                this.setState({
                    writtenTo: response.data.writtenTo
                });
            }).catch((e) => {
                alert("There was an issue getting users written to")
            })

    }

    updateWrittenTo(event){
        axios.get("http://localhost:5000/notes/users-written-to", {params: {email: this.state.sender}})
        .then(response => {
            this.setState({
                writtenTo: response.data.writtenTo
            });
        })
    }


    handleRecipientChange(event)
    {
        this.setState({
            recipient: event.target.value
        });
    }

    handleFilterChange(event)
    {
        this.setState({
            filter: event.target.value,
            filterText: "All"
        });
        this.typeahead.getInstance().clear();
    }

    handleAnonymousChange(event)
    {
        this.setState({
            anonymous: event.target.checked
        });
    }

    handleSubmit(event)
    {
        event.preventDefault();
        console.log(this.state);

        if(this.state.recipient === "")
        {
            alert("Please select a recipient");
        }
        else if(this.state.message === "")
        {
            alert("Message cannot be blank");
        }
        else
        {
            const note = {
                sender: this.state.sender, // this will be the current user's session id
                recipient: this.state.recipient,
                message: this.state.message,
                anonymous: this.state.anonymous
            }
            axios.post("http://localhost:5000/notes/send", note)
                .then(res => {
                    // need to implement check if the post request was successful
                    if(res.status !== 200)
                        alert("Error");
                    else
                    {
                        //check if successful--if successful clear form else dont and let them try again
                        this.setState({
                            recipient: '',
                            message: ''
                        });
                        this.typeahead.getInstance().clear();

                        alert("Warm and fuzzy sent!");
                    }
                })
                .catch(function (error){
                    alert("Error");
                    console.log(error);
                });
        }

        this.updateWrittenTo();
    }

    render()
    {
        // user list filter functions
        const noFilter = (recipient) => (true);
        const filterWritten = (recipient) => (this.state.writtenTo.includes(recipient.email));
        const filterNotWritten = (recipient) => (!this.state.writtenTo.includes(recipient.email));

        // filter options here
        const filterFunc = this.state.filter === "all" ? noFilter : this.state.filter === "written" ? filterWritten : filterNotWritten;
        const recipientNames = this.state.recipients.filter(filterFunc).map((recipient) => (recipient.firstName + " " + recipient.lastName)); // this will break rn bc no .name value


        return (
            <div className="write-form" id="write-fuzzies">
                <form onSubmit={this.handleSubmit}>
                    <div className="dropdown">
                        <h3 id="write-label">Select a recipient and write a warm and fuzzy!</h3>
                        <br/>

                        <div className="fuzzies-forms" id="select-div">
                            <Typeahead 
                                style={{width:"68%", float: "left"}}
                                id="recipient-select"
                                options={recipientNames}
                                onChange={(selected) => {
                                    // fix--doesnt work for duplicate names
                                    let recipientID = this.state.recipients.filter(recipient => ((recipient.firstName + " " + recipient.lastName) === selected[0]))[0];
                                    recipientID = (recipientID === undefined ? "" : recipientID.email);
                                    this.setState({recipient: recipientID});
                                }}
                                placeholder="Choose a recipient"
                                ref={(typeahead) => this.typeahead = typeahead}
                            />

                            <select id="filter-select" className="form-control" onChange={this.handleFilterChange}>
                                <option value="all">{this.state.filterText}</option>
                                <option value="not-written">Not written to</option>
                                <option value="written">Written to</option>
                            </select>
                        </div>
                    </div>

                    <div className="fuzzies-forms">
                        <br/>
                        <textarea 
                            className="form-control" value={this.state.message} 
                            onChange={(e) => {this.setState({message: e.target.value})}} 
                            style={{height: "25vh"}}
                        ></textarea>
                        <div id="checkbox" className="form-check">
                            <input type="checkbox" className="form-check-input" value={this.state.anonymous} onChange={this.handleAnonymousChange}></input>
                            <label className="form-check-label">Send anonymously</label>
                        </div>
                        <button type='submit' id="write-button" className="btn btn-primary mb-2">Put in bag!</button>
                    </div>
                </form>
            </div>
        );
    }
}