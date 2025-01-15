import { Author, Book } from "../models/index.js";
import { asyncHandler , ApiError , ApiResponse , uploadOnCloudinary} from "../utils/index.js";
import mongoose,{isValidObjectId} from 'mongoose'

export const createAuthor = asyncHandler(async(req , res) => {
    const {
        firstName,
        lastName,
        fullName,
        biography,
        birthDate,
        deathDate,
        nationality
    } = req.body

    if(
        [  firstName,
            lastName,
            fullName,
            biography,
            birthDate,
            deathDate,
            nationality
        ].some(feild => feild?.trim() === undefined)
    ){
        throw new ApiError("all feilds are mandatry")
    }

    const author = await Author.create({
        firstName,
        lastName,
        fullName,
        biography,
        birthDate,
        deathDate,
        nationality
    })

    if(!author)
    {
        throw new ApiError("error while creating the author")
    }

    const authorInDb = await Author.findById(author?._id)

    if(!authorInDb)
    {
        throw new ApiError("error while finding the author ")
    }

    return res
           .status(200)
           .json(
              new ApiResponse(
                 authorInDb,
                 'author created successFully'
              )
           )
})

// TODO : COMPLETE THIS
export const getAllAuthor = asyncHandler(async(req , res) => {

})

export const getAuthor = asyncHandler(async(req , res ) => {
     const {authorId} = req.params
     if(!authorId && !isValidObjectId(authorId))
     {
        throw new ApiError('Error while getting the author Id')
     }
     
     const author = await Author.aggregate([
         {
            $match : {
                _id : new mongoose.Types.ObjectId(authorId)
            }
         },
         {
            $lookup : {
                from : 'books',
                foreignField : 'author',
                localField : '_id',
                as : 'books'
            }
         },
         {
            $addFields : {
                books : "$books"
            }
         },
         {
            $project : {
                firstName : 1,
                lastName : 1,
                fullName : 1,
                biography : 1,
                birthDate : 1,
                deathDate : 1,
                nationality : 1,
                books : 1
            }
         }
     ])

     if(!author)
     {
        throw new ApiError("Error while getting the author")
     }

     return res
            .status(200)
            .json(
                new ApiResponse(
                    author,
                    "author find successFully"
                )
            )

})

export const updateAuthor = asyncHandler(async(req , res) => {
    const {authorId} = req.params
    const {
        firstName,
        lastName,
        fullName,
        biography,
        birthDate,
        deathDate,
        nationality
      } = req.body

      if(
        [ firstName,
            lastName,
            fullName,
            biography,
            birthDate,
            deathDate,
            nationality
        ].some(feild => feild?.trim() === undefined)
        && (!authorId && isValidObjectId(authorId))
      ){
        throw new ApiError("all  feilds are mandatory")
      }

      const updatedAuthor = await Author.findByIdAndUpdate(
           authorId,
           {
              $set : {
                firstName,
                lastName,
                fullName,
                biography,
                birthDate,
                deathDate,
                nationality
              }
           },
           {
              new : true
           }
      )

      if(!updatedAuthor)
      {
        throw new ApiError('Error while updating the author')
      }

      return res
             .status(200)
             .json(
                new ApiResponse(
                    updatedAuthor,
                    "author updated successFully"
                )
             )
})

export const deleteAuthor = asyncHandler(async(req,res) => {
    const {authorId} = req.params
    if(!isValidObjectId(authorId))
    {
        throw new ApiError('Error while getting the id')
    }
    const deletedAuthor = await Author.findByIdAndDelete(req?.user._id)

    if(!deletedAuthor)
    {
       throw new ApiError('Error while deleting the author')
    }

    return res
           .status(200)
           .json(
              new ApiResponse(
                  {},
                  'user deleted SuccessFully'
              )
           )
})


// controllers that write for the author

// 1. Create Author Controller
// Purpose: Add a new author to the system.
// Operations:
// Accept input (e.g., name, biography, birthDate, books).
// Validate the data (e.g., ensure name is provided).
// Save the author to the database.
// Respond with the newly created author's details.

// 2. Get All Authors Controller
// Purpose: Fetch a list of all authors.
// Operations:
// Retrieve all authors from the database.
// Support optional query parameters for filtering or searching, such as:
// By name (e.g., search by name).
// By associated books (e.g., books field).
// Paginate results if necessary (e.g., 10 authors per page).

// 3. Get Author by ID Controller
// Purpose: Retrieve details of a specific author by their ID.
// Operations:
// Accept the authorId as a parameter.
// Find the author in the database using the authorId.
// Populate the books field to include book details.
// Return the author's full details, including their books.


// 4. Update Author Controller
// Purpose: Update an author's information.
// Operations:
// Accept the authorId as a parameter and update data in the request body.
// Validate the updated data (e.g., ensure the name is not empty).
// Update the author's details in the database.
// Return the updated author details.


// 5. Delete Author Controller
// Purpose: Remove an author from the system.
// Operations:
// Accept the authorId as a parameter.
// Check if the author is associated with any books.
// If yes, optionally prevent deletion or handle it (e.g., unlink books).
// Delete the author from the database.
// Return a success message.


// 6. Link Book to Author Controller
// Purpose: Associate a book with an author.
// Operations:
// Accept authorId and bookId in the request.
// Check if the book exists in the database.
// Add the bookId to the books array of the specified author.
// Save the updated author document.
// Return the updated author's details.


// 7. Unlink Book from Author Controller
// Purpose: Remove the association of a book from an author.
// Operations:
// Accept authorId and bookId in the request.
// Remove the bookId from the books array of the specified author.
// Save the updated author document.
// Return the updated author's details.


// 8. Search Authors Controller
// Purpose: Search authors by name or other criteria.
// Operations:
// Accept a query parameter (e.g., name or keyword).
// Perform a case-insensitive search using regex or other methods.
// Return a list of matching authors.


// 9. Author's Books Controller
// Purpose: Retrieve all books written by a specific author.
// Operations:
// Accept the authorId as a parameter.
// Populate the books field of the author's record.
// Return a list of books authored by the specified author.


// 10. Get Popular Authors Controller
// Purpose: Retrieve a list of authors based on criteria such as the number of books they've written or the popularity of their books.
// Operations:
// Aggregate authors based on their book count or other metrics.
// Sort authors by the chosen metric (e.g., most books, most borrowed books).
// Return the top authors as a response.