import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";

const UserList = () => {
  const { users, deleteUser } = useContext(UserContext);

  const handleDeleteUser = (userId) => {
    deleteUser(userId);
  };

  return (
    <div>
      <h2>Kullanıcı Listesi</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>İsim</th>
            <th>Email</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => handleDeleteUser(user.id)}>Sil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
