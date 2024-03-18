import { Request, Response } from "express";
import fs from "fs";
import PDFDocument from "pdfkit";
import { transporter } from "../services/Nodemailer";

export const sendEmail = async (req: Request, res: Response) => {
  try {
    const data = req.body.data;

    for (const student of data) {
      const doc = new PDFDocument();
      doc.pipe(fs.createWriteStream("grades.pdf"));

      // Set font style for title
      doc
        .font("Helvetica-Bold")
        .fontSize(20)
        .text("Babahagon Elementary School", { align: "center" });

      // Add blank line
      doc.moveDown();

      // Add student name, section, and date
      doc
        .font("Helvetica")
        .fontSize(12)
        .text(`Name: ${student.name}`, { align: "left" });
      doc.text(`Section: ${student.section}`, { align: "left" });
      doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: "left" });

      // Add blank line
      doc.moveDown();

      // Create table header
      doc
        .font("Helvetica-Bold")
        .text("Subject", 100, doc.y, { width: 200, align: "left" });
      doc.text("Grades", 350, doc.y, { width: 200, align: "left" });

      // Add table border
      doc
        .moveTo(100, doc.y + 15)
        .lineTo(550, doc.y + 15)
        .stroke();

      // Iterate through each grade and add to table
      student.grades.forEach((grade: any, index: number) => {
        const yPos = doc.y + index * 25 + 25; // Adjust the vertical position for each row
        doc
          .font("Helvetica")
          .text(grade.subjectName, 100, yPos, { width: 200, align: "left" });
        doc.font("Helvetica").text(grade.grade.toString(), 350, yPos, {
          width: 200,
          align: "left",
        });
        doc
          .moveTo(100, yPos + 15)
          .lineTo(550, yPos + 15)
          .stroke(); // Add row border
      });

      doc.end();

      await transporter.sendMail({
        from: "gradetrackerr@gmail.com",
        to: student.parentEmail,
        subject: "Grades Report",
        text: "Please find attached the grades report.",
        attachments: [
          {
            filename: "grades.pdf",
            path: "grades.pdf",
            contentType: "application/pdf",
          },
        ],
      });
    }

    res.status(200).send("Emails sent successfully.");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error sending emails.");
  }
};
