import { Request, Response, Router } from "express";
import multer from "multer";
import path from "path";
import { UserController } from "../controllers/UserControllers";
import verifyToken from "../middlewares/verifyToken";
import { sendEmail } from "../controllers/SendEmailController";
const routes = Router();
const uploadMoa = multer({ storage: multer.memoryStorage() }).single("pdfFile");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

routes.post("/createAdmin", UserController.createAdmin);
routes.post("/createTeacher", UserController.createTeacher);
routes.post("/createStudent", verifyToken, UserController.createStudent);
routes.post("/addSubject", UserController.addSubject);
routes.post("/addGrade", UserController.addGrade);

//get data
routes.get("/getStudents", verifyToken, UserController.getStudents);
routes.get("/getAllStudent", UserController.getAllStudent);
routes.get("/getTeachers", UserController.getTeacher);
routes.get("/getSubject", UserController.getSubject);

// get info
routes.get("/getTeacherInfo", verifyToken, UserController.getTeacherInfo);
routes.get("/getAdminInfo", verifyToken, UserController.getAdminInfo);
routes.delete("/deleteSubject/:id", UserController.deleteSubject);

// routes.delete("/deleteRequirement/:id", UserController.deleteRequirement);

routes.put("/updateTeacher", UserController.updateTeacher);
routes.put("/updateStudent", UserController.updateStudent);
routes.put("/updateGrade", UserController.updateGrade);

//logout
routes.post("/logout", (req: any, res: Response) => {
  try {
    res.clearCookie("token");
    res.json({ message: "LoggedOut" });
  } catch (error: any) {
    throw new Error(error);
  }
});

routes.post("/sendEmail", sendEmail);
export default routes;
