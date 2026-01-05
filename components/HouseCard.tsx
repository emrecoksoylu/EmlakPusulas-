
import React from 'react';
import { House } from '@/lib/scraper';
import { MapPin, Maximize, Home } from 'lucide-react';

interface HouseCardProps {
    house: House;
}

export function HouseCard({ house }: HouseCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col h-full group">
            <div className="relative h-48 sm:h-56 overflow-hidden">
                <img
                    src={house.imageUrl}
                    alt={house.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-sm border border-gray-200/50">
                    {house.source}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <p className="text-white font-bold text-xl sm:text-2xl">{house.price}</p>
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {house.title}
                </h3>

                <div className="flex items-center text-gray-500 mb-4 text-sm">
                    <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0 text-blue-500" />
                    <span className="truncate">{house.location}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4 bg-gray-50 p-3 rounded-lg">
                    {house.features.slice(0, 4).map((feature, index) => (
                        <div key={index} className="flex items-center text-xs font-medium text-gray-600">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2"></div>
                            {feature}
                        </div>
                    ))}
                </div>

                <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-medium">Updated today</span>
                    <a
                        href={house.url}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center"
                    >
                        View Details →
                    </a>
                </div>
            </div>
        </div>
    );
}
