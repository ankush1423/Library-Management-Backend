import {  Borrower , Book} from "../models/index.js"
import { asyncHandler , ApiError , ApiResponse , uploadOnCloudinary} from "../utils/index.js"
import mongoose,{isValidObjectId} from 'mongoose'

export const createBorrowwer = asyncHandler(async(req , res) => {

    const {userId , borrowedBooks } = req.body
    
    if(!isValidObjectId(userId) || !borrowedBooks || !Array.isArray(borrowedBooks) || borrowedBooks.length === 0)
    {
        throw new ApiError('bowwered books are required or userId required')
    }
    
    const existingBorrowwer = await Borrower.findOne({userId : userId})
    if(existingBorrowwer)
    {
        throw new ApiError("borrower already exist")
    }
    
    for(let book of borrowedBooks)
    {
        const booksToIssue = await Book.findById(book.bookId)
        if(!booksToIssue)
        {
            throw new ApiError(`book with this ${book._id} not available`)
        }
        if(!booksToIssue.isAvailable())
        {
            throw new ApiError(`book with this ${book._id} is not available`)
        }
    }

    // Create a new borrower record
    const borrower = new Borrower({
      userId,
      borrowedBooks: borrowedBooks.map(book => ({
        bookId: book.bookId,
        dueDate: book.dueDate,
      })),
      totalBorrowedBooks: borrowedBooks.length,
    });

    await borrower.save();

    for (const book of borrowedBooks) {
        await Book.findByIdAndUpdate(book.bookId, { $inc: { availableCopies: -1 } });
    }

    return res
           .status(200)
           .json(
             new ApiResponse(
                borrower,
                'borrower created successFully'
             )
           )
    
})

export const getBorrower = asyncHandler(async(req , res) => {
      const {borrowerId} = req.params
      if(!isValidObjectId(borrowerId))
      {
         throw new ApiError('Error while getting the Id')
      }

      const borrower = await Borrower.findById(borrowerId).populate('borrowedBooks').populate({
        path: 'borrowedBooks.bookId',
        select: 'title genre ISBN',
      });

      if(!borrower)
      {
        throw new ApiError('Error while getting the borrower')
      }
      
      return res
             .status(200)
             .json(
                new ApiResponse(
                     borrower,
                     'borrower find successFully'
                )
             )



})

export const addBookToBorrower = asyncHandler(async(req , res) => {
    const {borrowerId , newBook} = req.body
    if(!isValidObjectId(borrowerId) || !newBook)
    {      
        throw new ApiError('Error while getting the user or book data')
    }
    
    const book = await Book.findById(bookId)
    if(!book || !book.isAvailable())
    {
        throw new ApiError('book is not Vailable this time')
    }

    const bookAddedToBorrower = await Borrower.findByIdAndUpdate(
        userId,
        {
            $push : {
                borrowedBooks : newBook
            },
        },
        {
            new : true
        }
    )

    if(!bookAddedToBorrower)
    {
        throw new ApiError('Error while issung the book to the borrower')
    }
    
    return res
           .status(200)
           .json(
              new ApiResponse(
                bookAddedToBorrower,
                'book issued successFully'
              )
           )

})


// Here are some suggested controllers you can implement for the Borrower model in your library management system:

// 1. Create Borrower
// Purpose: Create a new borrower record when a user borrows books for the first time.
// Key Tasks:
// Validate userId and borrowedBooks input.
// Ensure books exist and are available for borrowing.
// Add borrowed books to the borrower's record.
// Decrement availableCopies in the Book model.
// HTTP Method: POST
// Route: /api/borrowers


// 2. Get Borrower Details
// Purpose: Retrieve the details of a borrower by their userId.
// Key Tasks:
// Fetch the borrower's record, including their borrowed books.
// Populate book details (e.g., title, author, genre).
// HTTP Method: GET
// Route: /api/borrowers/:userId


// 3. Add Borrowed Book
// Purpose: Add a new book to the borrower's borrowed books list.
// Key Tasks:
// Validate the book's availability and due date.
// Update the borrower's record with the new book.
// Update the availableCopies of the book in the Book model.
// HTTP Method: PUT
// Route: /api/borrowers/:userId/borrow


// 4. Return Borrowed Book
// Purpose: Mark a borrowed book as returned.
// Key Tasks:
// Validate that the book exists in the borrower's record.
// Update the returnedDate and change the status to returned.
// Increment the availableCopies in the Book model.
// HTTP Method: PUT
// Route: /api/borrowers/:userId/return/:bookId


// 5. Get Overdue Books
// Purpose: Retrieve a list of overdue books for a specific borrower.
// Key Tasks:
// Filter borrowedBooks by dueDate < current date and status === 'borrowed'.
// Return a list of overdue books with details.
// HTTP Method: GET
// Route: /api/borrowers/:userId/overdue
// 6. Update Borrower Details
// Purpose: Update a borrower's record (e.g., modify due dates, or correct data).
// Key Tasks:
// Validate input data.
// Allow updates to specific fields like dueDate or status.
// HTTP Method: PATCH
// Route: /api/borrowers/:userId


// 7. Delete Borrower Record
// Purpose: Remove a borrower's record (e.g., when all books are returned, and the user no longer borrows).
// Key Tasks:
// Validate that the borrower has no pending borrowed books.
// Delete the borrower record from the database.
// HTTP Method: DELETE
// Route: /api/borrowers/:userId


// 8. Get All Borrowers
// Purpose: Retrieve a list of all borrowers with their borrowing details.
// Key Tasks:
// Fetch all borrower records.
// Include related book details using populate().
// HTTP Method: GET
// Route: /api/borrowers


// 9. Check Borrower Borrowing Limit
// Purpose: Check if a borrower has exceeded the borrowing limit.
// Key Tasks:
// Validate the current count of borrowed books.
// Return a message indicating whether they can borrow more books.
// HTTP Method: GET
// Route: /api/borrowers/:userId/limit