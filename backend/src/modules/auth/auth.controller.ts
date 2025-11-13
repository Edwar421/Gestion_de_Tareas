import { Request, Response } from "express";
import { AppDataSource } from "../../ormconfig";
import { User } from "../../entities/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const userRepository = AppDataSource.getRepository(User);

const generateAccessToken = (email: string) => {
  return jwt.sign({ email }, process.env.JWT_SECRET || "default_secret", {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (email: string) => {
  return jwt.sign(
    { email },
    process.env.JWT_REFRESH_SECRET || "default_refresh_secret",
    {
      expiresIn: "7d",
    }
  );
};

const validateRegisterFields = (
  username: string,
  email: string,
  password: string
) => {
  const errors: string[] = [];

  if (!username || username.length > 20) {
    errors.push(
      "El usuario no puede tener más de 20 caracteres y es requerido."
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push("Debe ser un correo válido.");
  }

  if (!password || password.length < 8) {
    errors.push("La contraseña debe tener al menos 8 caracteres.");
  }

  const uppercaseRegex = /[A-Z]/;
  if (!uppercaseRegex.test(password)) {
    errors.push("La contraseña debe tener al menos una mayúscula.");
  }

  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
  if (!specialCharRegex.test(password)) {
    errors.push("La contraseña debe tener al menos un carácter especial.");
  }

  return errors;
};

const validateLoginFields = (email: string, password: string) => {
  const errors: string[] = [];

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push("Debe ser un correo válido.");
  }

  if (!password || password.length < 8) {
    errors.push("La contraseña debe tener al menos 8 caracteres.");
  }

  const uppercaseRegex = /[A-Z]/;
  if (!uppercaseRegex.test(password)) {
    errors.push("La contraseña debe tener al menos una mayúscula.");
  }

  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
  if (!specialCharRegex.test(password)) {
    errors.push("La contraseña debe tener al menos un carácter especial.");
  }

  return errors;
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const validationErrors = validateRegisterFields(username, email, password);
    if (validationErrors.length > 0) {
      res.status(400).json({ errors: validationErrors });
      return;
    }

    const existingUser = await userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      res.status(400).send("Email already exists");
      return;
    }

    const newUser = new User();
    newUser.username = username;
    newUser.email = email;
    newUser.password = await bcrypt.hash(password, 10);

    await userRepository.save(newUser);
    res.status(201).send("User registered");
  } catch (error) {
    res.status(500).send("Error registering user");
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const validationErrors = validateLoginFields(email, password);
    if (validationErrors.length > 0) {
      res.status(400).json({ errors: validationErrors });
      return;
    }

    const user = await userRepository.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(400).send("Invalid credentials");
      return;
    }

    const accessToken = generateAccessToken(user.email);
    const refreshToken = generateRefreshToken(user.email);

    res.send({ accessToken, refreshToken, username: user.username });
  } catch (error) {
    res.status(500).send("Error logging in");
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) {
    res.status(401).send("Refresh token is required");
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET || "default_refresh_secret"
    ) as { email: string };
    const accessToken = generateAccessToken(decoded.email);
    res.send({ accessToken });
  } catch (error) {
    res.status(403).send("Invalid refresh, please login again");
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userRepository.find({
      select: ["email", "username", "password"],
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send("Error fetching users");
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      res.status(404).send("User not found");
      return;
    }

    await userRepository.remove(user);
    res.status(200).send("User deleted successfully");
  } catch (error) {
    res.status(500).send("Error deleting user");
  }
};
