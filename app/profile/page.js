"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './page.css';

import HorizontalNav from '../home/horizontal';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [creation, setCreation] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    // Fetch user details when component loads
    const fetchUserData = async () => {
      try {
        const user = localStorage.getItem('username');
        const response = await axios.get(`/api/profile?username=${user}`, {withCredentials: true });
        const { username, email, created_at } = response.data;
        setUsername(username);
        setEmail(email);
        setCreation(new Date(created_at).toLocaleDateString()); // Format date
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const username = localStorage.getItem('username');
    try {
      const response = await axios.post(
        `/api/profile/password`,
        {
          
          currentPassword,
          newPassword,
          username
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        alert('Password updated successfully');
        setCurrentPassword('');
        setNewPassword('');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Redirect to the login page
         //window.location.href = '/login';
         console.log(error);
      } else {
        console.error('Error updating password:', error);
        alert('Failed to update password. Please try again.');
      }
      
    }
  };

  return (
    <div className="app">
     
      <div className="main-content">
        <HorizontalNav />
        <div class="container-profile mx-auto mt-20">

<div class="lg:flex ">
  <div class="lg:w-1/6 cc">
    <div class="card shadow-md rounded-md">
      <div class="p-4">
        <h5 class="text-lg font-semibold">Profile</h5>
      </div>
      <div class="p-4">
        <ul class="space-y-2">
          <li>
            <a href="/profile" class="flex items-center text-blue-600 hover:underline">
              <i class="icon-pencil mr-2"></i> Change password
            </a>
          </li>
          <li>
            <a href="/profile/details" class="flex items-center text-blue-600 hover:underline">
              <i class="icon-user mr-2"></i> Details
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div class="lg:w-5/6 lg:ml-20">
    <div>
      <h4 class="text-xl font-semibold">Edit your profile:</h4>    </div>

    <div>
      <form class="p-6 shadow-md rounded-md" id="verticalForm" >
        <input type="hidden" value="NE1fWXNUR1dVZmNuMUxjaFdqdzk3fkF3U3BWQXFLQksa0SH556p1SOyZzB8TPpUa3DHascALqNwj5NFDdURVGg==" name="YII_CSRF_TOKEN" />

        <div class="mb-4">
          <label class="blockfont-bold mb-2" for="editProfileForm_password">New password: <span class="text-red-600">*</span></label>
          <input class="border border-gray-300 rounded-md p-2 " name="editProfileForm[password]" id="editProfileForm_password" type="password" maxlength="64" value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)} />
        </div>

        <div class="mb-4">
          <label class="blockfont-bold mb-2" for="editProfileForm_repeat_password">Repeat New password: <span class="text-red-600">*</span></label>
          <input class="border border-gray-300 rounded-md p-2 " name="editProfileForm[repeat_password]" id="editProfileForm_repeat_password" type="password" />
        </div>

        <div class="mb-4">
          <label class="blockfont-bold mb-2" for="editProfileForm_old_password">Old password: <span class="text-red-600">*</span></label>
          <input class="border border-gray-300 rounded-md p-2 " name="editProfileForm[old_password]" id="editProfileForm_old_password" type="password" value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}/>
        </div>

        <div class="flex space-x-4">
          <button class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" type="button" onClick={handlePasswordChange} name="yt0">Update</button>
          <button class="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400" type="reset" name="yt1">Reset</button>
        </div>
      </form>
    </div>
  </div>
</div>

<div class="mt-10"></div>
</div>

      </div>
    </div>
  );
}

export default Profile;
