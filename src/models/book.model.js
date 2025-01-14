import mongoose , {Schema} from "mongoose";

// Define the schema for the Book model
const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
    },
    genre: {
      type: String,
      required: [true, 'Genre is required'],
      trim: true,
    },
    publicationYear: {
      type: Number,
      required: [true, 'Publication Year is required'],
      min: [1000, 'Year must be a valid number'],
      max: [new Date().getFullYear(), 'Year must not be in the future'],
    },
    ISBN: {
      type: String,
      required: [true, 'ISBN is required'],
      unique: true,
      validate: {
        validator: function (v) {
          return /^(97(8|9))?\d{9}(\d|X)$/.test(v); // ISBN-10 or ISBN-13 format
        },
        message: props => `${props.value} is not a valid ISBN!`,
      },
    },
    description: {
      type: String,
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
    },
    coverImage: {
      type: String,
      trim: true, // URL or Cloudinary link to cover image
    },
    totalCopies: {
      type: Number,
      required: [true, 'Total Copies is required'],
      min: [1, 'There must be at least one copy of the book'],
    },
    availableCopies: {
      type: Number,
      required: [true, 'Available Copies is required'],
      min: [0, 'Available copies cannot be negative'],
      default: function () {
        return this.totalCopies;
      },
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: [true, 'Added By is required'],
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);


// Method to check if a book is available for borrowing
bookSchema.methods.isAvailable = function () {
  return this.availableCopies > 0;
};

// Export the model
module.exports = mongoose.model('Book', bookSchema);
