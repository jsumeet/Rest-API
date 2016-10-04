Name: Sumeet Jain
ASU ID: 1209404895


REST Model: Level 2

REST Implementation done on Node.js with MongoDb as database.
Modules: express, mongoose, body-parser

POST Method used for creating a resource
PATCH Method used for updating the resource
PUT Method used for creating/updating the resource
DELETE Method used for deleting the resource
GET Method used for retriving a resource

1.	Create an Author

Method:	POST
URL:	localhost:8081/library/create/author

2.	Create a Book (note it must have at least one Author)

Method: POST
URL:	localhost:8081/library/create/book

3.	Update an Author’s first or last name

METHOD:	PATCH
URL:	localhost:8081/library/update/author/name

4.	Update a Book’s publisher, title, or year

METHOD: PATCH
URL:	localhost:8081/library/update/book/publisher/:book_id/:book_publisher
URL: 	localhost:8081/library/update/book/title/:book_id/:book_title
URL:	localhost:8081/library/update/book/year/:book_id/:book_year

Enter _id of book as parameter with the publisher, title or year to update the book details

5.	Add an Author to a Book

METHOD:	PUT
URL:	localhost:8081/library/update/book/addauthor


6.	Delete a Book

METHOD: DELETE
URL:	localhost:8081/library/delete/book/byisbn/:delete_isbn

Enter ISBN as parameter to delete the book

7.	Delete an Author (only if no Book with that Author)

METHOD:	DELETE
URL:	localhost:8081/library/delete/author/byid/:delete_id

Enter _id of author as parameter to delete the author

8.	Retrieve an Author by ID

METHOD:	GET
URL:	localhost:8081/library/find/author/byid/:author_id

Enter Author ID as parameter to get author


9.	Retrieve a Book by ISBN

METHOD:	GET
URL:	localhost:8081/library/find/book/byisbn/:get_isbn

Enter ISBN as parameter to get the book details

10.	 Retrieve a collection of Books by Title substring

METHOD:	GET
URL:	localhost:8081/library/find/book/bytitle/:get_title

Enter title substring as parameter to get the book details