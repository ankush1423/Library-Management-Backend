import mongoose , {Schema} from "mongoose";

// Define the schema for the Author model
const authorSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      minlength: [2, 'First name must be at least 2 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      minlength: [2, 'Last name must be at least 2 characters'],
    },
    fullName: {
      type: String,
      default: function () {
        return `${this.firstName} ${this.lastName}`;
      },
    },
    biography: {
      type: String,
      trim: true,
      minlength: [10, 'Biography must be at least 10 characters'],
      maxlength: [5000, 'Biography cannot exceed 5000 characters'],
    },
    birthDate: {
      type: Date,
      required: [true, 'Birth date is required'],
    },
    deathDate: {
      type: Date,
      default: null, // Optional field to record the author's death date
    },
    nationality: {
      type: String,
      required: [true, 'Nationality is required'],
      trim: true,
    },
    booksWritten: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book', // Reference to the Book model
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);



// Export the model
export const Author = mongoose.model('Author', authorSchema);
