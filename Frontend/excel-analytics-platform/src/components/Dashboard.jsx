import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Bar, Line, Pie, Scatter } from "react-chartjs-2";
import * as THREE from "three";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [uploaded, setUploaded] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedX, setSelectedX] = useState("");
  const [selectedY, setSelectedY] = useState("");
  const [chartType, setChartType] = useState("bar");
  const threeCanvasRef = useRef(null);
  const threeRendererRef = useRef(null);
const sceneRef = useRef(null);
const cameraRef = useRef(null);


  const handleDownload = () => {
    const chartCanvas = document.getElementById("myChart");
    const url = chartCanvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = "chart.png";
    link.click();
  };

  const handleDownload3DChart = () => {
   if (!threeRendererRef.current || !sceneRef.current || !cameraRef.current) return;

    threeRendererRef.current.render(sceneRef.current, cameraRef.current);

  setTimeout(() => {
    const url = threeRendererRef.current.domElement.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = "3d_chart.png";
    link.click();
  }, 100); // slight delay ensures the render completes
};

  const handleDelete = async (filename) => {
    try {
      await axios.delete(
        `http://localhost:8001/api/delete-file/${encodeURIComponent(filename)}`
      );

      // ✅ Correct state update
      setUploaded((prevFiles) =>
        prevFiles.filter((file) => file.filename !== filename)
      );

      // Clear selection if the deleted file was selected
      if (selectedFile?.filename === filename) {
        setSelectedFile(null);
        setSelectedX("");
        setSelectedY("");
      }

      alert("File deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete file");
    }
  };

  const token = localStorage.getItem("token");

  const fetchFiles = async () => {
    try {
      const response = await axios.get("http://localhost:8001/upload", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUploaded(response.data.files);
    } catch (error) {
      console.error("Fetch files failed:", error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:8001/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Upload success:", response.data);
      alert("File uploaded successfully!");
      fetchFiles();
      setFile(null);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload file");
    }
  };

const generate3DChart = () => {
  if (!selectedFile || !selectedX || !selectedY) return;

  // Clear old canvas
  threeCanvasRef.current.innerHTML = "";

  // Scene setup
  const scene = new THREE.Scene();
  sceneRef.current = scene;

  // Camera setup
  const camera = new THREE.PerspectiveCamera(
    75,
    threeCanvasRef.current.clientWidth / threeCanvasRef.current.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 10, 20);
  camera.lookAt(scene.position);
  cameraRef.current = camera;

  // Renderer setup
  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true }); // important!
  renderer.setSize(
    threeCanvasRef.current.clientWidth,
    threeCanvasRef.current.clientHeight
  );
  threeCanvasRef.current.appendChild(renderer.domElement);
  threeRendererRef.current = renderer;

  // Light
  const light = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light);

  // Bars
  selectedFile.data.forEach((row, index) => {
    const height = Number(row[selectedY]) / 10;
    const geometry = new THREE.BoxGeometry(0.5, height, 0.5);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(
        `hsl(${(index / selectedFile.data.length) * 360}, 100%, 50%)`
      ),
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = index * 0.7;
    cube.position.y = height / 2;
    scene.add(cube);
  });

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Animate
  const animate = () => {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  animate(); // start render loop
};


  const chartData = {
    labels: selectedFile?.data.map((row) => row[selectedX]),
    datasets: [
      {
        label: `${selectedY} vs ${selectedX}`,
        data: selectedFile?.data.map((row) => row[selectedY]),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        barThickness: 20,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        </div>
        <button
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </div>

      <div className="mb-8 space-y-4">
        <label className="inline-block bg-gray-800 px-4 py-2 rounded cursor-pointer hover:bg-gray-700 text-white">
          Choose Excel File
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        <button
          onClick={handleUpload}
          className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          Upload
        </button>
      </div>

      <div>
        <h3 className="text-2xl font-semibold mb-4">Recent Uploaded Files</h3>
        <table className="w-full table-auto border border-gray-700">
          <thead>
            <tr className="bg-gray-800">
              <th className="p-3 border border-gray-700">Date</th>
              <th className="p-3 border border-gray-700">File Name</th>
            </tr>
          </thead>
          <tbody>
            {uploaded.map((file) => (
              <tr key={file._id} className="hover:bg-gray-700">
                <td className="p-3 border border-gray-700">
                  {new Date(file.uploadDate).toLocaleDateString()}
                </td>
                <td className="p-3 border border-gray-700">
                  <div className="flex justify-between items-center">
                    <span
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedFile(file);
                        setSelectedX("");
                        setSelectedY("");
                      }}
                    >
                      {file.originalname}
                    </span>
                    <button
                      onClick={() => handleDelete(file.filename)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm ml-4"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedFile && (
        <div className="mt-10">
          <h3 className="text-2xl font-semibold mb-4">
            File Data: {selectedFile.originalname}
          </h3>

          <div className="flex gap-4 mb-6 flex-wrap">
            <div>
              <label className="block mb-2">Select X Axis:</label>
              <select
                value={selectedX}
                onChange={(e) => setSelectedX(e.target.value)}
                className="bg-gray-800 text-white p-2 rounded"
              >
                <option value="">-- Select Column --</option>
                {selectedFile.columns.map((col, index) => (
                  <option key={index} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2">Select Y Axis:</label>
              <select
                value={selectedY}
                onChange={(e) => setSelectedY(e.target.value)}
                className="bg-gray-800 text-white p-2 rounded"
              >
                <option value="">-- Select Column --</option>
                {selectedFile.columns.map((col, index) => (
                  <option key={index} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2">Select Chart Type:</label>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className="bg-gray-800 text-white p-2 rounded"
              >
                <option value="bar">Bar</option>
                <option value="line">Line</option>
                <option value="pie">Pie</option>
                <option value="scatter">Scatter</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleDownload}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Download Chart
          </button>

          {selectedX && selectedY && (
            <div className="space-y-8 mt-6">
              {chartType === "bar" && (
                <>
                  <h4 className="text-xl font-semibold">Bar Chart</h4>
                  <div style={{ height: "400px", width: "100%" }}>
                    <Bar
                      id="myChart"
                      data={chartData}
                      options={{ responsive: true, maintainAspectRatio: false }}
                    />
                  </div>
                </>
              )}

              {chartType === "line" && (
                <>
                  <h4 className="text-xl font-semibold">Line Chart</h4>
                  <div style={{ height: "400px", width: "100%" }}>
                    <Line
                      id="myChart"
                      data={chartData}
                      options={{ responsive: true, maintainAspectRatio: false }}
                    />
                  </div>
                </>
              )}

              {chartType === "pie" && (
                <>
                  <h4 className="text-xl font-semibold">Pie Chart</h4>
                  <div style={{ height: "400px", width: "100%" }}>
                    <Pie
                      id="myChart"
                      data={chartData}
                      options={{ responsive: true, maintainAspectRatio: false }}
                    />
                  </div>
                </>
              )}

              {chartType === "scatter" && (
                <>
                  <h4 className="text-xl font-semibold">Scatter Chart</h4>
                  <div style={{ height: "400px", width: "100%" }}>
                    <Scatter
                      id="myChart"
                      data={{
                        datasets: [
                          {
                            label: `${selectedY} vs ${selectedX}`,
                            data: selectedFile.data.map((row) => ({
                              x: row[selectedX],
                              y: row[selectedY],
                            })),
                            backgroundColor: "rgba(153, 102, 255, 0.7)",
                          },
                        ],
                      }}
                      options={{ responsive: true, maintainAspectRatio: false }}
                    />
                  </div>
                </>
              )}

              <h4 className="text-xl font-semibold">3D Visualization</h4>
              <div
                ref={threeCanvasRef}
                style={{ width: "100%", height: "400px" }}
                className="border border-gray-700"
              ></div>
              <button
                onClick={() => {
                  generate3DChart();
                  window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth",
                  });
                }}
                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded"
              >
                Generate 3D Chart
              </button>
              <button
                onClick={handleDownload3DChart}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-2"
              >
                Download 3D Chart
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
