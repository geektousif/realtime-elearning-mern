import { Router } from "express";
import {
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  createCategory,
  createCourse,
  getCourses,
} from "../../controllers/course.controller";
import auth from "../../middlewares/auth.middleware";
import checkPermission from "../../middlewares/checkPermission.middleware";

const router = Router();

router.route("/").get(getCourses).post(createCourse);

router
  .route("/categories")
  .get(getCategories)
  .post(auth, checkPermission("createCategory"), createCategory);
router
  .route("/categories/:id")
  .get(getCategory)
  .put(updateCategory) // TODO think about PATCH
  .delete(deleteCategory);

export default router;
