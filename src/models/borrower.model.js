import mongoose , {Schema} from "mongoose";

const borrowerSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: [true, 'User ID is required'],
    },
    borrowedBooks: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Book', // Reference to the Book model
          required: [true, 'Book ID is required'],
        },
        borrowedDate: {
          type: Date,
          default: Date.now,
        },
        dueDate: {
          type: Date,
          required: [true, 'Due date is required'],
        },
        returnedDate: {
          type: Date,
          default: null, // This will be set when the book is returned
        },
        status: {
          type: String,
          enum: ['borrowed', 'returned', 'overdue'],
          default: 'borrowed',
        },
      },
    ],
    totalBorrowedBooks: {
      type: Number,
      default: 0,
      min: [0, 'Total borrowed books cannot be negative'],
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);


// Method to calculate the overdue status of borrowed books
borrowerSchema.methods.checkOverdueBooks = function () {
  const overdueBooks = this.borrowedBooks.filter(book => {
    return book.dueDate < Date.now() && book.status === 'borrowed';
  });
  return overdueBooks;
};


// Export the model
export const Borrower = mongoose.model('Borrower', borrowerSchema);
