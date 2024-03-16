import argon2 from "argon2";
import { prisma } from "../services/Prisma";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const Auth = async (req: Request, res: Response) => {
  const secret_key = process.env.SECRET_KEY!;
  const { username, password } = req.body;

  try {
    const findUser = await prisma.account.findFirst({
      where: {
        username,
      },
    });
    if (!findUser)
      return res
        .status(200)
        .json(
          "Invalid username. Please double check your username and try again."
        );
    const verifyPassword = await argon2.verify(findUser.password, password);
    if (!verifyPassword)
      return res
        .status(200)
        .json(
          "Incorrect password. Please ensure you've entered the correct password and try again."
        );
    const token = jwt.sign({ id: findUser.id }, secret_key, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
    });
    return res.status(200).json("Success");
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export default Auth;
