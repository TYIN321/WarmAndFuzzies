import React, {Component} from 'react';
import Note from './Note.js';
import axios from 'axios';
import './Bag.css';


// view all notes in grid format
// pass User as props to use to get all notes
// we are getting user model from the route call :id
export default class Bag extends Component{
    constructor(props){
        super(props);

        this.state = {
            email: this.props.cookies.get('user'),
            firstName: "", // need to pass this from somewhere?
            lastName: "",
            userID: "",
            notes: [], // get request will fill this array with notes
            errorMessage: null 
        }
    }

    componentDidMount(){
        axios.get("http://localhost:5000/notes/view/" + this.state.email)
        .then(response => {
            this.setState({
                notes: response.data // should be an array of notes
            });
        })
        .catch((error) =>{
            this.setState({errorMessage: "Sorry, unable to retrieve your notes right now"})
            alert("There was an issue retriving your notes")
        })

        axios.get('http://localhost:5000/user', {          
            params: {email: this.state.email}
        })
            .then(response => {
                this.setState({
                    firstName: response.data.firstName,
                    lastName: response.data.lastName
                })
            }).catch((e) => {
                console.log(e);
                alert("There was an issue getting the user information. Please refresh the page")
            })
    }

    render(){
        const notes = this.state.notes;
        const heading = (<h1>Your Bag</h1>)
        return(
            <div id = "bag">
                {this.state.errorMessage || heading}
                <div>
                    <div className = "masonry">
                    {
                        notes.map(note =>
                        {
                            console.log(note);

                            return (
                                <div className = "item">
                                    <Note sender = {note.sender} anonymous = {note.anonymous} content = {note.contents} key = {note._id}/>
                                </div>
                                
                            )
                        })
                    }
                    </div>
                  
                </div>


            </div>
        );
    }
}
