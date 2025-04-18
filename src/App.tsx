import React, { useState } from 'react';
import { Search, GraduationCap, MapPin, BookOpen } from 'lucide-react';
import axios from 'axios';

interface University {
  Name: string;
  field_of_interest: string;
  location: string;
}

interface StudentInput {
  Name: string;
  field_of_interest: string;
  preferred_country: string;
}

function App() {
  const [studentName, setStudentName] = useState('');
  const [fieldOfInterest, setFieldOfInterest] = useState('');
  const [preferredCountry, setPreferredCountry] = useState('');
  const [recommendations, setRecommendations] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const studentData: StudentInput = {
      Name: studentName,
      field_of_interest: fieldOfInterest,
      preferred_country: preferredCountry
    };
    
    try {
      // Replace with your model's API endpoint
      const response = await axios.post('./api/recommendation_system_data.pkl', studentData);

      // Ensure the response data is an array and has the correct structure
      const universities = Array.isArray(response.data) ? response.data : [];
      
      // Validate and transform the data if needed
      const validUniversities = universities.map((uni: any) => ({
        Name: uni.Name || 'Unknown University',
        location: uni.location || 'Location not specified',
        field_of_interest: uni.field_of_interest || fieldOfInterest
      }));

      setRecommendations(validUniversities);
    } catch (err) {
      setError('Failed to fetch recommendations. Please try again.');
      console.error('Error fetching recommendations:', err);
      setRecommendations([]); // Reset recommendations on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-indigo-900 mb-2">
            University Recommendation System
          </h1>
          <p className="text-gray-600">
            Find the perfect university based on your interests and preferences
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student Name
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="pl-10 w-full rounded-md border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field of Interest
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={fieldOfInterest}
                  onChange={(e) => setFieldOfInterest(e.target.value)}
                  className="pl-10 w-full rounded-md border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Computer Science, Engineering, Business"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Country
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={preferredCountry}
                  onChange={(e) => setPreferredCountry(e.target.value)}
                  className="pl-10 w-full rounded-md border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter preferred country"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm mt-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200 flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Search size={20} className="mr-2" />
                  Find Universities
                </>
              )}
            </button>
          </form>
        </div>

        {recommendations.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recommended Universities</h2>
            <div className="space-y-4">
              {recommendations.map((uni, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200"
                >
                  <h3 className="text-lg font-semibold text-indigo-600">{uni.Name}</h3>
                  <div className="mt-2 text-gray-600 flex items-center">
                    <MapPin size={16} className="mr-1" />
                    {uni.location}
                  </div>
                  <div className="mt-1 text-gray-600 flex items-center">
                    <BookOpen size={16} className="mr-1" />
                    {uni.field_of_interest}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;