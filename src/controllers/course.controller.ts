import { Course, Category } from "../models/course.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";

/**
 * @route POST /api/v1/categories
 * @desc Create a category
 * @access Private
 * @returns Category
 */
const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const category = await Category.create({ name });
  return res
    .status(201)
    .json(new ApiResponse(201, category, "Category Created Successfully"));
});

const getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category Fetched Successfully"));
});

const getCategories = asyncHandler(async (_, res) => {
  const categories = await Category.find();
  return res
    .status(200)
    .json(new ApiResponse(200, categories, "Categories Fetched Successfully"));
});

const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const category = await Category.findByIdAndUpdate(
    id,
    { name },
    { new: true }
  );
  if (!category) {
    throw new ApiError(404, "Category not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category Updated Successfully"));
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Category Deleted Successfully"));
});

const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ published: true });
  return res
    .status(200)
    .json(new ApiResponse(200, courses, "Courses Fetched Successfully"));
});

const createCourse = asyncHandler(async (req, res) => {
  //   TODO
  const { name, description, category } = req.body;

  if (!name || !description || !category) {
    throw new ApiError(400, "All fields are required");
  }
  const createdBy = req.user?._id;
  // implement poster image
  const course = await Course.create({
    name,
    description,
    category,
    createdBy,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, course, "Course Created Successfully"));
});

export {
  createCategory,
  getCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getCourses,
  createCourse,
};
