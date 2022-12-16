import React from "react";
import Card from 'react-bootstrap/Card';
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import axios from "axios";

// List all books via looping through each book
export class Books extends React.Component{
    render(){
        return this.props.books.map(
            (book)=>{
                return <BookItem book={book} key={book._id} componentDidMount={this.props.componentDidMount}></BookItem>
            }
        );
    }
}

// Card for each book item (called from above)
class BookItem extends React.Component {

    // Constructor needed to bind the deleteBook() method from the button below.
    constructor(){
        super(); // call the parent (Book)
        this.deleteBook = this.deleteBook.bind(this); // when onclick event happens. bind the method
    }

    // Deletes a book when a Delete button is pressed.
    deleteBook(e){
        e.preventDefault();
        // HTTP request -> delete -> this.props.book._id
        axios.delete('http://localhost:4000/api/books/' + this.props.book._id)
        .then(()=>{ // Then reload the page
            this.props.componentDidMount();
        })
        .catch();
    }

    render() {
        return (
            <div>
                <Card>
                    <Card.Header>{this.props.book.title}</Card.Header>
                    <Card.Body>
                        <blockquote className="blockquote mb-0">
                            <img src={this.props.book.cover}></img>
                            <footer >
                                {this.props.book.author}
                            </footer>
                        </blockquote>
                    </Card.Body>
                    <Link to={'/edit/'+this.props.book._id} className="btn btn-primary">Edit</Link>
                    <Button variant="danger" onClick={this.deleteBook}>Delete</Button>
                </Card>
            </div>
        );
    }
}