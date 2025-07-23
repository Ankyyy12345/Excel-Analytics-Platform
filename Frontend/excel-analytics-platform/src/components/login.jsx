import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from 'axios'

const Login = () => {

  const [form, setForm] = useState({
    email: "", password: "",
  })

  const navigate = useNavigate()

  const handleChange = (e)=>{
    setForm({
      ...form, [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e)=>{
    e.preventDefault()
   if(!form.email || !form.password){
    alert("All fields are required")
    return;
   }

   try{
    const response =  await axios.post("http://localhost:8001/login",{
      email: form.email,
      password: form.password
    })
    console.log(response.data)

    localStorage.setItem("token", response.data.token)
    alert("successfully login user ")
    navigate("/dashboard")

   }catch(error){
    console.error("something went wrong",error)
   }

  }
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="max-w-md w-full p-8 rounded-xl shadow-lg bg-gray-800">
        <h2 className="text-3xl font-bold mb-6 text-center">Log In</h2>
        <form  onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-2 border border-gray-600 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter email"
              onChange={handleChange}
              
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-2 border border-gray-600 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter password"
              onChange={handleChange}
          
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold"
          >
            Log In
          </button>
        </form>

        <p className="text-sm text-center text-gray-400 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/"
            className="text-blue-400 hover:text-blue-600 font-medium"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
