import React from 'react';
import { useQuery } from 'react-query';
import { HiPlus, HiPhotograph, HiEye, HiTrash } from 'react-icons/hi';
import { galleryAPI } from '../../services/api';

const AdminGallery = () => {
  const { data, isLoading } = useQuery('adminGallery', () =>
    galleryAPI.getAll({ limit: 50 }).then(res => res.data.data)
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gallery Management</h1>
          <p className="text-gray-600">Manage photo albums and galleries</p>
        </div>
        <button className="btn-primary flex items-center">
          <HiPlus className="w-5 h-5 mr-2" />
          Create Album
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.albums?.map((album) => (
            <div key={album._id} className="bg-white rounded-xl shadow-lg overflow-hidden group">
              <div className="relative h-48">
                <img
                  src={album.coverImage || 'https://via.placeholder.com/400x300'}
                  alt={album.title?.en}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                  <button className="p-2 bg-white rounded-full text-gray-700 hover:bg-saffron-500 hover:text-white">
                    <HiEye className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-white rounded-full text-gray-700 hover:bg-red-500 hover:text-white">
                    <HiTrash className="w-5 h-5" />
                  </button>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center">
                  <HiPhotograph className="w-3 h-3 mr-1" />
                  {album.totalPhotos}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1">{album.title?.en}</h3>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="capitalize">{album.category}</span>
                  <span>{album.totalViews} views</span>
                </div>
              </div>
            </div>
          ))}
          
          {/* Add Album Card */}
          <button className="bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 h-64 flex flex-col items-center justify-center text-gray-500 hover:border-saffron-500 hover:text-saffron-500 transition-colors">
            <HiPlus className="w-12 h-12 mb-2" />
            <span className="font-medium">Add New Album</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminGallery;

