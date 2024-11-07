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
import { AuthRoles } from "../../constants/enums";

const router = Router();

router
  .route("/categories/:id")
  .get(getCategory)
  .put(auth([AuthRoles.INSTRUCTOR, AuthRoles.ADMIN]), updateCategory) // TODO think about PATCH
  .delete(auth([AuthRoles.INSTRUCTOR, AuthRoles.ADMIN]), deleteCategory);

router
  .route("/categories")
  .get(getCategories)
  .post(
    auth([AuthRoles.INSTRUCTOR, AuthRoles.ADMIN]),
    /*checkPermission("createCategory")*/
    createCategory
  );

router
  .route("/")
  .get(getCourses)
  .post(auth([AuthRoles.INSTRUCTOR, AuthRoles.ADMIN]), createCourse);

export default router;
