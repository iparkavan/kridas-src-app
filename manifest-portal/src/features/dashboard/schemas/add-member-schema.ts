import {z} from "zod"

const addMemberSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
  role: z.string().min(1, "User role is required").default("")
})

type AddMemberFields = z.infer<typeof addMemberSchema>

export type { AddMemberFields }

export { addMemberSchema }