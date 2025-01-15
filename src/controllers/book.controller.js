import {  Book } from "../models/index.js";
import { asyncHandler , ApiError , ApiResponse , uploadOnCloudinary} from "../utils/index.js";
import mongoose,{isValidObjectId} from 'mongoose';

export const createBook = asyncHandler(async(req , res) => {
    const {
        title,
        genre,
        publicationYear,
        ISBN,
        description,
        totalCopies,
        availableCopies
    } = req.body

    if(
        [ title,
            genre,
            publicationYear,
            ISBN,
            description,
            totalCopies,
            availableCopies
        ].some(feild => feild?.trim() === undefiend)
    ){
        throw new ApiError("all feilds are mandatry")
    }
    
    const coverImagePath = req?.file?.path
    if(!coverImagePath)
    {
        throw new ApiError('Error while getting the cover Image Path')
    }

    const coverImageRefrence = await uploadOnCloudinary(coverImagePath)
    if(!coverImageRefrence)
    {
        throw new ApiError('Error while uploadImage On Cloudnary')
    }
    const book = await Book.create({
        title,
        genre,
        publicationYear,
        coverImage: coverImageRefrence?.url,
        ISBN,
        description,
        totalCopies,
        availableCopies
    })

    if(!book)
    {
        throw new ApiError('Error while creating a book')
    }

    const createdBook = await Book.findById(book?._id)

    if(!createdBook)
    {
        throw new ApiError('Error while finding the book')
    }

    return res
           .status(200)
           .json(
              new ApiResponse(
                  createdBook,
                  'book created successFully'
              )
           )
})

export const getAllBooks = asyncHandler(async(req , res) => {

})

export const getBook = asyncHandler(async(req , res) => {
     const {bookId} = req.params

     if(!isValidObjectId(bookId))
     {
        throw new ApiError('Error while getting the book Id')
     }

     const book = await Book.findById(bookId).populate("author","fullName")
     if(!book)
     {
        throw new ApiError('Error while getting the book')
     }

     return res
            .status(200)
            .json(
                new ApiResponse(
                     book,
                     'book find SuucessFully'
                )
            )

})

export const updateBookDetails = asyncHandler(async(req , res) => {
     const {bookId} = req.params

     const {
        ISBN , totalCopies
     } = req.body

     if(!isValidObjectId(bookId) || !ISBN || !totalCopies)
     {
        throw new ApiError('all feilds are mandatory')
     }
     
     const updatedBook = await Book.findByIdAndUpdate(
        bookId,
        {
            $set : {
                ISBN ,
                totalCopies
            }
        },
        {
            new : true
        }
     )

     if(!updatedBook)
     {
        throw new ApiError('Error while updating the Book')
     }

     return res
            .status(200)
            .json(
                new ApiResponse(
                     updatedBook,
                     'book updated SuccessFully'
                )
            )

})

export const deleteBook = asyncHandler(async(req , res) => {
    const {bookId} = req.params
    if(!isValidObjectId(bookId))
    {
       throw new ApiError('Error while getting the valid Id of Book')
    }

    const deletedBook = await Book.findByIdAndDelete(bookId)
    if(!deleteBook)
    {
        throw new ApiError('Error while deleting the Book From Database')
    }

    return res
           .status(200)
           .json(
              new ApiResponse(
                  {},
                  'book deleted SuccessFully'
              )
           )
})


// Here are some controller suggestions for the Book model you provided. These controllers will allow comprehensive management of books in your library management system:

// 1. Create Book Controller
// Purpose: Add a new book to the library.
// Operations:
// Validate the input (e.g., title, author, genre, ISBN).
// Ensure the author and addedBy references are valid ObjectIDs in their respective collections.
// Save the book to the database.
// Return the newly created book's details.


// 2. Get All Books Controller
// Purpose: Fetch a list of all books in the library.
// Operations:
// Retrieve books with optional query parameters such as:
// By genre.
// By author.
// By publication year or other filters.
// Populate author and addedBy fields for detailed results.
// Support pagination (e.g., page and limit query params).


// 3. Get Book by ID Controller
// Purpose: Fetch details of a specific book by its ID.
// Operations:
// Accept the bookId as a parameter.
// Retrieve the book and populate author and addedBy fields.
// Return detailed book information, including whether it is available.


// 4. Update Book Details Controller
// Purpose: Update details of an existing book.
// Operations:
// Accept the bookId as a parameter and update data in the request body.
// Validate the updated fields (e.g., ISBN format, totalCopies logic).
// If totalCopies changes, adjust availableCopies accordingly.
// Save the updated book to the database.
// Return the updated book details.


// 5. Delete Book Controller
// Purpose: Remove a book from the library system.
// Operations:
// Accept the bookId as a parameter.
// Check if the book is associated with any active transactions (e.g., borrowed but not returned).
// If no active transactions exist, delete the book from the database.
// Return a success message.


// 6. Check Availability Controller
// Purpose: Check if a specific book is available for borrowing.
// Operations:
// Accept the bookId as a parameter.
// Use the isAvailable method from the schema to check availability.
// Return a response indicating whether the book is available.


// 7. Borrow Book Controller
// Purpose: Decrease the availableCopies when a user borrows a book.
// Operations:
// Accept bookId and userId in the request body.
// Verify the book is available for borrowing.
// Decrease the availableCopies count.
// Return a confirmation of the borrowing.


// 8. Return Book Controller
// Purpose: Increase the availableCopies when a user returns a book.
// Operations:
// Accept bookId and userId in the request body.
// Verify the book is associated with an active transaction for the user.
// Increase the availableCopies count.
// Return a confirmation of the return.


// 9. Search Books Controller
// Purpose: Search for books by various criteria.
// Operations:
// Accept query parameters such as:
// title (partial match).
// genre.
// author.
// publicationYear.
// Perform a case-insensitive search using regex or filters.
// Return a list of matching books.


// 10. Top Books Controller
// Purpose: Retrieve a list of the most popular or most borrowed books.
// Operations:
// Aggregate data to determine popularity based on borrowing transactions.
// Sort and return the top books.


// 11. Recent Additions Controller
// Purpose: Fetch a list of recently added books.
// Operations:
// Sort books by createdAt in descending order.
// Return the latest additions to the library.


// 12. Book Statistics Controller
// Purpose: Generate statistics about the books.
// Operations:
// Count books by genre, author, or publication year.
// Aggregate data for reports (e.g., most popular genres, authors with the most books).
// Return a summary of book-related statistics.


// 13. Reserve Book Controller (Optional)
// Purpose: Allow users to reserve a book when all copies are currently borrowed.
// Operations:
// Accept bookId and userId.
// Add the user to a waitlist for the book.
// Notify the user when a copy becomes available.
// These controllers cover the essential and advanced functionality needed for managing books in your library system. You can implement them as needed and extend them based on specific project requirements.