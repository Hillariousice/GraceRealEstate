import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../../../component/NavBar/NavBar';
import Footer from '../../../component/Footer/Footer';
import { apiGet, apiDelete } from '../../../utils/axios'; // Import apiDelete
import { toast } from 'react-toastify';

// Define an interface for Agent data
interface Agent {
  _id: string;
  name: string;
  companyName?: string;
  email: string;
  phone: string;
  // Add other relevant fields from your AgentModel, e.g., verified, address
  role?: string; // Should always be 'agent'
  serviceAvailable?: boolean;
  rating?: number;
}

const AdminListAgentsPage: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      setError(null);
      try {
        // Endpoint: GET /api/admins/get-all-agents (server AdminRoutes)
        // apiGet uses baseUrl "http://localhost:8080/api"
        // path should be "admins/get-all-agents"
        const response = await apiGet({ path: 'admins/get-all-agents' });
        if (response.data && response.data.agents) {
          setAgents(response.data.agents);
        } else {
          setAgents([]);
          // toast.info('No agents found or data in unexpected format.');
        }
      } catch (err: any) {
        console.error("Error fetching agents:", err);
        const errorMessage = err.response?.data?.Error || err.response?.data?.message || 'Failed to fetch agents.';
        setError(errorMessage);
        toast.error(errorMessage);
        setAgents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  const handleDeleteAgent = async (agentId: string) => {
    if (window.confirm(`Are you sure you want to delete agent ${agentId}? This action cannot be undone.`)) {
      try {
        // Endpoint: DELETE /api/admins/deleteAgent/:agentId
        // apiDelete from utils/axios should automatically include the token
        await apiDelete({ path: `admins/deleteAgent/${agentId}` });
        toast.success(`Agent ${agentId} deleted successfully.`);
        // Update agents list by filtering out the deleted agent
        setAgents(prevAgents => prevAgents.filter(agent => agent._id !== agentId));
      } catch (err: any) {
        console.error("Error deleting agent:", err);
        const errorMessage = err.response?.data?.Error || err.response?.data?.message || 'Failed to delete agent.';
        toast.error(errorMessage);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
          <p className="text-xl">Loading agents...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
          <p className="text-xl text-red-600">Error: {error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white shadow-xl rounded-lg p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Agent Management</h1>
            <Link
              to="/admin/agents/new"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
            >
              Add New Agent
            </Link>
          </div>

          {agents.length === 0 ? (
            <p className="text-gray-600">No agents found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Company</th>
                    <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {agents.map((agent) => (
                    <tr key={agent._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{agent.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{agent.companyName || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{agent.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {/* <Link to={`/admin/agents/edit/${agent._id}`} className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</Link> */}
                        <button
                          onClick={() => handleDeleteAgent(agent._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete agent"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminListAgentsPage;
