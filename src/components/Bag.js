import React, {Component} from 'react';
import Note from './Note.js';
import axios from 'axios';


// view all notes in grid format
// pass User as props to use to get all notes
// we are getting user model from the route call :id
export default class Bag extends Component{
    constructor(props){
        super(props);

        this.state = {
            firstName: this.props.match.params.firstName, // need to pass this from somewhere?
            lastName: this.props.match.params.lastName,
            userID: this.props.match.params.id,
            notes: [] // get request will fill this array with notes
        }
    }

    // NEED A LOGGED IN USER OR VALUE TO MAKE THIS REQUEST! 

    // componentWillMount(){
    //     axios.get('http://localhost:5000/view')
    //     .then(response =>{
    //         this.setState({
    //             notes: response.data.notes
    //         })
    //     })
    //     .catch((error) =>{
    //         console.log(error);
    //     })

    // }

    render(){
        var notes = this.state.notes;
        return(
            <div className = "container" style = {{background: "white"}}>
                <h1>{this.state.user}'s Bag</h1>
                {
                    notes.map(note =>
                    {
                        return <Note sender = {note.sender} content = {note.contents} />
                    })
                }

            </div>
        );
    }
}