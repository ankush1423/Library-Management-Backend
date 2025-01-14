import mongoose , {Schema} from "mongoose";

const transactionSchema = new Schema(
  {
    borrowerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Borrower', // Reference to the Borrower model
      required: [true, 'Borrower ID is required'],
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book', // Reference to the Book model
      required: [true, 'Book ID is required'],
    },
    transactionType: {
      type: String,
      enum: ['borrow', 'return'],
      required: [true, 'Transaction type is required'],
    },
    transactionDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    returnDate: {
      type: Date,
      default: null, // Set when the book is returned
    },
    penalty: {
      type: Number,
      default: 0,
      min: [0, 'Penalty cannot be negative'],
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Method to calculate penalty for overdue books
transactionSchema.methods.calculatePenalty = function () {
  if (this.returnDate && this.returnDate > this.dueDate) {
    const overdueDays = Math.floor((this.returnDate - this.dueDate) / (1000 * 60 * 60 * 24));
    this.penalty = overdueDays * 2; // Example: $2 penalty per day
  } else {
    this.penalty = 0;
  }
};

// Export the model
export const Transaction = mongoose.model('Transaction', transactionSchema);
