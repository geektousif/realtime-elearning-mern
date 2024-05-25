import { Schema, model } from "mongoose";
import { ICategory, ICourse } from "../types/models.type";

const categorySchema = new Schema<ICategory>({
  name: String,
});

export const Category = model<ICategory>("Category", categorySchema);

// /===================/
const courseSchema = new Schema<ICourse>({
  title: {
    type: String,
    required: [true, "Course Title is required"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Course Price is required"],
    min: [0, "Price can't be negative"],
  },
  posterImage: String,
  description: String,
  category: {
    type: Schema.ObjectId,
    ref: "Category",
  },
  instructor: {
    type: Schema.ObjectId,
    ref: "User",
  },
  published: Boolean,
});

export const Course = model<ICourse>("Course", courseSchema);
