import { Request, Response, response } from "express";

import { prisma } from "../services/Prisma";
import argon from "argon2";

export class UserController {
  static async createAdmin(req: any, res: Response) {
    const { email, password, name, address, contact, position } = req.body;
    try {
      const response = await prisma.account.create({
        data: {
          username: email,
          password: await argon.hash(password),
          role: "Admin",
          admin: {
            create: {
              name,
              address,
              contact,
              email,
              position,
            },
          },
        },
      });
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  static async createTeacher(req: any, res: Response) {
    const { name, contact, email, password } = req.body;
    try {
      const response = await prisma.account.create({
        data: {
          username: email,
          password: await argon.hash(password),
          role: "Teacher",
          teacher: {
            create: {
              name,
              contact,
              email,
              rank: 1,
            },
          },
        },
      });
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  static async createStudent(req: any, res: Response) {
    const { name, gradeLevel, parentName, parentEmail, section, teacher_id } =
      req.body;
    try {
      const response = await prisma.student.create({
        data: {
          name,
          gradeLevel: Number(gradeLevel),
          parentName,
          parentEmail,
          section,
          teacher_id: Number(teacher_id),
        },
      });
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  static async addSubject(req: any, res: Response) {
    const { subjectName } = req.body;
    try {
      await prisma.subject.create({
        data: {
          subjectName,
        },
      });
      res.status(200).json("Successfully added!");
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  static async addGrade(req: any, res: Response) {
    const data = req.body;

    try {
      for (const grade of data) {
        const existingGrade = await prisma.grades.findFirst({
          where: {
            student_id: grade.student_id,
            subject_id: grade.subject_id,
          },
        });

        if (existingGrade) {
          return res
            .status(400)
            .json({ error: "Grade already exists for subject and student." });
        }
      }

      await prisma.grades.createMany({
        data: data,
      });

      res.status(200).json("Successfully added!");
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  //GET

  static async getStudents(req: any, res: Response) {
    const teacher_id = req.user.teacher[0]?.id;
    try {
      const response = await prisma.student.findMany({
        where: { teacher_id },
        include: {
          grades: true,
        },
      });
      res.status(200).json(response);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  static async getAllStudent(req: any, res: Response) {
    try {
      const response = await prisma.student.findMany({
        include: {
          grades: true,
        },
      });
      res.status(200).json(response);
    } catch (error) {}
  }

  static async getTeacher(req: any, res: Response) {
    try {
      const response = await prisma.teacher.findMany({
        include: {
          student: true,
        },
      });
      res.status(200).json(response);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  static async getSubject(req: any, res: Response) {
    try {
      const response = await prisma.subject.findMany({
        include: {
          grades: true,
        },
      });
      res.status(200).json(response);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  //get info
  static async getTeacherInfo(req: any, res: Response) {
    const id = req.user.teacher[0]?.id;
    try {
      const response = await prisma.teacher.findUnique({
        where: {
          id,
        },
        include: {
          student: {
            include: {
              grades: true,
            },
          },
        },
      });
      res.status(200).json(response);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  static async getAdminInfo(req: any, res: Response) {
    const id = req.user.admin[0]?.id;

    try {
      const response = await prisma.admin.findUnique({
        where: { id },
      });
      res.status(200).json(response);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  // delte
  static async deleteSubject(req: any, res: Response) {
    const { id } = req.params;

    try {
      const response = await prisma.subject.delete({
        where: { id: Number(id) },
      });
      res.status(200).json(response);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  // update
  static async updateStudent(req: any, res: Response) {
    const { id, name, parentName, parentEmail, gradeLevel, section } = req.body;

    try {
      const response = await prisma.student.update({
        where: { id },
        data: {
          name,
          parentName,
          parentEmail,
          gradeLevel,
          section,
        },
      });
      res.status(200).json(response);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  static async updateTeacher(req: any, res: Response) {
    const { id, name, contact, email } = req.body;

    try {
      const response = await prisma.teacher.update({
        where: { id },
        data: {
          name,
          contact,
          email,
        },
      });
      res.status(200).json(response);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  static async updateGrade(req: any, res: Response) {
    const grades = req.body;

    try {
      for (const data of grades) {
        await prisma.grades.update({
          where: { id: data.id },
          data: { grade: Number(data.grade) }, // Properly format the data object
        });
      }

      res.status(200).json("Success");
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}
