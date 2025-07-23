import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

const Signup = () => {

     const [form, setForm] = useState({
      username: "",email:"",password:"",confirmPassword:""
     });

     const navigate = useNavigate();

     const handleChange = (e)=>{
      setForm({...form, [e.target.name]: e.target.value})  
     };

     const handleSubmit = async (e)=>{
       e.preventDefault();

       if(form.password !== form.confirmPassword){
        alert("Password is not mstched");
        return;
       }

       try{
        const response = await axios.post("http://localhost:8001/signup",{
           username: form.username,
           email: form.email,
           password: form.password,
        });
        console.log(response.data)
        alert("Account created successfully")
        navigate('/login')

       } catch(error){
        console.log(error.message) 
        alert("signup failed")
       }
     }

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-tr from-gray-900 via-gray-800 to-black px-4">
      <h2 className="text-4xl font-extrabold text-white mb-8">Create an Account</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Username
          </label>
          <input
            type="text"
            name="username"
            required
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter username"
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter email"
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Enter password"
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            required
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Confirm password"
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition duration-300"
        >
          Create Account
        </button>

        <p className="text-sm text-center text-gray-400 mt-4">
          Already have an account?{" "}
          <Link to= "/login" className="text-blue-400 hover:text-blue-500 font-medium">
          Log in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
