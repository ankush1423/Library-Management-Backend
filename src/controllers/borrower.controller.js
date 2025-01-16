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