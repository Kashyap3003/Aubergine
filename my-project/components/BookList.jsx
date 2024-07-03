import React, { useEffect, useState } from 'react';

const BookList = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetch('https://demo-1jjr.onrender.com/api/books/')
            .then(response => response.json())
            .then(data => setBooks(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-bold">Book List</h2>
            <ul>
                {books.map(book => (
                    <li key={book._id} className="my-2">
                        <h3 className="text-xl">{book.title}</h3>
                        <p>{book.isbn}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BookList;
