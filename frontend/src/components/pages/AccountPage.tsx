import { TUserResponse } from "../../lib/types";

export default function AccountPage({ user }: { user: TUserResponse }) {
  return (
    <div>
      <h1>Account Page</h1>
      <p>Welcome, {user.username}!</p>
    </div>
  )
}