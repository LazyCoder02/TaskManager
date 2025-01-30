import type { Request, Response } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { pool } from "../config/db"
import { z } from "zod"

const UserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
})

export const authController = {
  register: async (req: Request, res: Response) => {
    try {
      const { email, password, name } = UserSchema.parse(req.body)
      const hashedPassword = await bcrypt.hash(password, 10)

      const result = await pool.query(
        "INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name",
        [email, hashedPassword, name],
      )

      const user = result.rows[0]
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, {
        expiresIn: "1d",
      })

      res.status(201).json({ user, token })
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid input", details: error.errors })
      } else {
        console.error("Registration error:", error)
        res.status(500).json({ error: "Registration failed" })
      }
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = UserSchema.parse(req.body)

      const result = await pool.query("SELECT * FROM users WHERE email = $1", [email])
      const user = result.rows[0]

      if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        return res.status(401).json({ error: "Invalid credentials" })
      }

      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, {
        expiresIn: "1d",
      })

      res.json({ user: { id: user.id, email: user.email, name: user.name }, token })
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid input", details: error.errors })
      } else {
        console.error("Login error:", error)
        res.status(500).json({ error: "Login failed" })
      }
    }
  },

  me: async (req: Request, res: Response) => {
    // Assuming you have middleware that adds the user to the request
    const user = (req as any).user
    if (!user) {
      return res.status(401).json({ error: "Not authenticated" })
    }
    res.json({ user })
  },
}

