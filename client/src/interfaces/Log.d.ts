import { UserInterface } from "./User";

export interface LogInterface {
  _id: string;
  user: UserInterface;
  level: string;
  message: string;
  createdAt: Date;
}
